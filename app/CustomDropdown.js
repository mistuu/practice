import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import ToolBar from './components/ToolBar';
import AppColors from './common/AppColor';
import {TextInput, Button} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';

import Util from './utils/Util';
import ApiCalling from './network/ApiCalling';
import BASE_URL from './common/Config';
import ProgressDialog from './components/ProgressDialog';

import * as ImagePicker from 'react-native-image-picker';
import AppStyle from './common/AppStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons2 from 'react-native-vector-icons/Fontisto';
import Colors from './common/Colors';

const data = [
  {id: 1, label: 'Parent A'},
  {id: 2, label: 'Parent B'},
];

const CustomDropdown = ({icon, title, data,selected,setSelected,isAct,handlePickupInfo}) => {
  const [isActive, setIsActive] = useState(isAct);

  return (
    <View style={{paddingHorizontal: 20, marginTop: 35}}>
      <TouchableOpacity
        onPress={() =>setIsActive(!isActive)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={AppColors.subTitleColor}
        />
        <Text
          style={{
            flexGrow: 1,
            marginLeft: 10,
            color: AppColors.subTitleColor,
            ...AppStyle.TextStyle.inputTextFont,
            fontSize: 15,
          }}>
          {title}
        </Text>

        {isActive ? (
          <MaterialCommunityIcons
            name="chevron-up"
            size={20}
            color={AppColors.subTitleColor}
          />
        ) : (
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={AppColors.subTitleColor}
          />
        )}
      </TouchableOpacity>
      {isActive && (
        <View
          style={{
           
            alignItems:'center',
            justifyContent:'center',
           
           
           
            marginTop: 10,
            
          }}>
          {data != null && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:Colors.white,
                justifyContent: 'space-between',
              }}>
              <Dropdown
                style={styles.dropdown}
                data={data}
                labelField="label"
                valueField="id"
                placeholder="Pickup Info"
                value={selected}
                onChange={item => {
                  // console.log(item.id);
                  setSelected(item.id);
                }}
                // renderItems={renderItem}
              />
              <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => {
                    handlePickupInfo()     }}
                  style={{
                    marginLeft:5,
                    backgroundColor: AppColors.colorCyan,
                  }}>
                  Save
                </Button>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: AppColors.accentDark,
    fontSize: 14,
  },
  input: {
    background: AppColors.accentWhite,
    text: AppColors.textPrimary,
    accent: AppColors.accent,
    marginTop: 10,
    borderRadius: 10,
    borderColor: AppColors.colorDark,
  },
  outlineBtn: {
    borderColor: AppColors.borderColor,
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor:Colors.white,
    // marginTop: 10,
    height: 40,
    width: '80%',
    borderRadius: 5,
    padding: 10,
    // backgroundColor: 'white',
    borderWidth:0.3,
            borderColor:AppColors.searchIconColor,
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
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#000',
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
export default CustomDropdown;
