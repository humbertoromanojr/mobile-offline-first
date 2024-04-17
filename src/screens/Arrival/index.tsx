import React from "react";
import { useRoute } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { Button } from "../../components/Button";

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();

  const { id } = route.params as RouteParamsProps;

  return (
    <Container>
      <Header title="Chegada" />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>XXX0000</LicensePlate>
        <Label>Finalidade</Label>
        <Description>
          Descrição do uso do veículo descrição do uso do veículo descrição do
          uso do veículo descrição do uso do veículo descrição do uso do veículo
          descrição do uso do veículo descrição do uso do veículo descrição do
          uso do veículo descrição do uso do veículo
        </Description>

        <Footer>
          <Button title="Registrar Chegada" />
        </Footer>
      </Content>
    </Container>
  );
}
