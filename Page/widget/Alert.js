import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default Alert = () => {
  return (
    <View>
      <LottieView
          source={require('../../assets/lottieJSON/alert.json')}
          autoPlay 
          style={styles.alert}    
      />
    </View>
  )
}

const styles = StyleSheet.create({
  alert: {
    width: Dimensions.get('window').width / 2.5,
    height: Dimensions.get('window').width / 2.5,
  }
})