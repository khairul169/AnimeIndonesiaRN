import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Button = ({onPress, title, style, icon}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    {icon ? <Icon name={icon} style={styles.buttonIcon} /> : null}
    <Text style={styles.buttonTitle}>{title}</Text>
  </TouchableOpacity>
);

export default class About extends Component {
  static navigationOptions = {
    title: 'Tentang',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.appName}>Anime Indonesia</Text>
        <Text style={styles.appDesc}>
          Proyek ini bersumberkan terbuka dan dapat dikembangkan oleh siapa
          saja.
          {'\n\n'}Disclaimer:{'\n'}Tujuan awal dari proyek ini adalah untuk
          mencoba scrapping sebuah website fansub anime dan tidak bermaksud
          untuk mendapatkan keuntungan.
        </Text>
        <Button
          style={{marginTop: 32}}
          icon="logo-github"
          title="Fork on Github"
          onPress={() =>
            Linking.openURL('https://github.com/khairul169/AnimeIndonesiaRN')
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  appDesc: {
    fontSize: 14,
    color: '#686868',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#43A047',
    padding: 24,
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: 'row',
  },
  buttonTitle: {
    fontSize: 14,
    color: '#fff',
  },
  buttonIcon: {
    fontSize: 20,
    color: '#fff',
    marginRight: 12,
  },
});
