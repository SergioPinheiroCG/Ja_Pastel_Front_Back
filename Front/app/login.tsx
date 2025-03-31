import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "./styles/login.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/api";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailError(
      !text
        ? "E-mail é obrigatório"
        : !emailRegex.test(text)
        ? "E-mail inválido"
        : ""
    );
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(!text ? "Senha é obrigatória" : "");
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
    if (!validateForm()) {
      Alert.alert("Erro", "Por favor, corrija os campos destacados");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password);
      
      if (!response?.token || !response?.user?.id) {
        throw new Error("Dados de login incompletos");
      }

      // Armazena ambos token e userId
      await AsyncStorage.multiSet([
        ['authToken', response.token],
        ['userId', response.user.id]
        
      ]);

      // Verificação adicional
      const [storedToken, storedUserId] = await AsyncStorage.multiGet(['authToken', 'userId']);
      
      if (!storedToken[1] || !storedUserId[1]) {
        throw new Error("Falha ao armazenar credenciais");
      }

      console.log("Login bem-sucedido:", {
        token: storedToken[1]?.substring(0, 10) + "...",
        userId: storedUserId[1]
      });

      router.replace("/(tabs)/home");

    } catch (error) {
      console.error("Erro no login:", {
        error,
        email,
        time: new Date().toISOString()
      });

      Alert.alert(
        "Erro",
        typeof error === 'string' 
          ? error 
          : error.message || "Falha ao fazer login. Verifique suas credenciais."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
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
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={validateEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={validatePassword}
            />
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity 
          style={styles.buttonLogin} 
          onPress={handleEntrar}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonTextRegister}>CADASTRAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Login;