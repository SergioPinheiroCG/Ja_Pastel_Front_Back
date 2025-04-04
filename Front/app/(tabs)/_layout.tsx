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
    const routes: Record<string, string> = {
      Sair: "/login", // Agora "Sair" redireciona para login após logout
      "Meus Pedidos": "/(tabs)/pedido",
      "I.A. Dúvidas": "/(tabs)/pedido",
    };

    try {
      if (route === "Sair") {
        // Remove token e dados do usuário
        await AsyncStorage.multiRemove(["@auth_token", "@user_data"]);
        router.replace(routes[route]); // Redireciona para login
        Alert.alert("Até logo!", "Você saiu da sua conta com sucesso.");
      } else if (routes[route]) {
        router.push(routes[route]);
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    } finally {
      onCloseMenu(); // Fecha o menu
    }
  };

  return (
    <View style={styles.menuDropdown}>
      {["I.A. Dúvidas", "Meus Pedidos", "Sair"].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => handleNavigation(item)}
          style={styles.menuItemContainer}
          accessibilityLabel={item}
        >
          <Text style={styles.menuItem}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Footer = () => {
  const router = useRouter();

  const footerItems = [
    { name: "home", label: "Home", screen: "/(tabs)/home" },
    { name: "receipt-long", label: "Faça Seu Pedido", screen: "/(tabs)/pedido" },
    { name: "shopping-cart", label: "Carrinho", screen: "/(tabs)/cart" },
    { name: "chat", label: "Chat", screen: "/chat" },
//    { name: "arrow-back", label: "Voltar", action: () => router.back() },
  ];

  return (
    <View style={styles.footer}>
      {footerItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.action || (() => router.push(item.screen))}
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
