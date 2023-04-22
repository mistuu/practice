import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppColors from './common/AppColor';
import Dashboard from './Dashboard';
import ToolBar from './components/ToolBar';
import CalendarEvent from './CalendarEvent';
import Messaging from './Messaging';
import AppStyle from './common/AppStyle';
import ParentsDashboard from './ParentDashBoard/ParentsDashboard';
import Profile from './Profile';
import Util from './utils/Util';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from './common/Colors';
import BASE_URL, {URL_IMAGE_MY_PROFILE, URL_IMAGE_STUDENT_PHOTO} from './common/Config';
import Settings from './Settings';
import TextAvatar from 'react-native-text-avatar';
import {log} from 'console';
import ApiCalling from './network/ApiCalling';

const Tab = createBottomTabNavigator();

function TabNavigation({navigation, props}) {

  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [selectedChild, setSelectedChild] = useState({});

  useEffect(() => {
    // console.log(props.route.params?.selectItem());
    //  getProfile()
    getdata();
    const unsubscribe = navigation.addListener('focus', () => {
      //Your refresh code gets here
      getdata();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const getdata = () => {
    Util.getUser().then(async d=>{
      console.log(d);
      if(d.is_staff){
        setFirstName(d.firstName);
        setLastName(d.lastName);
        setProfile(URL_IMAGE_MY_PROFILE + d.avatar);
      }else{

        Util.getSelectedChild().then(data => {
          console.log('record====', data);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setProfile(URL_IMAGE_STUDENT_PHOTO + data.photo);
          setSelectedChild(data);
        });
      }
    
    })
  };

  const getProfile = async () => {
    try {
      console.log('Kese ho==');
      Util.getUser().then(async data => {
        await ApiCalling.apiCallBodyDataGet(
          'user/get-user-byId/' + data.id,
        ).then(ress => {
          console.log('ress.data===', ress.data);
          const tmp = ress.data.Parents;
          const list = [];

          tmp.forEach(element => {
            const newElement = {
              ...element.Student,
              name:
                element.Student.first_name + ' ' + element.Student.last_name,
            };
            list.push(newElement);
          });
          console.log('list', list);
          Util.saveSelectedChild(list[0]);
        });
      });
    } catch (error) {}
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Poppins-Medium',
          backgroundColor: AppColors.white,
        },
        headerStyle: {
          backgroundColor: AppColors.white,
        },
        tabBarStyle: {
          height: 65,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: AppColors.white,
        },
        tabBarItemStyle: {
          margin: 4,
          borderRadius: 10,
        },
      }}
      tabBarOptions={{
        style: {
          flexDirection: 'column',
          alignSelf: 'center',
          borderTopStartRadius: 5,
          borderTopEndRadius: 5,
        },
        activeTintColor: AppColors.activeTab,
        activeIconColor: AppColors.ghostWhite,
        inactiveTintColor: AppColors.inactiveTab,
        keyboardHidesTabBar: true,
        allowFontScaling: true,
      }}>
      <Tab.Screen
        name="Home"
        component={ParentsDashboard}
        options={{
          tabBarIcon: ({focused, color}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={focused ? AppColors.activeTab : AppColors.inactiveTab}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        options={{
          tabBarIcon: ({focused, color}) => (
            <MaterialCommunityIcons
              name="calendar-month-outline"
              color={focused ? AppColors.activeTab : AppColors.inactiveTab}
              size={25}
            />
          ),
        }}
        component={CalendarEvent}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({focused, color}) =>
            !Util.isValidData(profile) ? (
              <TextAvatar
                backgroundColor={Colors.primary}
                textColor={Colors.white}
                size={30}
                type={'circle'} // optional
              >
                {firstName + ' ' + lastName}
              </TextAvatar>
            ) : (
              <Image
                source={{
                  uri: profile,
                }}
                color={focused ? AppColors.activeTab : AppColors.inactiveTab}
                style={{borderRadius: 30 / 2, height: 30, width: 30}}
              />
            ),
        }}
        component={Profile}
      />
      <Tab.Screen
        name="Messages"
        options={{
          tabBarIcon: ({focused, color}) => (
            <MaterialCommunityIcons
              name="message-text-outline"
              color={focused ? AppColors.activeTab : AppColors.inactiveTab}
              size={25}
            />
          ),
        }}
        component={Messaging}
      />

      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({focused, tinColor}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={focused ? AppColors.activeTab : AppColors.inactiveTab}
              size={25}
            />
          ),
        }}
        component={Settings}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;

function showLogoutAlert({navigation, props}) {
  Alert.alert('Logout', 'Are you sure you want to logout from app?', [
    {
      text: 'No',
      onPress: () => console.log('Dismiss'),
      style: 'cancel',
    },
    {
      text: 'Yes',
      onPress: () => gotoLogin({navigation, props}),
    },
  ]);
}
function gotoLogin({navigation, props}) {
  Util.removeUser();
  Util.removeSelectedSchool();
  navigation.navigate('Login');
}
function SettingsScreen({navigation, props}) {
  return (
    <View style={{flex: 1}}>
      <ToolBar
        toolBarTitle={'Settings'}
        showSubTitle={false}
        showBackIcon={true}
        // navigation={navigation}
        // onHomeIconClick={() => {
        //   navigation.goBack(null);
        // }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: AppColors.white,
        }}>
        <TouchableOpacity
          onPress={() => {
            showLogoutAlert({navigation, props});
          }}
          style={styles.menuContainer}>
          <MaterialIcon
            name="logout"
            size={22}
            color={Colors.primary}
            style={styles.menuIcon}
          />
          <Text style={styles.menuTitle}>{'Log Out'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  subView: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderColor: AppColors.accent,
  },
  headerTitle: {
    paddingHorizontal: 10,
    ...AppStyle.TextStyle.titleExtraLarge,
  },
  text: {
    color: AppColors.accentDark,
    fontSize: 14,
  },
  menu: {
    width: window.width,
    height: window.height,
    backgroundColor: AppColors.colorWhite,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.colorMenu,
    textAlignVertical: 'center',
    marginLeft: 10,
    flex: 1,
  },
  toolbarStyle: {
    justifyContent: 'flex-start',
  },
  menuIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  menuContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 1,
  },
  dropdown: {
    backgroundColor: 'grey',
  },
});
