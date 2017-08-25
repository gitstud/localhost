import { StackNavigator } from 'react-navigation';
import type, { NavigationComponent } from 'react-navigation/src/TypeDefinition';

import Home from './Screens/Home';
import Portal from './Screens/Portal';

export const createRootNavigator: NavigationComponent = () =>
  StackNavigator(
    {
      Home: {
        screen: Home,
        navigationOptions: {
          gestureEnabled: false,
          title: 'My Localhosts',
        },
      },
      Portal: {
        screen: Portal,
        navigationOptions: ({navigation}) => ({
          title: `${navigation.state.params.name}`,
          gestureEnabled: false,
        }),
      }
    },
    {
      mode: 'modal',
      initialRouteName: 'Home'
    }
  )
