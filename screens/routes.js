import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Home';

const routes = createStackNavigator({
  Home,
});

export default createAppContainer(routes);
