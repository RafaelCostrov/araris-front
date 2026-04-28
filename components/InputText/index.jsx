import { View, Text, TextInput } from "react-native";

export default function InputText({ label, placeholder, value, onChangeText, secureTextEntry }) {
    return (
            <View className="gap-1">
              <Text className="font-poppins-medium text-texto-secundario text-lg">
                {label}
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg p-2 font-poppins-regular text-texto-primario"
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
              />
            </View>
    )}