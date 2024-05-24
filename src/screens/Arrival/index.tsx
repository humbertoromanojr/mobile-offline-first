import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "phosphor-react-native";

import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { LatLng } from "react-native-maps";
import { BSON } from "realm";

import {
    Container,
    Content,
    Description,
    Footer,
    Label,
    LicensePlate,
    AsyncMessage,
} from "./styles";

import { Map } from "../../components/Map";
import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";

import { getLastSyncTimestamp } from "../../libs/asyncStorage/syncStorage";
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { stopLocationTask } from "../../tasks/backgroundLocationTask";

type RouteParamsProps = {
    id: string;
};

export function Arrival() {
    const [dataNotSynced, setDataNotSynced] = useState(false);
    const [coordinates, setCoordinates] = useState<LatLng[]>([]);

    const route = useRoute();
    const { id } = route.params as RouteParamsProps;

    const { goBack } = useNavigation();
    const realm = useRealm();
    const historic = useObject(
        Historic,
        new BSON.UUID(id) as unknown as string
    );

    const title = historic?.status === "departure" ? "Chegada" : "Detalhes";

    function handleRemoveVehicleUsage() {
        Alert.alert("Cancel", "Cancel the use of the vehicle?", [
            { text: "Não", style: "cancel" },
            { text: "Sim", onPress: () => removeVehicleUsage() },
        ]);
    }

    async function removeVehicleUsage() {
        realm.write(() => {
            realm.delete(historic);
        });

        await stopLocationTask();

        goBack();
    }

    async function handleVehicleRegister() {
        try {
            if (!historic) {
                Alert.alert(
                    "Error",
                    "We couldn't get the data to register the vehicle's arrival!"
                );
            }

            const location = await getStorageLocations();

            realm.write(() => {
                historic!.status = "arrival";
                historic!.updated_at = new Date();
                historic?.coords.push(...location);
            });

            await stopLocationTask();

            Alert.alert("Success", "Arrival successfully registered!");

            goBack();
        } catch (error) {
            console.log("==> Error - handleVehicleRegister: ", error);
            Alert.alert("Error", "The vehicle could not arrive!");
        }
    }

    async function getLocationsInfo() {
        if (!historic) {
            return;
        }

        const lastSync = await getLastSyncTimestamp();
        const updatedAt = historic!.updated_at.getTime();
        setDataNotSynced(updatedAt > lastSync);

        if (historic?.status === "departure") {
            const locationsStorage = await getStorageLocations();
            setCoordinates(locationsStorage);
        } else {
            setCoordinates(historic?.coords ?? []);
        }
    }

    useEffect(() => {
        getLocationsInfo();
    }, [historic]);

    return (
        <Container>
            <Header title={title} />

            {coordinates.length > 0 && <Map coordinates={coordinates} />}

            <Content>
                <Label>Placa do veículo</Label>
                <LicensePlate>{historic?.license_plate}</LicensePlate>
                <Label>Finalidade</Label>
                <Description>{historic?.description}</Description>
            </Content>
            {historic?.status === "departure" && (
                <Footer>
                    <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
                    <Button
                        title="Registrar Chegada"
                        onPress={handleVehicleRegister}
                    />
                </Footer>
            )}

            {dataNotSynced && (
                <AsyncMessage>
                    Sincronização da
                    {historic?.status === "departure"
                        ? " partida "
                        : " chegada "}
                    pendente.
                </AsyncMessage>
            )}
        </Container>
    );
}
