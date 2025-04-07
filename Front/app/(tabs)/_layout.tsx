//front/app/(tabs)/_layout.tsx

import React from "react";
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CartProvider } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/_layout.styles";

export default function Layout() {
  return (
    <CartProvider>
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Stack>
            <Stack.Screen
              name="home"
              options={{
                headerShown: false,
                animation: "fade",
              }}
            />
            <Stack.Screen
              name="pedido"
              options={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="cart"
              options={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
          </Stack>
        </View>
        <Footer />
      </View>
    </CartProvider>
  );
}

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              // Limpar dados de autenticação
              await AsyncStorage.multiRemove(['authToken', 'userId', 'userName', 'userEmail']);
              router.replace('/login');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert("Erro", "Ocorreu um erro ao tentar sair. Por favor, tente novamente.");
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient
      colors={["#FF0000", "#F9d428"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <Image
        source={require("../../assets/images/LogoJapastel.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.menuButton}
        accessibilityLabel="Sair"
      >
        <MaterialIcons name="logout" size={30} color="red" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const Footer = () => {
  const router = useRouter();

  const footerItems: Array<{
    name: string;
    label: string;
    screen?: "/(tabs)/home" | "/(tabs)/pedido" | "/(tabs)/cart" | "/chat" | "/login";
    action?: () => void;
  }> = [
    { name: "home", label: "Home", screen: "/(tabs)/home" },
    { name: "receipt-long", label: "Faça Seu Pedido", screen: "/(tabs)/pedido" },
    { name: "shopping-cart", label: "Carrinho", screen: "/(tabs)/cart" },
    { name: "chat", label: "Chat", screen: "/chat" },
    //{ name: "arrow-back", label: "Voltar", action: () => router.back() },
  ];

  return (
    <View style={styles.footer}>
      {footerItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.action ? item.action : () => item.screen && router.push(item.screen)}
          style={styles.menuItemContainer}
          accessibilityLabel={item.label}
        >
          <MaterialIcons name={item.name as any} size={30} color="red" />
          <Text style={styles.footerText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};