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

import {Dropdown} from 'react-native-element-dropdown';
import {Button, Provider as PaperProvider, TextInput} from 'react-native-paper';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';
import ApiCalling, { axiosGet } from './network/ApiCalling';
import Util from './utils/Util';

const data = [
  {label: 'Create a new school', value: '1'},
  {label: 'Join a School', value: '2'},
];
const schoolNamelist = [
  {label: 'My First School', value: '1'},
  {label: 'My Second School', value: '2'},
  {label: 'Uniq', value: '2'},
  {label: 'Join a School', value: '2'},
];

// export const DropdownComponent = ({selected, selectedSet}) => {
//   const renderItem = item => {
//     return (
//       <View style={styles.item}>
//         <Text style={styles.textItem}>{item.label}</Text>;
//         {item.selected === selected && ''}
//         {/* {nameList.map(item => {
          
//         })} */}
//       </View>
//     );
//   };

//   return (
//     <>
//       <Dropdown
//         style={styles.dropdown}
//         placeholderStyle={styles.placeholderStyle}
//         selectedTextStyle={styles.selectedTextStyle}
//         inputSearchStyle={styles.inputSearchStyle}
//         data={schoolNamelist}
//         labelField="label"
//         valueField="value"
//         placeholder="Select School From list"
//         value={selected}
//         onChange={item => {
//           console.log(item.value);
//           selectedSet(item.value);
//           setShowDropdown(!showDropdown);
//         }}
//         renderItems={renderItem}
//       />
//     </>
//   );
// };

const JoinSchool = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState('1');
  const [showDropdown, setShowDropdown] = useState(false);
  const [namelist, setNameList] = useState([]);
  const [schoolId, setSchoolId] = useState(0);

   const DropdownComponent = ({selected, selectedSet}) => {
    // const renderItem = item => {
    //   return (
    //     <View style={styles.item}>
    //       <Text style={styles.textItem}>{item.label}</Text>;
    //       {/* {item.selected === selected && ''} */}
    //       {/* {nameList.map(item => {
            
    //       })} */}
    //     </View>
    //   );
    // };
  
    return (
      <>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Select school"
          value={selected}
          onChange={item => {
            
            console.log(item.value);
           item.value==2?(setShowDropdown(true), selectedSet(item.value)):(setShowDropdown(false), selectedSet(item.value));
            // setShowDropdown(!showDropdown)
          }}
          // renderItem={renderItem}
        />
        
      </>
    );
  };
  const DropdownComponent1 = ({nameList, setNameList}) => {
    // const renderItem = item => {
    //   return (
    //     <View style={styles.item}>
    //       <Text style={styles.textItem}>{item.label}</Text>;
    //       {/* {item.selected === selected && ''} */}
    //       {/* {nameList.map(item => {
            
    //       })} */}
    //     </View>
    //   );
    // };
  
    return (
      <>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={namelist}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          value={nameList}
          onChange={item => {
            
            console.log(item.value);
            setSchoolId(item.value);
            // setShowDropdown(!showDropdown)
          }}
          // renderItem={renderItem}
        />
        
      </>
    );
  };
  const getSchoolList = async () => {
    
    ApiCalling.apiCallParamsGet('school/get-school-list')
      .then(res => {
        const nameList = res.data.map((data) => {
         return {label:data.name, value:data.id}
        })
        console.log("school list data=",nameList);
        setNameList(nameList);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSchoolList();
  }, []);

  const confirmData = () => {
    if (selectedOption == 2) {
      JoinSchoolData();
      console.log('joinSchool');
    } else {
      navigation.navigate('CreateSchool');
    }
  };

  const JoinSchoolData = async () => {
   
    console.log(schoolId);
    if (schoolId > 0) {
      const data1 = {
        userId: Util.getUser().id,
        schoolId: schoolId,
      };
      console.log("record=",data1);


      ApiCalling.apiCallBodyDataPost('user/add-user-school', data)
        .then(res => {
          console.log(res);
          navigation.navigate('WaitingSchoolConfirm');
        })
        .catch(err => {
          console.log('Error', err);
        });
    }
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
                }}>
                What would you like to do?
              </Text>

              <View
                style={{
                  flexDirection: 'column',
                }}>
                <DropdownComponent
                  selected={selectedOption}
                  selectedSet={setSelectedOption}
                />
                {showDropdown && (
                  <DropdownComponent1
                    nameList={schoolId}
                    nameListSet={setSchoolId}
                  />
                )}
                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => confirmData()}
                  style={{
                    marginTop: 20,
                    marginBottom: 5,
                    backgroundColor: AppColors.colorCyan,
                  }}>
                  Confirm
                </Button>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 0,
                    marginTop: 20,
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
  dropdown: {
    marginTop: 10,
    height: 50,
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
export default JoinSchool;
