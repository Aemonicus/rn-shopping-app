# Règles globales

- De base les éléments sont en display:flex, flexDirection: "column" SAUF `<Text></Text>`

- On ne peut pas utiliser de valeur comme px, soit pourcentage soit juste la valeur seule qui correspondra à la densité du pixel sur l'écran

- Si l'élément parent ne possède pas de valeur fixe avec width and height ou flex (ex : flex:1), le parent n'aura pas de dimension et les éléments enfants ne seront pas visibles

- Penser à utiliser `flex:1` si on veut qu'un élément prenne de base toute la place disponible

- Penser à utilser `flexGrowl:1` si on veut le même comportement qu'au dessus sans les limitations de `flex:1` (par exemple si on veut défiler une liste, avec `flex:1` la liste va revenir automatiquement à la place d'origine)

- On peut placer verticalement un élément simplement avec `marginVertical` / `paddingVertical`

- On peut placer horizontalement un élément simplement avec `marginHorizontal` / `paddingHorizontal`

- On ne peut pas poser une `fontFamily` à un élément parent pour qu'elle soit passée à tous les enfants, il faut soit poser la `fontFamily` à tous les éléments que l'on souhaite, soit créer un component qui aura comme style la `fontFamily` qui nous intéresse. Ensuite on remplace tous les components `<Text></Text>` par le component que l'on vient de créer.
Exemple :

 ```javascript
import React from 'react'
import { Text, StyleSheet } from 'react-native'

const BodyText = ({ children }) => <Text style={styles.body}>{children}</Text>

const styles = StyleSheet.create({
  body: {
    fontFamily: 'open-sans'
  }
})

export default BodyText

```

- Les margins négatifs ne sont pas pris en compte sur Android

- Si je veux poser une box-shadow pour, par exemple, créer une card, je dois utiliser :
  - Pour iOS `shadow..`
  ```javascript
    width: 300,
    maxWidth: "80%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    elevation: 5,
    padding: 20,
    borderRadius: 10
   ```
  - Pour Android `elevation`
  ```javascript
    width: 300,
    maxWidth: "80%",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    backgroundColor: "white",
    elevation: 5,
    padding: 20,
    borderRadius: 10
  ```
  Du coup c'est beaucoup plus limité en terme de personnalisation sur Android qui applique de base le style MaterialUI. On posera `shadow..` et `elevation` dans le même style car React Native compile pour les deux systèmes en même temps mais une seule propriété fonctionnera suivant le système du client

- Pour utiliser du style différent pour deux éléments dans un même texte, on peut mettre un `<Text></Text>` dans un `<Text></Text>`. Le style passé d'un `<Text></Text>` est transféré à tous les `<Text></Text>` enfants. De plus, `flexbox` n'est pas pris en compte nativement avec les `<Text></Text>`


--------------------------------
# Créer un bouton personnalisé
On peut remplacer les composants `<Button>` par des composants customs, notamment pour le style. L'import de TouchableOpacity est important (ou un autre Touchable) pour rendre le bouton "clickable"

Exemple
```javascript
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import Colors from '../constants/colors'

const MainButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
# Utiliser une icone

Pour utiliser une icone, suivre les étapes suivantes :
- importer le composant, par exemple `Ionicons`, depuis le dossier `"@expo/vector-icons"`
- insérer la balise `<Ionicons name="md-remove" size={24} color="white" />`. Elle sera prise en compte même entre une balise `<Text />`
- on n'est pas limité aux icones Ionicons, d'autres existent (MaterialUI..), vérifier dans la doc
- la propriété `name` sert à identifier la balise choisie (dans une liste que l'on peut trouver dans la doc)
- les autres propriétés servent à styliser l'icone

Exemple
```javascript
import { Ionicons } from "@expo/vector-icons"
...
<MainButton onPress={() => nextGuessHandler('lower')} ><Ionicons name="md-remove" size={24} color="white" /></MainButton>
```