//front/app/(tabs)/styles/pedido.styles.ts

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  // CONTAINERS PRINCIPAIS
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  listaContainer: {
    padding: 16,
    paddingBottom: 80, // Espaço extra para a barra de menu
  },

  // COMPONENTES DE ERRO E CARREGAMENTO
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },

  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FF0000',
    borderRadius: 25,
  },

  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // CABEÇALHO
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // ITENS DA LISTA
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  imageContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemImage: {
    width: '100%',
    height: '100%',
  },

  textContainer: {
    flex: 1,
    paddingRight: 8,
  },

  itemNome: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },

  itemDescricao: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },

  itemPreco: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF0000',
  },

  // BOTÃO DE ADICIONAR
  botaoAdicionar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  botaoTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
    textAlignVertical: 'center',
  },

  // ESTADO VAZIO
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});