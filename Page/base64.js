import React, { Component } from 'react';
import { View, Image, Platform, StyleSheet, Button, Modal, Text } from 'react-native'

class Tesbes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }
    render() {
        <Image
            style={{ width: 100, height: 100, }}
            source={{
                uri: 'data:image/jpeg;base64,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'
            }}
        />
        return (
            <>
                <View className="flex-1 bg-green-600 justify-center" >

                    <Modal
                        opacity={0.5}
                        animationType={"fade"}
                        transparent={true}
                        visible={this.state.isVisible}
                        onRequestClose={() => { console.log("Modal has been closed.") }}>
                        <View className="flex-1 bg-gray-500 opacity-60">
                            <View className="opacity-100 z-100">

                                <Button title="Click To Close Modal" onPress={() => {
                                    this.setState({ isVisible: !this.state.isVisible })
                                }} />
                            </View>
                        </View>
                    </Modal>
                    <Button
                        title="Click To Open Modal"
                        onPress={() => { this.setState({ isVisible: true }) }}
                    />
                </View>
            </>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
    },
    modal: {
        opacity: 0.5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 80,
        marginLeft: 40,

    },
    text: {
        color: '#3f2949',
        marginTop: 10
    },
    test: {
        backgroundColor: 'blue'
    }
});
export default Tesbes;