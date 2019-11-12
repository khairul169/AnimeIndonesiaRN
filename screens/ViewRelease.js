import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import API from '../API';

const getReleaseType = name => {
  let res = null;
  let bit = null;
  let ext = null;

  // res
  if (name.includes('360p')) {
    res = 360;
  }
  if (name.includes('480p')) {
    res = 480;
  }
  if (name.includes('720p')) {
    res = 720;
  }
  if (name.includes('1080p')) {
    res = 1080;
  }

  // bit rate
  if (name.includes('8bit')) {
    bit = 8;
  }
  if (name.includes('10bit')) {
    bit = 10;
  }

  // ext
  if (name.includes('.mkv')) {
    ext = 'MKV';
  }
  if (name.includes('.mp4')) {
    ext = 'MP4';
  }
  // batch
  if (name.toLowerCase().includes('batch')) {
    ext = 'Batch';
  }

  return res
    ? (ext ? ext + ' ' : '') + (bit ? `${res}p ${bit}bit` : `${res}p`)
    : name;
};

export default class ViewRelease extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'View Release'),
  });

  constructor(props) {
    super(props);

    this.releaseId = props.navigation.getParam('id', 0);
    this.state = {
      isLoading: false,
      data: null,
    };
  }

  fetchData = async () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true});
    const data = await API.getReleaseById(this.releaseId);
    this.setState({data, isLoading: false});
  };

  refresh = () => {
    this.fetchData();
  };

  componentDidMount() {
    this.refresh();
  }

  render() {
    if (!this.state.data) {
      const loadingStyle = {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      };
      return (
        <View style={loadingStyle}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    const {image, title, uploads} = this.state.data;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.refresh}
            />
          }>
          <Image style={styles.previewImage} source={{uri: image}} />

          <Text style={styles.title}>{title}</Text>

          <View style={styles.linkContainer}>
            {uploads.map((item, index) => {
              if (!item.links || !item.links.length) {
                return null;
              }

              return (
                <View key={index} style={styles.linkCard}>
                  <Text style={styles.linkTitle}>
                    {getReleaseType(item.name)}
                  </Text>

                  <View style={styles.links}>
                    {item.links.map((link, id) => {
                      return (
                        <TouchableOpacity
                          key={id}
                          onPress={() => Linking.openURL(link.download)}>
                          <View style={styles.linkButton}>
                            <Text style={styles.linkName}>{link.name}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewImage: {
    height: 256,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    color: '#333',
    padding: 16,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  linkContainer: {
    padding: 16,
    paddingTop: 0,
  },
  linkCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  linkTitle: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 3,
    padding: 16,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    marginTop: 8,
    justifyContent: 'center',
  },
  linkName: {
    color: '#fff',
    fontSize: 12,
  },
});
