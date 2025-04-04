// home.styles.ts

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 20, // Espaço extra no final do conteúdo
  },
  bannerContainer: {
    backgroundColor: '#FFD700',
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CE0000',
  },
  carrosselContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  carrosselItem: {
    marginRight: 15,
  },
  carrosselImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  produtosContainer: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  depoimentosContainer: {
    padding: 20,
    backgroundColor: '#F0F0F0',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  depoimentosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  depoimentosList: {
    paddingBottom: 10,
  },
  depoimentoCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  depoimentoNome: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  depoimentoComentario: {
    color: '#666',
    marginTop: 5,
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: '#FFF',
    padding: 10,
    margin: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
    flex: 1,
    maxWidth: '48%', // Para ter 2 colunas
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default styles;