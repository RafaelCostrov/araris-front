import { View, Text, TextInput } from "react-native";

export default function InputText({ label, placeholder, value, onChangeText, secureTextEntry, onBlur, error }) {
    return (
            <View className="gap-1">
              <Text className="font-poppins-medium text-texto-secundario text-lg">
                {label}
              </Text>
              <View>
                <TextInput
                  className={`bg-gray-100 rounded-lg p-2 font-poppins-regular text-texto-primario border ${error ? 'border-red-500' : 'border-transparent'}`}
                  placeholder={placeholder}
                  value={value}
                  onChangeText={onChangeText}
                  secureTextEntry={secureTextEntry}
                  onBlur={onBlur}
                />
                {error ? (
                  <Text className="absolute -bottom-4 left-1 text-red-500 text-xs font-poppins-regular">{error}</Text>
                ) : null}
              </View>
            </View>
    )}