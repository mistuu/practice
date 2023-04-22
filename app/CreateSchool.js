import React, {useEffect, useRef, useState} from 'react';
import Util from './utils/Util';
import ApiCalling from './network/ApiCalling';
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
import PhoneInput from 'react-native-phone-number-input';

import {Dropdown} from 'react-native-element-dropdown';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';

const data = [
  {label: 'Preschool or child care', value: '1'},
  {label: 'After school', value: '2'},
  {label: 'Campus', value: '3'},
  {label: 'Other', value: '4'},
];

const CreateSchool = ({navigation}) => {
  const [schoolType, setSchoolType] = useState(1);
  const [school, setSchool] = useState('');
  const [schoolError, setSchoolError] = useState('');
  const [capacity, setCapacity] = useState('');
  const [enrollerr, setEnrollerr] = useState('');

  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [lengthErr, setLengthErr] = useState('');
  const [valueErr, setValueErr] = useState();
  const [namelist, setNameList] = useState([]);
  // const phoneInput = useRef<PhoneInput>(null);
  const DropdownComponent = ({schools, schoolSet}) => {
    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {/* {item.selected === selected && ''} */}
        </View>
      );
    };

    return (
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={namelist}
        labelField="label"
        valueField="value"
        placeholder="Select school type"
        value={schoolType}
        onChange={item => {
          console.log('create school: ', item.value);
          setSchoolType(item.value);
          // setShowDropdown(!showDropdown);
        }}
        renderItem={renderItem}
      />
    );
  };
  const createSchoolHandle = () => {
    let isValid = true;
    if (school === '') {
      setSchoolError('Please enter school');
      isValid = false;
    }
    if (capacity === '') {
      setEnrollerr('Please enter capacity');
      isValid = false;
    }
    if (capacity === 0) {
      setEnrollerr('Please enter capacity');
      isValid = false;
    }
    if (phone === '' || phone.length < 6) {
      setPhoneErr('Invalid phone number');
      console.log('Invalid phone number');
      isValid = false;
    }
    if (isValid) {
      saveSchool();
    }
  };

  useEffect(() => {
    getSchoolType();
  }, []);
  const getSchoolType = async () => {
    ApiCalling.apiCallParamsGet('school_type')
      .then(res => {
        console.log('school list data=', res);

        const nameList = res.data.map(data => {
          return {label: data.type, value: data.id};
        });
        console.log('school list data=', nameList);
        setNameList(nameList);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const saveSchool = async () => {
    const user = await Util.getUser();
    const data = {
      school_type_id: parseInt(schoolType),
      name: school,
      capacity: parseInt(capacity),
      contact_phone: phone,
      country_id: 1,
    };

    console.log('User data: ');
    console.log(data);

    ApiCalling.apiCallBodyDataPost('school/add-school', data)
      .then(res => {
        console.log(res);
        console.log(res.data);
        if (res.data.status === true) {
          console.log('Success');
          Util.saveSelectedSchool(res.data.school);
          navigation.navigate('Dashboard');
          console.log('Dashboard');
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.log('Error', err);
      });
  };

  const checkSchool = e => {
    setSchool(e.target.value);
  };
  const checkEnroll = e => {
    const value = e.target.value.replace(/\D/g, '');
    setCapacity(value);
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
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                What would you like to do?
              </Text>

              <View
                style={{
                  flexDirection: 'column',
                }}>
                <TextInput
                  placeholder="School Name"
                  value={school}
                  mode="outlined"
                  autoFocus={false}
                  blurOnSubmit={true}
                  clearButtonMode="never"
                  keyboardType="text"
                  onChangeText={text => {
                    setSchool(text);
                    checkSchool;
                  }}
                  style={styles.input}
                  outlineColor={AppColors.borderColor}
                />
                <Text style={{fontSize: 12, color: 'red'}}>
                  {school === '' ? <>{schoolError}</> : ''}
                </Text>
                <DropdownComponent
                  schools={schoolType}
                  schoolSet={setSchoolType}
                />

                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  <TextInput
                    placeholder="Enrolment capacity"
                    value={capacity}
                    mode="outlined"
                    autoFocus={false}
                    blurOnSubmit={true}
                    clearButtonMode="never"
                    keyboardType="text"
                    onChangeText={text => {
                      setCapacity(text);
                      checkEnroll;
                    }}
                    style={styles.input}
                    outlineColor={AppColors.borderColor}
                  />
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {capacity === '' ? <>{enrollerr}</> : ''}
                  </Text>
                </View>

                {/* <TextInput
                  placeholder="Phone"
                  value={phone}
                  mode="outlined"
                  autoFocus={false}
                  blurOnSubmit={true}
                  clearButtonMode="never"
                  activeOutlineColor="grey"
                  keyboardType="numeric"
                  onChangeText={text => {
                    setPhone(text);
                  }}
                  style={styles.input}
                  outlineColor={AppColors.borderColor}
                /> */}
                <PhoneInput
                  // ref={phoneInput}
                  // defaultValue={"+971"}
                  withShadow={false}
                  flagButtonStyle={{
                    margin: 0,
                    padding: 0,
                  }}
                  containerStyle={{
                    margin: 0,
                    padding: 0,
                    elevation: 0,
                    backgroundColor: AppColors.white,
                    borderColor: AppColors.borderColor,
                    borderWidth: 0.8,
                  }}
                  textInputStyle={{
                    margin: 0,
                    padding: 0,
                  }}
                  defaultCode="AE"
                  layout="first"
                  onChangeText={text => {
                    setPhone(text);
                    setPhoneErr('');
                  }}
                  // onChangeFormattedText={text => {
                  //   setFormattedValue(text);
                  // }}
                  withDarkTheme
                  withShadow
                  autoFocus
                />
                <Text style={{fontSize: 13, color: 'red'}}>
                  {phoneErr !== '' ? <> {phoneErr} </> : ''}
                </Text>

                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => {
                    createSchoolHandle();
                  }}
                  style={{
                    marginTop: 20,
                    marginBottom: 5,
                    backgroundColor: AppColors.colorCyan,
                  }}>
                  Create School
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
                    onPress={() => navigation.goBack('VerifyEmail')}
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
  outlineBtn: {
    borderColor: AppColors.borderColor,
    borderWidth: 1,
  },
  dropdown: {
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#000',
  },
});
export default CreateSchool;
