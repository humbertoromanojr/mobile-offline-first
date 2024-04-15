import { TouchableOpacityProps } from "react-native";
import { Key, Car } from "phosphor-react-native";
import { useTheme } from "styled-components";

import { Container, IconBox, Message, TextHighLight } from "./styles";

type Props = TouchableOpacityProps & {
  licensePlate?: string | null;
};

export function CarStatus({ licensePlate = null, ...rest }: Props) {
  const theme = useTheme();

  const Icon = licensePlate ? Key : Car;
  const message = licensePlate
    ? `Veículo ${licensePlate} em uso. `
    : `Nenhum veículo em uso. `;
  const status = licensePlate ? "Chegada" : "Saída";

  return (
    <Container {...rest}>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message>
        {message}

        <TextHighLight>Clique aqui para registrar o {status}</TextHighLight>
      </Message>
    </Container>
  );
}
