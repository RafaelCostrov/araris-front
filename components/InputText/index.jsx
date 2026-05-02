import { View, Text, TextInput } from "react-native";

export default function InputText({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  onBlur,
  error,
  required,
  ...props
}) {
  return (
    <View className="gap-1">
      <Text className="font-poppins-medium text-texto-secundario text-lg">
        {label}
        {required ? <Text className="text-red-400"> *</Text> : null}
      </Text>
      <View>
        <TextInput
          className={`bg-gray-100 rounded-lg p-2 font-poppins-regular text-texto-primario border ${
            error ? "border-red-500" : "border-transparent"
          }`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onBlur={onBlur}
          {...props}
        />
        {error ? (
          <Text className="absolute -bottom-4 left-1 text-red-500 text-xs font-poppins-regular">
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
