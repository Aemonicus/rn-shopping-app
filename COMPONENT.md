# Explication Générale

Commande pour lancer un projet avec expo (expo est un équivalent à create react app) : "expo init nom-du-projet"


Avec React Native on ne peut pas utiliser la même syntaxe que en HTML et CSS. Même le JSX est différent. On va utiliser un nombre limité de composant qui permettent cependant de couvrir tous les cas de figure.
Par exemple les `<div></div>` n'existent pas, React Native qui doit compiler le code en code natif mobile (java ou kotlin pour android et swift ou ObjectifC pour iOS) ne connait que sa syntaxe propre qu'il traduira ensuite en composant natif.

Donc pas de HTML, pas de CSS, pas de JSX comme sur React mais du JSX plus limité.



---------------------------------
# Composant de base

`<View></View>` est un composant équivalent au `<div></div>` utilisé pour encadrer tous les composants/éléments enfants de l'application. React Native ne comprend pas nativement les `<div></div>`

IMPORTANT : Pour définir une width à un élément comme un bouton, il faut passer par une `<View></View>` encapsulant l'élément.

Exemple avec un `<Button title="test"/>`
```javascript
  <View style={styles.button}>
    <Button title="CANCEL" color="red" onPress={onCancel} />
  </View>

const styles = StyleSheet.create({
  button: {
    width: "30%"
  }
})
```

--------------------------------
# Composant de base

`<ScrollView></ScrollView>` est un composant utilisé à la place du composant `<View></View>` pour permettre le défilement de l'écran car par défaut ce comportement n'est pas supporté sur mobile. Utilisé pour afficher des listes.

Si on veut styliser ce composant, il vaut mieux passer par la propriété `contentContainerStyle={}` plutôt que l'objet `style` classique car ce composant, comme `flatList` réagit différement.

On peut utiliser ce composant à l'intérieure d'un `<View></View>`, notamment pour styliser la liste (mettre une largeure..) MAIS ATTENTION il faut mettre `flex:1` dans le style de `<View></View>` sinon le défilement ne fonctionne pas sur Android.

Exemple
```javascript

const renderListItem = (item, numOfRound) => {
  return (
    <View style={styles.listItem} key={item}>
      <BodyText>#{numOfRound}</BodyText>
      <BodyText>{item}</BodyText>
    </View>
  )
}

const GameScreen = ({ userChoice, onGameOver }) => {

<View style={styles.listContainer}>
  <ScrollView contentContainerStyle={styles.list}>
    {pastGuesses.map((item, index) => renderListItem(item, pastGuesses.length - index))}
  </ScrollView>
</View>

}

  const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  listItem: {
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
})
```


--------------------------------
# Composant de base

`<TouchableWithoutFeedback></TouchableWithoutFeedback>` est un composant utilisé pour rendre toute une zone intéractive (écouter tous les évènements de type toucher/tap) sans effet visible. 
Exemple avec un évènement fourni de base dans l'API de react-native (il faut quand même l'importer au tout début) qui permet au toucher n'importe où en dehors du clavier de fermer le clavier : 
```javascript
import { View, StyleSheet, Text, Button, TouchableWithoutFeedback, Keyboard } from 'react-native'

<TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
  <View style={styles.screen}>
  ....
  </View>
</TouchableWithoutFeedback>
```


--------------------------------
# Composant de base

`<FlatList></FlatList>` est un composant qui remplace `<ScrollView></ScrollView>` car plus optimisé. Il n'affiche que les éléments de liste nécessaire et pas ceux cachés/invisibles..

Si on veut styliser ce composant, il vaut mieux passer par la propriété `contentContainerStyle={}` plutôt que l'objet `style` classique car ce composant, comme `scrollView` réagit différement.

Attention, le composant utilise son "propre" map() avec le props renderItem
Exemple  
```javascript
<FlatList
        keyExtractor={(item, index) => item.id}
        data={courseGoals}
        renderItem={itemData => (
          <GoalItem
            title={itemData.item.value}
            onDelete={() => removeGoalHandler(itemData.item.id)} />
        )}
      />
```



--------------------------------
# Composant de base

`<Text></Text>` est un composant utilisé pour afficher du texte. Composant de base obligatoire pour du texte.
- Le style passé d'un `<Text></Text>` parent est transféré à tous les `<Text></Text>` enfants (si l'un dans l'autre). 
C'est le seul composant qui transmet sont style à ses composants enfants, si ces enfants sont des `<Text></Text>`. 
- De plus, `flexbox` n'est pas pris en compte nativement avec les `<Text></Text>`



--------------------------------
# Composant de base

`<TextInput/>` est un composant utilisé pour afficher une zone de texte intéractive équivalent à un `<input>`. Composant de base obligatoire pour permettre de la saisie de texte.



