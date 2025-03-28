import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ícones
import styles from "./styles/welcome.styles"; // Importando estilos separados

const Welcome = () => {
  const router = useRouter();

  // Redireciona para a página de login
  const handleIniciar = () => {
    router.push("/login"); // Navega para a tela de login
  };

  return (
    <LinearGradient
      colors={["#FF0000", "#FFFF00"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* LOGO */}
      <Image
        source={require("../assets/images/LogoJapastel.png")}
        style={styles.logo}
      />

      <Text style={styles.slogan}>
        SEJA BEM-VINDO{"\n\n"}À FRANQUIA QUE MAIS{"\n"}CRESCE NO{"\n"}BRASIL
      </Text>

      <TouchableOpacity style={styles.arrowButton} onPress={handleIniciar}>
        <MaterialIcons name="arrow-forward" size={60} color="red" />{" "}
      </TouchableOpacity>
    </LinearGradient>
  );
};
export default Welcome;
