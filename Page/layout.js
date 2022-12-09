import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Button } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import { withTheme } from '@rneui/themed';
import Modal from "react-native-modal";
import Success from './widget/Success';
import Alert from './widget/Alert';
import * as Font from 'expo-font';

init({
  sync: {},
  size: 10000,
  enableCache: true,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
});

const options = {
  host: '104.248.156.51',
  port: 9001,
  path: 'token',
  id: 'id_' + parseInt(Math.random() * 100000)
};

let customFonts = {
  'Carre': require('../assets/fonts/carre.ttf'),
};

client = new Paho.MQTT.Client(options.host, options.port, options.path);

class layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username_mqtt: 'ali',
      password_mqtt: '1234',
      message: '',
      messageList: [],
      status: '',
      topic_token: 'power/token',
      topic_gambar: 'cam/token',
      data_token: [],
      display_data_token: '',
      isVisible: false,
      fontsLoaded: false,
      isLook: false,
      isHidden: false,
      refresh: "",
    };
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
  }

  //font function
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  // consoleLog() {
  //   // console.log(this.state.data_token + " data token")
  //   // console.log(this.state.data_token.length + " length data token")
  //   // console.log(this.state.display_data_token + " display data token")
  //   // console.log(this.state.display_data_token.length + " length display data token")
  // }

  // MQTT State///////////////////////////////////////////////////////////
  refresh = () => {
    var rel = this.state.refresh
    var camRel = "go" + rel + ">"
    this.setState({
      isLook: true
    })
    this.publishMessage("power/token", camRel)
  }

  componentDidMount() {
    this.setState({
      display_data_token: "isi Token..."
    })
    this.connect()
    this._loadFontsAsync(); 
  }

  onFailure = (err) => {
    console.log('Connect failed!');
    console.log(err);
    this.setState({ status: 'failed' });
  }

  connect = () => {
    this.setState({
      status: 'isFetching'
    }, () => {
      client.connect({
        onSuccess: this.onConnect,
        useSSL: false,
        userName: this.state.username_mqtt,
        password: this.state.password_mqtt,
        timeout: 3,
        onFailure: this.onFailure,
      });
    }
    );
  }

  publishMessage(topic, message) {
    message = new Paho.MQTT.Message(message)
    message.destinationName = topic
    client.send(message)
  }

  onConnect = () => {
    console.log('onConnect');
    this.setState({ status: 'connected' });
    client.subscribe(this.state.topic_token, { qos: 0 });
    client.subscribe(this.state.topic_gambar, { qos: 0 });
  }

  onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived = (message) => {
    if (message.destinationName == "cam/token") {
      console.log('onMessageArrived:' + message.payloadString);
      newmessageList = this.state.messageList;
      newmessageList.unshift(message.payloadString);
      this.setState({ messageList: newmessageList });
    }
  }
