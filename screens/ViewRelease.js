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

    const {image, uploads} = this.state.data;

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

          <View style={styles.content}>
            {uploads.map((item, index) => {
              if (!item.links || !item.links.length) {
                return null;
              }

              return (
                <View key={index} style={styles.linkContainer}>
                  <Text style={styles.linkName}>{item.name}</Text>

                  <View style={styles.links}>
                    {item.links.map((link, id) => {
                      return (
                        <TouchableOpacity
                          key={id}
                          onPress={() => Linking.openURL(link.download)}>
                          <View style={styles.linkButton}>
                            <Text style={styles.linkProvider}>{link.name}</Text>
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
  content: {
    padding: 8,
  },
  linkContainer: {
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 2,
    padding: 16,
    marginBottom: 8,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkName: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 12,
    fontSize: 12,
    lineHeight: 18,
    color: '#686868',
    marginBottom: 4,
  },
  linkButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
    justifyContent: 'center',
  },
  linkProvider: {
    color: '#333',
    fontSize: 12,
  },
});
