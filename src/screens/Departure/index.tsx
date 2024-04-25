import { useRef, useState } from "react";
import { Alert, ScrollView, TextInput } from "react-native";
import { useUser } from "@realm/react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { TextAreaInput } from "../../components/TextAreaInput";
import { LicensePlateInput } from "../../components/LicensePlateInput";

import { Container, Content } from "./styles";
import { licensePlateValidate } from "../../utils/licensePlateValidate";

export function Departure() {
    const [licensePlate, setLicensePlate] = useState("");
    const [description, setDescription] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

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

    return (
        <Container>
            <Header title="Saída" />

            <KeyboardAwareScrollView extraHeight={100}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Content>
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
