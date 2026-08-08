import Screen from "../../components/layout/Screen";
import AuthForm from "../../components/auth/AuthForm";

import { useAuth } from "../../hooks/useAuth";

import { NativeStackScreenProps } from "@react-navigation/native-stack"; // here is the error
import { RootStackParamList } from "../../navigation/RootStack";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login, pendingVideoId, setPendingVideoId } = useAuth();

  async function handleLogin(email: string, password: string) {
    await login(email, password);

    // Resume pending analysis if there is one
    if (pendingVideoId) {
      const id = pendingVideoId;

      setPendingVideoId(null);

      navigation.replace("Processing", {
        videoId: id,
      });

      return;
    }

    navigation.goBack();
  }

  return (
    <Screen>
      <AuthForm
        title="Welcome Back"
        buttonText="Login"
        onSubmit={handleLogin}
      />
    </Screen>
  );
}
