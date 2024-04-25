import styled from "styled-components/native";

export const Container = styled.View`
    width: 100%;
    padding: 16px;
    border-radius: 7px;

    background-color: ${({ theme }) => theme.COLORS.GRAY_700};
`;
