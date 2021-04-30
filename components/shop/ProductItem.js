import React from 'react'
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native"

import Colors from "../../constants/Colors"

const ProductItem = ({ image, title, price, onViewDetail, onAddToCart }) => {

  // On utilise TouchableOpacity pour rendre tout l'élément clickable et pas seulement le bouton 
  // Pour rendre plus classe sur android on passera par TouchableNativeFeedback et Plateform pour tester qu'on est bien sur android
  // Ensuite on englobe TouchableCmp par deux Views, le premier de l'item classique et le second "touchable" pour l'effet, franchement chiant je trouve juste pour poser un effet sur l'image
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }

  return (
    <View style={styles.products}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={onViewDetail} useForeground>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>{price.toFixed(2)}</Text>
          </View>
          <View style={styles.actions}>
            <Button color={Colors.primary} title="View Details" onPress={onViewDetail} />
            <Button color={Colors.primary} title="To Cart" onPress={onAddToCart} />
          </View>
        </TouchableCmp>
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  products: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden"
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    marginVertical: 4
  },
  price: {
    fontSize: 14,
    color: "#888"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20
  },
  details: {
    alignItems: "center",
    height: "15%",
    padding: 10
  }
})

export default ProductItem