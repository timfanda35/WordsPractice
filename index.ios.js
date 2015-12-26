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

var cardObjects = [];
var cardIndex = 0;
var isLoadingCards = false;
var REMIND_DATE_REMEMBER_INTERVAL = 7;
var REMIND_DATE_FORGET_INTERVAL = 3;

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
    this._loadCards(this._nextCard);

  },

  _loadCards: function(callback) {
    isLoadingCards = true;

    var noCardCallback = this._renderNoCard;

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 1);

    var query = new Parse.Query('Card');
    query.lessThanOrEqualTo("remindDate", today);
    query.descending('updatedAt');
    query.descending('remindDate');

    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " words.");

        isLoadingCards = false;
        if (results.length > 0) {
          cardObjects = results;
          callback();
        }
        else {
          noCardCallback();
        }
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
        noCardCallback();
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
        callback={this._remember}
      >
      </LongButton>
    );
  },

  _nextCard: function() {
    var len = cardObjects.length;

    if (cardIndex == len) {
      cardIndex = 0;
      this._loadCards(this._nextCard);
      return;
    };

    var cardObject = cardObjects[cardIndex];
    var card = { word: cardObject.get('word'), explain: cardObject.get('explain') }

    this.setState({
      card: card,
      isShowExplain: false,
    });
  },

  _showExplain: function() {
    if (isLoadingCards) { return; };

    if(cardObjects.length > 0) {
      this._setRemindDate(REMIND_DATE_FORGET_INTERVAL);
    }

    this.setState({
      card: this.state.card,
      isShowExplain: true,
    });
  },

  _remember: function() {
    if (isLoadingCards) { return; };

    if(cardObjects.length > 0 && !this.state.isShowExplain) {
      this._setRemindDate(REMIND_DATE_REMEMBER_INTERVAL);
    }

    this._nextCard();
  },

  _setRemindDate: function(day) {
    var remindDate = new Date();
    remindDate.setHours(0, 0, 0, 0);
    remindDate.setDate(remindDate.getDate() + day);

    var cardObject = cardObjects[cardIndex++];
    cardObject.set("remindDate", remindDate);
    cardObject.save();
  },

  _renderNoCard: function() {
    var card = { word: "NO WORD", explain: "沒有可背的單字" }
    this.setState({
      card: card,
      isShowExplain: true,
    });
  }
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
