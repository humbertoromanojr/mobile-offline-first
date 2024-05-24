import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "phosphor-react-native";
import { LatLng } from "react-native-maps";
import { BSON } from "realm";
import dayjs from "dayjs";

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
import { Loading } from "../../components/Loading";
import { Locations } from "../../components/Locations";
import { ButtonIcon } from "../../components/ButtonIcon";
import { LocationInfoProps } from "../../components/LocationInfo";

import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { getLastSyncTimestamp } from "../../libs/asyncStorage/syncStorage";
import { getStorageLocations } from "../../libs/asyncStorage/locationStorage";
import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import { getAddressLocation } from "../../utils/getAddressLocation";

type RouteParamsProps = {
    id: string;
};

export function Arrival() {
    const [dataNotSynced, setDataNotSynced] = useState(false);
    const [coordinates, setCoordinates] = useState<LatLng[]>([]);
    const [departure, setDeparture] = useState<LocationInfoProps>(
        {} as LocationInfoProps
    );
    const [arrival, setArrival] = useState<LocationInfoProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

        if (historic?.coords[0]) {
            const departureStreetName = await getAddressLocation(
                historic?.coords[0]
            );

            setDeparture({
                label: `Saída em ${departureStreetName ?? ""}`,
                description: dayjs(
                    new Date(historic?.coords[0].timestamp)
                ).format("DD/MM/YYYY [às] HH:mm"),
            });
        }

        if (historic?.status === "arrival") {
            const lastLocation = historic.coords[historical.coords.length - 1];
            const arrivalStreetName = await getAddressLocation(lastLocation);

            setArrival({
                label: `Chegando em ${arrivalStreetName ?? ""}`,
                description: dayjs(new Date(lastLocation.timestamp)).format(
                    "DD/MM/YYYY [às] HH:mm"
                ),
            });
        }

        setIsLoading(false);
    }

    useEffect(() => {
        getLocationsInfo();
    }, [historic]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Container>
            <Header title={title} />

            {coordinates.length > 0 && <Map coordinates={coordinates} />}

            <Content>
                <Locations departure={departure} arrival={arrival} />

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
