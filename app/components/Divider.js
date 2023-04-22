import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import AppColors from '../common/AppColor';

export default function Divider() {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: AppColors.divider,
        marginVertical: 10,
      }}
    />
  );
}
