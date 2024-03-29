# Reducers

!!!! ATTENTION !!!! 

Ne pas confondre le reducer de Redux avec le Hook useReducer de React
Voir `EditProductScreen.js` pour un exemple concret du Hook useReducer utilisé dans le form pour relier state et action

!!!! ATTENTION !!!! 

  Le reducers n'est au final rien d'autre qu'une fonction qui renvoie un nouveau state. Il prend en argument le state (ancien et nouveau si besoin) et une action (qui définit le type d'action recherchée).

  On va d'abord définir un initialState, le state de départ de l'application.

  Exemple : 

  ```javascript
  import { MEALS } from "../../data/dummy-data"

  const initialState = {
    meals: MEALS,
    filteredMeals: MEALS,
    favoriteMeals: []
  }

  const mealsReducer = (state = initialState, action) => {
    return state
  }

  ```

  Ensuite on va poser le reducer à la racine du projet, dans `App.js`

  Exemple : 

  ```javascript
    import { createStore, combineReducers } from "redux"
    import { Provider } from "react-redux"

    ... 

    // On récupère les reducers
    // !!!! ATTENTION !!!! : la clé "meals" sera utilisé à chaque fois que l'on appellera le state avec useSelector. 
    // Par exemple avec le initialState au-dessus:
    // const item = useSelector(state.meals.filteredMeals)
    // C'est comme si on avait un péage entre le useSelector (hook qui permet d'aller chercher une data dans le state) et l'accès au state quand on passe par un combineReducers

    const rootReducer = combineReducers({
      meals: mealsReducer
    })

    // On donne les reducers au store pour le créer
    const store = createStore(rootReducer)

    export default function App() {
      const [fontLoaded, setFontLoaded] = useState(false)

      if (!fontLoaded) {
        return <AppLoading
          startAsync={fetchFonts}
          onFinish={() => setFontLoaded(true)}
          onError={(err) => console.log(err)}
        />
      }

      return (
        // On encadre l'application avec provider qui englobera l'application avec le store
        <Provider store={store}>
          <MealsNavigator />
        </Provider>
      );
    }

  ```

