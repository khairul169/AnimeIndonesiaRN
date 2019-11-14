import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../API';

const Header = ({searchQuery, onSearchChange, onSearch, onClear}) => {
  return (
    <View style={{padding: 16}}>
      <View
        style={{
          backgroundColor: '#eee',
          borderRadius: 3,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextInput
          value={searchQuery}
          style={{padding: 16, paddingVertical: 8, flex: 1}}
          onChangeText={text => onSearchChange && onSearchChange(text)}
          placeholder="Filter anime.."
          onSubmitEditing={() => onSearch && onSearch()}
        />
        {!searchQuery ? (
          <Icon
            name="ios-search"
            size={20}
            color="#333"
            style={{marginRight: 16}}
          />
        ) : (
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onClear && onClear()}>
            <Icon name="ios-close-circle-outline" size={20} color="#333" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default class AnimeList extends Component {
  static navigationOptions = {
    title: 'Daftar Anime',
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      page: 1,
      data: null,
      hasError: false,
      searchQuery: '',
    };
  }

  onRefresh = async () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true});
    const data = await API.getAnimeList(1, this.state.searchQuery);
    this.setState({data, isLoading: false, page: 1, hasError: false});
  };

  componentDidMount() {
    this.onRefresh();
  }

  onEndReached = async () => {
    if (this.state.isLoading || this.state.hasError) {
      return;
    }

    this.setState({isLoading: true});
    const page = this.state.page + 1;
    const data = await API.getAnimeList(page, this.state.searchQuery);

    if (!data) {
      this.setState({hasError: true, isLoading: false});
    } else {
      this.setState({
        data: [...this.state.data, ...data],
        isLoading: false,
        page,
      });
    }
  };

  renderItem({item, index}) {
    return (
      <TouchableOpacity
        style={{
          padding: 16,
          borderColor: '#eee',
          borderTopWidth: 1,
          flexDirection: 'row',
        }}
        onPress={() =>
          this.props.navigation.navigate('ViewSeries', {
            title: item.title,
            id: item.id,
          })
        }>
        <Image
          source={{uri: item.image}}
          style={{
            width: 64,
            height: 64,
            resizeMode: 'cover',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        />
        <View style={{flex: 1, marginLeft: 16}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#686868',
              marginTop: 6,
              lineHeight: 20,
            }}>
            {item.genres.map(val => val.name).join(', ')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          searchQuery={this.state.searchQuery}
          onSearchChange={text => this.setState({searchQuery: text})}
          onSearch={this.onRefresh}
          onClear={() => {
            this.setState({searchQuery: ''});
            this.state.searchQuery = '';
            this.onRefresh();
          }}
        />
        <FlatList
          ref={ref => {
            this.flatList = ref;
          }}
          style={{flex: 1}}
          data={this.state.data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={this.state.isLoading}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
