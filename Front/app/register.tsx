import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import styles from "./styles/register.styles";
import { register } from "../services/api";

const Register = () => {
  const router = useRouter();

  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para mensagens de erro
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Regex para validação de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Função para validar o e-mail em tempo real
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(""); // Limpa o erro ao editar
    
    if (!text) {
      setEmailError("E-mail é obrigatório");
    } else if (!emailRegex.test(text)) {
      setEmailError("E-mail inválido");
    }
  };

  // Função para formatar e validar o CPF
  const handleCpfChange = (text: string) => {
    setCpfError(""); // Limpa o erro ao editar
    
    let formattedText = text.replace(/\D/g, "");
    if (formattedText.length > 3) {
      formattedText = formattedText.replace(/^(\d{3})(\d)/, "$1.$2");
    }
    if (formattedText.length > 6) {
      formattedText = formattedText.replace(
        /^(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3"
      );
    }
    if (formattedText.length > 9) {
      formattedText = formattedText.replace(
        /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
        "$1.$2.$3-$4"
      );
    }
    if (formattedText.length > 14) {
      formattedText = formattedText.substring(0, 14);
    }
    setCpf(formattedText);

    // Validação do CPF
    if (formattedText.length < 14) {
      setCpfError("CPF inválido");
    }
  };

  // Função para validar o formulário
  const validateForm = () => {
    let isValid = true;

    if (!name || name.length < 2) {
      setNameError("Nome deve ter pelo menos 2 caracteres");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!phone) {
      setPhoneError("Telefone é obrigatório");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!email) {
      setEmailError("E-mail é obrigatório");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("E-mail inválido");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!cpf || cpf.length < 14) {
      setCpfError("CPF inválido");
      isValid = false;
    } else {
      setCpfError("");
    }

    if (!password) {
      setPasswordError("Senha é obrigatória");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirme sua senha");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  // Função para lidar com o cadastro
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    const user = { nome: name, email, telefone: phone, cpf, senha: password };

    try {
      const response = await register(
        user.nome,
        user.email,
        user.telefone,
        user.cpf,
        user.senha
      );

      if (response._id) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        router.push("/login");
      } else if (response.message) {
        // Mostra mensagem genérica se não for possível identificar o campo
        Alert.alert("Erro", response.message);
      }
    } catch (error: any) {
      console.error("Erro no registro:", error);
      
      // Tratamento específico para erros de CPF
      if (error.message.includes("CPF")) {
        setCpfError(error.message);
      } 
      // Tratamento para erros de e-mail
      else if (error.message.includes("e-mail") || error.message.includes("email")) {
        setEmailError(error.message);
      } 
      // Tratamento para erros de telefone
      else if (error.message.includes("telefone")) {
        setPhoneError(error.message);
      } 
      // Tratamento para outros erros
      else {
        Alert.alert("Erro", error.message || "Ocorreu um erro ao realizar o cadastro.");
      }
    }
  };

  // Função para voltar à tela inicial
  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <LinearGradient
      colors={["#FF0000", "#FFFF00"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/LogoJapastel.png")}
            style={styles.logo}
          />
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.formContainer}>
          {/* NOME */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="user"
                size={20}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError("");
                }}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* TELEFONE */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="phone"
                size={20}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite nº de seu telefone"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setPhoneError("");
                }}
                keyboardType="phone-pad"
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* E-MAIL */}
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
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* CPF */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="id-card"
                size={20}
                color="#999"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite seu CPF"
                placeholderTextColor="#999"
                value={cpf}
                onChangeText={handleCpfChange}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>
            {cpfError ? <Text style={styles.errorText}>{cpfError}</Text> : null}
          </View>

          {/* SENHA */}
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
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
                }}
                secureTextEntry
              />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* CONFIRMAR SENHA */}
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
                placeholder="Digite novamente sua senha"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError("");
                }}
                secureTextEntry
              />
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* BOTÃO CADASTRAR */}
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={handleRegister}
          >
            <Text style={styles.buttonTextRegister}>CADASTRAR</Text>
          </TouchableOpacity>
        </View>

        {/* ÍCONE DE VOLTAR À TELA INICIAL */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
          <MaterialIcons name="arrow-back" size={40} color="red" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default Register;