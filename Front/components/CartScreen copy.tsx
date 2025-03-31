import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';
import styles from '../styles/cart.styles';

const CartScreen = () => {
  const { cart, removeFromCart, updateQuantity, submitOrder, total } = useCart();
  const router = useRouter();

  const handleFinalizarPedido = async () => {
    try {
      await submitOrder();
      router.push('../app/(tabs)/sucesso');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho</Text>
      
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <Text style={styles.itemPrice}>{item.preco}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantidade - 1)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantidade}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantidade + 1)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Text style={styles.removeButton}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
      
      <TouchableOpacity 
        style={styles.checkoutButton} 
        onPress={handleFinalizarPedido}
        disabled={cart.length === 0}
      >
        <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;