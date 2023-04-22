import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
  BackHandler,
  FlatList,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiCalling from '../../network/ApiCalling';
import CheckBox from '@react-native-community/checkbox';
import ImgToBase64 from 'react-native-image-base64';
import ImageResizer from 'react-native-image-resizer';
import * as ImagePicker from 'react-native-image-picker';
import {FlashOnRounded} from '@material-ui/icons';
import moment from 'moment';
import MaterialCommunityIconss from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon2 from 'react-native-vector-icons/Feather';
import MaterialIcon3 from 'react-native-vector-icons/Ionicons';
import Util from '../../utils/Util';
import ToolBar from '../../components/ToolBar';
import AppColors from '../../common/AppColor';
import {Button} from 'react-native-paper';
import ProgressDialog from '../../components/ProgressDialog';
import TextAvatar from 'react-native-text-avatar';
import BASE_URL, {URL_IMAGE_POST} from '../../common/Config';
import DocumentPickerHandle from 'react-native-document-picker';

const menuIconColor = Colors.primary;
const menuIconSize = 22;

const options = {
  mediaType: 'photo',
  includeBase64: false,
  selectionLimit: 1,
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class ActivityDetails extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      studIds: 0,
      category: [],
      checked: false,
      selectedCatItems: [],
      data: null,
      isLoading: false,
      description:
        this.props.route.params?.des == undefined
          ? null
          : this.props.route.params?.des,
      modalVisible: false,
      startTime: new Date(),
      isDisplayDate: false,
      endTime: new Date(),
      isDisplayEndDate: false,
      imagePath: null,
      imageBase64StringPhotoProof: null,
      selectedImage:
        this.props.route.params?.allFiles == undefined
          ? []
          : this.props.route.params?.allFiles,
      fileSendModal: false,
      temp:
        this.props.route.params?.key == undefined
          ? []
          : this.props.route.params?.key,
      student_ids: [],
      stage_ids: [],
      grade_ids: [],
      deleteMediaIds: [],
      update: false,
      PmodalVisible: false,
      draftData: null,
      updateVal: this.props.route.params?.update,
      draft: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    console.log('Update Valuy=', this.props.route.params?.update);
    if (this.props.route.params?.update == 1) {
      this.setState({update: true});
    }

    console.log('Key', this.props.route.params?.data);
    // type: type == 1 ? 'stage' : type == 2 ? 'Grades' : 'Students',
    // if (this.props.route.params?.data != undefined) {
    //   this.setState({
    //     description: this.props.route.params?.data?.description,
    //     update: true,
    //     updateVal: 1,
    //   });

    //   this.props.route.params?.data?.ActivityMedia.filter(f => {
    //     if (f.name.match(/.png/)) {
    //       this.state.selectedImage.push({
    //         uri: URL_IMAGE_POST + f.name,
    //         name: f.name,
    //         type: 'image/png',
    //       });
    //     } else if (f.name.match(/.jpeg/)) {
    //       this.state.selectedImage.push({
    //         uri: URL_IMAGE_POST + f.name,
    //         name: f.name,
    //         type: 'image/jpeg',
    //       });
    //     } else if (f.name.match(/.jpg/)) {
    //       this.state.selectedImage.push({
    //         uri: URL_IMAGE_POST + f.name,
    //         name: f.name,
    //         type: 'image/jpg',
    //       });
    //     } else if (f.name.match(/.pdf/)) {
    //       this.state.selectedImage.push({
    //         uri: URL_IMAGE_POST + f.name,
    //         name: f.name,
    //         type: 'application/pdf',
    //       });
    //     }
    //   });
    //   this.props.route.params?.data?.ActivityStudents.filter(d => {
    //     if (d.Stage != null) {
    //       this.state.temp.push({
    //         name: d.Stage?.stage,
    //         type: 'stage',
    //         id: d.Stage?.id,
    //       });
    //     } else if (d.Grade != null) {
    //       console.log('grade data==', d);
    //       this.state.temp.push({
    //         name: d.Grade?.title,
    //         type: 'Grades',
    //         id: d.Grade?.id,
    //       });
    //     } else if (d.Student != null) {
    //       this.state.temp.push({
    //         name: d.Student?.first_name,
    //         type: 'student',
    //         id: d.Student?.id,
    //       });
    //     }
    //   });
    //   this.props.route.params?.data?.ActivityMedia?.filter(m => {
    //     this.state.deleteMediaIds.push(m.id);
    //   });
    // }

    this.getData(this.props.route.params?.data);
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  clearData=()=>{
    this.setState({
      studIds: 0,
      category: [],
      checked: false,
      selectedCatItems: [],
      data: null,
      isLoading: false,
      description:null,
      modalVisible: false,
      startTime: new Date(),
      isDisplayDate: false,
      endTime: new Date(),
      isDisplayEndDate: false,
      imagePath: null,
      imageBase64StringPhotoProof: null,
      selectedImage:[],
      fileSendModal: false,
      temp:[],
      student_ids: [],
      stage_ids: [],
      grade_ids: [],
      deleteMediaIds: [],
      update: false,
      PmodalVisible: false,
      draftData: null,
      updateVal: 0,
      draft: false,
    })
  }
  getData = async id => {
    // this.clearData()
    try {
      // console.log(res);
      this.setState({isLoading: true});
      await ApiCalling.apiCallParamsGet('activity/getById/' + id).then(res => {
        console.log('res.data', res.data);

        this.setState({activityData: res.data});
        if (res.data != undefined) {
          this.setState({
            description: res.data?.description,
            update: true,
            updateVal: 1,
          });

          res.data?.ActivityMedia.filter(f => {
            if (f.name.match(/.png/)) {
              this.state.selectedImage.push({
                uri: URL_IMAGE_POST + f.name,
                name: f.name,
                type: 'image/png',
              });
            } else if (f.name.match(/.jpeg/)) {
              this.state.selectedImage.push({
                uri: URL_IMAGE_POST + f.name,
                name: f.name,
                type: 'image/jpeg',
              });
            } else if (f.name.match(/.jpg/)) {
              this.state.selectedImage.push({
                uri: URL_IMAGE_POST + f.name,
                name: f.name,
                type: 'image/jpg',
              });
            } else if (f.name.match(/.pdf/)) {
              this.state.selectedImage.push({
                uri: URL_IMAGE_POST + f.name,
                name: f.name,
                type: 'application/pdf',
              });
            }
          });
          res.data?.ActivityStudents.filter(d => {
            if (d.Stage != null) {
              this.state.temp.push({
                name: d.Stage?.stage,
                type: 'stage',
                id: d.Stage?.id,
              });
            } else if (d.Grade != null) {
              console.log('grade data==', d);
              this.state.temp.push({
                name: d.Grade?.title,
                type: 'Grades',
                id: d.Grade?.id,
              });
            } else if (d.Student != null) {
              this.state.temp.push({
                name: d.Student?.first_name,
                type: 'student',
                id: d.Student?.id,
              });
            }
          });
          res.data?.ActivityMedia?.filter(m => {
            this.state.deleteMediaIds.push(m.id);
          });
        }
        this.setState({isLoading: false});
      });

      ApiCalling.apiCallBodyDataGet('activity/getMyDraftedActivities').then(
        res => {
          console.log(res.data);
          this.setState({draftData: res.data});
        },
      );
      Util.getUser().then(data => {
        console.log('data', data);
        this.setState({data: data});
      });
      // setStudentList(res.data);
    } catch (error) {}
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  handleBackButtonClick() {
    this.onBackClick();
    return true;
  }
  onStateSelectedItemsChange = async (value, index) => {
    // let x = null
    // console.log(value);
    // // value=Object.assign({}, value)
    // await this.state.data.forEach(element => {
    //   if (element.id == value[0]) {
    //     x = element.name

    //   }
    //   // console.log("values:", element);
    // });

    // console.log("values:", x);
    this.setState({selectedCatItems: value});
    // this.state.visitorDetails.filter(i=>{
    //   value.filter(x=>{
    //     console.log(i);
    //     if(i.userId==x){
    //       this.state.tempList.push(i)
    //     }
    //   }
    //     )
    // })
    // console.log("Selcted Item:-", value);
  };

  changeSelectedDate = (event, selectedValue) => {
    console.log(moment(selectedValue).format('hh:mm a'));
    this.setState({startTime: selectedValue});
    this.setState({isDisplayDate: false});
  };

  changeSelectedEndDate = (event, selectedValue) => {
    console.log(moment(selectedValue).format('hh:mm a'));
    this.setState({endTime: selectedValue});
    this.setState({isDisplayEndDate: false});
  };

  async selectImage() {
    let isCameraPermitted = await Util.requestCameraPermission();
    let isStoragePermitted = await Util.requestExternalWritePermission();
    let isStorageReadPermitted = await Util.requestExternalReadPermission();

    console.log('isCameraPermitted', isCameraPermitted);
    console.log('isStoragePermitted', isStoragePermitted);
    console.log('isStorageReadPermitted', isStorageReadPermitted);

    if (isCameraPermitted || isStoragePermitted || isStorageReadPermitted) {
      this.setState({fileSendModal: !this.state.fileSendModal});
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
  }

  onImageSelectionResponse(response) {
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
    console.log('onImageSelectionResponse : ---->');
    console.log(response.assets[0]);

    // this.setState({
    //   selectedImage: response.assets[0],
    // });
    this.state.selectedImage.push({
      uri: response.assets[0].uri,
      type: response.assets[0].type,
      name: response.assets[0].fileName,
    });
    this.setState({fileSendModal: false});
  }
  onSelectFile = async () => {
    try {
      var res = await DocumentPickerHandle.pick({
        type: [DocumentPickerHandle.types.pdf],
      });

      this.state.selectedImage.push(res[0]);
      this.setState({fileSendModal: false});

      console.log('All Files Pick===', res);
    } catch (error) {}
  };
  onSelectAudioFile = async () => {
    try {
      var res = await DocumentPickerHandle.pick({
        type: [DocumentPickerHandle.types.audio],
      });
      this.state.selectedImage.push(res[0]);
      this.setState({fileSendModal: false});

      console.log('All Files Pick===', res);
    } catch (error) {}
  };
  submitForm = async () => {
    await this.state?.temp?.filter(d => {
      if (d.type == 'stage') {
        this.state.stage_ids.push(d.id);
      } else if (d.type == 'Grades') {
        this.state.grade_ids.push(d.id);
      } else {
        this.state.student_ids.push(d.id);
      }
    });

    this.setState({student_ids: [...new Set(this.state.student_ids)]});
    this.setState({grade_ids: [...new Set(this.state.grade_ids)]});
    this.setState({stage_ids: [...new Set(this.state.stage_ids)]});
    console.log(this.state.temp);
    console.log(this.state.student_ids.join(','));
    console.log(this.state.grade_ids.join(','));
    console.log(this.state.stage_ids.join(','));
    console.log(this.state.update);

    if (
      this.state.student_ids.length != 0 ||
      this.state.grade_ids.length != 0 ||
      this.state.stage_ids.length != 0
    ) {
      if (this.state.description != null) {
        var params={
          description:this.state.description,
          is_draft:this.state.draft,
          stage_ids:this.state.stage_ids.join(','),
          grade_ids:this.state.grade_ids.join(','),
          room_ids:'',
          student_ids:this.state.student_ids.join(','),
          deleted_mediaIds: this.state.deleteMediaIds.join(','),
          id:this.state.activityData?.id,
      
        }
        console.log(params);
        var formData = new FormData();

        formData.append('description', this.state.description);
        formData.append('is_draft', this.state.draft);
        formData.append('stage_ids', this.state.stage_ids.join(','));
        formData.append('grade_ids', this.state.grade_ids.join(','));
        formData.append('room_ids', '');
        
        formData.append('student_ids', this.state.student_ids.join(','));
        this.state.selectedImage.forEach(element => {
          formData.append('activity', {
            uri: element.uri,
            type: element.type,
            name: element.name,
          });
        });
        if (this.state.update) {
          formData.append('id', this.state.activityData?.id);
          formData.append(
            'deleted_mediaIds',
            this.state.deleteMediaIds.join(','),
          );
        } else {
          formData.append('is_global', 1);
        }

        console.log('formData==', formData);
        this.setState({isLoading: true});
        if (this.state.update) {
          ApiCalling.apiCallBodyDataPostMultipart(
            'activity/update-post',
            formData,
          )
            .then(res => {
              console.log(res.data);
              this.props.navigation.replace('TabNavigation');
              this.clearData()
              this.setState({isLoading: false});
            })
            .catch(err => {
              console.log('Error', err);
            });
        } else {
          ApiCalling.apiCallBodyDataPostMultipart('activity/add-post', formData)
            .then(res => {
              console.log(res.data);
              this.props.navigation.replace('TabNavigation');
              this.clearData()
              this.setState({isLoading: false});
            })
            .catch(err => {
              console.log('Error', err);
            });
        }
      } else {
        Util.showMsg('content is required');
      }
    } else {
      Util.showMsg('please Tag students or grades');
    }
  };
  remove = uri => {
    let temp = this.state.selectedImage;
    temp = temp.filter(x => x.uri !== uri);
    this.setState({selectedImage: temp});
  };
  removeItem = async item => {
    console.log(item);
    let temp = this.state.temp;
    temp = await temp.filter(x => x.id != item);
    this.setState({temp: temp});
    console.log(this.state.temp);
  };
  onBackClick = () => {
    Alert.alert('Draft', 'Save draft or Not this post?', [
      {
        text: 'No',
        onPress: () => this.props.navigation.replace('ParentsDashboard'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({draft: true}), this.submitForm();
        },
      },
    ]);
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        {ProgressDialog.CustomProgressBar(this.state.isLoading)}

        <ToolBar
          toolBarTitle={'New Post'}
          showSubTitle={false}
          showBackIcon={true}
          sendBtn={true}
          sendPost={() => this.submitForm()}
          navigation={this.props.navigation}
          onHomeIconClick={() => {
            this.onBackClick();
          }}
        />
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setModalVisible(false)}
          onSwipeComplete={() => this.setModalVisible(false)}
          swipeDirection="left"
          onBackButtonPress={() => this.setModalVisible(false)}>
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
                  this.setModalVisible(false);
                  ImagePicker.launchCamera(
                    {
                      mediaType: 'photo',
                      includeBase64: false,
                      quality: 0.5,
                      saveToPhotos: true,
                      selectionLimit: 1,
                    },
                    response => {
                      this.onImageSelectionResponse(response);
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
                  this.setModalVisible(false);
                  ImagePicker.launchImageLibrary(options, response => {
                    this.onImageSelectionResponse(response);
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
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.white,
          }}>
          <ScrollView
            style={{
              padding: 10,
              margin: 5,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                width: '100%',
                marginTop: 10,
              }}>
              {this.state.data?.avatar != null ? (
                <Image
                  source={{uri: BASE_URL + 'avatar/' + this.state.data?.avatar}}
                  style={{width: 45, borderRadius: 45 / 2, height: 45}}
                />
              ) : (
                <TextAvatar
                  backgroundColor={Colors.primary}
                  textColor={Colors.white}
                  size={45}
                  type={'circle'} // optional
                >
                  {this.state.data?.firstName.toUpperCase() +
                    ' ' +
                    this.state.data?.lastName.toUpperCase()}
                </TextAvatar>
              )}
              <View style={{paddingHorizontal: 8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: AppColors.black,
                  }}>
                  {this.state.data?.firstName + ' ' + this.state.data?.lastName}
                </Text>
                {this.state.temp?.length != 0 && (
                  <FlatList
                    data={this.state.temp}
                    numColumns={2}
                    renderItem={({item}) => {
                      return (
                        <View
                          style={{
                            margin: 5,
                            borderWidth: 1,
                            borderColor: AppColors.primary,
                            paddingHorizontal: 3,
                            alignSelf: 'flex-start',
                            borderRadius: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <MaterialCommunityIconss
                            name={'account-group'}
                            size={20}
                            color={AppColors.primary}
                          />
                          <Text
                            style={{
                              marginLeft: 5,
                              fontSize: 15,
                              color: AppColors.primary,
                              fontWeight: 'bold',
                            }}>
                            {item.name}
                          </Text>
                          <TouchableOpacity
                            style={{padding: 5}}
                            onPress={() => this.removeItem(item.id)}>
                            <MaterialCommunityIconss
                              name={'close'}
                              size={20}
                              color={AppColors.primary}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            </View>

            <TextInput
              placeholder="Write your post here.."
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.black}
              style={{
                ...styles.textBoxStyle,
                color: Colors.black,
                textAlignVertical: 'top',
              }}
              onChangeText={txt => this.setState({description: txt})}
              value={this.state.description}
            />

            <View
              style={{
                marginLeft: 5,
                marginTop: 5,
              }}>
              {this.state.selectedImage.length != 0 && (
                <FlatList
                  data={this.state.selectedImage}
                  style={{paddingBottom: 50}}
                  renderItem={({item}) => {
                    console.log(item.type);
                    return (
                      <View style={{flex: 1}}>
                        {item.type == 'image/jpeg' && (
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() => this.remove(item.uri)}
                              style={{marginLeft: 'auto'}}>
                              <MaterialCommunityIconss
                                name="close"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{uri: item.uri}}
                              style={{
                                borderRadius: 7,
                                height: 250,
                                width: Dimensions.get('window').width - 20,
                                resizeMode: 'cover',
                                alignSelf: 'center',
                                marginTop: 5,
                              }}
                            />
                          </View>
                        )}
                        {item.type == 'image/jpg' && (
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() => this.remove(item.uri)}
                              style={{marginLeft: 'auto'}}>
                              <MaterialCommunityIconss
                                name="close"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{uri: item.uri}}
                              style={{
                                borderRadius: 7,
                                height: 250,
                                width: Dimensions.get('window').width - 20,
                                resizeMode: 'cover',
                                alignSelf: 'center',
                                marginTop: 5,
                              }}
                            />
                          </View>
                        )}
                        {item.type == 'image/png' && (
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() => this.remove(item.uri)}
                              style={{marginLeft: 'auto'}}>
                              <MaterialCommunityIconss
                                name="close"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                            <Image
                              source={{uri: item.uri}}
                              style={{
                                borderRadius: 7,
                                height: 250,
                                width: Dimensions.get('window').width - 20,
                                resizeMode: 'cover',
                                alignSelf: 'center',
                                marginTop: 5,
                              }}
                            />
                          </View>
                        )}
                        {item.type == 'application/pdf' && (
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() => this.remove(item.uri)}
                              style={{marginLeft: 'auto'}}>
                              <MaterialCommunityIconss
                                name="close"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', padding: 5}}>
                              <MaterialCommunityIconss
                                name="file-pdf-box"
                                size={25}
                                style={{}}
                                color={AppColors.colorRed}
                              />
                              <Text style={{marginLeft: 5}}>{item.name}</Text>
                            </View>
                          </View>
                        )}
                        {item.type == 'audio/mpeg' && (
                          <View style={{flex: 1}}>
                            <TouchableOpacity
                              onPress={() => this.remove(item.uri)}
                              style={{marginLeft: 'auto'}}>
                              <MaterialCommunityIconss
                                name="close"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                            <View style={{flexDirection: 'row', padding: 5}}>
                              <MaterialIcon
                                name="audiotrack"
                                size={25}
                                style={{}}
                                color={AppColors.colorRed}
                              />
                              <Text style={{marginLeft: 5}}>{item.name}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            {this.state.fileSendModal && (
              <View
                style={{
                  backgroundColor: Colors.white,
                  zIndex: 99,
                  marginRight: 20,
                  borderRadius: 4,
                  marginLeft: 20,
                  flexDirection: 'row',
                  padding: 10,
                  elevation: 5,
                }}>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() =>
                      this.props.navigation.navigate('TagActivity', {
                        temp: this.state.temp,
                        des: this.state.description,
                        allFiles: this.state.selectedImage,
                        update: this.state.update ? 1 : 0,
                      })
                    }>
                    <MaterialIcon2
                      name="tag"
                      size={20}
                      color={Colors.iconColor}
                    />
                    <Text style={{fontSize: 14, color: Colors.iconColor}}>
                      Tag Students
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', marginLeft: 14}}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() =>
                      ImagePicker.launchCamera(
                        {
                          mediaType: 'photo',
                          includeBase64: false,
                          quality: 0.5,
                          saveToPhotos: true,
                          selectionLimit: 1,
                        },
                        response => {
                          this.onImageSelectionResponse(response);
                        },
                      )
                    }>
                    <MaterialIcon2
                      name="camera"
                      size={20}
                      color={Colors.iconColor}
                    />
                    <Text style={{fontSize: 14, color: Colors.iconColor}}>
                      Camera
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', marginLeft: 14}}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() =>
                      ImagePicker.launchImageLibrary(options, response => {
                        this.onImageSelectionResponse(response);
                      })
                    }>
                    <MaterialCommunityIcons
                      name="photo"
                      size={20}
                      color={Colors.iconColor}
                    />
                    <Text style={{fontSize: 14, color: Colors.iconColor}}>
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', marginLeft: 14}}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() => this.onSelectAudioFile()}>
                    <MaterialCommunityIcons
                      name="headphones"
                      size={20}
                      color={Colors.iconColor}
                    />
                    <Text style={{fontSize: 14, color: Colors.iconColor}}>
                      Audio
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{alignItems: 'center', marginLeft: 14}}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() => this.onSelectFile()}>
                    <MaterialIcon3
                      name="document-outline"
                      size={20}
                      color={Colors.iconColor}
                    />
                    <Text style={{fontSize: 14, color: Colors.iconColor}}>
                      Document
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View
              style={{
                backgroundColor: Colors.white,
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'flex-start',
                padding: 10,
                marginLeft: 10,
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 45 / 2,
                  height: 45,
                  width: 45,
                  backgroundColor: AppColors.childColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.selectImage()}>
                <MaterialIcon name="add" size={40} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({PmodalVisible: true})}
                style={{
                  borderRadius: 45 / 2,
                  height: 45,
                  width: 45,
                  marginLeft: 'auto',
                  backgroundColor: AppColors.childColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIconss
                  name="message-bookmark-outline"
                  size={25}
                  style={{}}
                  color={AppColors.white}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            isVisible={this.state.PmodalVisible}
            onBackdropPress={() => this.setState({PmodalVisible: false})}
            onSwipeComplete={() => this.setState({PmodalVisible: false})}
            swipeDirection="left"
            onBackButtonPress={() => this.setState({PmodalVisible: false})}>
           
                <FlatList
                  data={this.state.draftData}
                  // style={{flex:1}}
                  ListHeaderComponent={
                    <View style={{padding: 7,backgroundColor:AppColors.white,}}>
                      <View style={{flexDirection: 'row', alignContent: 'center'}}>
                        <TouchableOpacity
                          onPress={() => this.setState({PmodalVisible: false})}>
                          <MaterialIcon
                            name="arrow-back"
                            size={24}
                            color={AppColors.black}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20}}>
                          Choose Draft
                        </Text>
                      </View>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: AppColors.searchIconColor,
                          marginTop: 10,
                        }}
                      />
                    </View>
                  }
                  renderItem={({item,index}) => {
                    console.log(item);
                    index=index+1
                    return (
                      <View style={{flexDirection:'row',backgroundColor:AppColors.white,padding:10, alignItems:'center'}}>
                        <Text style={{}}>{index}.</Text>
                      <TouchableOpacity
                        style={{padding: 5,margin:5,marginLeft:10, width:"100%", backgroundColor:AppColors.white,elevation:3,}}
                        onPress={() => {
                          this.clearData(),
                          this.getData(item.id),
                            this.setState({PmodalVisible: false});
                        }}>
                        <Text style={{color: AppColors.black}}>
                          {item.description}
                        </Text>
                      </TouchableOpacity>
                        </View>
                    );
                  }}
                />
              
          
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  textBoxStyle: {
    marginTop: 5,
    // borderWidth: 0.8,
    // borderColor: AppColors.textSecondary,
    // paddingVertical: 5,
    // borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  imageStyle: {
    // padding: 10,
    // margin: 5,
    // height: 25,
    // width: 25,
    // resizeMode: 'stretch',
    // alignItems: 'center',
  },
  textInputStyle: {
    color: Colors.black,
    marginBottom: 1,
    borderBottomWidth: 1.2,
    borderBottomColor: Colors.black,
    height: Platform.OS === 'ios' ? 40 : null,
  },
  dateInput: {
    width: '100%',
    height: 45,
    padding: 10,
    fontSize: 18,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: 'green',
  },
  datepicker: {width: '100%', height: 55, paddingTop: 10},
  error: {color: 'red', fontSize: 10, padding: 2},
  switchLable: {
    // paddingLeft: 10,
    // paddingTop: 15,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    // width: '49%',
  },
  switch: {alignItems: 'center', marginLeft: 10},
  switchContainer: {
    // width: '95%',
    margin: 5,
    alignItems: 'center',
    // height: 55,
    flexDirection: 'row',
    // borderBottomWidth: 0.8,
    borderColor: Colors.black,
  },
});
const sColor = {
  primary: Colors.primary,
};
const sectionedMultiSelectStyle = {
  itemText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container: {
    height: 20,
    margin: 5,
    backgroundColor: AppColors.white,
  },
  modalWrapper: {
    height: 50,
    margin: 5,
  },
  subItemText: {
    backgroundColor: Colors.primary,
  },
  subItem: {
    paddingHorizontal: 10,
  },
  scrollView: {paddingHorizontal: 0},
  confirmText: {
    fontWeight: '500',
  },
  selectToggle: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
};
