import "react-native-get-random-values";
import "./src/libs/dayjs";

import { ThemeProvider } from "styled-components/native";
import { AppProvider, UserProvider } from "@realm/react";
import {
    useFonts,
    Roboto_400Regular,
    Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import { WifiSlash } from "phosphor-react-native";
import { StatusBar } from "react-native";

// screens
import { SignIn } from "./src/screens/SignIn";

// components
import { Loading } from "./src/components/Loading";
import { TopMessage } from "./src/components/TopMessage";

// routes
import { Routes } from "./src/routes";

// settings
import { REALM_APP_ID } from "@env";
import theme from "./src/theme";
import { RealmProvider, syncConfig } from "./src/libs/realm";

export default function App() {
    const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
    const netInfo = useNetInfo();

    if (!fontLoaded) {
        return <Loading />;
    }

    return (
        <AppProvider id={REALM_APP_ID}>
            <ThemeProvider theme={theme}>
                <SafeAreaProvider
                    style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
                >
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="transparent"
                        translucent
                    />

                    {!netInfo.isConnected && (
                        <TopMessage
                            title="Você está agora Off-line"
                            icon={WifiSlash}
                        />
                    )}

                    <UserProvider fallback={SignIn}>
                        <RealmProvider sync={syncConfig} fallback={Loading}>
                            <Routes />
                        </RealmProvider>
                    </UserProvider>
                </SafeAreaProvider>
            </ThemeProvider>
        </AppProvider>
    );
}
