import { useState, useContext } from "react";
import { Alert } from "react-native";

import { Button } from "../../components/Button";

import { Container, Title, Slogan, Content } from "./styles";

import backgroundImg from "../../assets/background.png";

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Content>
        <Title>Car Fleet</Title>
        <Slogan>Gestão de aluguel de veículos</Slogan>
        <Button title="Entrar com Google" />
      </Content>
    </Container>
  );
}
