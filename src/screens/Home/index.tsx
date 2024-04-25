import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

import { useQuery, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

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
            console.log("==> vehicle: ", vehicle);
        } catch (error) {
            Alert.alert(
                "Vehicle in use",
                "Vehicle in use could not be loaded!"
            );
            console.log("==> Error: ", error);
        }
    }

    function fetchHistoric() {
        try {
            const response = historic.filtered(
                `status = 'arrival' SORT(created_at DESC)`
            );

            const formattedHistoric = response.map((item) => {
                return {
                    id: item._id!.toString(),
                    LicensePlate: item.license_plate,
                    created: dayjs(item.created_at).format(
                        `[Saída em] DD/MM/YYYY [às] HH:mm`
                    ),
                    isSync: false,
                };
            });

            setVehicleHistoric(formattedHistoric);
        } catch (error) {
            console.log("==> Error - fetchHistoric: ", error);
            Alert.alert("History Error", "History could not be uploaded!");
        }
    }

    useEffect(() => {
        fetchVehicleInUse();
    }, [historic]);

    useEffect(() => {
        realm.addListener("change", () => fetchVehicleInUse());

        return () => {
            realm.removeListener("change", fetchVehicleInUse);
        };
    }, []);

    useEffect(() => {
        fetchHistoric();
    }, [historic]);

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
                    renderItem={({ item }) => <HistoricCard data={item} />}
                    ListEmptyComponent={<Label>No vehicles used yet</Label>}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </Content>
        </Container>
    );
}
