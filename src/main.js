import React, { Component } from 'react';
import {
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
import Icon from 'react-native-vector-icons/FontAwesome';

Sound.enableInSilenceMode(true);

const noteNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const notes = {};

function loadAllSounds (numberOfOctaves) {
  var path = 'acoustic_grand_piano-mp3/A2.mp3';

  [2, 3, 4, 5].forEach((octave) => {
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

loadAllSounds();

class MusicGameApp extends Component {
  constructor(props) {
    super(props);

    this.numberOfOctaves = 4;
    this.state = {
      note: null,
      mysteryNote: null,
      guesses: 0,
      successes: 0,
      streak: 0,
      showingMenu: false
    };
  }

  getRandomNote() {
    var num = Math.random() * (this.numberOfOctaves * 12) | 0;
    octave = (num / 12 | 0) + 2;
    noteName = noteNames[num % 12];

    return noteName + octave;
  }

  handleReset() {
    this.setState({
      note: null,
      mysteryNote: null,
      guesses: 0,
      successes: 0,
      streak: 0
    });
  }

  _onPressButton(event, note) {
    console.log('Pressed! ');
    this.setState({ note: note });

    if (note == this.state.mysteryNote) {
      console.log("Correct!");
      this.setState({
        mysteryNote: null,
        guesses: this.state.guesses + 1,
        successes: this.state.successes + 1,
        streak: this.state.streak + 1
      });
    } else if (this.state.mysteryNote) {
      this.setState({
        guesses: this.state.guesses + 1,
        streak: 0
      });
    }
    this.playNote(note);
  }

  handleGetNewNote() {
    console.log("what");
    var mysteryNote = this.getRandomNote()
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

  renderMainScreen () {
    return (
      <View style={{flex: 1}}>
        <View style={
              {
                flex: 1,
                justifyContent:'center',
                flexDirection: "row",
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <View style={{width: 30, alignItems: 'flex-end', flex: 0}}>
                <TouchableHighlight onPress={(e) => this.setState({showingMenu: true})} >
                  <Icon name="navicon" size={30} />
                </TouchableHighlight>
              </View>
              <Text style={[styles.text20, {flex: 2}]}>{this.state.successes / this.state.guesses * 100 | 0}%
              ({this.state.successes}/{this.state.guesses}), streak {this.state.streak}</Text>
            </View>
        <View style={{flex: 1, flexDirection: "row"}}>
            {this.state.mysteryNote ?
              <TouchableHighlight onPress={(e) => this.handleReplayNote()} style={{
                flexDirection: "column",
                flex: 1,
                justifyContent: 'center',
                alignItems: 'stretch'}}>
                <Text style={styles.bigButtonText}>Replay</Text>
              </TouchableHighlight> :
              <TouchableHighlight onPress={(e) => this.handleGetNewNote()} style={styles.bigButton}>
                <Text style={styles.bigButtonText}>Get new note</Text>
              </TouchableHighlight>
            }
        </View>
        <View style={
          {
            flex: 7,
            backgroundColor: 'steelblue',
            flexDirection: 'column',
            alignItems: 'stretch',
            borderWidth: 2,
            justifyContent: 'center'
          }}>
          {[...Array(this.numberOfOctaves * 2)].map((x, idx) =>
            <Row key={idx} rowNum={idx} handlePressButton={(a,b) => this._onPressButton(a,b)}/>
          )}
        </View>
      </View>
    );
  }

  renderMenu() {
    return <View><Text>lol</Text></View>;
  }

  render() {
    if (this.state.showingMenu) {
      return this.renderMenu();
    } else {
      return this.renderMainScreen();
    }
  }
}

class Row extends Component {
  render () {
    return (
      <View style={styles.row}>
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
        style={
          {
            borderWidth: 1,
            backgroundColor: this.color(),
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center'
          }}>
        <Text style={styles.text20}>
          {this.noteName()}
        </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  text15: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    fontFamily: "helvetica"
  },
  text20: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: "helvetica"
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "helvetica"
  },
  bigButtonText: {
    fontSize: 30,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "helvetica"
  },
  bigButton: {
    flexDirection: "column",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  }
});

export default MusicGameApp;
