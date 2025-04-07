//front/app/styles/welcome.styles.ts

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Garante que o LinearGradient ocupe toda a tela
    justifyContent: 'center', // Centraliza o conteúdo
    alignItems: 'center', // Centraliza o conteúdo
  },
  logo: {
    width: 200,
    height: 200,
  },
  slogan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'yellow',
    textAlign: 'center',
    marginTop: 20,
  },
  arrowButton: {
    marginTop: 30, // Posiciona a seta logo abaixo do texto de boas-vindas
    backgroundColor: 'transparent', // Fundo transparente
  },
});

export default styles;

