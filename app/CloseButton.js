import React from 'react';
import {Text, View, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppColors from './common/AppColor';

const CloseButton = ({color, hide}) => {
  return (
    <>
      <TouchableOpacity onPress={hide}>
        <MaterialCommunityIcons  name="close" size={25} color={color}  />
      </TouchableOpacity>
    </>
  );
};

export default CloseButton;
const styles = StyleSheet.create({
   close:{
    position: 'absolute', top: 8, right: 8, padding: 5
   }
})