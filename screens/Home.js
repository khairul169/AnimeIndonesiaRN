import React, {Component, PureComponent} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../API';

const Header = () => {
  return (
    <View style={styles.header}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.headerTitle}>Anime Indonesia</Text>
      <View
        style={{
          backgroundColor: '#eee',
          borderRadius: 3,
          padding: 16,
          paddingVertical: 12,
          marginTop: 12,
        }}>
        <Text>Cari anime...</Text>
      </View>
    </View>
  );
};

const ScrollToTop = ({yScroll, flatList}) => {
  const bottom = yScroll.interpolate({
    inputRange: [500, 600],
    outputRange: [-50, 32],
    extrapolate: 'clamp',
  });
  const opacity = yScroll.interpolate({
    inputRange: [560, 600],
    outputRange: [0.0, 1.0],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom,
        right: 32,
        backgroundColor: '#fff',
        elevation: 3,
        width: 48,
        height: 48,
        borderRadius: 24,
        zIndex: 99,
        opacity,
      }}>
      <TouchableOpacity
        onPress={() => {
          flatList && flatList.scrollToIndex({animated: true, index: 0.0});
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <Icon name="md-arrow-round-up" style={{fontSize: 20, color: '#333'}} />
      </TouchableOpacity>
    </Animated.View>
  );
};

class CardItem extends PureComponent {
  render() {
    const {style, title, image, height} = this.props;
    const imgStyle = [styles.itemCardImage, {height: height || 150}];
    return (
      <View style={[styles.itemCard, style]}>
        {image ? <Image style={imgStyle} source={{uri: image}} /> : null}
        <Text style={styles.itemCardTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  }
}

class Home extends Component {
  static navigationOptions = props => ({
    title: 'Beranda',
  });

  constructor(props) {
    super(props);

    this.flatList = null;
    this.state = {
      isLoading: false,
      featured: [],
      releaseList: [],
      currentPage: 1,
      ongoing: [],
      yScroll: new Animated.Value(0),
    };
  }

  fetchReleaseList = async () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true});

    const result = await API.getLatest();
    this.setState({
      featured: result.featured,
      releaseList: result.latest,
      ongoing: result.ongoing,
      isLoading: false,
    });
  };

  fetchMoreRelease = async () => {
    if (this.state.isLoading) {
      return;
    }

    this.setState({isLoading: true});

    const page = this.state.currentPage + 1;
    const result = await API.getLatest(page);
    this.setState({
      releaseList: [...this.state.releaseList, ...result.latest],
      currentPage: page,
      isLoading: false,
    });
  };

  refreshItems() {
    this.setState({releaseList: [], currentPage: 1, isLoading: false});
    this.fetchReleaseList();
  }

  renderAnimeList({item, index}) {
    const style = [
      styles.featuredItem,
      {
        marginLeft: !index ? 16 : 0,
        marginRight: 16,
      },
    ];

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('ViewSeries', {
            title: item.name,
            id: item.id,
          })
        }>
        <CardItem
          image={item.image}
          title={item.name}
          style={style}
          height={200}
        />
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    this.refreshItems();
  }

  renderSections({item, index}) {
    if (index === 0) {
      return (
        <View>
          <Text style={[styles.sectionTitle, {marginTop: 16}]}>
            Featured Series
          </Text>
          <FlatList
            horizontal
            data={this.state.featured}
            renderItem={this.renderAnimeList.bind(this)}
            keyExtractor={(obj, id) => id.toString()}
            style={styles.featured}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    }

    if (index === 1) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Ongoing Series</Text>
          <FlatList
            horizontal
            data={this.state.ongoing}
            renderItem={this.renderAnimeList.bind(this)}
            keyExtractor={(obj, id) => id.toString()}
            style={styles.featured}
            showsHorizontalScrollIndicator={false}
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
      const cardStyle = {
        margin: 8,
        marginHorizontal: 16,
        borderColor: '#eee',
        borderBottomWidth: 1,
      };
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ViewRelease', {
              title,
              id: item.id,
            })
          }>
          <CardItem
            key={index}
            image={item.image}
            title={title}
            style={cardStyle}
          />
        </TouchableOpacity>
      );
    }
  }

  render() {
    const sections = [0, 1, 2];
    const onScrollEvent = Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            y: this.state.yScroll,
          },
        },
      },
    ]);

    return (
      <View style={styles.container}>
        <Header {...this.props} />
        <ScrollToTop yScroll={this.state.yScroll} flatList={this.flatList} />
        <FlatList
          ref={ref => {
            this.flatList = ref;
          }}
          style={styles.container}
          data={[...sections, ...this.state.releaseList]}
          renderItem={this.renderSections.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchMoreRelease}
          refreshing={this.state.isLoading}
          onRefresh={this.refreshItems.bind(this)}
          onEndReachedThreshold={0.5}
          onScroll={onScrollEvent}
          scrollEventThrottle={1}
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
    fontSize: 14,
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
    fontSize: 14,
    color: '#333',
    marginVertical: 12,
  },
  featured: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  featuredItem: {
    width: 128,
    margin: 8,
  },
});

export default Home;