//////////////////////////////////////////////////////////////////////

  valueNumber = (value) => {
    $arrToken = this.state.data_token
    $arrToken.push(value)

    if ($arrToken.length > 20) {
      $arrToken.pop()
      return false
      alert("limit input")
    }
    this.setState({ display_data_token: $arrToken.join("").match(/.{1,4}/g).join("-") })
  }

  backspace = (value) => {
    let $arrToken = this.state.data_token
    if ($arrToken.length == 1) {
      return[this.setState({ 
        data_token: [],
        display_data_token: "isi Token..."
      }),
      alert("input tidak boleh kosong")]
    }
    $arrToken.pop()
    this.setState({ display_data_token: $arrToken.join("").match(/.{1,4}/g).join("-") })
  }

  enter = () => {
    $arrToken = this.state.data_token
    console.log($arrToken.join(""))

    $tokenForPublish = "go" + $arrToken.join("") + ">"
    console.log($tokenForPublish)
    this.setState({
      isVisible: false,
      data_token: [],
      display_data_token: 0,
      isHidden: true
    })
    this.publishMessage("power/token", $tokenForPublish)
  }

  render() {
    if (!this.state.fontsLoaded) {
      return null;
    }
    return (
      <View className="flex-1" style={{ backgroundColor: '#f3f4f6' }}>
        <View className="flex-1 mt-16 ">
          <View className="flex-grow justify-center">
            <View className="self-center">
              <Text className="text-4xl font-bold" style={[styles.Text, { color: '#0f172a' }]}>Robot Token V2</Text>

            </View>
            <View>
              <View className=" m-8 self-center justify-center rounded-2xl" style={styles.input}>
                <Text className=" text-white self-center text-center m-8" style={{ fontSize: 21, fontFamily: 'Carre' }}>{this.state.display_data_token}</Text>
              </View>
            </View>

            <View className="self-center flex-row justify-evenly  w-full items-center ">

              <Text className="text-xl font-semibold " style={{ color: '#d9a60a' }}>
                Jumlah Token : {this.state.data_token.length}
              </Text>
              <TouchableOpacity onPress={() => { this.refresh() }}>
                <View style={{ elevation: 10 }}>
                  <Image
                    source={require('../assets/img/camera.png')}
                    style=
                    {{
                      width: Dimensions.get('window').width / 7,
                      height: Dimensions.get('window').width / 7,
                      tintColor: "#201D1E",
                    }} />

                </View>
              </TouchableOpacity>
              <Modal
                isVisible={this.state.isLook}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                animationInTiming={500}
                animationOutTiming={500}
                className="mt-10">
                <View className=" rounded-2xl items-center justify-center self-center" style={styles.ModalGambar}>
                  <View className="items-center justify-center relative" > 
                  <Image
                      style={styles.ModalBase64}
                      className="relative"
                      source={{ uri: this.state.messageList.toString() }}
                    />
                    <TouchableOpacity title="Click To Close Modal" className="self-center " onPress={() => {
                      this.setState({ isLook: !this.state.isLook })
                    }}>
                      <View className=" my-3 mb-0 rounded-full justify-center self-center">
                        <Image source={require('../assets/img/close.png')} style={styles.Base64Close}/>
                      </View>
                    </TouchableOpacity> 
                   
                  </View>

                </View>

              </Modal>
            </View>
          </View>
          <View className="flex-grow">
            <View className="flex-row justify-evenly mb-5 ">
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(1)}>
                  <Text className="text-3xl" style={styles.Text}> 1 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(2)}>
                  <Text className="text-3xl" style={styles.Text}> 2 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(3)}>
                  <Text className="text-3xl" style={styles.Text}> 3 </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-evenly mb-5">
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(4)}>
                  <Text className="text-3xl" style={styles.Text}> 4 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(5)}>
                  <Text className="text-3xl" style={styles.Text}> 5 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(6)}>
                  <Text className="text-3xl" style={styles.Text}> 6 </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-evenly mb-5">
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(7)}>
                  <Text className="text-3xl" style={styles.Text}> 7 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(8)}>
                  <Text className="text-3xl" style={styles.Text}> 8 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(9)}>
                  <Text className="text-3xl" style={styles.Text}> 9 </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-evenly mb-5">
              <View>
                <TouchableOpacity
                  style={[styles.Circle]} onPress={() => this.backspace()}>
                  <Image
                    source={require('../assets/img/arrow.png')}
                    style=
                    {{
                      width: Dimensions.get('window').width / 10,
                      height: Dimensions.get('window').width / 10,
                      tintColor: '#FF4242',
                    }} />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.Circle} onPress={() => this.valueNumber(0)}>
                  <Text className="text-3xl" style={styles.Text}> 0 </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Modal
                  isVisible={this.state.isVisible}
                  animationIn={"fadeIn"}
                  animationOut={"fadeOut"}
                  animationInTiming={500}
                  animationOutTiming={500}
                  className="mt-10">
                  <View className="bg-slate-100 self-center justify-center" style={styles.Modal}>
                    <View className="justify-center self-center  ">
                      <View className="items-center">
                        <Alert />
                      </View>
                      <Text className="text-3xl text-center m-2">Are You Sure?</Text>
                      <Text className="text-2xl text-center">Token Robot Will Run!</Text>
                    </View>
                    <View className="flex-row justify-center m-3 my-5">
                      <TouchableOpacity className="rounded-xl" onPress={() => this.enter()}
                        style={[styles.ModalButton, { backgroundColor: '#17c461' }]}>
                        <Text className="text-white text-xl">Sure</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className=" rounded-xl" onPress={() => {
                        this.setState({ isVisible: !this.state.isVisible })
                      }} style={[styles.ModalButton, { backgroundColor: '#b4081e' }]}>
                        <Text className="text-white text-xl">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <Modal
                  isVisible={this.state.isHidden}
                  animationIn={"fadeIn"}
                  animationOut={"fadeOut"}
                  animationInTiming={500}
                  animationOutTiming={500}>
                  <View className="bg-slate-100 self-center justify-evenly" style={styles.Modal}>
                    <View className="justify-center self-center  ">
                      <View className="items-center scale-150">
                        <Success />
                      </View>
                      <Text className="text-3xl text-center m-2">Successfull</Text>
                    </View>
                    <View className="flex-row justify-center m-3 my-5">

                      <TouchableOpacity className=" rounded-xl" onPress={() => {
                        [
                          this.setState({
                            isHidden: false,
                            isLook: true
                          }),
                        ]
                          }} style={[styles.ModalButtonOk, { backgroundColor: '#' }]}>
                            <View style={styles.ModalButtonOkIn}>
                              <Text className="text-white text-xl">OK</Text>
                            </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <TouchableOpacity
                  onPress={() => { this.setState({ isVisible: true }) }}
                  style={[styles.Circle]}>

                  <Image source={require('../assets/img/left-arrow.png')}
                    style=
                    {{
                      width: Dimensions.get('window').width / 9,
                      height: Dimensions.get('window').width / 9,
                      tintColor: "white"
                    }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>
      </View>
    );
  }
}

export default layout;

const styles = StyleSheet.create({
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
    height: Dimensions.get('window').width / 6,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    
  },
  Text: {
    color: 'white',
    fontFamily: 'Carre',
  },
  ModalGambar: {
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 2,
    backgroundColor: '#z'
  },
  ModalBase64: {
    width: Dimensions.get('window').width / 1.3,
    height: Dimensions.get('window').width / 1.5,
    borderWidth: 5,
    borderColor: 'white'
  },
  ModalButtonOkIn:{
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').width / 7,
    backgroundColor: '#0084E4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,

  },
  Base64Close:{
    width: Dimensions.get('window').width / 8,
    height: Dimensions.get('window').width / 8,
  }

})