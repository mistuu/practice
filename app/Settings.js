import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Switch} from 'react-native-paper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Util from './utils/Util';
import TextAvatar from 'react-native-text-avatar';
import Colors from './common/Colors';
import BASE_URL, {URL_IMAGE_MY_PROFILE} from './common/Config';
import ApiCalling, {axiosPost} from './network/ApiCalling';

const SettingHeader = () => {
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 66,
        paddingHorizontal: 20,
        marginTop:
          Platform.OS === 'ios' && DeviceInfo.hasNotch()
            ? 12
            : Platform.OS === 'ios' && !DeviceInfo.hasNotch()
            ? 6
            : 0,
      }}>
      <StatusBar
        backgroundColor={AppColors.colorPrimary}
        barStyle="light-content"
      />
      <View>
        <Text
          style={{
            color: AppColors.SmallTextColor,
            ...AppStyle.TextStyle.semiBoldText,
            fontSize: 20,
          }}>
          Settings
        </Text>
      </View>
      <TouchableOpacity>
        <MaterialIcon
          name="search"
          size={25}
          color={AppColors.searchIconColor}
        />
      </TouchableOpacity>
    </View>
  );
};
const gotoLogin = async navigation => {
  var params = {
    token: global.token.token,
  };

  console.log('Parmas==', params);
  let res = await ApiCalling.apiCallLogout('user/logout', params);
  console.log('login', res.data);
  AsyncStorage.clear();
  navigation.replace('Login');
};

const showLogoutAlert = ({navigation}) => {
  Alert.alert('Logout', 'Are you sure you want to logout from app?', [
    {
      text: 'No',
      onPress: () => console.log('Dismiss'),
      style: 'cancel',
    },
    {
      text: 'Yes',
      onPress: () => gotoLogin(navigation),
    },
  ]);
};

const Settings = ({navigation}) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [data, setData] = useState(null);


  useEffect(() => {
    try {
      Util.getUser().then(data => {
        setData(data);
        console.log('utlilData:', data);
      });
    } catch (error) {}
  }, []);

  return (
    <View style={styles.container}>
      <SettingHeader />

      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            marginRight: 15,
          }}>
          {data?.avatar === null ? (
            <TextAvatar
              backgroundColor={Colors.primary}
              textColor={Colors.white}
              size={50}
              type={'circle'} // optional
            >
              {data?.firstName.toUpperCase() +
                ' ' +
                data?.lastName.toUpperCase()}
            </TextAvatar>
          ) : (
            <Image
              source={{uri: URL_IMAGE_MY_PROFILE + data?.avatar}}
              style={{borderRadius: 50 / 2, height: 50, width: 50}}
            />
          )}
        </View>
        <View>
          <Text
            style={{
              ...AppStyle.TextStyle.semiBoldText,
              fontSize: 18,
              color: AppColors.settingPrimaryColor,
            }}>
            {data?.firstName + ' ' + data?.lastName}
          </Text>
          {data?.is_parent === true && (
            <Text
              style={{
                ...AppStyle.TextStyle.descNormal,
              }}>
              Parent
            </Text>
          )}
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialIcon
              name="nightlight-round"
              color={AppColors.activeTab}
              style={{
                marginRight: 20,
                transform: [{rotate: '-25deg'}],
              }}
              size={25}
            />
            <Text style={styles.tabText}>Dark mode</Text>
          </View>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            theme={AppColors.SmallTextColor}
            color={AppColors.searchIconColor}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialIcon
              name="account-box"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>Account</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialIcon
              name="notifications"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>Notification</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialCommunityIcons
              name="chat"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>Chat settings</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialIcon
              name="pie-chart"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>Data and storage</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialIcon
              name="lock"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>Privacy and security</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <View style={styles.flex}>
            <MaterialCommunityIcons
              name="alert-circle"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>About</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => showLogoutAlert({navigation})}>
          <View style={styles.flex}>
            <MaterialIcon
              name="logout"
              color={AppColors.activeTab}
              style={styles.TabIcons}
              size={25}
            />
            <Text style={styles.tabText}>Logout</Text>
          </View>
          <MaterialIcon
            name="keyboard-arrow-right"
            color={AppColors.activeTab}
            size={25}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.settingbgColor,
  },
  customStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 8,
    marginTop: 20,
  },
  flex: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  TabIcons: {marginRight: 20},
  tabText: {fontFamily: 'Nunito-Regular', fontSize: 14},
});
