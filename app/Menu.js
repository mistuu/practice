import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import BASE_URL from './common/Config';
import Util from './utils/Util';

const window = Dimensions.get('window');
const uri = require('../app/assets/user.png');

export default function Menu({navigation}) {
  const [firstName, setFirstName] = React.useState('');
  const [avtar, setAvtar] = useState(null);
  const [lastName, setLastName] = React.useState('');
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    Util.getUser().then(data => {
      
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setPhone(data.mobile);
      if (data.avatar != null) { 
        setAvtar({uri: BASE_URL + 'avatar/' + data.avatar});
      } else {
        setAvtar(require('./assets/user.png'));
      }
      console.log(data);
    });
  };
  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
      <View
        style={{
          width: 200,
          height: 100,
          backgroundColor: '#f4f7f6',
          padding: 30,
          flexDirection: 'row',
          borderBottomColor: '#ddd',
          borderBottomWidth: 0.5,
          alignItems: 'center',
        }}>
        <Image
          source={avtar}
          style={styles.profile}></Image>
        <Text style={{color: AppColors.colorDarkbg}}>
          Welcome,{'\n'}
          <>
            <Text
              style={{
                fontWeight: 'bold',
                color: AppColors.colorDarkbg,
              }}>
              {firstName+" "+lastName}
            </Text>
          </>
        </Text>
      </View>
      <View
        style={{
          fontWeight: 500,
          marginTop: 20,
        }}>
        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => navigation.navigate('HomeScreen')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="home" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => navigation.navigate('StudentStaff')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="user" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Student / Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => navigation.navigate('Calender')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="calendar" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => onItemSelected('Messaging')}>
          
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="envelope" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Messaging</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() =>navigation.navigate('Activity')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="user-o" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => onItemSelected('Announcement')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="building" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Announcement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => onItemSelected('Billing')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="file-text" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Billing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => onItemSelected('Reporting')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="line-chart" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>Reporting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuTabs}
          onPress={() => onItemSelected('More')}>
          <Text
            style={{
              marginLeft: 30,
            }}>
            <Icon name="ellipsis-h" color="#49c5b6" size={16} />
          </Text>
          <Text style={styles.tabInside}>More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#f4f7f6',
    padding: 0,
    color: 'black',
    zIndex: 10,
  },
  avatarContainer: {
    marginBottom: 50,
    marginTop: 50,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
  profile: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  menuTabs: {
    color: AppColors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginBottom: 12,
  },
  Tabtext: {
    color: AppColors.textSecondary,
    paddingLeft: 30,
    height: 40,
    marginTop: 5,
    color: AppColors.colorDarkbg,
  },
  tabInside: {
    // backgroundColor: '#dddddddd',
    color: AppColors.colorDarkbg,
    padding: 15,
    // paddingRight: 5,
    // marginRight: 10,
  },
});

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};
