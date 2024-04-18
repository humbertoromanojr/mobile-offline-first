import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useQuery } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { HomeHeader } from "../../components/HomeHeader";
import { CarStatus } from "../../components/CarStatus";

import { Container, Content } from "./styles";

export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

    const { navigate } = useNavigation();

    const historic = useQuery(Historic);

    function handleRegisterMovement() {
        if (vehicleInUse?._id) {
            navigate("arrival", { id: vehicleInUse?._id.toString() });
        } else {
            navigate("departure");
        }
    }

    function fetchVehicle() {
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

    useEffect(() => {
        fetchVehicle();
    }, []);

    return (
        <Container>
            <HomeHeader />

            <Content>
                <CarStatus
                    licensePlate={vehicleInUse?.license_plate}
                    onPress={handleRegisterMovement}
                />
            </Content>
        </Container>
    );
}
