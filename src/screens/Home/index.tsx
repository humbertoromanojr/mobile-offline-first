import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useUser } from "@realm/react";

import { useQuery, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import {
    getLastSyncTimestamp,
    saveLastSyncTimestamp,
} from "../../libs/asyncStorage/syncStorage";

import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";
import { HistoricCard, HistoricCardProps } from "../../components/HistoricCard";

import { Container, Content, Label, Title } from "./styles";

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
    const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
        []
    );

    const { navigate } = useNavigation();

    const user = useUser();
    const realm = useRealm();

    const historic = useQuery(Historic);

    function handleRegisterMovement() {
        if (vehicleInUse?._id) {
            navigate("arrival", { id: vehicleInUse?._id.toString() });
        } else {
            navigate("departure");
        }
    }

    function fetchVehicleInUse() {
        try {
            const vehicle = historic.filtered(`status == 'departure'`)[0];
            setVehicleInUse(vehicle);
        } catch (error) {
            Alert.alert(
                "Vehicle in use",
                "Vehicle in use could not be loaded!"
            );
            console.log("==> Error: ", error);
        }
    }

    async function fetchHistoric() {
        try {
            const response = historic.filtered(
                `status = 'arrival' SORT(created_at DESC)`
            );

            const lastSync = await getLastSyncTimestamp();

            const formattedHistoric = response.map((item) => {
                return {
                    id: item._id!.toString(),
                    LicensePlate: item.license_plate,
                    isSync: lastSync > item.updated_at!.getTime(),
                    created: dayjs(item.created_at).format(
                        `[Saída em] DD/MM/YYYY [às] HH:mm`
                    ),
                };
            });

            setVehicleHistoric(formattedHistoric);
        } catch (error) {
            console.log("==> Error - fetchHistoric: ", error);
            Alert.alert("History Error", "History could not be uploaded!");
        }
    }

    function handleHistoricDetails(id: string) {
        navigate("arrival", { id });
    }

    async function progressNotification(
        transferred: number,
        transferable: number
    ) {
        const percentage = (transferred / transferable) * 100;

        if (percentage === 100) {
            await saveLastSyncTimestamp();
            fetchHistoric();
        }
    }

    useEffect(() => {
        fetchVehicleInUse();
    }, [historic]);

    useEffect(() => {
        realm.addListener("change", () => fetchVehicleInUse());

        return () => {
            if (realm && !realm.isClosed) {
                realm.removeListener("change", fetchVehicleInUse);
            }
        };
    }, []);

    useEffect(() => {
        fetchHistoric();
    }, [historic]);

    useEffect(() => {
        realm.subscriptions.update((mutableSubs, realm) => {
            const historicByUserQuery = realm
                .objects("Historic")
                .filtered(`user_id = '${user!.id}'`);

            mutableSubs.add(historicByUserQuery, { name: "historic_by_user_" });
        });
    }, [realm]);

    useEffect(() => {
        const syncSession = realm.syncSession;

        if (!syncSession) {
            return;
        }

        syncSession.addProgressNotification(
            Realm.ProgressDirection.Upload,
            Realm.ProgressMode.ReportIndefinitely,
            progressNotification
        );

        return () =>
            syncSession.removeProgressNotification(progressNotification);
    }, []);

    return (
        <Container>
            <HomeHeader />

            <Content>
                <CarStatus
                    licensePlate={vehicleInUse?.license_plate}
                    onPress={handleRegisterMovement}
                />

                <Title>History</Title>

                <FlatList
                    data={vehicleHistoric}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <HistoricCard
                            data={item}
                            onPress={() => handleHistoricDetails(item.id)}
                        />
                    )}
                    ListEmptyComponent={<Label>No vehicles used yet</Label>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </Content>
        </Container>
    );
}
