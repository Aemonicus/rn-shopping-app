import React from 'react'
import { FlatList, Text } from "react-native"
// useSelector = Hook permettant d'aller chercher dans le state
// useDispatch = Hook permettant de déclencher l'action pour l'envoyer au reducer et modifier le state
import { useSelector, useDispatch } from "react-redux"

import ProductItem from "../../components/shop/ProductItem"
import * as cartActions from "../../store/actions/cart"

const ProductsOverviewScreen = ({ navigation }) => {
  const products = useSelector(state => state.products.availableProducts)

  const dispatch = useDispatch()

  return (
    <FlatList
      data={products}
      renderItem={itemData =>
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}

          // J'ai accès au props navigation car ce screen est présent dans le stack du shopNavigator. Rappel : toutes les screens/vues placées dans le stack d'un navigator embarquent automatiquement la props navigation qui donne accès à certains objets/fonctions utiles comme la navigation
          // Là j'ai accès à la fonction navigate et au params pour passer par exemple l'id de l'item à afficher dans l'autre component
          onViewDetail={() => {
            navigation.navigate("ProductDetail", {
              productId: itemData.item.id,
              productTitle: itemData.item.title
            })
          }}
          onAddToCart={() => {
            dispatch(cartActions.addToCart(itemData.iem))
          }}
        />} />
  )
}

ProductsOverviewScreen.navigationOptions = {
  headerTitle: "All Products"
}

export default ProductsOverviewScreen