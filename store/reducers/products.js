import PRODUCTS from '../../data/dummy-data'

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(item => item.ownerId === "u1")
}

export default (state = initialState, action) => {
  return state
}