import React from 'react'
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from "react-native"

import Card from "../UI/Card"

const ProductItem = ({ image, title, price, onSelect, children }) => {

  // On utilise TouchableOpacity pour rendre tout l'élément clickable et pas seulement le bouton 
  // Pour rendre plus classe sur android on passera par TouchableNativeFeedback et Plateform pour tester qu'on est bien sur android
  // Ensuite on englobe TouchableCmp par deux Views, le premier de l'item classique et le second "touchable" pour l'effet, franchement chiant je trouve juste pour poser un effet sur l'image
  let TouchableCmp = TouchableOpacity

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }

  return (
    <Card style={styles.products}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={onSelect} useForeground>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
          <View style={styles.details}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>{price.toFixed(2)}</Text>
          </View>
          <View style={styles.actions}>
            {children}
          </View>
        </TouchableCmp>
      </View>
    </Card >
  )
}

const styles = StyleSheet.create({
  products: {
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
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 2
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#888"
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10
  }
})

export default ProductItem