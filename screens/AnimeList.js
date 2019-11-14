import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';

export default class AnimeList extends Component {
  static navigationOptions = props => ({
    title: 'Daftar Anime',
  });

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
