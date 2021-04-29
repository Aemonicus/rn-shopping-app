# Explication Générale

Deux options : 
- des vues conditionnelles depuis `App.js`, 
  
  Exemple
  ```javascript

    let content = <StartGameScreen onStartGame={startGameHandler} />

    if (userNumber && guessRounds <= 0) {
      content = <GameScreen userChoice={userNumber} onGameOver={gameOverHandler} />
    } else if (guessRounds > 0) {
      content = <GameOverScreen
        roundsNumber={guessRounds}
        userNumber={userNumber}
        onRestart={configureNewGameHandler}
      />
    }

    return (
      <SafeAreaView style={styles.screen}>
        <Header title={"Guess a Number"} />
        {content}
      </SafeAreaView>
    );

  ```

- Une librairie tierce qui gère la navigation : React Navigation
  - Arrêter le serveur 
  - `npm install --save react-navigation` 
  - `expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view`
  - créer un fichier `navigation`
  - créer le dossier voulu, ici `MealsNavigator.js`
  - créer un dossier `screens` et dedans créer les "pages" voulues
  
  Le nom est trompeur, cette librairie a été conçue pour react native et pas react

  ! IMPORTANT !
  Avec les version 4+ de React Navigation, il faut installer différents navigateurs :
    - `npm install --save react-navigation-stack` puis `import { createStackNavigator } from 'react-navigation-stack';`
    - `npm install --save react-navigation-tabs` puis `import { createBottomTabNavigator } from 'react-navigation-tabs';`
    - `npm install --save react-navigation-drawer` puis `import { createDrawerNavigator } from 'react-navigation-drawer';`
  
  Exemple de composant de navigateur. 

  ```javascript

  import React from 'react'
  import { createStackNavigator } from 'react-navigation-stack'
  import { createAppContainer } from 'react-navigation'
  import { createBottomTabNavigator } from 'react-navigation-tabs'
  import { createDrawerNavigator } from 'react-navigation-drawer'
  import { Ionicons } from "@expo/vector-icons"
  import CategoriesScreen from '../screens/CategoriesScreen'
  import FavoritesScreen from '../screens/FavoritesScreen'
  import CategoryMealsScreen from '../screens/CategoryMealsScreen'
  import MealDetailScreen from '../screens/MealDetailScreen'
  import FiltersScreen from '../screens/FiltersScreen'
  import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"

  import { Platform } from "react-native"
  import Colors from "../constants/Colors"

  const defaultStackNavOptions = {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primaryColor : ""
      },
      headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor
    }
  }

  const MealsNavigator = createStackNavigator({
    Categories: {
      // Exemple de customisation d'un élément différemment des autres
      screen: CategoriesScreen,
      defaultStackNavOptions
    },
    CategoryMeals: CategoryMealsScreen,
    MealDetail: MealDetailScreen
  }, {
    defaultNavigationOptions: defaultStackNavOptions
  })

  const FavNavigator = createStackNavigator({
    Favorites: FavoritesScreen,
    MealDetail: MealDetailScreen
  }, {
    defaultNavigationOptions: defaultStackNavOptions
  })

  const tabScreenConfig = {
    Meals: {
      screen: MealsNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return <Ionicons name="ios-restaurant" size={25} color={tabInfo.tintColor} />
        }
      },
      tabBarColor: Colors.primaryColor
    },
    Favorites: {
      screen: FavNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />
        },
        tabBarColor: Colors.secondaryColor
      }
    }
  }

  // On crée un stack dans la barre de navigation du bas, on inclut le stack de MealsNavigator sur le lien de la première vue. Un stack "nested" dans un stack en somme. On a ainsi toujours accès au stack de MealsNavigator sauf que là ça nous permet de poser une barre de navigation en bas qui utilise le stack de MealsNavigator dans le stack de MealsFavTabNavigator
  const MealsFavTabNavigator = Platform.OS === "android" ? createMaterialBottomTabNavigator(tabScreenConfig, {
    activeColor: "white",
    shifting: true
  }) : createBottomTabNavigator(tabScreenConfig, {
    tabBarOptions: {
      activeTintColor: Colors.secondaryColor
    }
  })

  // Je crée ce stack uniquement pour avoir un Header sur la page filters, aucune autre raison
  const FiltersNavigator = createStackNavigator({
    Filters: FiltersScreen
  })

  // Notre outil de navigation principal, le drawing navigator qui sera utilisé pour englober l'app dessous sera symbolisé dans l'app par un menu burger. 
  const MainNavigator = createDrawerNavigator({
    MealsFavs: MealsFavTabNavigator,
    Filters: FiltersNavigator
  })

  export default createAppContainer(MainNavigator)

  // Il faut penser à poser ce menu burger dans les navigationOptions des pages où on veut voir apparaitre le menu burger avec la propriété. Ci-dessous un exemple dans `CategoriesScreen.js`
  import CategoryGridTile from '../components/CategoryGridTile'
  import { HeaderButtons, Item } from "react-navigation-header-buttons" 

  const CategoriesScreen = ({ navigation }) => {

    const renderGridItem = itemData => {
      return (
        <CategoryGridTile
          title={itemData.item.title}
          color={itemData.item.color}
          onSelect={() => {
            navigation.navigate({ routeName: "CategoryMeals", params: { categoryId: itemData.item.id } })
          }}
        />
      )
    }

    return (
      <FlatList data={CATEGORIES} renderItem={renderGridItem} numColumns={2} />
    )
  }

  ```
  - On va créer un stack, une pile des vues rentrées dans l'objet qui englobera l'application
  - L'ordre des vues dans l'objet est important et indique quelle vue est en premier, en second, etc..
  - Chaque vue entrée dans l'objet de navigation possède automatiquement une props spéciale
  - on peut passer `defaultNavigationOptions` qui serviront à transporter des options (par exemple de style) directement aux vues concernées
  - Une fois ce dernier créé, on va le poser dans `App.js`
  - ATTENTION : il est possible d'inclure un stack dans un stack, notamment pour avoir une barre de navigation supplémentaire (typiquement en bas). Dans ce cas, comme on exporte un seul stack pour englober `App.js`, on va inclure un stack dans un autre. Voire l'exemple au-dessus.


