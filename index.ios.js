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
import { default as Sound } from 'react-native-sound';

const noteNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const notes = {};

function loadAllSounds () {
  var path = 'acoustic_grand_piano-mp3/A2.mp3';

  [2,3,4].forEach((octave) => {
    noteNames.forEach((noteName) => {
      var path = 'acoustic_grand_piano-mp3/' + noteName + octave + '.mp3';

      var note = new Sound(path, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound from ' + path, error);
        } else {
          console.log('This worked!', path);
        }
      });

      notes[noteName + octave] = note;
    })
  });
}

function getRandomNote() {
  var num = Math.random() * 36 | 0;
  octave = (num / 12 | 0) + 2;
  noteName = noteNames[num % 12];

  return noteName + octave;
}

loadAllSounds();

class MusicGameApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,
      mysteryNote: null,
      guesses: 0,
      successes: 0
    };
  }

  _onPressButton(event, note) {
    console.log('Pressed! ');
    this.setState({ note: note });

    if (note == this.state.mysteryNote) {
      console.log("Correct!");
      this.setState({
        mysteryNote: null,
        guesses: this.state.guesses + 1,
        successes: this.state.successes + 1
      });
    } else if (this.state.mysteryNote) {
      this.setState({
        guesses: this.state.guesses + 1
      });
    }
    this.playNote(note);
  }

  handleGetNewNote() {
    console.log("what");
    var mysteryNote = getRandomNote()
    this.setState({ mysteryNote: mysteryNote });
    this.playNote(mysteryNote);
  }

  handleReplayNote() {
    this.playNote(this.state.mysteryNote);
  }

  playNote(note) {
    console.log(note);
    if (this.state.note) {
      notes[this.state.note].stop();
    }

    this.setState({note: note});

    notes[note].play();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'powderblue', justifyContent:'center', flexDirection: "column"}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Music game! {this.state.note}</Text>
        </View>
        <View style={{flex: 2, backgroundColor: 'skyblue', flexDirection: "row"}}>
            {this.state.mysteryNote ?
              <TouchableHighlight onPress={(e) => this.handleReplayNote()} style={{
                flexDirection: "column",
                flex: 1,
                justifyContent: 'center',
                alignItems: 'stretch'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>Replay</Text>
              </TouchableHighlight> :
              <TouchableHighlight onPress={(e) => this.handleGetNewNote()} style={{
                flexDirection: "column",
                flex: 1,
                justifyContent: 'center',
                alignItems: 'stretch'}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>Get new note</Text>
              </TouchableHighlight>
            }
          <View style={{flexDirection: "column", flex: 1, justifyContent:'center', alignItems: 'stretch'}} >
            <Text style={{flex: 1, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Guesses: {this.state.guesses}</Text>
            <Text style={{flex: 1, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Successes: {this.state.successes}</Text>
            <Text style={{flex: 1, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Accuracy: {this.state.successes / this.state.guesses * 100}%</Text>
          </View>

        </View>
        <View style={{flex: 7, backgroundColor: 'steelblue', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}>
          {[...Array(6)].map((x, idx) =>
            <Row key={idx} rowNum={idx} handlePressButton={(a,b) => this._onPressButton(a,b)}/>
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

  noteName () {
    octave = (this.props.rowNum / 2 | 0) + 2;
    noteName = noteNames[(this.props.rowNum % 2) * 6 + this.props.idx];

    return noteName + octave;
  }

  color () {
    if (this.noteName().indexOf("b") !== -1) {
      return "grey";
    } else {
      return "white";
    }
  }

  render () {
    return (
      <TouchableHighlight
        key={this.props.idx}
        onPress={(e) => this.props.handlePressButton(e, this.noteName())}
        style={{borderWidth: 2, backgroundColor: this.color(), flexDirection: 'column', flex: 1}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
          {this.noteName()}
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

AppRegistry.registerComponent('AwesomeProject', () => MusicGameApp);
