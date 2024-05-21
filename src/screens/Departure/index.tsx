import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, TextInput } from "react-native";
import { useUser } from "@realm/react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Car } from "phosphor-react-native";
import {
    useForegroundPermissions,
    watchPositionAsync,
    LocationAccuracy,
    LocationSubscription,
    LocationObjectCoords,
} from "expo-location";

import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { Loading } from "../../components/Loading";
import { Map } from "../../components/Map";
import { LocationInfo } from "../../components/LocationInfo";
import { TextAreaInput } from "../../components/TextAreaInput";
import { LicensePlateInput } from "../../components/LicensePlateInput";

import { Container, Content, Message } from "./styles";
import { licensePlateValidate } from "../../utils/licensePlateValidate";
import { getAddressLocation } from "../../utils/getAddressLocation";

export function Departure() {
    const [licensePlate, setLicensePlate] = useState("");
    const [description, setDescription] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [currentAddress, setCurrentAddress] = useState<string | null>(null);
    const [currentCoords, setCurrentCoords] =
        useState<LocationObjectCoords | null>(null);

    const [locationForegroundPermission, requestLocationForegroundPermission] =
        useForegroundPermissions();

    const descriptionRef = useRef<TextInput>(null);
    const licensePlateRef = useRef<TextInput>(null);

    const { goBack } = useNavigation();

    const realm = useRealm();
    const user = useUser();

    function handleDepartureRegister() {
        try {
            if (!licensePlateValidate(licensePlate)) {
                licensePlateRef.current?.focus();
                return Alert.alert(
                    "Plate is Invalid",
                    "Invalid Plate,  informe correctly plate from your car please"
                );
            }

            if (description.trim().length === 0) {
                descriptionRef.current?.focus();
                return Alert.alert(
                    "Purpose",
                    "Please state the purpose for which you are using the vehicle"
                );
            }

            setIsRegistering(true);

            realm.write(() => {
                realm.create(
                    "Historic",
                    Historic.generate({
                        user_id: user!.id,
                        license_plate: licensePlate,
                        description: description,
                    })
                );
            });

            Alert.alert("Exit", "Vehicle exit successfully registered!");

            goBack();
        } catch (error) {
            setIsRegistering(false);
            console.log("==> Error: ", error);
            Alert.alert(
                "Error",
                "It was not possible to record the exit of the vehicle!!"
            );
        }
    }

    useEffect(() => {
        requestLocationForegroundPermission();
    }, []);

    useEffect(() => {
        if (!locationForegroundPermission?.granted) {
            return;
        }

        let subscription: LocationSubscription;

        watchPositionAsync(
            {
                accuracy: LocationAccuracy.High,
                timeInterval: 1000,
            },
            (location) => {
                setCurrentCoords(location.coords);

                getAddressLocation(location.coords)
                    .then((address) => {
                        if (address) {
                            setCurrentAddress(address);
                        }
                    })
                    .finally(() => setIsLoadingLocation(false));
            }
        ).then((response) => (subscription = response));

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [locationForegroundPermission]);

    if (!locationForegroundPermission?.granted) {
        return (
            <Container>
                <Header title="Saída" />
                <Message>
                    Você precisa permitir o acesso a localização, para utilizar
                    essa funcionalidade. Por favor, acesse as configurações do
                    seu aparelho para conceder essa permissão.
                </Message>
            </Container>
        );
    }

    if (isLoadingLocation) {
        return <Loading />;
    }

    return (
        <Container>
            <Header title="Saída" />

            <KeyboardAwareScrollView extraHeight={100}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {currentCoords && <Map coordinates={[currentCoords]} />}
                    <Content>
                        {currentAddress && (
                            <LocationInfo
                                icon={Car}
                                label="Localização atual"
                                description={currentAddress}
                            />
                        )}

                        <LicensePlateInput
                            ref={licensePlateRef}
                            label="Placa do veículo"
                            placeholder="BRA4321"
                            onSubmitEditing={() =>
                                descriptionRef.current?.focus()
                            }
                            returnKeyType="next"
                            onChangeText={setLicensePlate}
                        />

                        <TextAreaInput
                            ref={descriptionRef}
                            label="Finalidade"
                            placeholder="Vou utilizar o veículo para..."
                            onChangeText={setDescription}
                        />

                        <Button
                            title="Registrar Saída"
                            onPress={handleDepartureRegister}
                            isLoading={isRegistering}
                        />
                    </Content>
                </ScrollView>
            </KeyboardAwareScrollView>
        </Container>
    );
}