```javascript

  import MealsNavigator from './navigation/MealsNavigator'

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
    <MealsNavigator />
  );
}

  ```

Ensuite, dans la première vue, ici `CategoriesScreen.js`, on va poser un bouton pour tester le routing. 
On va utiliser la props `navigation` qui est passée à la vue grâce à l'objet du navigator, cette props possède beaucoup de propriétés (objets et functions) :

- La fonction `navigate`.
Cette fonction `navigate` accepte en argument un objet dans lequel on indique la vue vers laquelle on veut être dirigée si on clique sur le bouton. Rien de plus, la librairie s'occupe du reste. On ne s'occupe pas du "sens" de navigation, du bouton retour etc.. c'est géré par la librairie.
Deux syntaxe pour la fonction `navigate`, les deux fonctionnent sans différence, l'une est plus courte, c'est tout

```javascript

const CategoriesScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text>The Categories Screen!</Text>
      <Button title="Go to Meals!" onPress={() => { navigation.navigate({ routeName: "CategoryMeals" }) }} />
      <Button title="Go to Meals!" onPress={() => { navigation.navigate("CategoryMeals") }} />
    </View>
  )
}

```

- La fonction `push`.
Cette fonction `push` est identique à la fonction `navigate` mais permet en plus de renvoyer sur la même page, comme une sorte de refresh, ce que ne fait pas fonction `navigate`.

```javascript

const CategoriesScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text>The Categories Screen!</Text>
      <Button title="Go to Meals!" onPress={() => { navigation.push("CategoryMeals") }} />
    </View>
  )
}

```

- La fonction `goBack` et `pop`.
  Cette fonction `goBack` est identique au bouton "retour" pris en charge par la fonction `navigate` mais permet de le mettre où on veut et donc de ne pas être limité au bouton "retour" dans la barre de navigation.
  La fonction `pop` est identique mais ne peut être utilisé que dans un stack, contrairement à `goBack` qui peut être utilisé avec `navigation` n'importe où

```javascript

const CategoriesScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text>The Categories Screen!</Text>
      <Button title="Go Back" onPress={() => { navigation.goBack() }} />
      <Button title="Go Back" onPress={() => { navigation.pop() }} />
    </View>
  )
}

```

- La fonction `popToTop`.
  Cette fonction permet de revenir à la première vue du stack, pratique si on veut revenir directement à l'accueil par exemple

  ```javascript

  const MealDetailScreen = ({ navigation }) => {
    return (
      <View style={styles.screen}>
        <Text>The Meal Detail Screen!</Text>
        <Button title="Go Back to Categories" onPress={() => {navigation.popToTop()}} />
      </View>
    )
  }

  ```

- La fonction `replace`.
  Cette fonction permet de remplacer la vue dans le stack par celle choisie

  ```javascript

    const MealDetailScreen = ({ navigation }) => {
      return (
        <View style={styles.screen}>
          <Text>The Meal Detail Screen!</Text>
          <Button title="Go Back to Categories" onPress={() => {navigation.replace("CategoryMeals")}} />
        </View>
      )
    }

  ```


Rappel : les fonctions sont des objets en js, après avoir créé la fonction/objet, je peux lui ajouter des propriétés. Je rajoute donc la propriété `navigationOptions` qui me permet, entre autres, d'ajouter du style au header de la barre de navigation

  ```javascript
  CategoriesScreen.navigationOptions = {
    headerTitle: "Meal Categories",
    headerStyle: {
      backgroundColor: Platform.OS === "android" ? Colors.primaryColor : ""
    },
    headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor
  }
  ```


Je peux passer des paramètres, comme des props, d'une vue à une autre grâce à `navigation`...

```javascript
  const renderGridItem = itemData => {
      return (
        <TouchableOpacity
          style={styles.gridItem}
          // Version alternative
          // onPress={() => { navigation.navigate({ routeName: "CategoryMeals", {categoryId: itemData.item.id} }) }}>
          // Je passe des params/infos dans l'objet navigation jusqu'à la vue suivante
          onPress={() => { navigation.navigate({ routeName: "CategoryMeals", params: { categoryId: itemData.item.id } }) }}>
          <View>
            <Text>{itemData.item.title}</Text>
          </View>
        </TouchableOpacity>
      )
    }
```

