import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  LogBox,
  Alert,
  FlatList,
  Dimensions,
  TextInput,
  ImageBackground,
  Platform,
  Linking,
} from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import IconFA from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon2 from 'react-native-vector-icons/Feather';

import YoutubePlayer from 'react-native-youtube-iframe';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import Divider from '../components/Divider';
import {Gallery} from 'react-grid-gallery';
import ToolBar from '../components/ToolBar';
import AppColors from '../common/AppColor';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import App from '../../App';
import Util from '../utils/Util';
import GridImageView from 'react-native-grid-image-viewer';
import Modal from 'react-native-modal';
import {SliderBox} from 'react-native-image-slider-box';
import {Chip, Menu, Provider, Button} from 'react-native-paper';
import ApiCalling from '../network/ApiCalling';
import BASE_URL, {
  URL_ACTIVITY_COMMENT,
  URL_IMAGE_ACTIVITY,
  URL_IMAGE_POST,
} from '../common/Config';
import Colors from '../common/Colors';
import moment from 'moment';
import AppStyle from '../common/AppStyle';
import ReadMore from '@fawazahmed/react-native-read-more';
import ProgressDialog from '../components/ProgressDialog';
import TextAvatar from 'react-native-text-avatar';
import ImageResizer from 'react-native-image-resizer';
import Swipeable from 'react-native-swipeable';
import * as ImagePicker from 'react-native-image-picker';
import {URL_IMAGE_MY_PROFILE} from '../common/Config';
const {width, height} = Dimensions.get('window');
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
const leftContent = [<Text>Pull to activate</Text>];

