import styled, { css } from "styled-components/native";

export type SizeProps = "SMALL" | "NORMAL";

type Props = {
    size: SizeProps;
};

const variantSizeStyles = (size: SizeProps) => {
    return {
        SMALL: css`
            width: 32px;
            height: 32px;
        `,
        NORMAL: css`
            width: 46px;
            height: 46px;
        `,
    }[size];
};

export const Container = styled.View<Props>`
    flex: 1;

    ${({ size }) => variantSizeStyles(size)}
`;
