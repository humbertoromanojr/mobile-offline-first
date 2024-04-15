import { useState, useContext } from "react";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Realm, useApp } from "@realm/react";

import { Button } from "../../components/Button";
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from "@env";

import { Container, Title, Slogan, Content } from "./styles";

import backgroundImg from "../../assets/background.png";

GoogleSignin.configure({
  scopes: ["email", "profile"],
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
});

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const app = useApp();

  async function handleGoogleSignIn() {
    try {
      setIsAuthenticating(true);

      const { idToken } = await GoogleSignin.signIn();

      if (idToken) {
        const credentials = Realm.Credentials.jwt(idToken);

        await app.logIn(credentials);
      } else {
        Alert.alert(
          "Entrar com Google",
          "Não foi possível se logar na sua conta Google, tente de novo mais tarde!"
        );
        setIsAuthenticating(false);
      }
    } catch (error) {
      console.log("==> SignIn", error);
      setIsAuthenticating(false);
      Alert.alert(
        "Entrar com Google",
        "Não foi possível se logar na sua conta Google, tente de novo mais tarde!"
      );
    }
  }

  return (
    <Container source={backgroundImg}>
      <Content>
        <Title>Car Fleet</Title>
        <Slogan>Gestão de aluguel de veículos</Slogan>
        <Button
          title="Entrar com Google"
          isLoading={isAuthenticating}
          onPress={handleGoogleSignIn}
        />
      </Content>
    </Container>
  );
}
