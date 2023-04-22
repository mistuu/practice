import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Overlay} from 'react-native-elements';
import AppColors from '../common/AppColor';

function CustomProgressBar(visible) {
  return (
    <Overlay isVisible={visible}
    overlayStyle={{ backgroundColor: "transparent", elevation: 0,  }}
    >
      <ActivityIndicator
        size="large"
        color={AppColors.colorPrimary}
        style={{alignSelf: 'center'}}
      />
    </Overlay>
  );
}

export default {CustomProgressBar};
