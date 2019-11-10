import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

const CardItem = ({style, title, image}) => (
  <View style={[styles.itemCard, style]}>
    {image ? (
      <Image style={styles.itemCardImage} source={{uri: image}} />
    ) : null}
    <Text style={styles.itemCardTitle}>{title}</Text>
  </View>
);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      releaseList: [],
      currentPage: 1,
      isLoading: false,
    };
  }

  fetchReleaseList = async () => {
    try {
      this.setState({isLoading: true});
      const response = await fetch('http://awsubs-api.khairul.my.id/');
      const data = await response.json();
      this.setState({releaseList: data.result, isLoading: false});
    } catch (error) {
      console.log(error);
    }
  };

  fetchMoreRelease = async () => {
    try {
      this.setState({isLoading: true});
      const response = await fetch(
        'http://awsubs-api.khairul.my.id/page/' + this.state.currentPage + 1,
      );
      const data = await response.json();
      this.setState({
        releaseList: [...this.state.releaseList, ...data.result],
        currentPage: this.state.currentPage + 1,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  refreshItems() {
    this.setState({releaseList: [], currentPage: 1, isLoading: false});
    this.fetchReleaseList();
  }

  renderAnimeList({item, index}) {
    let title = item.title.substr(
      0,
      item.title.indexOf('Subtitle') || item.title.length,
    );
    title = title.length > 26 ? title.substr(0, 26) + '..' : title;

    const style = [
      styles.featuredItem,
      {
        marginLeft: !index ? 16 : 8,
        marginRight: index === this.state.releaseList.length - 1 ? 16 : 8,
      },
    ];

    return <CardItem image={item.image} title={title} style={style} />;
  }

  componentDidMount() {
    this.refreshItems();
  }

  renderSections({item, index}) {
    if (index === 0) {
      return (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Anime Indonesia</Text>
        </View>
      );
    }

    if (index === 1) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Featured Series</Text>
          <FlatList
            horizontal
            data={this.state.releaseList}
            renderItem={this.renderAnimeList.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            style={styles.featured}
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            snapToInterval={256}
            snapToAlignment="center"
          />
        </View>
      );
    }

    if (index === 2) {
      return <Text style={styles.sectionTitle}>Rilisan Terbaru</Text>;
    }

    if (index >= 3) {
      const title = item.title.substr(
        0,
        item.title.indexOf('Subtitle') || item.title.length,
      );
      return (
        <CardItem
          key={index}
          image={item.image}
          title={title}
          style={{margin: 8, marginHorizontal: 16}}
        />
      );
    }
  }

  render() {
    const sections = [0, 1, 2];

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <FlatList
          style={styles.container}
          data={[...sections, ...this.state.releaseList]}
          renderItem={this.renderSections.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchMoreRelease}
          refreshing={this.state.isLoading}
          onRefresh={this.refreshItems.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#111',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#686868',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
  },
  itemCardImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemCardTitle: {
    fontSize: 16,
    color: '#111',
    marginVertical: 12,
  },
  featured: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  featuredItem: {
    width: 256,
    margin: 8,
  },
});
