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

var cards = [];
var cardIndex = 0;
var isLoadingCards = false;

var CardView = React.createClass({
  render: function() {
    return (
      <View style={styles.viewWord}>
        <Text style={styles.textEnWord}>
          {this.props.card.word}
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

    return this.props.card.explain;
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
      card: {
        word: '',
        explain: ''
      },
      isShowExplain: false,
    };
  },

  componentDidMount: function() {
    this._loadCards(this._nextWord);

  },

  _loadCards: function(callback) {
    isLoadingCards = true;

    var query = (new Parse.Query('Card')).descending('createAt');
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " words.");

        cards = [];
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id + ' - ' + object.get('word'));
          cards.push({ word: object.get('word'), explain: object.get('explain') });
        }

        isLoadingCards = false;
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
        <CardView card={this.state.card} isShowExplain={this.state.isShowExplain} />

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
      word: this.state.card,
      isShowExplain: true,
    });
  },

  _nextWord: function() {
    if (isLoadingCards) { return; };

    var len = cards.length;

    if (cardIndex == len) {
      cardIndex = 0;
      this._loadWords(this._nextWord);
      return;
    };

    this.setState({
      card: cards[cardIndex++],
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
