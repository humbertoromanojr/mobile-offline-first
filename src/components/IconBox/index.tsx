import { IconProps } from "phosphor-react-native";
import { useTheme } from "styled-components";

import { Container, SizeProps } from "./styles";

export type IconBoxProps = (props: IconProps) => JSX.Element;

type Props = {
    size?: SizeProps;
    icon: IconBoxProps;
};

export function IconBox({ size = "NORMAL", icon: Icon }: Props) {
    const iconSize = size === "NORMAL" ? 24 : 16;
    const { COLORS } = useTheme();

    return (
        <Container size={size}>
            <Icon size={iconSize} color={COLORS.BAND_LIGHT} />
        </Container>
    );
}
