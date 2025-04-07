//front/src/app/(tabs)/pedido.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../../context/CartContext";
import { request } from "../../services/api";
import styles from "./styles/pedido.styles";
import { MaterialIcons } from '@expo/vector-icons';

interface Produto {
  _id: string;
  nome: string;
  descricao: string;
  valor: number;
  imagem: string;
}

const Pedido = () => {
  const { addToCart } = useCart();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const data = await request("/api/produto", "GET", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProdutos(data);
      } catch (err) {
        setError("Erro ao carregar cardápio");
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const adicionarAoCarrinho = (produto: Produto) => {
    addToCart({
      id: produto._id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.valor,
    });
    Alert.alert("Adicionado", `${produto.nome} foi adicionado ao carrinho!`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.refreshText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <Text style={styles.titulo}>CARDÁPIO</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          {/* Container da Imagem */}
          <View style={styles.imageContainer}>
            {item.imagem ? (
              <Image 
                source={{ uri: item.imagem }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.itemImage, { justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialIcons name="fastfood" size={24} color="#999" />
              </View>
            )}
          </View>

          {/* Informações do Produto */}
          <View style={styles.textContainer}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemDescricao}>{item.descricao}</Text>
            <Text style={styles.itemPreco}>
              {item.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>

          {/* Botão de Adicionar */}
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => adicionarAoCarrinho(item)}
          >
            <Text style={styles.botaoTexto}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.listaContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={40} color="#999" />
          <Text style={styles.emptyText}>Nenhum produto disponível</Text>
        </View>
      }
      style={styles.container}
    />
  );
};

export default Pedido;