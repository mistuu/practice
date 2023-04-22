/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Node, useEffect, useState} from 'react';

import {SafeAreaView, StyleSheet, Text, Image, Platform} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';


import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';

import {useIsFocused} from '@react-navigation/native';
import {getItem} from './utils/AsyncConfig';
import Util from './utils/Util';

const SplashScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (Platform.OS === 'android') {
        setTimeout(() => {
          nextScreen();
        }, 1000);
      } else {
        nextScreen();
      }
    }
  });

  function nextScreen() {
   
      Util.getUser().then(data => {
        var LoginDetails = data;
        //console.log('Login', LoginDetails);
        if (LoginDetails != null && LoginDetails != '') {
          if (LoginDetails.is_staff) {
            if (LoginDetails.user_Schools.length != 0) {
              if (LoginDetails.user_Schools[0].RoleId) {
                // navigation.navigate("ParentsDashboard");
              navigation.navigate('TabNavigation');
                
                // navigation.navigate('Dashboard');
                //console.log('dashboard');
              } else {
                navigation.navigate('WaitingSchoolConfirm');
              }
            } else {
              navigation.navigate('JoinSchool');
            }
          } else {
            if (LoginDetails.is_parent) {
              const tmp = data.Parents;
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
              navigation.navigate('TabNavigation');
              // navigation.navigate('ParentsDashboard');
              //console.log('ParentsDashboard');
            } else {
              navigation.navigate('JoinSchool');
            }
          }
        } else {
          navigation.navigate('Login');
        }
      });
    
  }

  return (
    <PaperProvider theme={AppStyle.BaseTheme}>
      <SafeAreaView
        style={{
          ...AppStyle.Parent,
          backgroundColor: AppColors.white,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...AppStyle.TextStyle.titleExtraLarge,
            position: 'absolute',
            top: '50%',
            right: 0,
            left: 0,
            textAlign: 'center',
            fontSize: 25,
            color: AppColors.colorDark,
          }}>
          Welcome
        </Text>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({});

export default SplashScreen;
