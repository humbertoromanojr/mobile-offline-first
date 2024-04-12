import styled from "styled-components/native"

export const Container = styled.View`
  flex: 1;

  background: ${({ theme }) => theme.COLORS.GRAY_800};
`

export const Content = styled.View`
  flex: 1;
  padding: 12px;
`
