import PRODUCTS from '../../data/dummy-data'
import Product from '../../models/product'
import { CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT } from '../actions/products'

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(item => item.ownerId === "u1")
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PRODUCT:
      const newProduct = new Product(
        new Date().toString(),
        "u1",
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      )

      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      }

    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(item => item.id === action.pid)
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      )
      const updatedUserProducts = [...state.userProducts]
      updatedUserProducts[productIndex] = updatedProduct
      const availableProductIndex = state.availableProducts.findIndex(item => item.id === action.pid)
      const updatedAvailableProducts = [...state.availableProducts]
      updatedAvailableProducts[availableProductIndex] = updatedProduct

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      }

    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(item => item.id !== action.pid),
        availableProducts: state.availableProducts.filter(item => item.id !== action.pid)
      }
  }
  return state
}