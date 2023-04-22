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

const WaitingSchoolConfirm = ({navigation}) => {
  


  async function doLogin() {
    if (!Util.isValidData(email)) {
      Util.showMsg('Please enter valid email');
      return;
    }
    if (!Util.isValidData(password)) {
      Util.showMsg('Please enter valid password');
      return;
    }

    if (email === neededEmail && password === neededPassword) {
      Util.showMsg('Welcome!');
      navigation.navigate('Home');
    } else if (email !== neededEmail) {
      Util.showMsg('Email not matched');
    } else if (password !== neededPassword) {
      Util.showMsg('Password not matched');
    }
  }

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
                  fontSize: 15,
                  lineHeight: 25,
                }}>
                We send the verification to school,  
              </Text>
                <Text
                style={{
                    ...AppStyle.TextStyle.titleExtraLarge,
                    paddingHorizontal: 5,
                    textAlign: 'center',
                    fontSize: 15,
                    lineHeight: 25,
                }}>Please wait till they activate your account.</Text>
              <View
                style={{
                  flexDirection: 'column',
                }}>
               
               <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                  }}>
                  <Text style={styles.text}>Want to Login ? </Text>
                  <Button
                    color="#555"
                    onPress={() => navigation.navigate('Login')}
                    style={{position: 'relative', bottom: 10}}>
                    Login
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
});
export default WaitingSchoolConfirm;
