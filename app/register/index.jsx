import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import Button from "../../components/Button";
import InputText from "../../components/InputText";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 3;

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function formatCnpj(value) {
  const digits = onlyDigits(value).slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function isValidCnpj(value) {
  const digits = onlyDigits(value);

  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) {
    return false;
  }

  let length = 12;
  let numbers = digits.slice(0, length);
  let sum = 0;
  let pos = length - 7;

  for (let index = length; index >= 1; index -= 1) {
    sum += Number(numbers[length - index]) * pos;
    pos -= 1;

    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== Number(digits[12])) {
    return false;
  }

  length = 13;
  numbers = digits.slice(0, length);
  sum = 0;
  pos = length - 7;

  for (let index = length; index >= 1; index -= 1) {
    sum += Number(numbers[length - index]) * pos;
    pos -= 1;

    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === Number(digits[13]);
}

function formatCep(value) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

const initialForm = {
  name: "",
  email: "",
  cnpj: "",
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  initialBalance: "",
  companyCategory: "",
};

const stepLabels = [
  "Informações básicas",
  "CNPJ e localização",
  "Informações da empresa",
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [cepLoading, setCepLoading] = useState(false);
  const [cepFeedback, setCepFeedback] = useState("");

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));

    if (field === "cep") {
      setCepFeedback("");
    }
  }

  function handleEmailBlur() {
    if (form.email && !EMAIL_REGEX.test(form.email)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        email: "Insira um e-mail válido (ex: usuario@email.com)",
      }));
      return;
    }

    setErrors((currentErrors) => ({ ...currentErrors, email: "" }));
  }

  function handleCnpjBlur() {
    if (form.cnpj && !isValidCnpj(form.cnpj)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        cnpj: "Insira um CNPJ válido (ex: 12.345.678/0001-90)",
      }));
      return;
    }

    setErrors((currentErrors) => ({ ...currentErrors, cnpj: "" }));
  }

  async function handleCepBlur() {
    const cepDigits = onlyDigits(form.cep);

    if (!cepDigits) {
      setCepFeedback("");
      return;
    }

    if (cepDigits.length !== 8) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        cep: "Insira um CEP válido (ex: 12345-678)",
      }));
      return;
    }

    setErrors((currentErrors) => ({ ...currentErrors, cep: "" }));
    setCepLoading(true);
    setCepFeedback("");

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepDigits}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          cep: "CEP não encontrado.",
        }));
        return;
      }

      setForm((currentForm) => ({
        ...currentForm,
        cep: formatCep(cepDigits),
        street: data.logradouro || currentForm.street,
        neighborhood: data.bairro || currentForm.neighborhood,
        city: data.localidade || currentForm.city,
        state: data.uf || currentForm.state,
      }));
      setCepFeedback("Endereço preenchido automaticamente.");
    } catch {
      setErrors((currentErrors) => ({
        ...currentErrors,
        cep: "Não foi possível consultar o CEP agora.",
      }));
    } finally {
      setCepLoading(false);
    }
  }

  function validateCurrentStep() {
    const nextErrors = {};

    if (currentStep === 0) {
      if (!form.name.trim()) {
        nextErrors.name = "Informe seu nome.";
      }

      if (!form.email.trim()) {
        nextErrors.email = "Informe seu e-mail.";
      } else if (!EMAIL_REGEX.test(form.email)) {
        nextErrors.email = "Insira um e-mail válido (ex: usuario@email.com)";
      }
    }

    if (currentStep === 1) {
      if (!form.cnpj.trim()) {
        nextErrors.cnpj = "Informe o CNPJ.";
      } else if (!isValidCnpj(form.cnpj)) {
        nextErrors.cnpj = "Insira um CNPJ válido (ex: 12.345.678/0001-90)";
      }

      const cepDigits = onlyDigits(form.cep);

      if (!cepDigits) {
        nextErrors.cep = "Informe o CEP.";
      } else if (cepDigits.length !== 8) {
        nextErrors.cep = "Insira um CEP válido (ex: 12345-678)";
      }

      if (!form.street.trim()) {
        nextErrors.street = "Informe a rua.";
      }

      if (!form.neighborhood.trim()) {
        nextErrors.neighborhood = "Informe o bairro.";
      }

      if (!form.city.trim()) {
        nextErrors.city = "Informe a cidade.";
      }

      if (!form.state.trim()) {
        nextErrors.state = "Informe o estado.";
      }
    }

    if (currentStep === 2) {
      if (!form.initialBalance.trim()) {
        nextErrors.initialBalance = "Informe o saldo inicial.";
      }

      if (!form.companyCategory.trim()) {
        nextErrors.companyCategory = "Informe a categoria da empresa.";
      }
    }

    setErrors((currentErrors) => ({ ...currentErrors, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  }

  function handleNextStep() {
    if (!validateCurrentStep()) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS - 1));
  }

  function handleSubmit() {
    if (!validateCurrentStep()) {
      return;
    }

    router.replace("/(tabs)/home");
  }

  return (
    <View className="flex-1 bg-azul-primario">
      <SafeAreaView className="flex-1 justify-between">
        <Image
          source={require("../../assets/images/logo_branco.png")}
          className="self-center w-[60%] mt-[5%] h-[15%]"
          resizeMode="contain"
        />

        <View className="bg-white rounded-t-[50px] absolute bottom-0 left-0 right-0 h-[84%]">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-10 pt-10 pb-4 gap-6">
              <View className="gap-3">
                <Text className="text-2xl font-poppins-semibold text-texto-primario">
                  Crie sua conta
                </Text>
                <Text className="font-poppins-regular text-texto-terciario">
                  Etapa {currentStep + 1} de {TOTAL_STEPS}:{" "}
                  {stepLabels[currentStep]}
                </Text>
                <View className="flex-row gap-2">
                  {stepLabels.map((label, index) => (
                    <View
                      key={label}
                      className={`h-2 flex-1 rounded-full ${
                        index <= currentStep
                          ? "bg-azul-primario"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </View>
              </View>

              <View className="gap-6">
                {currentStep === 0 ? (
                  <>
                    <InputText
                      label="Nome completo"
                      required
                      placeholder="Como devemos te chamar?"
                      value={form.name}
                      onChangeText={(text) => updateField("name", text)}
                      secureTextEntry={false}
                      autoCapitalize="words"
                      error={errors.name}
                    />
                    <InputText
                      label="E-mail"
                      required
                      placeholder="usuario@email.com"
                      value={form.email}
                      onChangeText={(text) => updateField("email", text)}
                      secureTextEntry={false}
                      onBlur={handleEmailBlur}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      error={errors.email}
                    />
                  </>
                  
                ) : null}

                {currentStep === 1 ? (
                  <>
                    <InputText
                      label="CNPJ"
                      required
                      placeholder="12.345.678/0001-90"
                      value={form.cnpj}
                      onChangeText={(text) =>
                        updateField("cnpj", formatCnpj(text))
                      }
                      secureTextEntry={false}
                      onBlur={handleCnpjBlur}
                      keyboardType="number-pad"
                      error={errors.cnpj}
                    />

                    <View className="gap-2">
                      <InputText
                        label="CEP"
                        required
                        placeholder="12345-678"
                        value={form.cep}
                        onChangeText={(text) =>
                          updateField("cep", formatCep(text))
                        }
                        secureTextEntry={false}
                        onBlur={handleCepBlur}
                        keyboardType="number-pad"
                        error={errors.cep}
                      />
                      <View className="min-h-5 flex-row items-center gap-2">
                        {cepLoading ? (
                          <ActivityIndicator size="small" color="#0063f5" />
                        ) : null}
                        {cepFeedback ? (
                          <Text className="font-poppins-regular text-xs text-azul-primario">
                            {cepFeedback}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <InputText
                      label="Rua"
                      required
                      placeholder="Rua, avenida, travessa..."
                      value={form.street}
                      onChangeText={(text) => updateField("street", text)}
                      secureTextEntry={false}
                      error={errors.street}
                    />
                    <InputText
                      label="Número"
                      placeholder="Ex: 123"
                      value={form.number}
                      onChangeText={(text) => updateField("number", text)}
                      secureTextEntry={false}
                      keyboardType="number-pad"
                    />
                    <InputText
                      label="Bairro"
                      required
                      placeholder="Seu bairro"
                      value={form.neighborhood}
                      onChangeText={(text) => updateField("neighborhood", text)}
                      secureTextEntry={false}
                      error={errors.neighborhood}
                    />
                    <InputText
                      label="Cidade"
                      required
                      placeholder="Sua cidade"
                      value={form.city}
                      onChangeText={(text) => updateField("city", text)}
                      secureTextEntry={false}
                      error={errors.city}
                    />
                    <InputText
                      label="UF"
                      required
                      placeholder="Ex: SP"
                      value={form.state}
                      onChangeText={(text) =>
                        updateField("state", text.toUpperCase())
                      }
                      secureTextEntry={false}
                      autoCapitalize="characters"
                      maxLength={2}
                      error={errors.state}
                    />
                  </>
                ) : null}

                {currentStep === 2 ? (
                  <>
                    <InputText
                      label="Saldo inicial"
                      required
                      placeholder="Ex: 15000"
                      value={form.initialBalance}
                      onChangeText={(text) =>
                        updateField("initialBalance", text)
                      }
                      secureTextEntry={false}
                      keyboardType="decimal-pad"
                      error={errors.initialBalance}
                    />
                    <InputText
                      label="Categoria da empresa"
                      required
                      placeholder="Ex: Tecnologia, varejo, serviços..."
                      value={form.companyCategory}
                      onChangeText={(text) =>
                        updateField("companyCategory", text)
                      }
                      secureTextEntry={false}
                      error={errors.companyCategory}
                    />
                  </>
                ) : null}
              </View>

              <View className="gap-3 pt-2">
                {currentStep < TOTAL_STEPS - 1 ? (
                  <Button
                    title="Continuar"
                    onPress={handleNextStep}
                    isPrimary={true}
                  />
                ) : (
                  <Button
                    title="Criar conta"
                    onPress={handleSubmit}
                    isPrimary={true}
                  />
                )}

                {currentStep > 0 ? (
                  <Pressable
                    onPress={() =>
                      setCurrentStep((step) => Math.max(step - 1, 0))
                    }
                  >
                    <Text className="text-center font-poppins-medium text-azul-primario">
                      Voltar para a etapa anterior
                    </Text>
                  </Pressable>
                ) : null}

                {currentStep === 0 ? (
                  <><Text className="text-center font-poppins-medium text-texto-secundario">
                Já possui conta?{" "}
                <Text
                  onPress={() => router.replace("/login")}
                  className="text-azul-primario"
                >
                  Acesse aqui
                </Text>
              </Text>
              <Text 
              onPress={() => router.push("/about")} 
              className="font-poppins-regular-italic text-azul-primario text-center text-sm">
                Conheça mais sobre nós
              </Text></>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
