/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

var WordsView = React.createClass({
  render: function() {
    return (
      <View style={styles.viewWord}>
        <Text style={styles.textWord}>
          {this.props.word}
        </Text>
      </View>
    );
  },
});

var words = ['welcome', 'hello', 'world'];

var WordsPractice = React.createClass({
  getInitialState: function() {
    return {
      word: '',
    };
  },

  componentDidMount: function() {
    this._nextWord();
  },

  render: function() {
    return (
      <View style={styles.container}>
        <WordsView word={this.state.word} />

        <View style={styles.buttonBlock}>
          {this._renderButton('I don\'t know', styles.buttonCancel, this._nextWord)}

          {this._renderButton('I see', styles.buttonOK, this._nextWord)}
        </View>
      </View>
    );
  },

  _renderButton: function(text, buttonStyle, callback) {
    return (
      <TouchableHighlight underlayColor='transparent'>
        <Text style={[styles.buttonBase, buttonStyle]} onPress={callback}>
          {text}
        </Text>
      </TouchableHighlight>
    );
  },

  _nextWord: function() {
    var index = Math.floor(Math.random() * words.length);

    this.setState({
      word: words[index],
    });
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  viewWord: {
    width: 300,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#F5EAEE',
    marginBottom: 30,
    justifyContent: 'center',
  },
  textWord: {
    fontSize: 46,
    textAlign: 'center',
  },
  buttonBlock: {
    flexDirection: 'row',
  },
  buttonBase: {
    textAlign: 'center',
    color: 'white',
    margin: 5,
    padding: 10,
    width: 100,
    borderRadius: 5,
  },
  buttonCancel: {
    backgroundColor: 'red',
  },
  buttonOK: {
    backgroundColor: 'green',
  },
});

AppRegistry.registerComponent('WordsPractice', () => WordsPractice);
