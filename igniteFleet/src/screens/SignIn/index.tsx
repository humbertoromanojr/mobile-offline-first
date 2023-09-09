import { useEffect, useState } from "react"
import { Alert } from "react-native"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { Realm, useApp } from "@realm/react"

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env"

import { Button } from "../../components/Button"

import { Container, Title, Slogan } from "./styles"

import backgroundImg from "../../assets/background.png"

WebBrowser.maybeCompleteAuthSession()

export function SignIn() {
  const [isAuth, setIsAuth] = useState(false)

  const app = useApp()

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ["profile", "email"],
  })

  function handleGoogleSignIn() {
    setIsAuth(true)

    googleSignIn().then((response) => {
      if (response.type !== "success") {
        setIsAuth(false)
      }
    })
  }

  useEffect(() => {
    if (response?.type === "success") {
      if (response.authentication?.idToken) {
        const credentials = Realm.Credentials.jwt(
          response.authentication.idToken
        )

        app.logIn(credentials).catch((error) => {
          console.log(error)
          Alert.alert(
            "Entrar",
            "Não foi possível conectar-se a sua conta Google!"
          )
          setIsAuth(false)
        })
      } else {
        Alert.alert(
          "Entrar",
          "Não foi possível conectar-se a sua conta Google!"
        )
        setIsAuth(false)
      }
    }
  }, [response])

  return (
    <Container source={backgroundImg}>
      <Title>Car Fleet</Title>
      <Slogan>Gestão de aluguel de veículos</Slogan>
      <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuth}
      />
    </Container>
  )
}
