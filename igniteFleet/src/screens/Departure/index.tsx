import { Header } from "../../components/Header"
import { LicensePlateInput } from "../../components/LicensePlateInput"

import { Container, Content } from "./styles"

export function Departure() {
  return (
    <Container>
      <Header title="Saída" />

      <Content>
        <LicensePlateInput label="Place do veículo" placeholder="BRA4321" />
      </Content>
    </Container>
  )
}
