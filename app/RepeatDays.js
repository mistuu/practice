import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyle from './common/AppStyle';
const RepeatDays = props => {
  console.log(props);
  const [pressed, setPressed] = useState('');
  const iconName = props.isDayChecked ? 'circle' : 'circle-outline';
  return (
    <View style={styles.container}>
      <Pressable onPress={props.onPress}>
        <MaterialCommunityIcons
          name={iconName}
          size={35}
          color="#49c5b6"
          style={{
            borderRadius: 100,
            marginRight: 7,
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        />
        <Text style={styles.title}>{props.title}</Text>
      </Pressable>
    </View>
  );
};

export default RepeatDays;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    borderRadius: 100,
  },
  title: {
    fontSize: 14,
    color: '#495057',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 8,
    left: 0,
    textAlignVertical: 'center',
    textAlign: 'center',
    ...AppStyle.TextStyle.descNormal,
  },
  circulercheckbox: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  chcekboxLetter: {
    color: '#4f4e4ee7',
  },
});
