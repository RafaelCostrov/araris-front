import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import Button from "../../components/Button";
import InputText from "../../components/InputText";

export default function AcessarConta() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View className="flex-1 bg-azul-primario">
      <SafeAreaView className="flex-1 justify-between">
        <Image
          source={require("../../assets/images/logo_branco.png")}
          className="self-center w-[60%] mt-[5%] h-[15%]"
          resizeMode="contain"
        />
        <View className="bg-white rounded-t-[50px] absolute bottom-0 left-0 right-0  h-[80%] justify-around pb-4">
          <Text className="text-2xl pl-12 pt-10 font-poppins-semibold text-texto-primario">
            Acesse sua conta
          </Text>
          <View className="gap-6">
            <View className="w-[85%] self-center gap-4">
              <InputText
                label="E-mail"
                placeholder="usuario@email.com"
                value={email}
                onChangeText={(text) => setEmail(text)}
                secureTextEntry={false}
              />
              <InputText
                label="Senha"
                placeholder="•••••••••••••"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
              />
            </View>

            <Text className="text-left pl-12 text-sm font-poppins-medium text-azul-primario">
              Esqueceu sua senha?
            </Text>
            <Button
              title="Entrar"
              onPress={() => router.replace("/(tabs)/home")}
              isPrimary={true}
            />
          </View>
          <Text className="text-center font-poppins-medium text-texto-secundario">
            Não possui conta?{" "}
            <Text onPress={() => router.replace("/Register")} className="text-azul-primario">
              Se Cadastre
            </Text>
          </Text>
          <View className="h-[1px] w-[90%] self-center bg-gray-300" />
          <Pressable className="p-4 w-[20%] self-center items-center justify-center rounded-xl active:bg-gray-200/50 border border-gray-200">
            <Image
              source={require("../../assets/images/google.png")}
              className="w-10 h-10 self-center"
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
