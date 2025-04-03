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
        ? "E-mail é obrigatório"
        : !emailRegex.test(text)
        ? "E-mail inválido"
        : "",
    });
  };

  const validatePassword = (text: string) => {
    updateFormState({
      password: text,
      passwordError: !text ? "Senha é obrigatória" : "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      emailError: "",
      passwordError: "",
    };

    if (!formState.email || !emailRegex.test(formState.email)) {
      errors.emailError = "E-mail inválido";
      isValid = false;
    }

    if (!formState.password) {
      errors.passwordError = "Senha é obrigatória";
      isValid = false;
    }

    updateFormState(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os campos destacados");
      return;
    }

    updateFormState({ isLoading: true });

    try {
      const response = await login(formState.email, formState.password) as LoginResponse;
      
      if (!response?.token || !response?.user?.id) {
        throw new Error("Dados de login incompletos");
      }

      if (!response.user.nome) {
        throw new Error("Nome do usuário não retornado");
      }

      // Armazena todos os dados do usuário
      await AsyncStorage.multiSet([
        ['authToken', response.token],
        ['userId', response.user.id],
        ['userName', response.user.nome],
        ['userEmail', response.user.email],
      ]);

      console.log('Dados do usuário armazenados:', {
        token: response.token.substring(0, 10) + '...',
        userId: response.user.id,
        userName: response.user.nome,
      });

      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Erro no login:", {
        error,
        email: formState.email,
        time: new Date().toISOString(),
      });

      const errorMessage = typeof error === "string" 
        ? error 
        : error.message || "Falha ao fazer login. Verifique suas credenciais.";
      
      Alert.alert("Erro", errorMessage);
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