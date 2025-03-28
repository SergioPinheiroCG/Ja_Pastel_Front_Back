// Home.tsx
import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import styles from './styles/home.styles';

// Lista de produtos
const produtos = [
  { id: '1', imagem: 'https://i.pinimg.com/736x/8b/48/48/8b4848e02bbb91f24715617451d87d89.jpg' },
  { id: '2', imagem: 'https://i.pinimg.com/736x/57/61/a2/5761a2e201373f43e1cc718ff0078e3a.jpg' },
  { id: '3', imagem: 'https://i.pinimg.com/736x/a5/6d/34/a56d3429b507240a1b6ac89933335646.jpg' },
  { id: '4', imagem: 'https://i.pinimg.com/736x/e6/05/a8/e605a8aecf1d9bee338018eeb0e45f94.jpg' },
  { id: '5', imagem: 'https://i.pinimg.com/736x/7f/71/41/7f7141da9efc168011d031ade2f081eb.jpg' },
  { id: '6', imagem: 'https://i.pinimg.com/736x/ec/60/74/ec60741be4dd00893d8a2697feee1677.jpg' },
  { id: '7', imagem: 'https://i.pinimg.com/736x/87/3c/a6/873ca64f749b54688ca95b848759f7b7.jpg' },
  { id: '8', imagem: 'https://i.pinimg.com/736x/ba/08/cd/ba08cdf773a812cc351025d5d47a276b.jpg' },
  { id: '9', imagem: 'https://i.pinimg.com/736x/ff/8c/e2/ff8ce219b70bbcf211e06c67854a8e1a.jpg' },
  { id: '10', imagem: 'https://i.pinimg.com/736x/70/07/09/7007094cf70b3d7fd411c49aa66aff26.jpg' },
  { id: '11', imagem: 'https://i.pinimg.com/736x/1f/47/8f/1f478f9342d57da88cecb708d8f15b9e.jpg' },


];

// Postagens de clientes
const depoimentos = [
  { id: '1', nome: 'Fabricio Dias', comentario: 'O pastel de carne é simplesmente maravilhoso! Muito saboroso!' },
  { id: '2', nome: 'Bruno Rafael', comentario: 'O atendimento é excelente, e o pastel de camarão é imperdível!' },
  { id: '3', nome: 'Daniel Abella', comentario: 'Melhor pastel que já comi! Preço justo e qualidade incrível!' },
];

// Componente de item do produto
interface Produto {
  id: string;
  imagem: any;
}

const ProdutoItem = ({ item }: { item: Produto }) => (
  <View style={styles.itemCard}>
    <Image source={item.imagem}style={styles.itemImage}resizeMode="cover" />
  </View>
);

// Componente para os depoimentos
interface Depoimento {
  id: string;
  nome: string;
  comentario: string;
}

const DepoimentoItem = ({ item }: { item: Depoimento }) => (
  <View style={styles.depoimentoCard}>
    <Text style={styles.depoimentoNome}>{item.nome}</Text>
    <Text style={styles.depoimentoComentario}>{item.comentario}</Text>
  </View>
);

export default function Home() {
  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProdutoItem item={item} />}
      ListHeaderComponent={
        <>
          {/* BANNER */}
          <View style={styles.bannerContainer}>
            <Text style={styles.bannerText}>SEJA BEM VINDO!</Text>
          </View>

          {/* CARROSSEL DE PRODUTOS */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={produtos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View key={item.id} style={styles.carrosselItem}>
                <Image source={{ uri: item.imagem }} style={styles.carrosselImage} />
              </View>
            )}
          />

          {/* DEPOIMENTOS */}
          <View style={styles.depoimentosContainer}>
            <Text style={styles.depoimentosTitle}>O que nossos clientes dizem:</Text>
            <FlatList
              data={depoimentos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <DepoimentoItem item={item} />}
              contentContainerStyle={styles.depoimentosList}
              nestedScrollEnabled={true}
            />
          </View>

          {/* SOBRE A EMPRESA */}
          <View style={styles.depoimentosContainer}>
            <Text style={styles.depoimentoNome}>Sobre a empresa</Text>
            <Text style={styles.depoimentoComentario}>
              O Japastel foi fundado por Gustavo Kubo, um japonês que chegou ao Brasil com uma visão única. Ao longo dos anos,
              Gustavo e sua família consolidaram o Japastel como uma referência em qualidade e sabor, oferecendo deliciosos
              pastéis e refrigerantes em um ambiente acolhedor e familiar.
            </Text>
          </View>
        </>
      }
      ListFooterComponent={null}
      contentContainerStyle={styles.container}
    />
  );
}