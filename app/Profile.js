import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import ToolBar from './components/ToolBar';
import AppColors from './common/AppColor';
import {TextInput, Button, accessibilityLabel} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import TextAvatar from 'react-native-text-avatar';
import Util from './utils/Util';
import ApiCalling from './network/ApiCalling';
import BASE_URL, {URL_IMAGE_MY_PROFILE, URL_IMAGE_STUDENT_PHOTO} from './common/Config';
import ProgressDialog from './components/ProgressDialog';
import PhoneInput from 'react-native-phone-number-input';
import * as ImagePicker from 'react-native-image-picker';
import AppStyle from './common/AppStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FAB, Portal, Provider} from 'react-native-paper';
import CustomDropdown from './CustomDropdown';
import Feed from './Feed';
import { storeItem } from './utils/AsyncConfig';
import axios from 'axios';
import moment from 'moment';
import Contacts from './Contacts';

const options = {
  mediaType: 'photo',
  includeBase64: false,
  selementctionLimit: 1,
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const ProfileFabButton = ({isOpen, action,setIsActive,setIsAct}) => {
  return (
    <Provider>
      <Portal>
        <FAB.Group
          fabStyle={{
            backgroundColor: AppColors.calendarPrimary,
          }}
          theme={{colors: {accent: 'blue'}}}
          style={styles.fabGroup}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          accessibilityRole="button"
          containerStyle={{
            width: '100%',
            height: '100%',
            backgroundColor: AppColors.blackTransparentColor,
            position: 'absolute',
            left: 0,
            right: 0,
          }}
          open={isOpen}
          color={AppColors.white}
          // visible
          icon={isOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'car',
              label: 'Pick up info',
              onPress: () =>{setIsActive(0), setIsAct(true)},
            },
            {
              icon: 'umbrella-beach-outline',
              label: 'Vacation',
              onPress: () => console.log('Pressed email'),
            },
            {
              icon: 'calendar-range',
              label: 'Sick',
              onPress: () => console.log('Pressed notifications'),
            },
          ]}
          onStateChange={() => action(!isOpen)}
          onPress={() => {
            if (isOpen) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </Provider>
  );
};

const Profile = ({navigation,props}) => {
  const [isLoading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = React.useState('');
  const [firstNameErr, setFirstNameErr] = useState('');
  const [avtar, setAvtar] = useState(null);

  const [lastName, setLastName] = React.useState('');
  const [lastNameErr, setlastNameErr] = useState('');
  const [email, setEmail] = React.useState('');
  const [emailErr, setEmailErr] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selementctedImage, setSelementctedImage] = useState(null);
  const [isActive, setIsActive] = useState(0);
  const [tabLine, setTabLine] = useState(0);
  const [isOpenFabButton, setIsOpenFabButton] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [studentFirstName, setStudentFirstName] = useState([]);
  const [studDOB, setstudDOB] = useState(null);
  const [studentLastName, setStudentLastName] = useState([]);
  const [studentPhoto, setStudentPhoto] = useState([]);
  const [classRoomName, setClassRoomName] = useState([]);
  const [pickupInfo, setPickupInfo] = useState([]);
  const [student_photo, setStudent_Photo] = useState([]);
  const [isAct,setIsAct]=useState(false)
  const [selected, setSelected] = useState("");
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // const [selectedChild, setSelectedChild] = useState({});

  // useEffect(() => {
  //   getProfile();
  // }, []);

  // const getProfile = async () => {
  //   setLoading(true);
  //   Util.getUser().then(data => {
  //     const tmp = data.Parents;
  //     const list = [];
  //     tmp.forEach(element => {
  //       const newelementment = {
  //         // id:element.name.Student.id,
  //         name: element.Student.first_name + ' ' + element.Student.last_name,
  //         first_name: element.Student.first_name,
  //         last_name: element.Student.last_name,
  //         photo: element.Student.photo,
  //         School: element.Student.School,
  //         classroom: element.Student.classroom.name,
  //       };
  //       list.push(newelementment);
  //     });
  //     console.log('newelement', JSON.stringify(data));
  //     console.log('listdata::', list);

  //     setStudentFirstName(list[0].first_name);
  //     setStudentLastName(list[0].last_name),
  //       setStudentAvatar(list[0].photo),
  //       setClassRoomName(list[0].classroom),
  //       // setPickupInfo(list[0])
  //       console.log('photo', list[0].photo);

  //     //   setUserId(data.id);
  //     // setEmail(data.email);
  //     // setFirstName(data.firstName);
  //     // setLastName(data.lastName);
  //     // setPhone(data.mobile);
  //     // if (data.avatar != null && data.avatar != '') {
  //     //   setAvtar({uri: BASE_URL + 'avatar/' + data.avatar});
  //     // } else {
  //     //   setAvtar(require('../app/assets/user.png'));
  //     // }
  //     setLoading(false);
  //     console.log('profileData', data);
  //   });
  // };

  useEffect(() => {
   getdata()
   const unsubscribe = navigation.addListener('focus', () => {
    //Your refresh code gets here
    getdata()
  });
  return () => {
    unsubscribe();
  };
  }, [navigation, isAct]);
const getdata=async()=>{
  setLoading(true)
  Util.getUser().then(async d=>{
    if(d.is_staff){
      console.log(d);
      Util.showMsg("Under Devlopment")
      setLoading(false)
      // if (d.avatar !== null) {
      //   setStudentPhoto({uri: URL_IMAGE_MY_PROFILE + d.avatar});
      // }
      // console.log('Childdata', data);
      // setStudentFirstName(d.firstName);
      // setStudentLastName(d.lastName);
      // setLoading(false)
    }else{
      await Util.getSelectedChild().then(data => {
        // console.log("Sele",data);
        // setSelectedChild(data);
        if (data.photo !== null) {
          setStudentPhoto({uri: URL_IMAGE_STUDENT_PHOTO + data.photo});
        }
        console.log('Childdata', data);
        setSelected(data.pickup_info_id)
        setstudDOB(data.dob)
        setStudentFirstName(data.first_name);
        setStudentLastName(data.last_name);
        setStudentPhoto(data.photo);
        setClassRoomName(data.classroom.name);
        setLoading(false)
        var params = {
          user: data.id,
          school: data.School.id,
        };
        // console.log(params);
        ApiCalling.apiCallParamsGetWithHeader('pickup-info/list', params).then(
          async res => {
            console.log('Response==', res.data);
            var data = [];
            await res.data.filter(i => {
              data.push({id: i.id, label: i.title});
            });
            // console.log(data);
            setPickupInfo(data);
          },
        );
      });
    }
  })
 
}
  const selementctImage = async () => {
    let isCameraPermitted = await Util.requestCameraPermission();
    let isStoragePermitted = await Util.requestExternalWritePermission();
    let isStorageReadPermitted = await Util.requestExternalReadPermission();

    console.log('isCameraPermitted', isCameraPermitted);
    console.log('isStoragePermitted', isStoragePermitted);
    console.log('isStorageReadPermitted', isStorageReadPermitted);

    if (isCameraPermitted || isStoragePermitted || isStorageReadPermitted) {
      setModalVisible(true);
    } else {
      if (!isCameraPermitted) {
        await Util.requestCameraPermission();
      }
      if (!isStoragePermitted) {
        await Util.requestExternalWritePermission();
      }
      if (!isStorageReadPermitted) {
        await Util.requestExternalReadPermission();
      }
      Util.showMsg('Please allow permission.');
    }
  };

  const onImageSelementctionResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled camera picker');
      return;
    } else if (response.errorCode == 'camera_unavailable') {
      Util.showMsg('Camera not available on device');
      return;
    } else if (response.errorCode == 'permission') {
      Util.showMsg('Permission not satisfied');
      return;
    } else if (response.errorCode == 'others') {
      Util.showMsg(response.errorMessage);
      return;
    }
    // this.compressImage(response);
    console.log('onImageSelementctionResponse : ---->');
    console.log(response.assets[0]);
    setSelementctedImage(response.assets[0]);
    setStudent_Photo({uri: response.assets[0].uri});
    saveHandler(response.assets[0]);
    
    
    // this.setState({
    //   selementctedImage: response.assets[0],
    // });
  };


  const saveHandler = async selectedImage => {
    if (selectedImage === null) {
      return;
    }

    var formData = new FormData();
    // formData.append('email', email);
    // formData.append('firstName', firstName);
    // formData.append('lastName', lastName);
    // formData.append('mobile', phone);
    if (selectedImage != null) {
      formData.append('photo', {
        uri: selectedImage.uri,
        type: selectedImage.type,
        name: selectedImage.fileName,
      });
    }
    setLoading(true);
    const child = await Util.getSelectedChild();
    console.log("Forma data==", {
      uri: selectedImage.uri,
      type: selectedImage.type,
      name: selectedImage.fileName,
    });
    try {
      await ApiCalling.apiPostMultipartProfile(
        'student/edit-photo/' + child.id,
        formData).then(async res => {
        console.log('resData::', res.data);
        Util.showMsg(res.data.message);
        UpdateAllData()
        setLoading(false);
        // navigation.goBack(null);
      });
    } catch (error) {
      Util.showMsg(error);
    }
  };
 const UpdateAllData=async()=>{
    try {
      Util.getUser().then(data => {
        ApiCalling.apiCallBodyDataGet('user/get-user-byId/' + data.id)
          .then(async res => {
            if (Util.isValidData(res.data)) {
              console.log('data: ', res.data);
              Util.saveUser(res.data);
              await storeItem('LoginDetails', JSON.stringify(res.data));
              if (res.data.is_staff) {
                if (res.data.user_Schools.length != 0) {
                  if (res.data.user_Schools[0].RoleId) {
                    // Util.saveSelectedSchool(res.user.user_Schools[0].RoleId);
                    Util.saveSelectedSchool(res.data.user_Schools[0].school);
                  
    
                    navigation.replace("TabNavigation");
                    // navigation.navigate('Dashboard');
                    console.log('dashboard');
                  } else {
                    // navigation.navigate('WaitingSchoolConfirm');
                  }
                } else {
                  // navigation.navigate('JoinSchool');
                }
              } else {
                if (res.data.is_parent) {
                  const tmp = res.data.Parents;
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
                  Util.getSelectedChild().then(data => {
                    // console.log(data);
                    // setSelectedChild(data);
                    if (data.photo !== null) {
                      setStudentPhoto({uri: URL_IMAGE_STUDENT_PHOTO + data.photo});
                    }
                  })
                  navigation.replace("TabNavigation");

                  // navigation.navigate('ParentsDashboard');
                  // navigation.navigate('TabNavigation');
    
                  console.log('ParentsDashboard');
                } else {
                  // navigation.navigate('JoinSchool');
                }
              }
            } else {
              setLoginError('Not getting data of user');
            }

          })
          .catch(error => {
            console.log(error);
          });
      });
    } catch (error) {
      
    }
  }
  const ProfileHeader = ({toolbarTitle}) => {
    return (
      <View
        style={{
          position: 'relative',
          zIndex: 5,
          justifyContent: 'center',
          height:
            Platform.OS === 'ios' && DeviceInfo.hasNotch()
              ? 68
              : Platform.OS === 'ios' && !DeviceInfo.hasNotch()
              ? 62
              : 56,
          // paddingStart: 6,
          // paddingEnd: 16,
          paddingHorizontal: 15,
          backgroundColor: AppColors.white,
          // elementvation: 1,
          zIndex: 1,
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{...AppStyle.TextStyle.titleExtraLarge}}>
            {toolbarTitle}
          </Text>
        </View>
      </View>
    );
  };

const handlePickupInfo=async()=>{
  try {
    console.log(selected);
    await Util.getSelectedChild().then(data => {
      var temp=data
      console.log("Childe data Before==",temp);
      ApiCalling.apiCallParamsGet("student/edit-Pickup-info/"+data.id+"/"+selected).then(res=>{
        console.log("Update data==",temp.pickup_info_id);
        temp.pickup_info_id=res.data.user.pickup_info_id
        console.log("Pick up id==",res.data.user.pickup_info_id);
        console.log("After updated data==",temp);
        Util.saveSelectedChild(temp);

      })
    })
  } catch (error) {
    
  }
}
function getAgeFromBirthday(birthday) {
  if(birthday){
    var totalMonths = moment().diff(birthday, 'months');
    var years = parseInt(totalMonths / 12);
    var months = totalMonths % 12;
      if(months !== 0){
         return years + ' years and ' + months+' months';
       }
  return years + ' years';
    }
  return null;
}
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
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
        <View style={styles.container}>
          {ProgressDialog.CustomProgressBar(isLoading)}
          <ProfileHeader toolbarTitle={'Profile'} />
          {/* <ScrollView> */}
            <View>
              <TouchableOpacity onPress={() => selementctImage()}>
                <View style={styles.profileContainer}>
                  {studentPhoto === null ? (
                    <TextAvatar
                      backgroundColor={AppColors.colorPrimary}
                      textColor={AppColors.white}
                      size={120}
                      type={'circle'} // optional
                    >
                      {studentFirstName.toUpperCase() +
                        '' +
                        studentLastName.toUpperCase()}
                    </TextAvatar>
                  ) : (
                    <View style={{position: 'relative'}}>
                      <View>
                        <Image
                          style={styles.ProfileImage}
                          source={{
                            uri: URL_IMAGE_STUDENT_PHOTO + studentPhoto,
                          }}
                        />

                        <View style={styles.pencilWrap}>
                          <MaterialCommunityIcons
                            name="pencil-outline"
                            size={20}
                            style={styles.pencilIcon}
                            color={AppColors.white}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.profileWrap}>
                <Text style={styles.profileTitle}>
                  {studentFirstName} {studentLastName}
                </Text>
                <Text style={styles.profileSubTitle}>
                  {getAgeFromBirthday(studDOB)} | {classRoomName}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  marginTop: 50,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => setIsActive(0)}>
                  <MaterialCommunityIcons
                    name="emoticon-outline"
                    size={20}
                    style={{marginRight: 5}}
                    color={
                      isActive === 0
                        ? AppColors.mainColor
                        : AppColors.subTitleColor
                    }
                  />
                  <Text
                    style={{
                      ...AppStyle.TextStyle.inputTextFont,
                      // borderBottomWidth: 5,
                      // borderRadius: 5,
                      position: 'relative',

                      color:
                        isActive === 0
                          ? AppColors.mainColor
                          : AppColors.subTitleColor,
                    }}>
                    About
                  </Text>
                  {isActive === 0 ? (
                    <View style={styles.activeLine}></View>
                  ) : null}
                </TouchableOpacity>

                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => setIsActive(1)}>
                  <MaterialCommunityIcons
                    name="newspaper"
                    size={20}
                    style={{marginRight: 5}}
                    color={
                      isActive === 1
                        ? AppColors.mainColor
                        : AppColors.subTitleColor
                    }
                  />
                  <Text
                    style={{
                      ...AppStyle.TextStyle.inputTextFont,
                      color:
                        isActive === 1
                          ? AppColors.mainColor
                          : AppColors.subTitleColor,
                    }}>
                    Feed
                  </Text>
                  {isActive === 1 ? (
                    <View style={styles.activeLine}></View>
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => setIsActive(2)}>
                  <MaterialCommunityIcons
                    name="card-account-mail-outline"
                    style={{marginRight: 5}}
                    size={20}
                    color={
                      isActive === 2
                        ? AppColors.mainColor
                        : AppColors.subTitleColor
                    }
                  />
                  <Text
                    style={{
                      ...AppStyle.TextStyle.inputTextFont,
                      color:
                        isActive === 2
                          ? AppColors.mainColor
                          : AppColors.subTitleColor,
                    }}>
                    Contacts
                  </Text>
                  {isActive === 2 ? (
                    <View style={styles.activeLine}></View>
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    color:
                      isActive == 3
                        ? AppColors.mainColor
                        : AppColors.subTitleColor,
                  }}
                  onPress={() => setIsActive(3)}>
                  <MaterialCommunityIcons
                    name="panorama-outline"
                    style={{marginRight: 5}}
                    size={20}
                    color={
                      isActive === 3
                        ? AppColors.mainColor
                        : AppColors.subTitleColor
                    }
                  />
                  <Text
                    style={{
                      ...AppStyle.TextStyle.inputTextFont,
                      color:
                        isActive === 3
                          ? AppColors.mainColor
                          : AppColors.subTitleColor,
                    }}>
                    Media
                  </Text>
                  {isActive === 3 ? (
                    <View style={styles.activeLine}></View>
                  ) : null}
                </TouchableOpacity>
              </View>

              {isActive === 0 && (
                <ScrollView>
                  <CustomDropdown
                    icon={'car'}
                    title={'Pickup info'}
                    data={pickupInfo}
                    selected={selected}
                    setSelected={setSelected}
                    isAct={isAct}
                    handlePickupInfo={handlePickupInfo}
                  />
                  <CustomDropdown
                    icon={'file-account-outline'}
                    title={'Personal info'}
                    // data={null}
                  />
                  <CustomDropdown
                    icon={'smart-card-outline'}
                    title={'Health info'}
                    // data={null}
                  />
                  <CustomDropdown
                    icon={'account-check-outline'}
                    title={'Registration info'}
                    // data={null}
                  />
                </ScrollView>
              )}

              {isActive === 1 && (
                <>
                  <ScrollView>
                    <Feed />
                  </ScrollView>
                </>
              )}

              {isActive === 2 && (
                <>
                <ScrollView>
                  <Contacts/>
                </ScrollView>
                </>
              )}
              {isActive === 3 && (
                <>
                  <Text>Media</Text>
                </>
              )}

              {/* <View style={styles.profileCard}>
                <TextInput
                  label="First Name"
                  mode="outlined"
                  value={firstName}
                  onChangeText={text => {
                    setFirstName(text);
                  }}
                  outlineColor={AppColors.accent}
                  style={styles.input}
                />
                <Text style={styles.error}>
                  {firstName === '' ? <>{firstNameErr}</> : null}
                </Text>
                <TextInput
                  outlineColor={AppColors.accent}
                  label="Last Name"
                  mode="outlined"
                  value={lastName}
                  style={styles.input}
                  onChangeText={text => setLastName(text)}
                />
                <Text style={styles.error}>
                  {lastName === '' ? <>{lastNameErr}</> : null}
                </Text>
                <TextInput
                  outlineColor={AppColors.accent}
                  label="Email"
                  mode="outlined"
                  value={email}
                  editable={false}
                  onChangeText={email => setEmail(email)}
                  style={styles.input}
                />
                <Text style={styles.error}>
                  {email === '' ? (
                    <>{emailErr}</>
                  ) : reg.test(email) === false ? (
                    <>{emailErr}</>
                  ) : null}
                </Text>

                <PhoneInput
                  // ref={phoneInput}
                  // defaultValue={"+971"}

                  codeTextStyle={{
                    marginTop: -3,
                    fontWeight: '500',
                    fontSize: 15,
                  }}
                  withShadow={false}
                  flagButtonStyle={{
                    margin: -2,
                    padding: 0,
                    height: 50,
                    backgroundColor: AppColors.ghostWhite,
                  }}
                  textContainerStyle={{
                    backgroundColor: AppColors.white,
                  }}
                  containerStyle={{
                    margin: 0,
                    padding: 0,
                    elementvation: 0,
                    borderWidth: 0.8,
                    marginHorizontal: 15,
                    width: '91%',
                    borderRadius: 6,
                    height: 50,
                    overflow: 'hidden',
                    marginTop: 10,
                  }}
                  textInputStyle={{
                    margin: 0,
                    padding: 0,
                    fontSize: 15,
                  }}
                  defaultCode="AE"
                  layout="first"
                  onChangeText={text => {
                    setPhone(text);
                    setPhoneErr('');
                  }}
                  withDarkTheme={false}
                  autoFocus={false}
                />
                <Text style={styles.error}>
                  {phoneErr !== '' ? <> {phoneErr} </> : ''}
                </Text>
                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  onPress={saveHandler}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  style={{
                    marginTop: 20,
                    marginBottom: 5,
                    backgroundColor: AppColors.colorCyan,
                    marginHorizontal: 15,
                  }}>
                  Save
                </Button>
              </View> */}
            </View>
          {/* </ScrollView> */}
          <Modal
            isVisible={modalVisible}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeComplete={() => setModalVisible(false)}
            swipeDirection="left"
            onBackButtonPress={() => setModalVisible(false)}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  width: '90%',
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: AppColors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    padding: 10,
                    color: Colors.primary,
                  }}>
                  Choose Image
                </Text>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: AppColors.divider,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    ImagePicker.launchCamera(
                      {
                        mediaType: 'photo',
                        includeBase64: false,
                        quality: 0.5,
                        saveToPhotos: true,
                        selementctionLimit: 1,
                      },
                      response => {
                        onImageSelementctionResponse(response);
                      },
                    );
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      padding: 10,
                      color: AppColors.textPrimary,
                      fontWeight: '500',
                    }}>
                    Camera
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: AppColors.divider,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    ImagePicker.launchImageLibrary(options, response => {
                      onImageSelementctionResponse(response);
                    });
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      padding: 10,
                      color: AppColors.textPrimary,
                      fontWeight: '500',
                    }}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <ProfileFabButton
            isOpen={isOpenFabButton}
            action={setIsOpenFabButton}
            setIsActive={setIsActive}
            setIsAct={setIsAct}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  item: {
    padding: 15,
    marginHorizontal: 10,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 100,
    alignSelf: 'center',
    height: 100,
    borderRadius: 100 / 2,
  },
  ProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    // resizeMode: 'contain',
  },
  dividerLine: {
    height: 0.5,
    backgroundColor: AppColors.darkDivider,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  profileCard: {
    backgroundColor: AppColors.colorWhite,
    borderRadius: 8,
    elementvation: 4,
    margin: 10,
    paddingVertical: 20,
  },

  input: {
    flex: 1,
    marginTop: 5,
    height: 50,
    justifyContent: 'center',
    fontSize: 15,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    paddingHorizontal: 5,
    marginHorizontal: 15,
  },
  saveButton: {
    backgroundColor: AppColors.mainColor,
    marginTop: 20,
    borderRadius: 6,
    marginHorizontal: 15,
  },
  saveText: {
    color: AppColors.white,
  },
  error: {
    fontSize: 12,
    color: 'red',
    paddingHorizontal: 20,
    marginVertical: 2,
  },
  phoneInput: {
    borderWidth: 0.6,
    borderColor: AppColors.mainColor,
  },
  profileWrap: {justifyContent: 'center', alignItems: 'center', paddingTop: 5},
  activeLine: {
    borderBottomColor: AppColors.mainColor,
    borderBottomWidth: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    position: 'absolute',
    bottom: -4,
    left: 15,
    right: 0,
  },
  pencilWrap: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: AppColors.calendarPrimary,
    color: AppColors.white,
    elementvation: 1,
  },
  pencilIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 5,
    right: 0,
    top: 5,
  },
  profileTitle: {
    ...AppStyle.TextStyle.titleExtraLarge,
    color: AppColors.primaryTextColor,
    fontSize: 26,
  },
  profileSubTitle: {
    ...AppStyle.TextStyle.subTitle,
    color: AppColors.subTitleColor,
    fontSize: 12,
  },
  fabGroup: {
    position: 'absolute',
    height: '100%',
    right: 0,
    left: 0,
    zIndex: 1,
    flex: 1,
    backgroundColor: AppColors.blackTransparentColor,
  },
});
