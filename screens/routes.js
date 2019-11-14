import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './Home';
import AnimeList from './AnimeList';
import About from './About';
import ViewRelease from './ViewRelease';
import ViewSeries from './ViewSeries';

const HomeTabs = createBottomTabNavigator(
  {
    Home,
    AnimeList,
    About,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;

        switch (routeName) {
          case 'Home':
            iconName = 'ios-home';
            break;
          case 'AnimeList':
            iconName = 'md-list';
            break;
          case 'About':
            iconName = 'ios-information-circle-outline';
            break;
        }

        return <Icon name={iconName} size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      style: {
        height: 52,
        paddingVertical: 4,
        backgroundColor: '#fff',
      },
      activeTintColor: '#388E3C',
      inactiveTintColor: '#333',
    },
  },
);

HomeTabs.navigationOptions = {
  header: null,
};

const routes = createStackNavigator(
  {
    Home: HomeTabs,
    ViewRelease,
    ViewSeries,
  },
  {
    headerLayoutPreset: 'center',
  },
);

export default createAppContainer(routes);
