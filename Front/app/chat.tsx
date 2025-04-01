import React, { useState } from "react";
import { 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  SafeAreaView 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

class Message{
  text: string
  sentBy: string
  constructor(text: string, sentBy: string ) {
    this.text = text;
    this.sentBy = sentBy;
  }
}

const Chat = () => {
  const router = useRouter();
  const [userLogged, setUserLogged] = useState('Sérgio');
  const [chat, setChat] = useState<{messages: Message []}>({messages: []});
  const [message, setMessage] = useState('');
  
  const sendMessage = () => {
    chat.messages.push ({text:message, sentBy: userLogged})
    setChat({messages: [...chat.messages]})
    setMessage('')
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/home")}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atendimento Virtual!</Text>
      </View>

      {/* Mensagem de criptografia */}
      <View style={styles.encryptionNotice}>
        <Text style={styles.encryptionText}>
          As mensagens são protegidas com a criptografia, ficando somente entre você e os participantes desta conversa.</Text>
      </View>

      {/* Lista de mensagens */}
      <FlatList
        style={styles.messagesContainer}
        data={chat.messages}
        renderItem={({item}) => <Balloon message={item} currentUser={userLogged} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyMessage}>Sem mensagem no momento!</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        
      />
      
      {/* Área de input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          placeholderTextColor="#666"
          value={message}
          onChangeText={(message)=>setMessage (message)}
        />
        <TouchableOpacity
          onPress={() => sendMessage()}
          style={styles.sendButton}
          disabled={!message}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Balloon = ({ message, currentUser }: any) => {
  const sent = currentUser === message.sentBy;
  
  return (
    <View style={[
      styles.bubbleWrapper,
      sent ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived
    ]}>
      <View style={[
        styles.balloon,
        sent ? styles.balloonSent : styles.balloonReceived
      ]}>
        {/* Nome do usuário (parte superior) */}
        <Text style={sent ? styles.userNameSent : styles.userNameReceived}>
          {message.sentBy}
        </Text>
        
        {/* Mensagem (parte inferior) */}
        <Text style={sent ? styles.balloonTextSent : styles.balloonTextReceived}>
          {message.text}
        </Text>
       </View>
    </View>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#CE0000', // Vermelho da sua paleta
    padding: 10,
    paddingTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    right: 16,
    top: 10,
    zIndex: 1,
    padding: 8,
  },
  headerTitle: {
    color: '#FFD700', // Dourado da sua paleta
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 24,
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  encryptionNotice: {
    backgroundColor: '#F0F0F0', // Cinza claro da sua paleta
    padding: 12,
    margin: 8,
    borderRadius: 8,
    alignSelf: 'center',
    maxWidth: '90%',
  },
  encryptionText: {
    color: '#CE0000', // Vermelho da sua paleta
    fontSize: 12,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  messagesContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyMessage: {
    color: '#666', // Cinza médio
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
    borderColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  sendButton: {
    backgroundColor: '#CE0000', // Vermelho da sua paleta
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleWrapper: {
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  bubbleWrapperSent: {
    alignSelf: 'flex-end',
  },
  bubbleWrapperReceived: {
    alignSelf: 'flex-start',
  },

  // Estilos para o nome do usuário
  userNameSent: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  userNameReceived: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  
  // Ajuste no balão para melhor organização
  balloon: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
    flexDirection: 'column', // Mudamos para column para empilhar verticalmente
  },
  //Ajustes nos Balloons
  balloonSent: {
    backgroundColor: '#FFD700', // Dourado da sua paleta
    borderBottomRightRadius: 0,
  },
  balloonReceived: {
    backgroundColor: '#F0F0F0', // Cinza claro da sua paleta
    borderBottomLeftRadius: 0,
  },

  // Ajuste nos textos para melhor espaçamento
  balloonTextSent: {
    color: '#333',
    fontSize: 16,
    marginBottom: 4,
  },
  balloonTextReceived: {
    color: '#333',
    fontSize: 16,
    marginBottom: 4,
  },
  
  // Ajuste no tempo para alinhar à direita
  timeTextSent: {
    color: '#666',
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  timeTextReceived: {
    color: '#666',
    fontSize: 10,
    alignSelf: 'flex-end',
  },
});

export default Chat;