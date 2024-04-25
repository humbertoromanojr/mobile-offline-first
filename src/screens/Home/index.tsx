import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useQuery, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";
import { HistoricCard } from "../../components/HistoricCard";

import { Container, Content } from "./styles";

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

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
            console.log("==> fetchHistoric: ", response);
        } catch (error) {
            console.log("==> Error - fetchHistoric: ", error);
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

                <HistoricCard
                    data={{
                        created: "25/04/2024",
                        LicensePlate: "XXX1212",
                        isSync: false,
                    }}
                />
            </Content>
        </Container>
    );
}
