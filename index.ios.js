/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Parse = require('parse/react-native');
var Environment = require('./environment.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;

Parse.initialize(
  Environment.PARSE_APPLICATION_ID,
  Environment.PARSE_JAVASCRIPT_KEY
);

var words = [];
var wordIndex = 0;

var WordsView = React.createClass({
  render: function() {
    return (
      <View style={styles.viewWord}>
        <Text style={styles.textEnWord}>
          {this.props.word.en}
        </Text>

        <Text style={styles.textZhWord}>
          {this._getZhExplain()}
        </Text>
      </View>
    );
  },

  _getZhExplain: function() {
    if (!this.props.isShowExplain) {
      return ' ';
    };

    return this.props.word.zh;
  },
});

var LongButton = React.createClass({
  render: function() {
    return (
      <TouchableHighlight underlayColor='transparent'>
        <Text style={[styles.buttonBase, this.props.buttonStyle]} onPress={this.props.callback}>
          {this.props.buttonText}
        </Text>
      </TouchableHighlight>
    );
  },
});

var WordsPractice = React.createClass({
  getInitialState: function() {
    return {
      word: {
        en: '',
        zh: ''
      },
      isShowExplain: false,
    };
  },

  componentDidMount: function() {
    this._loadWords(this._nextWord);

  },

  _loadWords: function(callback) {
    var query = (new Parse.Query('Word')).descending('createAt');
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " words.");

        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id + ' - ' + object.get('word'));
          words.push({ en: object.get('word'), zh: object.get('explain') });
        }

        callback();
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },

  render: function() {
    return (
      <View style={styles.container}>
        <WordsView word={this.state.word} isShowExplain={this.state.isShowExplain} />

        <View style={styles.buttonBlock}>
          {this._renderCancelButton()}

          {this._renderOKButton()}
        </View>
      </View>
    );
  },

  _renderCancelButton: function() {
    var btnStyle = [styles.buttonCancel];
    if (this.state.isShowExplain) {
      btnStyle.push(styles.buttonDisable);
    }

    return (
      <LongButton
        buttonText={'I don\'t know'}
        buttonStyle={btnStyle}
        callback={this._showExplain}
        disable={true}
      >
      </LongButton>
    );
  },

  _renderOKButton: function() {
    return (
      <LongButton
        buttonText={'I see'}
        buttonStyle={styles.buttonOK}
        callback={this._nextWord}
      >
      </LongButton>
    );
  },

  _showExplain: function() {
    this.setState({
      word: this.state.word,
      isShowExplain: true,
    });
  },

  _nextWord: function() {
    var len = words.length;

    if (wordIndex == len) {
      wordIndex = 0;
      this._loadWords(this._nextWord);
      return;
    };

    this.setState({
      word: words[wordIndex++],
      isShowExplain: false,
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
  textEnWord: {
    fontSize: 40,
    textAlign: 'center',
  },
  textZhWord: {
    fontSize: 24,
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
  },
  buttonCancel: {
    backgroundColor: 'red',
  },
  buttonOK: {
    backgroundColor: 'green',
  },
  buttonDisable: {
    backgroundColor: 'gray',
  },
});

AppRegistry.registerComponent('WordsPractice', () => WordsPractice);
