import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppColors from './common/AppColor';

const data = [
  {label: 'Staff / Teacher', value: '1'},
  {label: 'Parent', value: '2'},
];

const DropdownComponent = ({role, rollIdError, setRole}) => {
  const renderItem = item => {
    console.log(rollIdError);
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.role === role && ''}
        {/* <Text>{role == 0 && <>{rollIdError} </> }</Text> */}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Who you are"
      value={role}
      onChange={item => {
        console.log(item.value);
        setRole(item.value);
      }}
      renderLeftIcon={() => ''}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 10,
    height: 50,
    backgroundColor: AppColors.borderColor,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppColors.accent,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
    fontSize: 14,
  },
  textItem: {
    // flex: 1,
    fontSize: 15,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 15,
    color: AppColors.textPrimary,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#000',
  },
});