--------------------------------
# Composant de base

`<Button title=""/>` est un composant utilisé pour afficher un bouton. La props title est obligatoire. D'autres props comme onPress peuvent être utilisés pour les évènements.
Exemple
```javascript
<View>
  <Button title="Reset" onPress={() => { }} />
  <Button title="Confirm" onPress={() => { }} />
</View>
```



--------------------------------
# Composant de base

`<Image source={require('')}/>` est un composant utilisé pour afficher une image. 
Si on va chercher une image en local, on utilise la méthode `require()`
Si on va chercher l'image sur le web, on utilise `{uri: ""}` ATTENTION, pour les images récupérées sur le web il faudra toujours mettre une `width` et une `height`
Exemple
```javascript

<Image
  style={styles.image}
  source={require('../assets/success.png')}
  source={{ uri: 'https://www.updatepedia.com/wp-content/uploads/2019/04/Successss.jpg' }}
  resizeMode="cover"
/>

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    borderRadius: 200,
    borderWidth: 3,
    borderColor: 'black',
    marginVertical: 30
  }
})

```

--------------------------------
# Composant de base

`<AppLoading />` est un composant utilisé pour différer le chargement de la page en attendant qu'un certain élément soit terminé. 
Penser à poser dans le terminal : expo install expo-app-loading

Exemple
```javascript

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font'

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

export default function App() {
...

  const [dataLoaded, setDataLoaded] = useState(false)

  if (!dataLoaded) {
    return <AppLoading
      startAsync={fetchFonts}
      onFinish={() => setDataLoaded(true)}
      onError={(err) => console.log(err)}
    />
  }

  ...
}
```

--------------------------------
# Platform API
API qui indique la plateforme sur laquelle on se trouve. Il suffit de l'utiliser dans une ternaire.

Exemple
```javascript
import { View, Text, StyleSheet, Platform } from 'react-native'

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 90,
    paddingTop: 40,
    backgroundColor: Platform.OS === "android" ? Colors.primary : "white",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: Platform.OS === "ios" ? "#ccc" : "transparent",
    borderBottomWidth: Platform.OS === "ios" ? 1 : 0
  },
  headerTitle: {
    color: Platform.OS === "ios" ? Colors.primary : "white",
    fontSize: 20,
    fontFamily: 'open-sans-bold',
  }
})

export default Header

```


Autre Exemple
```javascript
import { View, Text, StyleSheet, Platform } from 'react-native'

const Header = ({ title }) => {
  return (
    // <View style={styles.header}>
    <View style={{ ...styles.headerBase, ...Platform.select({ ios: styles.headerIOS, android: styles.headerAndroid }) }}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  headerBase: {
    width: "100%",
    height: 90,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIOS: {
    backgroundColor: "white",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  headerAndroid: {
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    color: Platform.OS === "ios" ? Colors.primary : "white",
    fontSize: 20,
    fontFamily: 'open-sans-bold',
  }
})

export default Header

```



--------------------------------
# Composant de base
`TouchableNativeFeedback` permet d'avoir une intéraction sur un élément sur Android, type button, comme `TouchableOpacity` qui lui fonctionne sur iOs. Couplé à `Platform` API, ça donne ça :

Exemple
```javascript
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native'

import Colors from '../constants/colors'

const MainButton = ({ children, onPress }) => {

  let ButtonComponent = TouchableOpacity

  if (Platform.OS === 'android' && Platform.Versionn >= 21) {
    ButtonComponent = TouchableNativeFeedback
  }
  return (
    // on doit encapsuler le bouton dans une View si on veut garder sous controle l'effet du bouton, hack de styles sur RN
    <View style={styles.buttonContainer}>
      <ButtonComponent onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{children}</Text>
        </View>
      </ButtonComponent>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden'
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  buttonText: {
    color: "white",
    fontFamily: "open-sans",
    fontSize: 20
  }
})

export default MainButton

```



--------------------------------
# Composant de base

`<SafeAreaView></SafeAreaView>` est un composant qui permet de prendre en compte les encoches, les barres de menu etc.. qui pourraient se superposer aux éléments sur l'écran. Si on le pose, il faut le poser autour du composant le plus haut niveau, dans notre cas dans `App.js`. A noter que certaines librairies s'occupent de ce problème sans avoir à utiliser ce composant, ça dépendra donc du projet et des librairies utilisées

Exemple
```javascript

import { StyleSheet, Text, View, SafeAreaView } from 'react-native';


export default function App() {

return (
    <SafeAreaView style={styles.screen}>
      <Header title={"Guess a Number"} />
      {content}
    </SafeAreaView>
  );
}
```