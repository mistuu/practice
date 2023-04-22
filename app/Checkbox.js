import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyle from './common/AppStyle';
const Checkbox = props => {
  console.log(props);
  const iconName = props.isChecked
    ? 'checkbox-marked'
    : 'checkbox-blank-outline';
  return (
    <View style={styles.container}>
      <Pressable onPress={props.onPress}>
        <MaterialCommunityIcons name={iconName} size={24} color="#49c5b6" />
      </Pressable>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};

export default Checkbox;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: 100,
    marginTop: 8,
    marginBottom: 5,
  },
  title: {
    fontSize: 15,
    color: '#495057',
    marginLeft: 5,
    ...AppStyle.TextStyle.descNormal,
  },
});
