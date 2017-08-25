import React, { Component } from 'react';
import {
  View,
  Text,
  WebView,
} from 'react-native';

export default class Portal extends Component {

  state={
    error: false,
  }

  render() {
    const { port, extension, ipAdd } = this.props.navigation.state.params;
    let url = 'http://' + ipAdd;
    if (port.length > 0) {
      if (port[0] === ':') {
        url = `http://${ipAdd}${port}`;
      } else {
        url = `http://${ipAdd}:${port}`;
      }
    }
    if (extension.length > 0) {
      if (extension[0] === '/') {
        url = `http://${ipAdd}:${port}${extension}`;
      } else {
        url = `http://${ipAdd}:${port}/${extension}`;
      }
    }

    if (this.state.error) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>There was an error loading this page</Text>
          <Text style={{fontSize: 20}}>Check the address and make sure that</Text>
          <Text style={{fontSize: 20}}>you local machine is running on the same</Text>
          <Text style={{fontSize: 20}}>ip address, port number, and extension</Text>
          <Text style={{fontSize: 20, marginTop: 15, color: 'red'}}>{url}</Text>
        </View>
      )
    }

    return (
      <WebView
        source={{uri: url}}
        style={{
          flex: 1,
          height: 300,
          width: '100%',
        }}
        startInLoadingState={true}
        onError={() => this.setState({ error: true })}
      />
    )
  }
}
