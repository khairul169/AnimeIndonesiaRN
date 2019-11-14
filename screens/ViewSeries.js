import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import API from '../API';
import Icon from 'react-native-vector-icons/Ionicons';

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

export default class ViewSeries extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'View Series'),
    headerTitleStyle: {
      fontSize: 16,
    },
  });

  constructor(props) {
    super(props);

    this.seriesId = props.navigation.getParam('id', 0);
    this.state = {
      isLoading: false,
      data: null,
      favorite: false,
    };
  }

  fetchData = async () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true});
    const data = await API.getSeriesById(this.seriesId);
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

    const {image, title, info, items} = this.state.data;

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
          <View style={styles.topBar}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={{
                padding: 16,
                paddingHorizontal: 24,
                alignSelf: 'stretch',
                justifyContent: 'center',
              }}
              onPress={() => this.setState({favorite: !this.state.favorite})}>
              <Icon
                name={this.state.favorite ? 'md-heart' : 'md-heart-empty'}
                size={24}
                color={this.state.favorite ? '#e53935' : '#333'}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderColor: '#eee',
              borderBottomWidth: 1,
              padding: 24,
              paddingVertical: 16,
            }}>
            {Object.keys(info).map((key, index) => {
              return (
                <View
                  key={index}
                  style={{flexDirection: 'row', marginBottom: 8}}>
                  <Text style={{fontWeight: 'bold', width: '30%'}}>
                    {capitalize(key)}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      lineHeight: 20,
                      marginLeft: 16,
                    }}>
                    {info[key]}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text
            style={{
              borderColor: '#eee',
              borderBottomWidth: 1,
              padding: 24,
              paddingVertical: 12,
              marginTop: 24,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Episodes
          </Text>

          <View style={{marginBottom: 24}}>
            {items.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderColor: '#eee',
                    borderBottomWidth: 1,
                    padding: 24,
                    paddingVertical: 16,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ViewRelease', {
                      title: item.title,
                      id: item.id,
                    })
                  }>
                  <Text style={{fontSize: 14, color: '#111'}}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
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
    height: 300,
    resizeMode: 'cover',
  },
  topBar: {
    flexDirection: 'row',
    borderColor: '#eee',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
    padding: 16,
    paddingLeft: 24,
    flex: 1,
  },
});
