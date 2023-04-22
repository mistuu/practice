/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Node, useEffect, useState} from 'react';

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

import AppStyle from './common/AppStyle';
import AppColors from './common/AppColor';
import Util from './utils/Util';
import ApiCalling, {axiosPost} from './network/ApiCalling';
import {storeItem} from './utils/AsyncConfig';
import ProgressDialog from './components/ProgressDialog';
import auth from '@react-native-firebase/auth';

import {GoogleSignin} from '@react-native-community/google-signin';
GoogleSignin.configure({
  webClientId:
    '88435559780-4ap4r13gmn8fbgjer0qggqakutnh8raf.apps.googleusercontent.com',
});


const Login = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const user = auth().currentUser;
  const [icon, setIcon] = useState('eye');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [loginError, setLoginError] = useState('');
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    getData();
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'EXIT', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const getData = async () => {
    const user = await Util.getUser();
    console.log('User:', user);
  };
  async function onGoogleButtonPress() {
    //for signOut
    // try {
    //   await GoogleSignin.revokeAccess();
    //   await GoogleSignin.signOut();
    //   auth()
    //     .signOut()
    //     .then(() => alert('Your are signed out!'));
    // } catch (error) {
    //   console.error(error);
    // } 
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log("Google credii====",idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential)
  }
 const signInWithGoogle=async(data)=>{
    try { 
      var params={
        "email":data.user.email,
        "token": global.token.token,
        "origin": global.token.os
    }

      console.log("Parmas==",params);
      let res = await axiosPost('user/google-login', params);
      console.log('login',res);
      console.log(res);
      if (res === undefined) {
        setLoading(false);
        Util.showMsg('Server API not working');
      } else if (res.status === true) {
        setLoading(false);
        if (Util.isValidData(res.user)) {
          console.log('User: ', res.user);
          Util.saveUser(res.user);
          await storeItem('LoginDetails', JSON.stringify(res.user));
          if (res.user.is_staff) {
            if (res.user.user_Schools.length != 0) {
              if (res.user.user_Schools[0].RoleId) {
                // Util.saveSelectedSchool(res.user.user_Schools[0].RoleId);
                Util.saveSelectedSchool(res.user.user_Schools[0].school);
                navigation.navigate('TabNavigation');

                // navigation.navigate("ParentDashboard");
                // navigation.navigate('Dashboard');
                console.log('dashboard');
              } else {
                navigation.navigate('WaitingSchoolConfirm');
              }
            } else {
              navigation.navigate('JoinSchool');
            }
          } else {
            if (res.user.is_parent) {
              // navigation.navigate('ParentsDashboard');
              navigation.navigate('TabNavigation');

              console.log('ParentsDashboard');
            } else {
              navigation.navigate('JoinSchool');
            }
          }
        } else {
          setLoginError('Not getting data of user');
        }
      } else {
        setLoading(false);
        Util.showMsg(res.message);
        setLoginError(res.message);
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const getLogin = async () => {
    setLoading(true);
    const data = {
      email: email,
      password: password,
      token: global.token.token,
      origin: global.token.os
    };
    console.log("Data login with token",data);
    try {
      let res = await axiosPost('user/login', data);
      console.log('login');
      console.log(res);
      if (res === undefined) {
        setLoading(false);
        Util.showMsg('Server API not working');
      } else if (res.status === true) {
        setLoading(false);
        if (Util.isValidData(res.user)) {
          console.log('User: ', res.user);
          Util.saveUser(res.user);
          await storeItem('LoginDetails', JSON.stringify(res.user));
          if (res.user.is_staff) {
            if (res.user.user_Schools.length != 0) {
              if (res.user.user_Schools[0].RoleId) {
                // Util.saveSelectedSchool(res.user.user_Schools[0].RoleId);
                Util.saveSelectedSchool(res.user.user_Schools[0].school);
                navigation.navigate('TabNavigation');

                // navigation.navigate("ParentDashboard");
                // navigation.navigate('Dashboard');
                console.log('dashboard');
              } else {
                navigation.navigate('WaitingSchoolConfirm');
              }
            } else {
              navigation.navigate('JoinSchool');
            }
          } else {
            if (res.user.is_parent) {
              const tmp = res.user.Parents;
              const list = [];
      
              tmp.forEach(element => {
                const newElement = {
                  ...element.Student,
                  name: element.Student.first_name + ' ' + element.Student.last_name,
                  
                };
                list.push(newElement);
              });
              Util.saveListChilde(list)
              Util.saveSelectedChild(list[0])
              
              // navigation.navigate('ParentsDashboard');
              navigation.navigate('TabNavigation');

              console.log('ParentsDashboard');
            } else {
              navigation.navigate('JoinSchool');
            }
          }
        } else {
          setLoginError('Not getting data of user');
        }
      } else {
        setLoading(false);
        Util.showMsg(res.message);
        setLoginError(res.message);
      }
    } catch (error) {
      setLoading(false);
    }
    // ApiCalling.apiCallBodyDataPost('user/login', data)
    //   .then(res => {
    //     if (res.data.status === true) {
    //       if (Util.isValidData(res.data.user)) {
    //         console.log('User: ', res.data.user);
    //         Util.saveUser(res.data.user);
    //         if (res.data.user.is_staff) {
    //           if (Util.isArrayNotEmpty(res.data.user.user_Schools)) {
    //             if (res.data.user.user_Schools[0].RoleId) {
    //               Util.saveSelectedSchool(res.data.user.user_Schools[0].RoleId);
    //               Util.saveSelectedSchool(res.data.user.user_Schools[0].school);
    //               //  navigation.navigate("Dashboard");
    //               console.log('dashboard');
    //             } else {
    //               navigation.navigate('WaitingSchoolConfirm');
    //             }
    //           } else {
    //             navigation.navigate('JoinSchool');
    //           }
    //         } else {
    //           if (res.data.user.is_parent) {
    //             // navigation.navigate("ParentsDashboard");
    //             console.log('ParentDashboard');
    //           } else {
    //             navigation.navigate('JoinSchool');
    //           }
    //         }
    //       } else {
    //         setLoginError('Not getting data of user');
    //       }
    //     } else {
    //       setLoginError(res.data.message);
    //     }
    //   })
    //   .catch(err => {
    //     console.log('Error', err);
    //   });
  };
  const _changeIcon = () => {
    icon !== 'eye-off'
      ? (setIcon('eye-off'), setPasswordVisible(false))
      : (setIcon('eye'), setPasswordVisible(true));
  };
  const loginHandler = () => {
    if (email === '') {
      setEmailError('Enter email');
      // return;
    } else if (reg.test(email) === false) {
      setEmailError('Email is not valid');
      // return;
    }
    if (password === '') {
      setPassError('Enter Password');
      // return;
    }
    getLogin();
  };

  const checkEmail = e => {
    setEmail(e.target.value);
  };

  const checkPassword = e => {
    setPassword(e.target.value);
  };

  return (
    <View style={styles.container}>
      {ProgressDialog.CustomProgressBar(isLoading)}
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
                Login
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <TextInput
                  placeholder="Email"
                  value={email}
                  mode="outlined"
                  keyboardType="email-address"
                  onChangeText={text => {
                    setEmail(text);
                    checkEmail;
                  }}
                  style={styles.input}
                />
                <Text style={{fontSize: 13, color: 'red'}}>
                  {email === '' ? (
                    <>{emailError}</>
                  ) : reg.test(email) === false ? (
                    <>{emailError}</>
                  ) : (
                    ''
                  )}
                </Text>
                <TextInput
                  // label="Password"
                  placeholder="Password"
                  value={password}
                  secureTextEntry={passwordVisible}
                  right={
                    <TextInput.Icon
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      size={15}
                      onPress={_changeIcon}
                    />
                  }
                  mode="outlined"
                  keyboardType="default"
                  onChangeText={text => {
                    setPassword(text);
                    checkPassword;
                  }}
                  style={styles.input}
                />
                <Text style={{fontSize: 13, color: 'red'}}>
                  {password === '' || password.length < 5 ? (
                    <>{passError} </>
                  ) : (
                    ''
                  )}
                </Text>

                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => {
                    loginHandler();
                  }}
                  style={{
                    marginTop: 20,
                    marginBottom: 5,
                    backgroundColor: AppColors.colorCyan,
                  }}>
                  Login
                </Button>

                <Text style={{textAlign: 'center'}}>Or</Text>

                <Button
                  color="#212529"
                  onPress={() =>
                    onGoogleButtonPress().then((data) =>

                    // console.log('Signed in with Google!',data),
                    signInWithGoogle(data),
                    )
                  }
                  style={styles.outlineBtn}>
                  Google
                </Button>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                  }}>
                  <Text style={styles.text}>Don't have an account ? </Text>
                  <Button
                    color="#555"
                    onPress={() => navigation.navigate('Register')}
                    style={{position: 'relative', bottom: 10}}>
                    Register
                  </Button>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 15,
                  }}>
                  <Button
                    color="#555"
                    // onPress={() => navigation.navigate('ForgetPassword')}
                    style={{position: 'relative', bottom: 10, fontSize: 10}}>
                    Forget Password ?
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
    borderEndWidth: 0,
    borderBottomWidth: 0,
    textDecorationLine: 0,
    height: 50,
    fontSize: 15,
    // borderWidth: 1,
    borderRadius: 10,
    borderColor: AppColors.borderColor,
    backgroundColor: 'white',
    // borderBottomColor: '#000',
  },
  outlineBtn: {
    borderColor: AppColors.borderColor,
    borderWidth: 1,
    fontSize: 15,
  },
});

export default Login;
