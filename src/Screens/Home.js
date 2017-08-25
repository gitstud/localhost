import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
} from 'react-native';


const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'ghostwhite',
  },
  URLcontainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  url: {
    fontSize: 16,
    color: 'snow',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  errorLabel: {
    fontWeight: '500',
    color: 'red',
    width: '100%',
    textAlign: 'center',
  },
  directions: {
    paddingTop: 15,
    paddingBottom: 10,
    fontWeight: '500',
    fontSize: 18,
    color: 'royalblue',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  delete: {
    backgroundColor: 'red',
    color: 'white',
    paddingTop: 17,
    paddingBottom: 17,
    paddingRight: 20,
    paddingLeft: 20,
    fontWeight: '700',
    fontSize: 16,
  },
  addNew: {
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
    backgroundColor: 'royalblue',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    marginTop: 15,
  },
  inputContainer: {
    width: '100%',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'white',
  },
  addNewContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  }
});

export default class Home extends Component {

  state = {
    port: '',
    extension: '',
    ipAdd: '',
    addresses: [],
    name: '',
    error: false,
    active: 'lightcoral',
    addNew: false,
    colors: ['lightcoral', 'lightsalmon', 'khaki', 'lightgreen', 'lightblue', 'plum']
  }

  componentDidMount() {
    AsyncStorage.getItem('addresses', (err, res) => {
      if (res) {
        this.setState({ addresses: JSON.parse(res) });
      }
    });
  }

  deleteItem(i) {
    const { addresses } = this.state;
    let newAddress = [...addresses];
    newAddress.splice(i, 1);
    AsyncStorage.setItem('addresses', JSON.stringify(newAddress), () => {
      AsyncStorage.getItem('addresses', (err, res) => {
        this.setState({
          addresses: JSON.parse(res),
        });
      });
    });
  }

  handleNewPress = () => {
    const { port, extension, ipAdd, name, addresses, active } = this.state;

    if (name.length < 1) {
      this.setState({ error: 'Please include a name for this address'});
      return;
    }

    if (ipAdd.length < 1) {
      this.setState({ error: 'Please include the IP address'});
      return;
    }

    const { navigate } = this.props.navigation;
    let newAddress = [...addresses, {name, port, extension, ipAdd, color: active}];

    AsyncStorage.setItem('addresses', JSON.stringify(newAddress), () => {
      AsyncStorage.getItem('addresses', (err, res) => {
        this.setState({
          addresses: JSON.parse(res),
          name: '',
          port: '',
          extension: '',
          ipAdd: '',
          error: false,
          active: 'lightcoral',
          addNew: false,
        });
      });
    });

    navigate('Portal', {port, extension, ipAdd, name});
  }

  handleCancelPress = () => {
    this.setState({
      name: '',
      port: '',
      extension: '',
      ipAdd: '',
      error: false,
      active: 'lightcoral',
      addNew: false,
    });
  }

  handleSavedPress(value) {
    const { port, extension, ipAdd, name, addresses } = value;
    const { navigate } = this.props.navigation;
    navigate('Portal', {port, extension, ipAdd, name});
  }

  render() {
    const { port, extension, ipAdd, name, addresses, error, colors, active, addNew } = this.state;

    return (
      <ScrollView style={styles.container}>
        {addNew && (
          <View style={styles.addNewContainer}>
            <Text style={styles.directions}>Give this address a name:</Text>
            <TextInput
              style={styles.inputContainer}
              value={name}
              placeholder="Name"
              onChangeText={(value: string) => this.setState({ name: value })}
              autoCorrect={false}
            />
            <Text style={styles.directions}>Enter IP address number:</Text>
            <TextInput
              style={styles.inputContainer}
              value={ipAdd}
              placeholder="127.0.0.1"
              onChangeText={(value: string) => this.setState({ ipAdd: value })}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.directions}>Enter port number:</Text>
            <TextInput
              style={styles.inputContainer}
              value={port}
              placeholder="port number"
              onChangeText={(value: string) => this.setState({ port: value })}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.directions}>Enter url extension:</Text>
            <TextInput
              style={styles.inputContainer}
              value={extension}
              placeholder="Optional: route/index.html"
              onChangeText={(value: string) => this.setState({ extension: value })}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.directions}>Choose a color:</Text>
            <View style={styles.colorContainer}>
              {colors.map((color, i) => (
                <TouchableOpacity key={i} onPress={() => {this.setState({ active: color })}}>
                  {color === active && <View style={{width: 20, height: 20, backgroundColor: color, borderBottomWidth: 2, borderBottomColor: 'black'}} />}
                  {color !== active && <View style={{width: 20, height: 20, backgroundColor: color}} />}
                </TouchableOpacity>
              ))}
            </View>

            {error && <Text style={styles.errorLabel}>{error}</Text>}
            <View>
              <Button
                onPress={this.handleNewPress}
                title="Go"
                color="green"
              />
              <Button
                onPress={this.handleCancelPress}
                title="Cancel"
                color="red"
              />
            </View>
          </View>
        )}
        {!addNew && (
          <View>
            <TouchableOpacity onPress={() => this.setState({ addNew: true })}>
              <Text style={styles.addNew}>Add New Address</Text>
            </TouchableOpacity>
            <View>
              {addresses.map((value, i) => {
                let url = 'http://' + value.ipAdd;
                if (value.port.length > 0) {
                  if (port[0] === ':') {
                    url = `http://${value.ipAdd}${value.port}`;
                  } else {
                    url = `http://${value.ipAdd}:${value.port}`;
                  }
                }
                if (value.extension.length > 0) {
                  if (extension[0] === '/') {
                    url = `http://${value.ipAdd}:${value.port}${value.extension}`;
                  } else {
                    url = `http://${value.ipAdd}:${value.port}/${value.extension}`;
                  }
                }
                return (
                  <View key={i} style={styles.URLcontainer}>
                    <View
                      style={{
                        backgroundColor: value.color,
                        paddingLeft: 10,
                        paddingTop: 10,
                        paddingRight: 10,
                        width: 280,
                      }}
                    >
                      <TouchableOpacity key={i} onPress={() => this.handleSavedPress(value)}>
                        <Text style={styles.name}>{value.name}</Text>
                        <Text
                          style={styles.url}
                          selectable={true}
                          numberOfLines={1}
                          ellipsizeMode="clip"
                        >{url}</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.deleteItem(i)}>
                      <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
              )})}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}
