import React from 'react'
import { Text, View, StyleSheet, Button, Image, ScrollView } from "react-native"
import { useSelector } from "react-redux"

const ProductDetailScreen = ({ navigation }) => {
  // Je récupère l'id de l'item depuis le screen parent grâce à la props navigation car cette screen aussi est présente dans le stack
  const productId = navigation.getParam("productId")

  // On utilise useSelector pour aller chercher dans le state
  // On va dans state.products parce que dans App.js, la clé du reducer combiné est "products"
  //  const rootReducer = combineReducers({
  //   products: productsReducer
  // })
  // Puis on rentre dans le state et on sélectionnce ce qu'on veut, ici "availableProducts"
  const selectedProduct = useSelector(state => state.products.availableProducts.find(item => item.id === productId))

  return (
    <View style={styles.screen}>
      <Text>{selectedProduct.title}</Text>
    </View>
  )
}

// Je récupère pour le headerTitle le params title passé par le composant parent grâce à la props navigation
ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  }
}

const styles = StyleSheet.create({})

export default ProductDetailScreen