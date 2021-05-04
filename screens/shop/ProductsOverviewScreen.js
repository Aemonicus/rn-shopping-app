import React from 'react'
import { FlatList, Button, Platform } from "react-native"
// useSelector = Hook permettant d'aller chercher dans le state
// useDispatch = Hook permettant de déclencher l'action pour l'envoyer au reducer et modifier le state
import { useSelector, useDispatch } from "react-redux"
import { HeaderButtons, Item } from "react-navigation-header-buttons"
import HeaderButton from "../../components/UI/HeaderButton"

import ProductItem from "../../components/shop/ProductItem"
import * as cartActions from "../../store/actions/cart"

import Colors from "../../constants/Colors"


const ProductsOverviewScreen = ({ navigation }) => {
  const products = useSelector(state => state.products.availableProducts)

  const dispatch = useDispatch()

  const selectItemHandler = (id, title) => {
    navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    })
  }

  return (
    <FlatList
      data={products}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}

          // J'ai accès au props navigation car ce screen est présent dans le stack du shopNavigator. Rappel : toutes les screens/vues placées dans le stack d'un navigator embarquent automatiquement la props navigation qui donne accès à certains objets/fonctions utiles comme la navigation
          // Là j'ai accès à la fonction navigate et au params pour passer par exemple l'id de l'item à afficher dans l'autre component
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title)
          }}
        >
          <Button color={Colors.primary} title="View Details" onPress={() => {
            selectItemHandler(itemData.item.id, itemData.item.title)
          }} />
          <Button color={Colors.primary} title="To Cart" onPress={() => {
            dispatch(cartActions.addToCart(itemData.item))
          }} />
        </ProductItem>
      )}
    />
  )
}

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: "All Products",
    headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item title="Menu" iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"} onPress={() => { navData.navigation.toggleDrawer() }} />
    </HeaderButtons>,
    headerRight: <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item title="Cart" iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"} onPress={() => { navData.navigation.navigate('Cart') }} />
    </HeaderButtons>
  }
}

export default ProductsOverviewScreen