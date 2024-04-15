import { Header } from "../../components/Header";
import { Button } from "../../components/Button";
import { TextAreaInput } from "../../components/TextAreaInput";
import { LicensePlateInput } from "../../components/LicensePlateInput";

import { Container, Content } from "./styles";

export function Departure() {
  return (
    <Container>
      <Header title="Saída" />

      <Content>
        <LicensePlateInput label="Placa do veículo" placeholder="BRA4321" />

        <TextAreaInput label="Finalidade" />

        <Button title="Registrar Saída" />
      </Content>
    </Container>
  );
}
