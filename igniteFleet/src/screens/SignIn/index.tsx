import { Container, Title, Slogan } from "./styles"

import { Button } from "../../components/Button"

import backgroundImg from "../../assets/background.png"

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Car Fleet</Title>
      <Slogan>Gestão de aluguel de veículos</Slogan>
      <Button title="Entrar com Google" />
    </Container>
  )
}
