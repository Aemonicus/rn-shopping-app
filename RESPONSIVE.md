# Règles globales

- Mettre `width` en % avec une `minWidth` en fixe et une `maxWidth` en %
  Exemple
```javascript
import React from 'react'
import { Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
   inputContainer: {
    width: "80%",
    minWidth: 300,
    maxWidth: "95%",
    alignItems: "center",
  },
})

```

- Dans le fichier `app.json`, dans l'objet `expo`, il y a une propriété `"orientation"`, si on lui donne une valeur (portrait ou landscape), l'application sera bloquée dans l'orientation choisie. Si on ne veut pas bloquer l'orientation, il faut utiliser `"default"`
  Exemple
  ```javascript
  "orientation": "default",
  ```

- Penser à utiliser le component `<ScrollView></ScrollView>` autour de tous les autres components pour rendre une page scrollable en mode landscape.

- Penser à utiliser le composant `<KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}></KeyboardAvoidingView>` si on veut s'assurer que le clavier reste toujours en dessous d'un input présent sur la page. Ce composant doit être sous le component `<ScrollView></ScrollView>` et encadrer tous les autres. `behavior` et `keyboardVerticalOffset` permettent de placer le clavier sous l'input de 30 unités de pixel.
`behavior` va utiliser `"position"` pour iOS et `"padding"` pour Android

--------------------------------
# Dimensions API
Il s'agit d'un objet mis à disposition par React Native pour avoir accès à certaines informations de l'appareil.
Par exemple pour avoir accès à la largeure totale de l'appareil, je peux choisir entre 'window' ou 'screen', toujours choisir 'window'. iOS ne bronche pour aucun des deux mais Android ne prendra pas toute la largeure avec 'screen' donc 'window'..

Exemple 
```javascript
import React from 'react'
import { Text, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
   button: {
    // width: 100
    // width: "20%"
    width: Dimensions.get('window').width / 4
  },
})

```

Un exemple pour avoir un cercle : 

```javascript
import React from 'react'
import { Text, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
   imageContainer: {
    width: Dimensions.get("window").width * 0.7,
    // On utilise la width même pour la hauteur car pour réaliser un cercle parfait on doit avoir la même dimension hauteur/largeure, le tout divisé par deux
    height: Dimensions.get("window").width * 0.7,
    borderRadius: Dimensions.get("window").width * 0.7 / 2,
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    marginVertical: 30
  },
})

```


Ci-dessus, je peux décider de la largeure du bouton grâce à 
  - width en fixe
  - width en pourcentage
  - width utilisant l'objet Dimensions.
  
L'objet `Dimensions` donne accès à certaines méthodes, dans cet exemple il me donne la largeure TOTALE de l'appareil, là où le pourcentage donne une information basée sur la largeure du parent


Je peux aussi utiliser une ternaire pour choisir une valeur en fonction de la taille, ci-dessous la hauteur dans l'exemple

Exemple 
```javascript
import React from 'react'
import { Text, StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Dimentions.get("window").height > 600 ? 20 : 10,
    width: 500,
    maxWidth: "90%"
  }
})

```

Je peux aussi utiliser `Dimensions` en dehors de styleSheet, par Exemple

```javascript
import React from 'react'
import { Text, StyleSheet, Dimensions } from 'react-native'

...
// En dehors du return
if (Dimensions.get("window").height > 600) {
    return <View>...</View>
  }

// Dans le return pour indiquer le style à prendre pour le composant <Card>
return (
    <View style={styles.screen}>
      <Text>Opponent's Guess</Text>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={Dimensions.get("window").height > 600 ? styles.buttonContainer : styles.buttonContainerSmall}>
)
...

```

Pour adapter la taille d'éléments quand on passe du mode portrait au mode paysage, par exemple pour des boutons, on va devoir mettre un écouteur d'évènements car le calcul de taille d'éléments, avec ou sans `Dimensions`, ne se fait qu'une seule fois !
Pour changer la taille de ses éléments avec `Dimensions`, on va :
  - utiliser `useState` pour stocker dans le state l'état du bouton (sa dimension dans notre exemple)
  - poser un écouteur d'évènements
  - utiliser le hook `useEffect` qui va relancer le code à chaque fois que l'écouteur d'évènements est repéré
  - sortir le style à changer de l'objet `styleSheet` pour le mettre en style inline dans le JSX (on peut laisser le reste du style dans l'objet `styleSheet` si on avait posé autre chose que la taille à changer, dans ce cas on aura du style inline ET dans l'objet `styleSheet`)

Exemple
```javascript
import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, Dimensions } from 'react-native'

...

const StartGameScreen = ({ onStartGame }) => {

  const [enteredValue, setEnteredValue] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState()
  const [buttonWidth, setButtonWidth] = useState(Dimensions.get("window").width / 4)
...


useEffect(() => {
    const updateLayout = () => {
      setButtonWidth(Dimensions.get("window").width / 4)
    }

    Dimensions.addEventListener('change', updateLayout)
    return () => {
      Dimensions.removeEventListener('change', updateLayout)
    }
  })

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
        ...
              <View style={styles.buttonContainer}>
                <View style={{ width: buttonWidth }}>
                  <Button title="Reset" color={Colors.secondary} onPress={resetInputHandler} />
                </View>
                <View style={{ width: buttonWidth }}>
                  <Button title="Confirm" color={Colors.primary} onPress={confirmInputHandler} />
                </View>
        ...        
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

```



--------------------------------
# ScreenOrientation API
API fourni par expo, donc utilisable uniquement avec expo, qui permet de vérifier l'orientation de l'appareil et réaliser certaines actions.
Malheureusement cette API n'a pas l'air de fonctionner sur mon iphone donc on oublie pour l'instant. A voir plus tard car l'idée permet de se passer du Dimensions API qui se base sur une valeur mais Dimensions API reste l'API de référence pour l'instant encore

Exemple
```javascript
import * as ScreenOrientation from 'expo-screen-orientation'

const GameScreen = ({ userChoice, onGameOver }) => {
  // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  ...

```



