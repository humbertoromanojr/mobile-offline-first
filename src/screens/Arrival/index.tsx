import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { X } from "phosphor-react-native";

import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
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

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { getLastSyncTimestamp } from "../../libs/asyncStorage/syncStorage";

type RouteParamsProps = {
    id: string;
};

export function Arrival() {
    const [dataNotSynced, setDataNotSynced] = useState(false);

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

    function removeVehicleUsage() {
        realm.write(() => {
            realm.delete(historic);
        });

        goBack();
    }

    function handleVehicleRegister() {
        try {
            if (!historic) {
                Alert.alert(
                    "Error",
                    "We couldn't get the data to register the vehicle's arrival!"
                );
            }

            realm.write(() => {
                historic!.status = "arrival";
                historic!.updated_at = new Date();
            });

            Alert.alert("Success", "Arrival successfully registered!");

            goBack();
        } catch (error) {
            console.log("==> Error - handleVehicleRegister: ", error);
            Alert.alert("Error", "The vehicle could not arrive!");
        }
    }

    useEffect(() => {
        getLastSyncTimestamp().then((lastSync) =>
            setDataNotSynced(historic!.updated_at.getTime() > lastSync)
        );
    }, []);

    return (
        <Container>
            <Header title={title} />
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
