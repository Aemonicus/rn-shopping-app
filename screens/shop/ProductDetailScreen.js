import React from 'react'
import { Text, View, StyleSheet, Button, Image, ScrollView } from "react-native"

// useSelector = Hook permettant d'aller chercher dans le state
// useDispatch = Hook permettant de déclencher l'action pour l'envoyer au reducer et modifier le state
import { useSelector, useDispatch } from "react-redux"
import Colors from "../../constants/Colors"
import * as cartActions from "../../store/actions/cart"

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

  const dispatch = useDispatch()

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title="Add to Cart" onPress={() => {
          dispatch(cartActions.addToCart(selectedProduct))
        }} />
      </View>
      <Text style={styles.price}>{selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  )
}

// Je récupère pour le headerTitle le params title passé par le composant parent grâce à la props navigation
ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  }
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold"
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
    marginHorizontal: 20
  }
})

export default ProductDetailScreen