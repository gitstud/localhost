import React, { Component } from 'react';
import type, { NavigationComponent } from 'react-navigation/src/TypeDefinition';
import { createRootNavigator } from './src/router';

export default class App extends Component {
  render() {
    const Layout: NavigationComponent = createRootNavigator();
    return <Layout />
  }
}
