import styled from "styled-components/native"

export const Container = styled.View`
  width: 100%;
  margin: 32px 0;
  padding: 22px;
  border-radius: 7px;

  background-color: ${({ theme }) => theme.COLORS.GRAY_700};

  flex-direction: row;
  align-items: center;
`
