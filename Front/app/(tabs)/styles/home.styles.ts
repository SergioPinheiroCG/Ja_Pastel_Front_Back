// home.styles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  bannerContainer: {
    backgroundColor: '#FFD700',
    padding: 10,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CE0000',
  },
  carrosselContainer: {
    marginVertical: 10,
  },
  carrosselItem: {
    marginRight: 10,
  },
  carrosselImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  depoimentosContainer: {
    padding: 20,
    backgroundColor: '#F0F0F0',
    marginTop: 20,
    borderRadius: 10,
  },
  depoimentosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  depoimentosList: {
    marginTop: 10,
  },
  depoimentoCard: {
    backgroundColor: '#FFF',
    padding: 5,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  depoimentoNome: {
    fontWeight: 'bold',
    color: '#333',
  },
  depoimentoComentario: {
    color: '#666',
    marginTop: 5,
  },
  itemCard: {
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});

export default styles;
