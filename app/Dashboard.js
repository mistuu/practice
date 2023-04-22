import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Picker,
  LogBox,
} from 'react-native';
import AppColors from './common/AppColor';
import SideMenu from 'react-native-side-menu-updated';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Divider from './components/Divider';
import ToolBar from './components/ToolBar';
import AppStyle from './common/AppStyle';
import App from '../App';
import Util from './utils/Util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BASE_URL from './common/Config';
import ApiCalling from './network/ApiCalling';
import TabNavigation from './TabNavigation';
import {Dropdown} from 'react-native-element-dropdown';
import Header from './Header';

const ChildSelect = ({childList, selectChild, onValueSelect}) => {
  const renderItem = item => {
    return (
      <View style={{marginLeft: 10, padding: 3}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            ...AppStyle.TextStyle.titleNormal,
          }}>
          <MaterialIcon
            name="insert-emoticon"
            size={20}
            style={{marginRight: 5}}
          />
          <Text
            style={{
              ...AppStyle.TextStyle.titleNormal,
              color: AppColors.black,
              paddingVertical: 5,
            }}>
            {item.name}
          </Text>
        </View>
        {/* {item.selectChild === selectChild && ''} */}
      </View>
    );
  };

  return (
    <TouchableOpacity>
      <Dropdown
        fontFamily="Poppins-Medium"
        dropdownPosition={4}
        style={{
          width: 150,
          padding: 5,
          marginVertical: 4,
          marginLeft: 10,

          paddingHorizontal: 10,
        }}
        
        renderRightIcon={() => (
          <TouchableOpacity>
            <MaterialCommunityIcons name="menu-down" size={25} style={{position:'relative', left:-14,}} />
          </TouchableOpacity>
        )}
        containerStyle={{
          borderRadius: 5,
          width: 150,
        }}
        placeholderStyle={{
          fontSize: 15,
          width: 150,
          // ...AppStyle.TextStyle.titleNormal,
        }}
        placeholder="Child Name"
        placeholderColor={AppColors.accent}
        data={childList}
        value={selectChild.id}
        labelField="name"
        valueField="id"
        renderItem={renderItem}
        onChange={onValueSelect}
      />
    </TouchableOpacity>
  );
};

LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
      firstName: null,
      lastName: null,
      avatar: null,
      child: '',
      selectChild: {},
      childList: [
        {id: 1, name: 'Child A'},
        {id: 2, name: 'Child B'},
      ],
    };
  }
  componentDidMount() {
    this.getProfile();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getProfile();
    });
  }

  show() {
    this.setState(prevState => ({
      isToggle: !prevState.isToggle,
    }));
  }
  onChanageChild() {
    this.setState({selectChild: value});
    console.log(selectChild);
  }
  getProfile = async () => {
    try {
      Util.getUser().then(data => {
        ApiCalling.apiCallBodyDataGet('user/get-user-byId/' + data.id)
          .then(ress => {
            console.log(ress);
            Util.saveUser(ress.data);
            this.setState({
              firstName: ress.data.firstName,
              lastName: ress.data.lastName,
            });
            if (ress.data.avatar != null) {
              this.setState({
                avatar: {uri: BASE_URL + 'avatar/' + ress.data.avatar},
              });
            } else {
              this.setState({avatar: require('./assets/user.png')});
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    } catch (error) {}
  };
  updateDrawerState(isDrawerOpen) {
    this.setState({isDrawerOpen});
  }

  toggleDrawer = () => {
    this.setState({isDrawerOpen: !this.state.isDrawerOpen});
  };

  gotoLogin() {
    Util.removeUser();
    Util.removeSelectedSchool();
    this.props.navigation.navigate('Login');
  }
  HomeProfile() {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <Image
              source={require('./assets/Profile.png')}
              style={{
                borderRadius: 100,
              }}
            />
          </View>
          <ChildSelect
            childList={this.state.childList}
            selectChild={this.state.selectChild}
            onValueSelect={item => {
              console.log(item);
              this.setState({
                selectChild: item,
              });
            }}
          />

          {/* <TouchableOpacity>
            <MaterialCommunityIcons
              name="menu-down"
              size={25}
              color={AppColors.inactiveTab}
            />
          </TouchableOpacity> */}
        </View>
        <View>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              color={AppColors.inactiveTab}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
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

  render() {
    return (
      <View style={styles.container}>
        <Header toolbarTitle={this.HomeProfile()} />
        <View
          style={{
            flex: 1,
            backgroundColor: AppColors.white,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={AppStyle.TextStyle.titleLarge}>Staff Dashboard</Text>
        </View>
      </View>
    );
  }
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
