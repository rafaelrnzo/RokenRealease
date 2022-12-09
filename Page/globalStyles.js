import { StyleSheet } from "react-native";
import { useFonts } from 'expo-font'

export default function globalStyles() {
  const [fontsLoaded] = useFonts({
    Carre: require('../assets/fonts/carre.ttf')
  });

}
  export const stylesGlobal = StyleSheet.create({
    Circle: {
      // borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) ,
      borderRadius: 15,
      width: Dimensions.get('window').width / 4,
      height: Dimensions.get('window').width / 6,
      backgroundColor: '#201D1E',
      justifyContent: 'center',
      alignItems: 'center',
      borderStyle: "solid",
      elevation: 10,
    },
    Enter: {
      width: Dimensions.get('window').width / 5,
      height: Dimensions.get('window').width / 5,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 10,
    },
  
    input: {
      width: Dimensions.get('window').width / 1.1,
      height: Dimensions.get('window').width / 3.5,
      backgroundColor: '#0f172a',
      elevation: 10,
    },
    Modal: {
      width: Dimensions.get('window').width / 1.3,
      height: Dimensions.get('window').height / 2,
      borderRadius: 15,
    },
    ModalButton: {
      width: Dimensions.get('window').width / 3.2,
      height: Dimensions.get('window').height / 12,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 8,
    },
    Text: {
      color: 'white',
      fontFamily: 'Carre',
    }
       
  })