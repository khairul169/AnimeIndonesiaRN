import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}>
        <Image
          source={require('../assets/app_icon.png')}
          style={styles.appIcon}
        />
        <Text style={styles.appName}>Anime Indonesia</Text>
        <Text style={styles.appDesc}>
          Proyek ini bersumberkan terbuka dan dapat dikembangkan oleh siapa
          saja.
        </Text>
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Disclaimer:{'\n'}Tujuan awal dari proyek ini adalah untuk mencoba
            scrapping sebuah website fansub anime dan tidak bermaksud untuk
            mendapatkan keuntungan.
          </Text>
        </View>
        <Button
          style={{marginTop: 32}}
          icon="logo-github"
          title="Fork on Github"
          onPress={() =>
            Linking.openURL('https://github.com/khairul169/AnimeIndonesiaRN')
          }
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  appIcon: {
    width: 128,
    height: 128,
    marginTop: 32,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  appDesc: {
    fontSize: 14,
    color: '#686868',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 5,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#686868',
    lineHeight: 18,
    textAlign: 'center',
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
