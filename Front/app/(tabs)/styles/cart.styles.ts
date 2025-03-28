import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  trashIcon: {
    marginLeft: 15,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'right',
    color: '#333',
  },
  paymentMethodContainer: {
    marginTop: 25,
    marginBottom: 15,
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  paymentMethodOptions: {
    gap: 12,
  },
  paymentOptionContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  iconContainer: {
    marginLeft: 10,
  },
  cardInputContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  finalizarButton: {
  position: 'absolute',
  bottom: 70, // Antes estava 20, agora sobe acima do footer
  left: 20,
  right: 20,
  backgroundColor: '#4CAF50',
  borderRadius: 8,
  paddingVertical: 14,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
}

});

export default styles;