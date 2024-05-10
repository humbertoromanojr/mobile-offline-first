import { useTheme } from "styled-components/native";

import { IconBoxProps } from "../ButtonIcon";
import { Container, Title } from "./styles";

type Props = {
    icon?: IconBoxProps;
    title: string;
};

export function TopMessage({ title, icon: Icon }: Props) {
    const { COLORS } = useTheme();

    return (
        <Container>
            {Icon && <Icon size={18} color={COLORS.GRAY_100} />}

            <Title>{title}</Title>
        </Container>
    );
}
