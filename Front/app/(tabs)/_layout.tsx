//front/src/app/%28tabs%29/_layout.tsx

import React, { useState, useCallback } from "react";
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CartProvider } from "../../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/_layout.styles";
import { StyleSheet } from "react-native";


interface HeaderProps {
  onToggleMenu: () => void;
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <CartProvider>
      <View style={styles.container}>
        <Header onToggleMenu={handleToggleMenu} />
        {menuOpen && <MenuDropdown onCloseMenu={handleToggleMenu} />}
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

const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => (
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
      onPress={onToggleMenu}
      style={styles.menuButton}
      accessibilityLabel="Menu"
    >
      <MaterialIcons name="more-vert" size={30} color="#FFF" />
    </TouchableOpacity>
  </LinearGradient>
);

const MenuDropdown = ({ onCloseMenu }: { onCloseMenu: () => void }) => {
  const router = useRouter();

  const handleNavigation = async (route: string) => {
    try {
      if (route === "Sair") {
        // Limpar dados de autenticação
        await AsyncStorage.multiRemove(['authToken', 'userId', 'userName', 'userEmail']);
        router.replace('/login');
      } else if (route === "I.A. Dúvidas") {
        // Verificar se o usuário está autenticado
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Atenção', 'Você precisa estar logado para acessar o chat');
          router.push('/login');
        } else {
          router.push('/chat');
        }
      } else if (route === "Meus Pedidos") {
        router.push('/(tabs)/pedido');
      }
    } catch (error) {
      console.error('Erro na navegação:', error);
    } finally {
      onCloseMenu();
    }
  };

  return (
    <View style={styles.menuDropdown}>
      {["I.A. Dúvidas", "Meus Pedidos", "Sair"].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => handleNavigation(item)}
          style={styles.menuItemContainer}
        >
          <Text style={styles.menuItem}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
  { name: "arrow-back", label: "Voltar", action: () => router.back() },
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
