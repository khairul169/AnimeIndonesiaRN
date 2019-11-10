import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Home';
import ViewRelease from './ViewRelease';

const routes = createStackNavigator({
  Home,
  ViewRelease,
});

export default createAppContainer(routes);
