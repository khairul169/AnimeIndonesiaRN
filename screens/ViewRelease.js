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

export default class ViewRelease extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'Lihat Rilisan'),
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

    try {
      this.setState({isLoading: true});
      const response = await fetch(
        'http://awsubs-api.khairul.my.id/release/' + this.releaseId,
      );
      const data = await response.json();
      this.setState({data: data.result, isLoading: false});
    } catch (error) {
      console.log(error);
    }
  };

  refresh = () => {
    this.fetchData();
  };

  componentDidMount() {
    this.refresh();
  }

  render() {
    if (!this.state.data) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    const {image, uploads} = this.state.data;

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this.refresh}
          />
        }>
        <Image
          style={{height: 256, resizeMode: 'cover'}}
          source={{uri: image}}
        />

        <View style={{padding: 8}}>
          {uploads.map((item, index) => {
            if (!item.links || !item.links.length) {
              return null;
            }

            return (
              <View
                key={index}
                style={{
                  backgroundColor: '#fff',
                  elevation: 3,
                  borderRadius: 2,
                  padding: 16,
                  marginBottom: 8,
                }}>
                <Text
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                    paddingBottom: 12,
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#686868',
                    marginBottom: 4,
                  }}>
                  {item.name}
                </Text>

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {item.links.map((link, id) => {
                    return (
                      <TouchableOpacity
                        key={id}
                        onPress={() => Linking.openURL(link.download)}>
                        <View
                          style={{
                            backgroundColor: '#ddd',
                            borderRadius: 3,
                            paddingHorizontal: 16,
                            height: 32,
                            borderRadius: 16,
                            marginRight: 8,
                            marginTop: 8,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#333',
                              fontSize: 12,
                            }}>
                            {link.name}
                          </Text>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
