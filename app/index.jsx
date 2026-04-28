import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import Button from "../components/Button";

export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-azul-primario">
      <Image
        source={require("../assets/images/loira.png")}
        className="absolute top-[15%] bottom-0 left-0 right-0 w-full h-[100%]"
        resizeMode="contain"
      />
      <SafeAreaView className="flex-1 justify-between">
        <Image
          source={require("../assets/images/logo_branco.png")}
          className="self-center w-[60%] mt-4 bottom-[20%]"
          resizeMode="contain"
        />

        <View className="gap-2">
          <Button 
          title="Acesse sua conta"
          onPress={() => router.push("/login")}
          isPrimary={true}
          />
          <Button 
          title="Crie uma nova conta"
          onPress={() => router.push("/register")}
          isPrimary={false}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
