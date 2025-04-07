//front/src/app/%28tabs%29/cart.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/cart.styles";
import { request } from "../../services/api";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } =
    useCart();
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("Dinheiro");
  const [userName, setUserName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [securityCode, setSecurityCode] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [name, token] = await AsyncStorage.multiGet([
          "userName",
          "authToken",
        ]);

        if (name[1]) {
          setUserName(name[1]);
          return;
        }

        if (!token[1]) throw new Error("Token não encontrado");

        const response = await request("/api/me", "GET", null, {
          headers: { Authorization: `Bearer ${token[1]}` },
        });

        const userName = response.user?.nome || "Cliente";
        setUserName(userName);
        await AsyncStorage.setItem("userName", userName);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setUserName("Cliente");
      }
    };

    fetchUserData();
  }, []);

  const renderPaymentOption = (paymentMethod: string) => {
    const isSelected = selectedPaymentMethod === paymentMethod;
    const iconName = isSelected ? "check-square" : "square";
    let paymentIcon = null;

    switch (paymentMethod) {
      case "Dinheiro":
        paymentIcon = <FontAwesome name="money" size={24} color="green" />;
        break;
      case "Pix":
        paymentIcon = <FontAwesome name="qrcode" size={24} color="blue" />;
        break;
      case "Cartão de Crédito":
        paymentIcon = <FontAwesome name="credit-card" size={24} color="red" />;
        break;
      default:
        paymentIcon = null;
    }

    return (
      <View style={styles.paymentOption}>
        <TouchableOpacity
          style={styles.paymentOptionButton}
          onPress={() => setSelectedPaymentMethod(paymentMethod)}
        >
          <FontAwesome
            name={iconName}
            size={24}
            color={isSelected ? "green" : "gray"}
          />
          <Text style={styles.paymentText}>{paymentMethod}</Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>{paymentIcon}</View>
      </View>
    );
  };

  const finalizarPedido = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione itens ao carrinho antes de finalizar.");
      return;
    }
  
    if (selectedPaymentMethod === "Cartão de Crédito" && 
        (!cardNumber || !securityCode || !expiryDate)) {
      Alert.alert("Erro", "Preencha todos os campos do cartão.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const [token, userId] = await AsyncStorage.multiGet([
        "authToken", "userId"
      ]);
  
      if (!token[1] || !userId[1]) {
        throw new Error("Usuário não autenticado.");
      }
  
      // Preparar os itens do pedido com quantidades corretas
      const produtos = cartItems.map(item => ({
        produto: item.id,
        quantidade: item.quantidade,
        precoUnitario: item.preco
      }));
  
      // Calcular valor total baseado nas quantidades
      const valorTotal = produtos.reduce((total, item) => {
        return total + (item.precoUnitario * item.quantidade);
      }, 0);
  
      const pedidoData = {
        produtos,
        formaPagamento: selectedPaymentMethod,
        valorTotal,
        usuario: userId[1],
        ...(selectedPaymentMethod === "Cartão de Crédito" && {
          cartao: {
            numero: cardNumber,
            codigoSeguranca: securityCode,
            dataValidade: expiryDate,
          },
        }),
      };
  
      const response = await request("/api/pedidos", "POST", pedidoData, {
        headers: { Authorization: `Bearer ${token[1]}` },
      });
  
      if (!response.success) {
        throw new Error(response.message || "Erro ao processar pedido");
      }
  
      Alert.alert(
        "Sucesso!", 
        `Pedido #${response.pedido._id} realizado com sucesso!`,
        [{
          text: "OK",
          onPress: () => {
            clearCart();
            router.push("/pedido");
          }
        }]
      );
  
      if (selectedPaymentMethod === "Cartão de Crédito") {
        setCardNumber("");
        setSecurityCode("");
        setExpiryDate("");
      }
  
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert(
        "Erro",
        error.message || "Erro ao finalizar pedido. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert("Remover item", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        onPress: () => removeFromCart(id),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Seu Carrinho, </Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemText}>{item.nome}</Text>
                <Text style={styles.itemPrice}>
                  R$ {(item.quantidade * item.preco).toFixed(2)}
                </Text>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                >
                  <FontAwesome
                    name="minus-circle"
                    size={24}
                    color={item.quantidade > 1 ? "red" : "gray"}
                  />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{item.quantidade}</Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantidade + 1)}
                >
                  <FontAwesome name="plus-circle" size={24} color="green" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                  <FontAwesome
                    name="trash"
                    size={24}
                    color="gray"
                    style={styles.trashIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <Text style={styles.totalText}>
                Total: R$ {getTotal().toFixed(2)}
              </Text>

              <View style={styles.paymentMethodContainer}>
                <Text style={styles.paymentMethodTitle}>
                  Forma de pagamento
                </Text>
                <View style={styles.paymentMethodOptions}>
                  {["Dinheiro", "Pix", "Cartão de Crédito"].map(
                    (paymentMethod) => (
                      <View
                        key={paymentMethod}
                        style={styles.paymentOptionContainer}
                      >
                        {renderPaymentOption(paymentMethod)}
                      </View>
                    )
                  )}
                </View>
              </View>

              {selectedPaymentMethod === "Cartão de Crédito" && (
                <View style={styles.cardInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Número do Cartão"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    maxLength={16}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Código de Segurança"
                    value={securityCode}
                    onChangeText={setSecurityCode}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Data de Validade (MM/AA)"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              )}

              <View style={styles.finalizarButton}>
                <Button
                  title={isSubmitting ? "Processando..." : "Finalizar Pedido"}
                  color="green"
                  onPress={finalizarPedido}
                  disabled={isSubmitting}
                />
              </View>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default Cart;