export default class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
      firstName: null,
      lastName: null,
      data: this.props.route.params?.parentPost,
      userId: null,
      like: false,
      setRefreshing: false,
      imgModal: false,
      sliderOpen: false,
      img: null,
      itemOpen: 0,
      isLoading: false,
      likeModal: false,
      sendTextMessage: '',
      modalVisible: false,
      selectedImage: null,
      commentList: [],
      likeList: [],
      commentImageModal: false,
      commentImage: null,
      avatar: require('../assets/user.png'),
    };
  }
  async componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    // this.getProfile();
    // this.focusListener = this.props.navigation.addListener('focus', () => {
    //   this.getProfile();
    // });

    this.getCommentData();
    //    this.setState({data:this.props.route.params?.parentPost})
  }
  getCommentData = async () => {
    try {
      await Util.getUser().then(data => {
        this.setState({userId: data.id});
        if (data.is_staff) {
          var params = {
            page_size: 20,
            page_number: 1,
          };
          ApiCalling.apiCallBodyDataPost('activity/getActivities', params).then(
            res => {
              console.log('Staff Data', res.data);
              res.data.data.filter(i => {
                if (i.id == this.state.data.id) {
                  // this.state.commentList.push(i.ActivityComments)
                  this.setState({
                    commentList: i.ActivityComments,
                    likeList: i.ActivityLike,
                  });
                }
              });
            },
          );
        } else {
          ApiCalling.apiCallBodyDataGet(
            'activity/getByStudentId/' + data.Parents[0].Student.id,
          ).then(res => {
            console.log(res.data);
            res.data.filter(i => {
              if (i.id == this.state.data.id) {
                // this.state.commentList.push(i.ActivityComments)
                this.setState({
                  commentList: i.ActivityComments,
                  likeList: i.ActivityLike,
                });
              }
            });
          });
        }
      });
    } catch (error) {}
  };
  handleRefresh = () => {};
  likeUnLike = val => {
    ApiCalling.apiCallBodyDataPost('activity/like/' + val);
    this.getCommentData();
  };
  unLike = val => {
    ApiCalling.apiCallDelete('activity/Unlike/' + val);
    this.getCommentData();
  };
  showFile = async fileUrl => {
    // Get today's date to add the time suffix in filename
  Linking.openURL(fileUrl)
  };
  getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  async selectImage() {
    let isCameraPermitted = await Util.requestCameraPermission();
    let isStoragePermitted = await Util.requestExternalWritePermission();
    let isStorageReadPermitted = await Util.requestExternalReadPermission();

    console.log('isCameraPermitted', isCameraPermitted);
    console.log('isStoragePermitted', isStoragePermitted);
    console.log('isStorageReadPermitted', isStorageReadPermitted);

    if (isCameraPermitted || isStoragePermitted || isStorageReadPermitted) {
      this.setState({modalVisible: true});
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
    console.log('response==', response);
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
    this.setState({
      selectedImage: response.assets[0],
    });
    // Util.showMsg('Photo Upload Successfully');
  }
  deleteComment = async id => {
    try {
      ApiCalling.apiCallDelete('activity/comment/' + id).then(res => {
        console.log('Delet response==', res.data);
      });
      this.getCommentData();
    } catch (error) {}
  };
  sendComment = () => {
    var formData = new FormData();
    formData.append('comment', this.state.sendTextMessage);
    formData.append('activity_id', this.state.data.id);
    if (this.state.selectedImage != null) {
      formData.append('activity_comment', {
        uri: this.state.selectedImage.uri,
        type: this.state.selectedImage.type,
        name: this.state.selectedImage.fileName,
      });
    }
    console.log('formData==', formData);
    this.setState({isLoading: true});

    ApiCalling.apiCallBodyDataPostMultipart(
      'activity/add-post-comment',
      formData,
    ).then(res => {
      console.log(res.data);
      this.setState({isLoading: false});
      Util.showMsg(res.data.message);
      this.setState({sendTextMessage: '', selectedImage: null});
      this.getCommentData();
    });
  };
  render() {
    var img = this.state.data.ActivityMedia.map(
      i => URL_IMAGE_POST + i.name,
    ).sort();

    var x = this.state.likeList.some(i => {
      return i.created_by == this.state.userId;
    });

    return (
      <View style={styles.container}>
        <ToolBar
          toolBarTitle={'Comment'}
          showSubTitle={false}
          showBackIcon={true}
          navigation={this.props.navigation}
          onHomeIconClick={() => {
            this.props.navigation.goBack(null);
          }}
        />
        {ProgressDialog.CustomProgressBar(this.state.isLoading)}

        <View
          style={{
            backgroundColor: AppColors.white,
            flex: 1,
          }}>
          <ScrollView
            nestedScrollEnabled
            style={{
              paddingTop: 10,
              paddingBottom: 25,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              {this.state.data.CreatedBy.avatar != '' &&
              this.state.data.CreatedBy.avatar != null ? (
                <Image
                  source={{
                    uri:
                      BASE_URL + 'avatar/' + this.state.data.CreatedBy.avatar,
                  }}
                  style={{
                    // marginTop: -4,
                    width: 45,
                    height: 45,
                    borderRadius: 45 / 2,
                    resizeMode: 'contain',
                  }}
                />
              ) : (
                <TextAvatar
                  backgroundColor={this.state.data.backColor}
                  textColor={Colors.white}
                  size={45}
                  type={'circle'} // optional
                >
                  {this.state.data.CreatedBy.firstName.toUpperCase() +
                    ' ' +
                    this.state.data.CreatedBy.lastName.toUpperCase()}
                </TextAvatar>
              )}

              <View style={{paddingHorizontal: 8}}>
                <Text
                  style={{
                    color: AppColors.primaryTextColor,
                    ...AppStyle.TextStyle.titleLarge,
                  }}>
                  {this.state.data.CreatedBy.firstName +
                    ' ' +
                    this.state.data.CreatedBy.lastName}
                </Text>
                <Text
                  style={{
                    color: AppColors.subTitleColor,
                    fontSize: 11,
                    ...AppStyle.TextStyle.subTitle,
                  }}>
                  {moment(this.state.data.created_on).format('lll')}
                </Text>
              </View>
            </View>
            <ReadMore
              numberOfLines={3}
              seeMoreStyle={{color: Colors.skyBlue}}
              seeLessStyle={{color: Colors.skyBlue}}
              style={styles.caption}>
              {this.state.data.description}
            </ReadMore>

            <View>
              {img.length != 0 && (
                <View style={styles.imageContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      marginBottom: 4,
                    }}>
                    {img[0]?.match(/.pdf/) ? (
                      <View style={{flexDirection: 'row', padding: 5}}>
                        <TouchableOpacity onPress={() => this.showFile(img[0])}>
                          <MaterialCommunityIcons
                            name="file-pdf-box"
                            size={50}
                            style={{}}
                            color={AppColors.calendarPrimary}
                          />
                          <Text style={{marginLeft: 5}}>{/*{item.name}*/}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      img[0] != null && (
                        <TouchableOpacity
                          style={{flex: 1}}
                          onPress={() =>
                            this.setState({
                              img: img,
                              itemOpen: 0,
                              sliderOpen: true,
                              postAvtar: item.CreatedBy.avatar,
                            })
                          }>
                          <Image
                            style={[styles.img, {marginRight: 2}]}
                            source={{uri: img[0]}}
                          />
                        </TouchableOpacity>
                      )
                    )}
                    {img[1]?.match(/.pdf/) ? (
                      <View style={{flexDirection: 'row', padding: 5}}>
                        <TouchableOpacity onPress={() => this.showFile(img[1])}>
                          <MaterialCommunityIcons
                            name="file-pdf-box"
                            size={50}
                            style={{}}
                            color={AppColors.calendarPrimary}
                          />
                          <Text style={{marginLeft: 5}}>{/*{item.name}*/}</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      img[1] != null && (
                        <TouchableOpacity
                          style={{flex: 1}}
                          onPress={() =>
                            this.setState({
                              img: img,
                              itemOpen: 1,
                              sliderOpen: true,
                              postAvtar: item.CreatedBy.avatar,
                            })
                          }>
                          <Image
                            style={[styles.img, {marginLeft: 2}]}
                            source={{uri: img[1]}}
                          />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                  {img[2]?.match(/.pdf/) ? (
                    <View style={{flexDirection: 'row', padding: 5}}>
                      <TouchableOpacity onPress={() => this.showFile(img[2])}>
                        <MaterialCommunityIcons
                          name="file-pdf-box"
                          size={50}
                          style={{}}
                          color={AppColors.calendarPrimary}
                        />
                        <Text style={{marginLeft: 5}}>{/*{item.name}*/}</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    img[2] != null && (
                      <View style={{flexDirection: 'row', height: 90}}>
                        {img[2] != null && (
                          <TouchableOpacity
                            style={{flex: 1}}
                            onPress={() =>
                              this.setState({
                                img: img,
                                itemOpen: 2,
                                sliderOpen: true,
                                postAvtar: item.CreatedBy.avatar,
                              })
                            }>
                            <Image
                              style={[styles.img, {marginRight: 2}]}
                              source={{uri: img[2]}}
                            />
                          </TouchableOpacity>
                        )}
                        {img[3]?.match(/.pdf/) ? (
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <TouchableOpacity
                              onPress={() => this.showFile(img[3])}>
                              <MaterialCommunityIcons
                                name="file-pdf-box"
                                size={50}
                                style={{}}
                                color={AppColors.calendarPrimary}
                              />
                              <Text style={{marginLeft: 5}}>
                                {/*{item.name}*/}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          img[3] != null && (
                            <TouchableOpacity
                              style={{flex: 1}}
                              onPress={() =>
                                this.setState({
                                  img: img,
                                  itemOpen: 3,
                                  sliderOpen: true,
                                  postAvtar: item.CreatedBy.avatar,
                                })
                              }>
                              <Image
                                style={[
                                  styles.img,
                                  {marginLeft: 2, marginRight: 2},
                                ]}
                                source={{uri: img[3]}}
                              />
                            </TouchableOpacity>
                          )
                        )}
                        {img[4]?.match(/.pdf/) ? (
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <TouchableOpacity
                              onPress={() => this.showFile(img[4])}>
                              <MaterialCommunityIcons
                                name="file-pdf-box"
                                size={50}
                                style={{}}
                                color={AppColors.calendarPrimary}
                              />
                              <Text style={{marginLeft: 5}}>
                                {/*{item.name}*/}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          img[4] != null && (
                            <TouchableOpacity
                              style={{flex: 1}}
                              onPress={() =>
                                this.setState({
                                  img: img,
                                  itemOpen: 4,
                                  sliderOpen: true,
                                  postAvtar: item.CreatedBy.avatar,
                                })
                              }>
                              <Image
                                style={[styles.img, {marginLeft: 2}]}
                                source={{uri: img[4]}}
                              />
                            </TouchableOpacity>
                          )
                        )}
                        {img[5]?.match(/.pdf/) ? (
                          <View style={{flexDirection: 'row', padding: 5}}>
                            <TouchableOpacity
                              onPress={() => this.showFile(img[5])}>
                              <MaterialCommunityIcons
                                name="file-pdf-box"
                                size={50}
                                style={{}}
                                color={AppColors.calendarPrimary}
                              />
                              <Text style={{marginLeft: 5}}>
                                {/*{item.name}*/}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          img[5] != null && (
                            <ImageBackground
                              style={[styles.img, {marginLeft: 2}]}
                              source={{uri: img[5]}}>
                              <TouchableOpacity
                                style={{
                                  flex: 1,
                                  backgroundColor: 'rgba(0,0,0,.5)',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                onPress={() =>
                                  this.setState({
                                    img: img,
                                    itemOpen: 0,
                                    sliderOpen: true,
                                    postAvtar: item.CreatedBy.avatar,
                                  })
                                }>
                                <View>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      color: 'white',
                                      fontWeight: '700',
                                    }}>
                                    + {img.length - 5}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </ImageBackground>
                          )
                        )}
                      </View>
                    )
                  )}
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  width: '100%',
                  paddingHorizontal: 5,
                  // paddingVertical: 2,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => this.setState({likeModal: true})}>
                  <Text
                    style={{
                      ...AppStyle.TextStyle.subTitle,
                      color: AppColors.subTitleColor,
                      fontSize: 11,
                    }}>
                    {Util.getLikeLabel(this.state.likeList.length)}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    ...AppStyle.TextStyle.subTitle,
                    color: AppColors.subTitleColor,
                    fontSize: 11,
                  }}>
                  {Util.getCommentLabel(this.state.commentList.length)}
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 0.3,
                  borderStyle: 'solid',
                  borderColor: AppColors.lightDivider,
                  marginTop: 4,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  paddingHorizontal: 5,
                  width: '100%',
                  paddingVertical: 5,
                }}>
                {x ? (
                  <TouchableOpacity
                    onPress={() => this.unLike(this.state.data.id)}>
                    <MaterialCommunityIcons
                      name="heart"
                      size={25}
                      style={{color: Colors.red}}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => this.likeUnLike(this.state.data.id)}>
                    <MaterialCommunityIcons
                      name="cards-heart-outline"
                      size={25}
                      style={{}}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={{marginLeft: 20}}>
                  <MaterialCommunityIcons
                    name="message-reply-outline"
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              {/* <View
                style={{
                  borderWidth: 0.3,
                  borderColor: Colors.grayCCC,
                  marginTop: 10,
                }}
              /> */}
            </View>
            <FlatList
              data={this.state.commentList}
              style={{
                width: '100%',
                backgroundColor: AppColors.white,
              }}
              contentContainerStyle={{paddingBottom: 80, marginTop: 20}}
              renderItem={({item, index}) => {
                console.log(x);
                return (
                  <Swipeable
                    rightButtons={[
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          backgroundColor: Colors.red,
                        }}
                        onPress={() => this.deleteComment(item.id)}>
                        <MaterialCommunityIcons
                          name="delete"
                          size={35}
                          style={{
                            marginLeft: 10,
                            alignItems: 'center',
                            color: Colors.white,
                          }}
                        />
                      </TouchableOpacity>,
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 10,
                        width: '100%',
                        marginTop: 10,
                      }}>
                      {item?.CommentedBy.avatar != '' &&
                      item?.CommentedBy.avatar != null ? (
                        <Image
                          source={{
                            uri: URL_IMAGE_MY_PROFILE + item.CommentedBy.avatar,
                          }}
                          style={{
                            // marginTop: -4,
                            width: 30,
                            height: 30,
                            borderRadius: 30 / 2,
                            resizeMode: 'contain',
                          }}
                        />
                      ) : (
                        <TextAvatar
                          backgroundColor={this.state.data.backColor}
                          textColor={Colors.white}
                          size={30}
                          type={'circle'} // optional
                        >
                          {item.CommentedBy.firstName.toUpperCase() +
                            ' ' +
                            item.CommentedBy.lastName.toUpperCase()}
                        </TextAvatar>
                      )}
                      <View style={{paddingHorizontal: 8}}>
                        <Text
                          style={{
                            ...AppStyle.TextStyle.titleLarge,
                            color: AppColors.primaryTextColor,
                            fontSize: 14,
                          }}>
                          {item.CommentedBy.firstName +
                            ' ' +
                            item.CommentedBy.lastName}
                        </Text>
                        <Text
                          style={{
                            ...AppStyle.TextStyle.subTitle,
                            color: AppColors.subTitleColor,
                            fontSize: 12,
                          }}>
                          {item.comment}
                        </Text>
                        {item.image != null && (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                commentImage: URL_ACTIVITY_COMMENT + item.image,
                                commentImageModal: true,
                              })
                            }>
                            <Image
                              source={{
                                uri: URL_ACTIVITY_COMMENT + item.image,
                              }}
                              style={{
                                // marginTop: -4,
                                width: 100,
                                height: 100,
                                resizeMode: 'cover',
                              }}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </Swipeable>
                );
              }}
            />
            <View
              style={{
                borderWidth: 0.3,
                borderStyle: 'solid',
                borderColor: AppColors.lightDivider,
                marginTop: 4,
              }}
            />
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              padding: 7,
              backgroundColor: AppColors.white,
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 45 / 2,
                height: 45,
                width: 45,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 3,
              }}
              onPress={() => this.selectImage()}>
              <MaterialIcon name="add" size={45} color={Colors.white} />
            </TouchableOpacity>

            <View
              style={{
                borderWidth: 0.5,
                borderColor: AppColors.darkFadeText,
                marginHorizontal: 10,
                borderRadius: 6,
                paddingHorizontal: 14,
                marginVertical: 5,
                justifyContent: 'center',
                backgroundColor: AppColors.white,
                width: '80%',
                elevation: 3,
              }}>
              {this.state.selectedImage != null && (
                <Image
                  source={{uri: this.state.selectedImage.uri}}
                  style={{
                    height: 200,
                    width: '90%',
                    resizeMode: 'cover',
                  }}
                />
              )}
              <TextInput
                placeholder={'Type a message...'}
                mode="outlined"
                multiline={true}
                placeholderTextColor="#000"
                // numberOfLines={1}
                value={this.state.sendTextMessage}
                onChangeText={txt => this.setState({sendTextMessage: txt})}
                style={{
                  color: AppColors.placeholderColor,
                  width: '94%',
                  ...AppStyle.TextStyle.subTitle,
                }}
              />
              <TouchableOpacity
                style={styles.sendMessageBtn}
                onPress={() => this.sendComment()}>
                <View style={{position: 'absolute', top: 10, left: 14}}>
                  <MaterialIcon2 size={23} name="send" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Comment Image Modal View */}
        <Modal
          isVisible={this.state.commentImageModal}
          onBackdropPress={() => this.setState({commentImageModal: false})}
          onSwipeComplete={() => this.setState({commentImageModal: false})}
          swipeDirection="left"
          onBackButtonPress={() => this.setState({commentImageModal: false})}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              source={{uri: this.state.commentImage}}
              style={{resizeMode: 'cover', width: '100%', height: '60%'}}
            />
          </View>
        </Modal>
        {/* Photo Picker Modal */}
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({modalVisible: false})}
          onSwipeComplete={() => this.setState({modalVisible: false})}
          swipeDirection="left"
          onBackButtonPress={() => this.setState({modalVisible: false})}>
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
                  this.setState({modalVisible: false});
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
                  this.setState({modalVisible: false});
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
        {/* User Like Modal */}
        <Modal
          isVisible={this.state.likeModal}
          onBackdropPress={() => this.setState({likeModal: false})}
          onBackButtonPress={() => this.setState({likeModal: false})}>
          <FlatList
            data={this.state.likeList}
            style={{
              padding: 7,
              borderRadius: 8,
              width: '100%',
              backgroundColor: Colors.white,
            }}
            ListHeaderComponent={
              <View style={{padding: 7}}>
                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => this.setState({likeModal: false})}>
                    <MaterialIcon
                      name="arrow-back"
                      size={24}
                      color={AppColors.black}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{fontSize: 20, fontWeight: 'bold', marginLeft: 20}}>
                    Reaction
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: Colors.grayCCC,
                    marginTop: 10,
                  }}
                />
              </View>
            }
            renderItem={({item, index}) => {
              console.log(x);
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    width: '100%',
                    marginTop: 10,
                  }}>
                  <TextAvatar
                    backgroundColor={this.state.data.backColor}
                    textColor={Colors.white}
                    size={45}
                    type={'circle'} // optional
                  >
                    {item.CreatedBy.firstName.toUpperCase() +
                      ' ' +
                      item.CreatedBy.lastName.toUpperCase()}
                  </TextAvatar>
                  <View style={{paddingHorizontal: 8}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: AppColors.black,
                      }}>
                      {item.CreatedBy.firstName + ' ' + item.CreatedBy.lastName}
                    </Text>
                    <Text
                      style={{
                        color: AppColors.black,
                        fontSize: 13,
                      }}>
                      {moment(item.created_on).fromNow()}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="heart"
                    size={25}
                    style={{position: 'absolute', right: 5, color: Colors.red}}
                  />
                </View>
              );
            }}
          />
        </Modal>

        <Modal
          style={{
            margin: 0,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: AppColors.blackTransparentColor,
            width: '100%',
          }}
          isVisible={this.state.sliderOpen}
          onBackdropPress={() => this.setState({sliderOpen: false})}
          onBackButtonPress={() => this.setState({sliderOpen: false})}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 15,
                height: 56,
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => this.setState({sliderOpen: false})}>
                  <MaterialIcon
                    name="arrow-back-ios"
                    size={24}
                    color={AppColors.white}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {this.state.data?.CreatedBy.avatar != '' &&
                  this.state.data?.CreatedBy.avatar != null ? (
                    <Image
                      source={{
                        uri:
                          BASE_URL +
                          'avatar/' +
                          this.state.data.CreatedBy.avatar,
                      }}
                      style={{
                        // marginTop: -4,
                        width: 30,
                        height: 30,
                        borderRadius: 30 / 2,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <TextAvatar
                      backgroundColor={this.state.data.backColor}
                      textColor={Colors.white}
                      size={30}
                      type={'circle'} // optional
                    >
                      {this.state.data.CreatedBy.firstName.toUpperCase() +
                        ' ' +
                        this.state.data.CreatedBy.lastName.toUpperCase()}
                    </TextAvatar>
                  )}

                  <View>
                    <Text
                      style={{
                        // fontWeight: '500',
                        color: AppColors.white,
                        marginLeft: 10,
                        ...AppStyle.TextStyle.title,
                      }}>
                      {this.state.data.CreatedBy.firstName +
                        ' ' +
                        this.state.data.CreatedBy.lastName}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{width: 20}}></View>
            </View>

            <View style={{flex: 1, justifyContent: 'center'}}>
              <SliderBox
                images={this.state.img}
                sliderBoxHeight={500}
                resizeMode={'contain'}
                autoplay={false}
                // parentWidth={300}
                firstItem={this.state.itemOpen}
                resizeMethod={'resize'}
                paginationBoxStyle={{
                  display: 'none',
                }}
                ImageComponentStyle={{width: '100%', marginTop: 5}}
                imageLoadingColor="#2196F3"
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subView: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderColor: AppColors.accent,
  },
  text: {
    color: AppColors.accentDark,
    fontSize: 14,
  },
  caption: {
    color: AppColors.black,
    marginTop: 8,
    marginBottom: 5,
    fontSize: 13,
    ...AppStyle.TextStyle.subTitle,
  },
  menu: {
    width: window.width,
    height: window.height,
    backgroundColor: AppColors.colorWhite,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.colorMenu,
    textAlignVertical: 'center',
    marginLeft: 10,
    flex: 1,
  },
  menuIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  menuContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 1,
  },
  imageContainer: {
    height: height / 3,
  },

  img: {
    flex: 1,
    width: null,
    height: null,
  },
  textContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 8,
  },
  messageInputBox: {},
  sendMessageBtn: {
    position: 'absolute',
    right: 5,
    // backgroundColor: AppColors.mainColor,
    borderRadius: 100,
    padding: 3,
    width: 45,
    height: 45,
  },
});
