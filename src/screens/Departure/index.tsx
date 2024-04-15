import { useRef } from "react";
import { TextInput } from "react-native";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { TextAreaInput } from "../../components/TextAreaInput";
import { LicensePlateInput } from "../../components/LicensePlateInput";

import { Container, Content } from "./styles";

export function Departure() {
  const descriptionRef = useRef<TextInput>(null);

  function handleDepartureRegister() {
    console.log("==> OK");
  }

  return (
    <Container>
      <Header title="Saída" />

      <Content>
        <LicensePlateInput
          label="Placa do veículo"
          placeholder="BRA4321"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          returnKeyType="next"
        />

        <TextAreaInput ref={descriptionRef} label="Finalidade" />

        <Button title="Registrar Saída" onPress={handleDepartureRegister} />
      </Content>
    </Container>
  );
}
