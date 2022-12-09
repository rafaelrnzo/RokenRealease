import { StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React, {Component} from 'react'
import Layout from './Page/layout'
import Tesbes from './Page/base64'
import { StatusBar } from 'expo-status-bar';
import Success from './Page/widget/Success';

const App = () => {
  return (
    <>
      <StatusBar style="true" />
      <Layout/>
    </>
  )
}

export default App

const styles = StyleSheet.create({})
    
