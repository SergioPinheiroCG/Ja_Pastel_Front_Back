import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./styles/login.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/api"; // Importa a função login do api.ts

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (text) => {
    setEmail(text);
    setEmailError(
      !text
        ? "E-mail é obrigatório"
        : !emailRegex.test(text)
        ? "E-mail inválido"
        : ""
    );
  };

  const validateForm = () => {
    let isValid = true;
    if (!email || !emailRegex.test(email)) {
      setEmailError("E-mail inválido");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Senha é obrigatória");
      isValid = false;
    }
    return isValid;
  };

  const handleEntrar = async () => {
    if (validateForm()) {
      try {
        const { token } = await login(email, password); // Chama a função login do api.ts
        await AsyncStorage.setItem("authToken", token); // Armazena o token no AsyncStorage
        router.push("/(tabs)/home"); // Redireciona após login
      } catch (error) {
        Alert.alert("Erro", error.message || "Falha ao fazer login");
      }
    } else {
      Alert.alert(
        "Erro",
        "Login Inválido! Por favor, digite um e-mail e senha válidos."
      );
    }
  };

  const handleRegister = () => {
    router.push("/register"); // Redireciona para a página de cadastro
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
      <Text style={styles.slogan}>FAÇA O SEU LOGIN{"\n"} {"\n"}
      </Text>
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
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
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
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.buttonLogin} onPress={handleEntrar}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleRegister}
        >
          <Text style={styles.buttonTextRegister}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Login;
