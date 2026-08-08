import Screen from "../../components/layout/Screen";
import AuthForm from "../../components/auth/AuthForm";

import { useAuth } from "../../hooks/useAuth";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register, pendingVideoId, setPendingVideoId } = useAuth();

  async function handleRegister(email: string, password: string) {
    await register(email, password);

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
        title="Create Account"
        buttonText="Register"
        onSubmit={handleRegister}
      />
    </Screen>
  );
}
