import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request } from "../services/api";

type Message = {
  id: string;
  text: string;
  sentBy: string;
  timestamp: Date;
  isError?: boolean;
};

const Chat = () => {
  const router = useRouter();
  const [userLogged, setUserLogged] = useState('Você');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  // Carrega dados do usuário e mensagem inicial
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const name = await AsyncStorage.getItem("userName");
        if (name) setUserLogged(name);

        // Verifica autenticação
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Acesso não autorizado", "Faça login para acessar o chat");
          router.replace("/login");
          return;
        }

        // Mensagem inicial da IA
        setMessages([{
          id: '1',
          text: "Olá! Sou o assistente virtual do Japastel. Posso te ajudar com informações sobre seus pedidos, cardápio ou outras dúvidas. Como posso ajudar?",
          sentBy: "Atendente Virtual",
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error("Erro ao inicializar chat:", error);
      }
    };

    initializeChat();
  }, []);

  // Rola para baixo quando novas mensagens são adicionadas
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    try {
      // Adiciona mensagem do usuário
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sentBy: userLogged,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);
      inputRef.current?.blur();

      // Envia para a IA
      const token = await AsyncStorage.getItem("authToken");
      const response = await request("/api/chat", "POST", { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.success) {
        throw new Error(response.error || "Erro na resposta da IA");
      }

      // Adiciona resposta da IA
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.response || "Não entendi sua pergunta. Poderia reformular?",
        sentBy: "Atendente Virtual",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Erro no chat:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: error.message || "Erro ao processar sua mensagem",
        sentBy: "Sistema",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sentBy === "Atendente Virtual";
    const isSystem = item.sentBy === "Sistema";
    
    return (
      <View style={[
        styles.messageContainer,
        isAI ? styles.aiMessageContainer : 
              isSystem ? styles.systemMessageContainer : 
              styles.userMessageContainer
      ]}>
        <Text style={[
          styles.senderName,
          isAI ? styles.aiSenderName :
                isSystem ? styles.systemSenderName :
                styles.userSenderName
        ]}>
          {item.sentBy}
        </Text>
        <View style={[
          styles.messageBubble,
          isAI ? styles.aiMessageBubble : 
                isSystem ? styles.systemMessageBubble :
                styles.userMessageBubble,
          item.isError && styles.errorMessageBubble
        ]}>
          <Text style={
            isAI ? styles.aiMessageText : 
                  isSystem ? styles.systemMessageText :
                  styles.userMessageText
          }>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atendente Virtual</Text>
      </View>

      {/* Área de mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      />

      {/* Área de input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputWrapper}
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#888"
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!isLoading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || isLoading) && styles.disabledButton
            ]}
            onPress={sendMessage}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CE0000',
    padding: 15,
    paddingTop: Platform.OS === 'android' ? 35 : 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '85%',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  systemMessageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    maxWidth: '100%',
  },
  senderName: {
    fontSize: 12,
    marginBottom: 4,
  },
  aiSenderName: {
    color: '#666',
  },
  userSenderName: {
    color: '#CE0000',
  },
  systemSenderName: {
    color: '#888',
    fontStyle: 'italic',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
  },
  aiMessageBubble: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 0,
  },
  userMessageBubble: {
    backgroundColor: '#CE0000',
    borderBottomRightRadius: 0,
  },
  systemMessageBubble: {
    backgroundColor: '#EEE',
    borderRadius: 8,
  },
  errorMessageBubble: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
    borderWidth: 1,
  },
  aiMessageText: {
    color: '#333',
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
  },
  systemMessageText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    fontSize: 16,
    marginRight: 10,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CE0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Chat;