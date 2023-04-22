import React from 'react';
import {View, Text, Image, StatusBar, SafeAreaView} from 'react-native';
import AppStyle from './common/AppStyle';
import AppColors from './common/AppColor';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Header = ({toolbarTitle}) => {
  return (
    <View
      style={{

        
        position:'relative',
        zIndex:5,
        justifyContent:'center',
        height:
            Platform.OS === 'ios' && DeviceInfo.hasNotch()
              ? 68
              : Platform.OS === 'ios' && !DeviceInfo.hasNotch()
              ? 62
              : 56,
          // paddingStart: 6,
          // paddingEnd: 16,
          paddingHorizontal: 15,
          backgroundColor: AppColors.white,
          elevation: 1,
          zIndex:1,

      }}>
      <View>{toolbarTitle}</View>
    </View>
  );
};

export default Header;

export const ParentHeaderHome = ({toolbarTitle}) => {
  return (
    <View
      style={{
        position:'relative',
        zIndex:5,
        justifyContent:'center',
        height:
            Platform.OS === 'ios' && DeviceInfo.hasNotch()
              ? 68
              : Platform.OS === 'ios' && !DeviceInfo.hasNotch()
              ? 62
              : 56,
          paddingHorizontal: 15,
          backgroundColor: AppColors.white,
          elevation: 1,
          zIndex:1,

      }}>
      <View style={{alignItems:'center', flexDirection:'row', justifyContent:'space-between',}}>
      <View style={{justifyContent:'flex-end', alignItems:'center', marginLeft:30, flexGrow:1,}}>
        <Text style={{...AppStyle.TextStyle.title, fontSize:22, color:AppColors.primaryTextColor}}>{toolbarTitle}</Text>
      </View>
      <View style={{justifyContent:'flex-end', flexDirection:'row', flexShrink:1,}}>
        <TouchableOpacity><MaterialIcons name="notifications-none" size={25} style={{marginRight:10}}/></TouchableOpacity>
        <TouchableOpacity><MaterialCommunityIcons name="account-circle-outline" size={25} style={{marginLeft:5}}/></TouchableOpacity>
      </View>
      </View>
    </View>
  );
};


