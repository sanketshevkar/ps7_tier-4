import React, { Component } from "react";
import RNFS from "react-native-fs";
import EditScreen from "./CameraScreen";
import { AppRegistry, StyleSheet, View, Button, ActivityIndicator } from "react-native";
import RNDocumentScanner from "react-native-document-scanner";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCapturing: false,
      isCropping: false,
      isValidatingImageCropping: false,
      image: null,
      content: "",
    };
  }

  /**
   * When crop button is clicked
   */
  _handlePressCrop = () => {
    this.setState({ isValidatingImageCropping: true }, () => {
      setTimeout(this._startImageCropping, 0);
    });
  };

  /**
   * Start image cropping
   */
  _startImageCropping = () => {
    this.scanner.cropImage().then(({ image }) => {
      console.log("44", image);
      RNFS.readFile(image, "base64").then((res) => {
        console.log(res);
        this.setState({
          image,
          isValidatingImageCropping: false,
          content: res,
        });
      });
    });
  };

  render() {
    const { isCapturing, isCropping, isValidatingImageCropping, image } =
      this.state;

    if (image === null) {
      return (
        <View style={styles.container}>
          {/* Document scanner */}
          <RNDocumentScanner
            ref={(ref) => (this.scanner = ref)}
            onStartCapture={() => this.setState({ isCapturing: true })}
            onEndCapture={() =>
              this.setState({ isCapturing: false, isCropping: true })
            }
            androidCameraPermissionOptions={{
              title: "Permission to use camera",
              message: "We need your permission to use your camera",
              buttonPositive: "Ok",
              buttonNegative: "Cancel",
            }}
          />

          {/* Button to scan document
          <Button
            disabled={!isCropping}
            onPress={this._handlePressCrop}
            title="Validate"
            color="#0082CA"
          />

        <Button
            disabled={!isCropping}
            onPress={this._handlePressCrop}
            title="Import Document"
            color="#0082CA"
          /> */}

<View style={styles.buttonStyleContainer}>
    <View style={{flex: 1, borderWidth: 1}}>
    <Button
             title={"Scan"}
              color="#841584"
            />
    </View>
    <View style={{flex: 1, borderWidth: 1}}>
    <Button
                 title={"Upload"}
             color="#841584"
           />

    </View>
    <View style={{flex: 1, borderWidth: 1}}>
    <Button
                 title={"User"}
             color="#841584"
           />

    </View>

         </View>

          {/* Loading during capture */}
          {(isCapturing || isValidatingImageCropping) && (
            <ActivityIndicator style={styles.loading} animating />
          )}
        </View>
      );
    } else {
      return (
        <EditScreen
          style={styles.container}
          source={image}
          content={this.state.content}
          resizeMode="contain"
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonStyleContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#841584'
   },
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});

AppRegistry.registerComponent("MainScreen", () => MainScreen);
