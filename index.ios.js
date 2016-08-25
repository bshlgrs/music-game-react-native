/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  View
} from 'react-native';
import {
  Button
} from 'react-native-button';
import { Sound } from 'react-native-sound';

var note = new Sound('acoustic_grand_piano-A2.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
  } else { // loaded successfully
    console.log('duration in seconds: ' + whoosh.getDuration() +
        'number of channels: ' + whoosh.getNumberOfChannels());
  }
});

class MusicGameApp extends Component {
  constructor(props) {
    super(props);
    this.state = { num: 0 };
  }

  _onPressButton(event, rowNum, idx) {
    console.log('Pressed!');
    this.setState({ num: rowNum + idx });
    note.play();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'powderblue', justifyContent:'center', flexDirection: "column"}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Music game! {this.state.num}</Text>
        </View>
        <View style={{flex: 2, backgroundColor: 'skyblue'}} />
        <View style={{flex: 7, backgroundColor: 'steelblue', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}>
          {[...Array(6)].map((x, idx) =>
            <Row key={idx} rowNum={idx} handlePressButton={(a,b,c) => this._onPressButton(a,b,c)}/>
          )}
        </View>
      </View>
    );
  }
}

class Row extends Component {
  render () {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        }}>
        {[...Array(6)].map((x, idx) =>
          <Key key={idx} rowNum={this.props.rowNum} idx={idx} handlePressButton={this.props.handlePressButton}/>
        )}
      </View>
    );
  }
}

class Key extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <TouchableHighlight
        key={this.props.idx}
        onPress={(e) => this.props.handlePressButton(e, this.props.idx, this.props.rowNum)}
        style={{width: 20, borderWidth: 2, backgroundColor: 'red', flexDirection: 'column', flex: 1}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
          {this.props.idx} {this.props.rowNum}
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class Bananas extends Component {
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <Image source={pic} style={{width: 193, height: 110}}/>
    );
  }
}

AppRegistry.registerComponent('MusicGameApp', () => MusicGameApp);
