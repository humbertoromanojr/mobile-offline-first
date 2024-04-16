import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import { Container } from "./styles";

type RouteParamsProps = {
  id: string;
};

export function Arrival() {
  const route = useRoute();

  const { id } = route.params as RouteParamsProps;

  console.log("==> ID: ", id);

  return (
    <Container>
      <Text></Text>
    </Container>
  );
}
