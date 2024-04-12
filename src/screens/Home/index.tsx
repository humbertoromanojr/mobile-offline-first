import { useNavigation } from "@react-navigation/native";

import { Container, Content } from "./styles";

import { HomeHeader } from "../../components/HomeHeader";

export function Home() {
  return (
    <Container>
      <HomeHeader />
    </Container>
  );
}
