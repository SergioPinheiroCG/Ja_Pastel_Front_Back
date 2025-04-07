import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/api";
import styles from "./styles/login.styles";

interface User {
  id: string;
  email: string;
  nome: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const Login = () => {
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    isLoading: false,
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const updateFormState = (updates: Partial<typeof formState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const validateEmail = (text: string) => {
    updateFormState({
      email: text,
      emailError: !text
        ? "Por favor, insira seu e-mail"
        : !emailRegex.test(text)
        ? "Por favor, insira um e-mail válido"
        : "",
    });
  };

  const validatePassword = (text: string) => {
    updateFormState({
      password: text,
      passwordError: !text ? "Por favor, insira sua senha" : "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      emailError: "",
      passwordError: "",
    };

    if (!formState.email) {
      errors.emailError = "Por favor, insira seu e-mail";
      isValid = false;
    } else if (!emailRegex.test(formState.email)) {
      errors.emailError = "Por favor, insira um e-mail válido";
      isValid = false;
    }

    if (!formState.password) {
      errors.passwordError = "Por favor, insira sua senha";
      isValid = false;
    }

    updateFormState(errors);
    return isValid;
  };

  const getFriendlyErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') {
      // Trata mensagens específicas da API
      if (error.includes('credentials')) {
        return 'E-mail ou senha incorretos. Por favor, tente novamente.';
      }
      if (error.includes('connection')) {
        return 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      }
      return error;
    }

    if (error instanceof Error) {
      // Trata erros específicos
      if (error.message.includes('Network Error')) {
        return 'Problema de conexão. Verifique sua internet e tente novamente.';
      }
      if (error.message.includes('404')) {
        return 'Serviço indisponível no momento. Tente novamente mais tarde.';
      }
      return 'Ocorreu um erro durante o login. Por favor, tente novamente.';
    }

    return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert("Atenção", "Por favor, verifique os campos destacados");
      return;
    }

    updateFormState({ isLoading: true });

    try {
      const response = await login(formState.email, formState.password) as LoginResponse;
      
      if (!response?.token || !response?.user?.id) {
        throw new Error('Dados de autenticação incompletos');
      }

      if (!response.user.nome) {
        throw new Error('Informações do usuário incompletas');
      }

      // Armazena todos os dados do usuário
      await AsyncStorage.multiSet([
        ['authToken', response.token],
        ['userId', response.user.id],
        ['userName', response.user.nome],
        ['userEmail', response.user.email],
      ]);

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Erro no login:", error);
      const friendlyMessage = getFriendlyErrorMessage(error);
      Alert.alert("Atenção", friendlyMessage);
    } finally {
      updateFormState({ isLoading: false });
    }
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <LinearGradient
      colors={["#FF0000", "#FFFF00"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require("../assets/images/LogoJapastel.png")}
        style={styles.logo}
      />
      <Text style={styles.slogan}>FAÇA O SEU LOGIN{"\n"}</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <FontAwesome
              name="envelope"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, formState.emailError ? styles.inputError : null]}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              value={formState.email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {formState.emailError ? (
            <Text style={styles.errorText}>{formState.emailError}</Text>
          ) : null}
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={24}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, formState.passwordError ? styles.inputError : null]}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={formState.password}
              onChangeText={validatePassword}
            />
          </View>
          {formState.passwordError ? (
            <Text style={styles.errorText}>{formState.passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={handleLogin}
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={navigateToRegister}
          disabled={formState.isLoading}
        >
          <Text style={styles.buttonTextRegister}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Login;