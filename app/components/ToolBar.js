/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  View,
  SafeAreaView,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import IconFA from 'react-native-vector-icons/FontAwesome5';
import IconFA from 'react-native-vector-icons/Ionicons';

import Util from '../utils/Util';
import AppColors from '../common/AppColor';
import AppStyle from '../common/AppStyle';
import Colors from '../common/Colors';

export default class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: '',
      isBackButtonVisible: true,
      title: '',
      subTitle: '',
      FCMToken: '',
      user: null,
      showAll: false,
      showAllIcon: false,
      searchIconTF:true,
    };
  }

  // componentDidMount() {
  //   this.props.navigation.addListener('willFocus', () => {});
  // }

  gotoLogin() {
    this.props.navigation.navigate('Login');
  }

  showLogoutAlert() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from app?',
      [
        {
          text: 'No',
          onPress: () => console.log('Dismiss'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.gotoLogin(),
        },
      ],
      {cancelable: false},
    );
  }
  selectAll = () => {
    console.log();
    this.setState({showAllIcon: !this.state.showAllIcon});
  };
  render() {
    return (
      <SafeAreaView
        style={{
          width: '100%',
          flexDirection: 'row',
          height:
            Platform.OS === 'ios' && DeviceInfo.hasNotch()
              ? 68
              : Platform.OS === 'ios' && !DeviceInfo.hasNotch()
              ? 62
              : 56,
          paddingStart: 6,
          paddingEnd: 16,
          backgroundColor: AppColors.white,
          elevation: 1,
          zIndex:1,
        }}
        forceInset={{
          top:
            Platform.OS === 'ios' && DeviceInfo.hasNotch() ? 'always' : 'never',
        }}>
        <StatusBar
          backgroundColor={AppColors.white}
          barStyle="light-content"
        />
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            height: 56,
            marginTop:
              Platform.OS === 'ios' && DeviceInfo.hasNotch()
                ? 12
                : Platform.OS === 'ios' && !DeviceInfo.hasNotch()
                ? 6
                : 0,
          }}>
          <TouchableOpacity
            onPress={this.props.onHomeIconClick}
            style={{
              height: 56,
              paddingHorizontal: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.props.showBackIcon === true ? (
              <MaterialIcon
                name="arrow-back-ios"
                size={25}
                color={AppColors.black}
              />
            ) : (
              // <MaterialIcon name="menu" size={24} color={AppColors.black} />
              null
            )}
          </TouchableOpacity>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginStart: 80,
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: AppColors.colorWhite,
                ...AppStyle.TextStyle.titleExtraLarge,
                fontSize: 20,
              }}>
              {this.props.toolBarTitle}
            </Text>
            {this.props.showSubTitle === true ? (
              <Text
                numberOfLines={1}
                style={{
                  color: AppColors.colorWhite,
                  fontSize: 12,
                }}
                ellipsizeMode={'tail'}>
                {this.props.toolBarSubTitle}
              </Text>
            ) : null}
          </View>
          {this.props.showSearchButton === true ? (
            <TouchableOpacity
              style={{alignItems: 'center', marginHorizontal: 7,right:0,position:'absolute'}}
              onPress={() => {this.setState({searchIconTF:!this.state.searchIconTF}),
                this.props.showSearchIcon(this.state.searchIconTF)
              }}>
              <MaterialIcon
                name={this.state.searchIconTF?"search":"cancel"}
                size={25}
                style={{marginStart: 70,}}
                color={AppColors.black}
              />
            </TouchableOpacity>
          ) : null}
          {this.props.sendBtn == true ? (
            <TouchableOpacity
              style={{alignItems: 'center',marginLeft:'auto', marginHorizontal: 7}}
              onPress={this.props.sendPost}>
              <MaterialIcon
                name="send"
                size={24}
                style={{marginStart: 10}}
                color={AppColors.searchIconColor}
              />
            </TouchableOpacity>
          ):null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    flex: 1,
    fontSize: 15,
    alignSelf: 'center',
  },
  backgroundStyle: {
    backgroundColor: AppColors.colorWhite,
    height: 35,
    borderRadius: 3,
    marginBottom: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyles: {
    fontSize: 14,
    marginHorizontal: 7,
    alignSelf: 'center',
  },
});
