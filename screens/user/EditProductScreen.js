import React, { useEffect, useCallback, useReducer } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Platform, Alert } from "react-native"
import { useSelector, useDispatch } from "react-redux"

import { HeaderButtons, Item } from "react-navigation-header-buttons"
import HeaderButton from "../../components/UI/HeaderButton"
import * as productsActions from "../../store/actions/products"
import Input from "../../components/UI/Input"

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE"

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    }
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    }
    let updatedFormIsValid = true
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities
    }
  }
  return state
}

const EditProductScreen = ({ navigation }) => {

  const prodId = navigation.getParam("productId")

  const editedProduct = useSelector(state => state.products.userProducts.find(item => item.id === prodId))

  const dispatch = useDispatch()

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false
  })

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form", [{ text: "Ok" }])
      return
    }
    if (editedProduct) {
      dispatch(productsActions.updateProduct(
        prodId,
        formState.inputValues.title,
        formState.inputValues.description,
        formState.inputValues.imageUrl
      ))
    } else {
      dispatch(productsActions.createProduct(
        formState.inputValues.title,
        formState.inputValues.description,
        formState.inputValues.imageUrl,
        +formState.inputValues.price
      ))
    }
    navigation.goBack()
  }, [dispatch, prodId, formState])

  useEffect(() => {
    navigation.setParams({ submit: submitHandler })
  }, [submitHandler])

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false
    if (text.trim().length > 0) {
      isValid = true
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier
    })
  }

  return (
    <ScrollView>
      <View style={styles.form}>
        <Input
          label="Title"
          keyboardType="default"
          errorText="Please enter a valid title!"
          autoCapitalize="sentences"
          // Controle uniquement l'apparence du bouton, pas sa fonctionnalité
          returnKeyType="next"
        />
        <Input
          label="Image URl"
          keyboardType="default"
          errorText="Please enter a valid image url!"
          // Controle uniquement l'apparence du bouton, pas sa fonctionnalité
          returnKeyType="next"
        />
        {editedProduct ? null : (
          <Input
            label="Price"
            keyboardType="decimal-pad"
            errorText="Please enter a valid price!"
            // Controle uniquement l'apparence du bouton, pas sa fonctionnalité
            returnKeyType="next"
          />
        )
        }
        <Input
          label="Description"
          keyboardType="default"
          autoCapitalize="sentences"
          errorText="Please enter a valid description!"
          // Controle uniquement l'apparence du bouton, pas sa fonctionnalité
          multiline
          numberOfLines={3}
        />
      </View>
    </ScrollView>
  )
}

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam("submit")
  return {
    headerTitle: navData.navigation.getParam("productId") ? "Edit Product" : "Add Product",
    headerRight:
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"}
          onPress={submitFn} />
      </HeaderButtons>
  }
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  }
})

export default EditProductScreen