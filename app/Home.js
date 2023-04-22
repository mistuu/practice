import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome!</Text>
      <Text style={styles.boldtext}>Get started in 3 easy steps</Text>

      <View style={styles.card}>
        <Icon name="teacher" color="#49c5b6" size={50} />
        <Text style={styles.text}>Add Staff</Text>
      </View>
      <View style={styles.card}>
        <Icon name="user-add" color="#49c5b6" size={50} />
        <Text style={styles.text}>Add Staff</Text>
      </View>
      <View style={styles.card}>
        <Icon name="chalkboard-teacher" color="#49c5b6" size={50} />
        <Text style={styles.text}>Add Staff</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#dddddd',
    color: 'black',
  },
  buttonStyle: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  head: {height: 40, backgroundColor: '#f1f8ff', color: 'black'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa', color: 'black'},
  row: {height: 28},
  text: {textAlign: 'center', color: 'grey'},
  boldtext: {fontWeight: 'bold', color: '#000', textAlign: 'center'},
  card: {
    backgroundColor: '#f1f8ff',
    margin: 30,
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Home;
