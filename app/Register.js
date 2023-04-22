/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Node, useEffect, useState} from 'react';
import AppColors from './common/AppColor';
import Util from './utils/Util';
import ApiCalling, {axiosGet} from './network/ApiCalling';

import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  Modal,
  Image,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ScrollView,
} from 'react-native';
import CheckBox from 'react-native-checkbox';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppStyle from './common/AppStyle';
import DropdownList from './DropdownList';

// const neededEmail = 'demo@gmail.com';
// const neededPassword = '12345';
const ConditionCheck = props => {
  console.log(props);
  const iconName = props.isChecked
    ? 'checkbox-marked'
    : 'checkbox-blank-outline';
  return (
    <View style={styles.TermsCheckBox}>
      <Pressable onPress={props.onPress}>
        <MaterialCommunityIcons name={iconName} size={28} color="#49c5b6" />
      </Pressable>
      <Text style={styles.conditionCheckLable}>{props.title}</Text>
    </View>
  );
};

const Register = ({navigation}) => {
  const [icon, setIcon] = useState('eye');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [email, setEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [lastName, setLastName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [roleId, setRoleId] = useState(0);
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastNameErr, setLastNameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [rollIdErr, setRollIdErr] = useState('');
  const [termsErr, setTermsErr] = useState('');

  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const checkMail = async () => {
    //setIsLoading(true);
    try {
      let res = await axiosGet('user/generate-verification-code/' + email);
      console.log('Varification mail response===', res);
      if (res.status === true) {
        navigation.navigate('VerifyEmail', {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          roleId: roleId,
        });
      } else {
        // Toast.show(res.message)
        Alert.alert(res.message);
        setEmailErr(res.message);
      }
    } catch (error) {}
    // ApiCalling.apiCallParamsGet('user/generate-verification-code/' + email)
    //   .then(res => {

    //setIsLoading(false);
    // console.log("Varification mail response===",res.data);
    // if (res.data.status === true) {
    //   navigation.navigate('VerifyEmail',{
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     password: password,
    //     roleId: roleId,
    //   });
    // } else {
    //   setEmailErr(res.data.message);
    // }
    // })
    // .catch(errr => {
    //   console.log('error');
    // });
  };

  const registerHandler = e => {
    let isValid = true;
    if (firstName === '') {
      setFirstNameErr('First Name is required');
      isValid = false;
      // return;
    }
    if (lastName === '') {
      setLastNameErr('Last Name is required');
      isValid = false;
      // return;
    }
    if (email === '') {
      setEmailErr('Enter email');
      isValid = false;
    } else if (reg.test(email) === false) {
      setEmailErr('Email is not valid');
      isValid = false;
      // return;
    }
    if (password === '') {
      setPassErr('Enter password');
      isValid = false;
    } else if (password.length < 5) {
      setPassErr('password must be at least 5 characters long');
      isValid = false;
      // return;
    }
    if (roleId == 0) {
      console.log('role: ', roleId);
      setRollIdErr('Please select your role');
      isValid = false;
      // return;
    }
    if (isTermsChecked !== true) {
      setTermsErr('Please accept terms of service');
      isValid = false;
    }
    if (isValid) {
      checkMail();
    }
  };

  const changeName = () => {
    setFirstName(e.target.value);
  };
  const changelastName = () => {
    setLastName(e.target.value);
  };
  const checkEmail = e => {
    setEmail(e.target.value);
  };
  const checkPassword = e => {
    setPassword(e.target.value);
  };

  // async function doLogin() {
  //   if (!Util.isValidData(email)) {
  //     Util.showMsg('Please enter valid email');
  //     return;
  //   }
  //   else if (reg.test(email) === false) {
  //     setEmailError('Email is not valid');
  //     return;
  //   }

  //   if (!Util.isValidData(password)) {
  //     Util.showMsg('Please enter valid password');
  //     return;
  //   }

  //   // if (email === neededEmail && password === neededPassword) {
  //   //   Util.showMsg('Welcome!');
  //   //   navigation.navigate('Home');
  //   // } else if (email !== neededEmail) {
  //   //   Util.showMsg('Email not matched');
  //   // } else if (password !== neededPassword) {
  //   //   Util.showMsg('Password not matched');
  //   // }
  // }
  const _changeIcon = () => {
    icon !== 'eye-off'
      ? (setIcon('eye-off'), setPasswordVisible(false))
      : (setIcon('eye'), setPasswordVisible(true));
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
              paddingVertical: 30,
              paddingHorizontal: 10,
              justifyContent: 'center',
              color: AppColors.colorAccent,
              backgroundColor: AppColors.colorDarkbg,
            }}>
            <Image
              source={require('./assets/logoWhite.png')}
              style={{marginBottom: 10, width: 100}}></Image>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                justifyContent: 'center',
                color: AppColors.colorAccent,
                backgroundColor: AppColors.white,
                borderRadius: 10,
              }}>
              <ScrollView
                style={{
                  width: '100%',
                  height: '100%',
                }}>
                <Text
                  style={{
                    ...AppStyle.TextStyle.titleExtraLarge,
                    textAlign: 'center',
                    elevation: 3,
                    paddingVertical: 10,
                  }}>
                  Sign Up
                </Text>
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  <TextInput
                    label="First Name"
                    // placeholder="First Name"
                    value={firstName}
                    mode="outlined"
                    autoFocus={false}
                    blurOnSubmit={true}
                    clearButtonMode="never"
                    keyboardType="text"
                    outlineColor={AppColors.accent}
                    onChangeText={text => {
                      setFirstName(text);
                      changeName;
                    }}
                    style={styles.input}
                  />
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {firstName === '' ? <>{firstNameErr}</> : ''}
                  </Text>

                  <TextInput
                    label="Last Name"
                    // placeholder="Last Name"
                    value={lastName}
                    mode="outlined"
                    keyboardType="text"
                    onChangeText={text => {
                      setLastName(text);
                      changelastName;
                    }}
                    style={styles.input}
                    outlineColor={AppColors.accent}
                  />
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {lastName === '' ? <>{lastNameErr}</> : ''}
                  </Text>
                  <TextInput
                    label={'Email'}
                    // placeholder="Email"
                    value={email}
                    mode="outlined"
                    keyboardType="email-address"
                    onChangeText={text => {
                      setEmail(text);
                      checkEmail;
                    }}
                    style={styles.input}
                    outlineColor={AppColors.accent}
                  />
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {email === '' ? (
                      <>{emailErr}</>
                    ) : reg.test(email) === false ? (
                      <>{emailErr}</>
                    ) : (
                      ''
                    )}
                  </Text>
                  <TextInput
                    label={'Password'}
                    // placeholder="Password"
                    value={password}
                    secureTextEntry={passwordVisible}
                    right={
                      <TextInput.Icon
                        name={passwordVisible ? 'eye' : 'eye-off'}
                        size={20}
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
                    outlineColor={AppColors.accent}
                  />
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {password === '' || password.length < 5 ? (
                      <>{passErr} </>
                    ) : (
                      ''
                    )}
                  </Text>
                  <DropdownList
                    role={roleId}
                    rollIdError={rollIdErr}
                    setRole={setRoleId}
                  />
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {roleId === 0 ? <>{rollIdErr} </> : ''}
                  </Text>
                  {/* <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <CheckBox
                    style={{
                      width: 3,
                      height: 3,
                      backgroundColor: 'grey',
                    }}
                    tintColors={{true: '#368098'}}
                    onCheckColor={'#6F763F'}
                    borderColor="#174A41"
                    borderRadius={1}
                    size={10}
                    label=""
                    value={isTermsChecked}
                    onChange={checked => {
                      setIsTermsChecked(checked);
                      console.log('I am checked', checked);
                    }}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      marginLeft: 5,
                      color: AppColors.colorDark,
                    }}>
                    I agree to the Terms of service
                  </Text>
                </View> */}

                  <ConditionCheck
                    onPress={() => setIsTermsChecked(!isTermsChecked)}
                    title="I agree to the Terms of service"
                    isChecked={isTermsChecked}
                  />

                  <Text style={{fontSize: 12, color: 'red'}}>
                    {isTermsChecked === false ? <>{termsErr} </> : ''}
                  </Text>
                  <Button
                    raised
                    mode="contained"
                    theme={{roundness: 5}}
                    labelStyle={{
                      color: AppColors.white,
                    }}
                    onPress={() => registerHandler()}
                    style={{
                      marginTop: 3,

                      backgroundColor: AppColors.colorCyan,
                    }}>
                    Get Started
                  </Button>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '500',
                      color: AppColors.accent,
                      paddingVertical: 3,
                    }}>
                    Or
                  </Text>

                  <Button color="#212529" style={styles.outlineBtn}>
                    Google
                  </Button>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 12,
                    }}>
                    <Text style={styles.text}>Already have an account ? </Text>
                    <Button
                      color="#555"
                      onPress={() => navigation.navigate('Login')}
                      style={{position: 'relative', bottom: 10}}>
                      Login
                    </Button>
                  </View>
                </View>
              </ScrollView>
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
    borderEndWidth: 0,
    borderBottomWidth: 0,
    textDecorationLine: 0,
    height: 50,
    fontSize: 15,
    borderRadius: 10,
    borderColor: AppColors.borderColor,
    outlineColor: AppColors.borderColor,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  outlineBtn: {
    borderColor: AppColors.accent,
    borderWidth: 1,
    color: '#333',
    marginVertical: 1,
  },
  title: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
    fontWeight: '600',
  },
  TermsCheckBox: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    position: 'relative',
    top: 5,
  },
  conditionCheckLable: {
    fontSize: 15,
    color: '#495057',
    marginLeft: 5,
  },
});

export default Register;
