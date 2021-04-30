import React from 'react'
import { FlatList, Text } from "react-native"
// Hook permettant d'aller chercher dans le state
import { useSelector } from "react-redux"

import ProductItem from "../../components/shop/ProductItem"

const ProductsOverviewScreen = () => {
  const products = useSelector(state => state.products.availableProducts)
  return (
    <FlatList
      data={products}
      renderItem={itemData =>
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetail={() => { }}
          onAddToCart={() => { }}
        />} />
  )
}

ProductsOverviewScreen.navigationOptions = {
  headerTitle: "All Products"
}

export default ProductsOverviewScreen