... que je récupère de la manière suivante dans la vue ciblée :
```javascript
  const CategoryMealsScreen = ({ navigation }) => {
    // Je récupère les params/infos et les stocke dans carId
    const carId = navigation.getParam("categoryId")
    return (
      <View style={styles.screen}>
        <Text>The Category Meal Screen!</Text>
        <Button title="Go to Details" onPress={() => { navigation.navigate("MealDetail") }} />
        <Button title="Go Back" onPress={() => { navigation.goBack() }} />
      </View>
    )
  }
```

On va avoir un problème cependant si on veut récupérer les infos passées en paramètres EN DEHORS de la fonction principale (`CategoryMealsScreen` par exemple ci-dessus). En effet, les params/infos sont récupérées depuis l'objet `navigation` passées en paramètre de la fonction... inaccessible à l'extérieur de cette dernière et donc inaccessible avec `navigationOptions` qui se trouve à l'extérieur. Rappel, `navigationOptions` est rajouté à la function APRES sa création donc en dehors de cette dernière.

La solution consiste à passer par l'objet `navigationData` qui est en fait identique (ou en tout cas suffisamment proche) à l'objet `navigation`. L'objet `navigationData` est accessible à l'extérieur de la fonction principale donc :

```javascript
  CategoryMealsScreen.navigationOptions = navigationData => {
    const carId = navigationData.navigation.getParam("categoryId")

    const selectedCategory = CATEGORIES.find(item => item.id === carId)

    return {
      headerTitle: selectedCategory.title
    }
  }
```

- Pour un bouton/texte/icone en haut à droite dans la barre de navigation, après avoir installé la lib `npm i --save @expo/vector-icons` pour les icones, deux options :
  - A la mano :
    ```javascript
      MealDetailScreen.navigationOptions = navigationData => {

        const mealId = navigationData.navigation.getParam("mealId")
        const selectedMeal = MEALS.find(item => item.id === mealId)

        return {
          headerTitle: selectedMeal.title,
          headerRight: <Text>FAV!</Text>
        }
      }

    ```
  - A travers une librairie : `npm install --save react-navigation-header-buttons@6`
    Le `@6` sert à identifier et fixer la version dans le tuto udemy.
    On va préférer la lib, même si la solution manuelle est possible, pour des raisons de simplicité lors du style si on veut qu'il rende bien sur un maximum de format de téléphone.

    - On va d'abord créer un composant custom `HeaderButton.js`:

    Exemple : 

    ```javascript
      import React from 'react'
      import { Platform } from "react-native"
      import { HeaderButton } from 'react-navigation-header-buttons'
      import { Ionicons } from '@expo/vector-icons'

      import Colors from "../constants/Colors"

      const CustomHeaderButton = props => {
        return <HeaderButton
          {...props}
          IconComponent={Ionicons}
          iconSize={23}
          color={Platform.OS === "android" ? "white" : Colors.primaryColor}
        />
      }

      export default CustomHeaderButton

    ```

    - Ensuite sur la page où on souhaite afficher l'icone dans la barre de navigation, `MealDetailScreen.js`, on va poser `HeaderButtons` de la lib `"react-navigation-header-buttons"` PLUS `HeaderButton` que l'on a créé dans notre composant au-dessus. On utilise `HeaderButtons` et à l'intérieur `HeaderButtonComponent={HeaderButton}` pour lui dire de prendre le style de notre composant `HeaderButton`. Au final, la partie dessous ne change pas trop en dehors du `title` (solution de secours si l'icone ne s'affiche pas) et du `iconName` qui indique quelle icone utiliser. La couleur et la taille sont gérées au-dessus dans le composant custom.

    Exemple : 

    ```javascript

      import { HeaderButtons, Item } from "react-navigation-header-buttons"
      import HeaderButton from "../components/HeaderButton"

      ....

      MealDetailScreen.navigationOptions = navigationData => {

        const mealId = navigationData.navigation.getParam("mealId")
        const selectedMeal = MEALS.find(item => item.id === mealId)

        return {
          headerTitle: selectedMeal.title,
          headerRight:
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
              <Item
                title="Favorite"
                iconName="ios-star"
                onPress={() => { }}
              />
            </HeaderButtons>
        }
      }
    ```


  Si on veut utiliser des tabs style android dans la barre de navigation du bas = `npm i --save react-navigation-material-bottom-tabs` puis `npm i --save react-native-paper`



  Si on veut styliser les éléments de navigation, dans `MealsNavigator.js`
   ```javascript
    const defaultStackNavOptions = {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: Platform.OS === "android" ? Colors.primaryColor : ""
        },
        // Pour styliser les éléments dans la barre de navigation du haut, on doit passer par defaultNavigationOptions et les objets suivants :
        headerTitleStyle: {
          fontFamily: "open-sans-bold",
        },
        headerBackTitleStyle: {
          fontFamily: "open-sans"
        },
        headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor
      }
    }

  ```