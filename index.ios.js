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

var words = [
  {
    en: 'welcome',
    zh: '歡迎'
  },
  {
    en: 'hello',
    zh: '哈囉'
  },
  {
    en: 'world',
    zh: '世界'
  }
];

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
    this._nextWord();
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
    if (this.state.isShowExplain) {
      return;
    }

    return (
      <LongButton
        buttonText={'I don\'t know'}
        buttonStyle={styles.buttonCancel}
        callback={this._showExplain}
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
    var index = Math.floor(Math.random() * words.length);

    this.setState({
      word: words[index],
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
    fontSize: 46,
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
});

AppRegistry.registerComponent('WordsPractice', () => WordsPractice);
