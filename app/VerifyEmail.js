import React, {useEffect, useState} from 'react';

import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  Image,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Svg,
} from 'react-native';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';
import ApiCalling, { axiosPost } from './network/ApiCalling';
import Util from './utils/Util';

const VerifyEmail = ({route, navigation}) => {
  const [codeVerify, setCodeVerify] = React.useState('');
  const [codeErr, setCodeErr] = useState('');

  useEffect(() => {
    console.log('email ', email);
  });
  const email = route.params.email;
  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  const password = route.params.password;
  const roleId = route.params.roleId;

  const VerifyCode = async () => {
    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      parent_staff: roleId,
      verificationCode: codeVerify,
    };

    console.log('User data: ');
    console.log(data);
    try {
      let res = await axiosPost("user/add-user",data)
      if (res.status === true) {
        Util.saveUser(res.user);
        if (res.user.user_Schools.length > 0) {
          if (res.user.user_Schools[0].RoleId > 0) {
            Util.saveSelectedSchool(res.user.user_Schools[0].school);
            navigation.navigate('Dashboard');
            console.log('dashoard');
          } else {
            navigation.navigate('WaitingSchoolConfirm');
          }
        } else {
          console.log(roleId);
          if(roleId == 1)
          {
             
            navigation.navigate('JoinSchool');
          }
          else{ 
            navigation.navigate("ParentsDashboard");
          }
        }
      } else {
        Util.showMsg(res.message)
      }
    } catch (error) {
      
    }

    // ApiCalling.apiCallBodyDataPost('user/add-user', data)
    //   .then(res => {
    //     console.log(res);
    //     debugger;
    //     console.log(res.data);
    //     if (res.data.status === true) {
    //       Util.saveUser(res.data.user);
    //       if (res.data.user.user_Schools.length > 0) {
    //         if (res.data.user.user_Schools[0].RoleId > 0) {
    //           Util.saveSelectedSchool(res.data.user.user_Schools[0].school);
    //           navigation.navigate('Dashboard');
    //           console.log('dashoard');
    //         } else {
    //           navigation.navigate('WaitingSchoolConfirm');
    //         }
    //       } else {
    //         navigation.navigate('JoinSchool');
    //       }
    //     }
    //   })
    //   .catch(err => {
    //     console.log('Error');
    //   });
  };

  const verifyHandler = () => {
    
    if (codeVerify === '') {
      setCodeErr('Verify your code');
    } else {
      VerifyCode();
      // navigation.navigate('JoinSchool')
    }
  };

  const changeCode = () => {
    setCodeVerify(e.target.value);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{
          width: '100%',
          height: '100%',
        }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
          style={{
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
              color: AppColors.colorAccent,
              backgroundColor: AppColors.colorDarkbg,
            }}>
            <Image
              source={require('./assets/logoWhite.png')}
              style={{marginBottom: 20, width: 100}}></Image>
            <View
              style={{
                padding: 15,
                justifyContent: 'center',
                color: AppColors.colorAccent,
                backgroundColor: AppColors.white,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  ...AppStyle.TextStyle.titleExtraLarge,
                  paddingHorizontal: 5,
                  textAlign: 'center',
                }}>
                Verify your Email Address
              </Text>
              <Text
                style={{
                  ...AppStyle.TextStyle.titleExtraLarge,
                  textAlign: 'center',
                  fontSize: 12,
                  marginTop: 5,
                  color: AppColors.colorDanger,
                }}>
                Code sent to {email}
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <TextInput
                  // label="Verification code"
                  placeholder="Verification code"
                  // value={VerifyCode}
                  mode="outlined"
                  activeOutlineColor="grey"
                  keyboardType="numeric"
                  onChangeText={text => {
                    setCodeVerify(text);
                    changeCode;
                  }}
                  style={styles.input}
                />
                <Text style={{fontSize: 13, color: 'red'}}>
                  {codeVerify === '' ? <> {codeErr} </> : ''}
                </Text>

                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => {
                    verifyHandler();
                  }} //navigation.navigate('JoinSchool')}
                  style={{
                    marginTop: 25,
                    marginBottom: 5,
                    backgroundColor: AppColors.colorCyan,
                  }}>
                  Confirm
                </Button>

                <Text style={{textAlign: 'center'}}>Or</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 0,
                  }}>
                  <Button
                    color="#555"
                    onPress={() => navigation.goBack('Register')}
                    style={{position: 'relative', bottom: 10}}>
                    Back
                  </Button>
                  <Button
                    color="#555"
                    onPress={() => navigation.navigate('Register')}
                    style={{position: 'relative', bottom: 10}}>
                    Register
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    marginTop: 10,
    // borderRadius: 10,
    borderEndWidth: 0,
    borderBottomWidth: 0,
    textDecorationLine: 0,
    height: 50,
    fontSize: 15,
    borderWidth: 0,
    backgroundColor: 'white',
    // borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  outlineBtn: {
    borderColor: AppColors.borderColor,
    borderWidth: 1,
  },
});
export default VerifyEmail;
