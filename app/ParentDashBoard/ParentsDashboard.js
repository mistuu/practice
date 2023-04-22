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
  ImageBackground,
  BackHandler,
  Platform,
  Linking,
} from 'react-native';
import SideMenu from 'react-native-side-menu-updated';
import IconFA from 'react-native-vector-icons/Ionicons';
import IconFA1 from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Divider from '../components/Divider';
import {Gallery} from 'react-grid-gallery';
import ToolBar from '../components/ToolBar';
import AppColors from '../common/AppColor';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIconss from 'react-native-vector-icons/Entypo';

import App from '../../App';
import Util from '../utils/Util';
import GridImageView from 'react-native-grid-image-viewer';
import Modal from 'react-native-modal';
import {SliderBox} from 'react-native-image-slider-box';
import {Chip, Menu, Provider, Button} from 'react-native-paper';
import ApiCalling from '../network/ApiCalling';
import BASE_URL, {
  URL_IMAGE_MY_PROFILE,
  URL_IMAGE_POST,
  URL_IMAGE_STUDENT_PHOTO,
} from '../common/Config';
import Colors from '../common/Colors';
import moment from 'moment';
import ReadMore from '@fawazahmed/react-native-read-more';
import ProgressDialog from '../components/ProgressDialog';
import TextAvatar from 'react-native-text-avatar';
import AppStyle from '../common/AppStyle';
//Import ActionButton
import ActionButton from 'react-native-action-button';

//Import Icon for the ActionButton
import Icon from 'react-native-vector-icons/Ionicons';
import Header, {ParentHeaderHome} from '../Header';
import {Dropdown} from 'react-native-element-dropdown';
import {Images} from '../assets';
import YoutubePlayer from 'react-native-youtube-iframe';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import WebView from 'react-native-webview';
const {width, height} = Dimensions.get('window');

const ChipComponent = ({name, icon}) => (
  <Chip
    icon={icon}
    size={14}
    style={{
      height: 25,
      justifyContent: 'center',
      marginVertical: 15,
      marginRight: 5,
      fontSize: 14,
    }}
    onPress={() => console.log('Pressed')}>
    {name}
  </Chip>
);

const ChildSelect = ({childList, selectChild, onValueSelect, data}) => {
  // console.log('childList', childList);
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Image
          source={Images.childe}
          style={{
            tintColor: AppColors.childColor,
            height: 15,
            width: 15,
          }}
        />
        <Text style={styles.textItem}>{item.name}</Text>
      </View>
    );
  };
  return (
    <TouchableOpacity>
      {
        <>
          <Dropdown
            fontFamily="Poppins-Medium"
            dropdownPosition={4}
            disable={childList.length === 1 ? true : false}
            style={{
              width: 165,
              padding: 5,
              marginVertical: 4,
              marginLeft: 10,
              paddingHorizontal: 10,
            }}
            renderRightIcon={() => {
              return (
                <View>
                  {childList.length == 1 ? null : (
                    <MaterialCommunityIcons
                      name="menu-down"
                      size={25}
                      color={AppColors.black}
                      style={{position: 'relative', left: -5}}
                    />
                  )}
                </View>
              );
            }}
            containerStyle={{
              borderRadius: 5,
              width: 200,
            }}
            placeholderStyle={{
              fontSize: 15,
              // width: 150,
            }}
            placeholder="Child Name"
            placeholderColor={AppColors.accent}
            data={childList}
            value={selectChild?.id}
            labelField="name"
            valueField="id"
            onChange={onValueSelect}
            renderItem={renderItem}
          />
        </>
      }
    </TouchableOpacity>
  );
};

export default class ParentsDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
      firstName: null,
      lastName: null,
      data: [],
      userId: null,
      like: false,
      setRefreshing: false,
      imgModal: false,
      sliderOpen: false,
      img: null,
      itemOpen: 0,
      is_staff: false,
      isLoading: false,
      postAvtar: null,
      avatar: require('../assets/user.png'),
      selectChild: {},
      childList: [],
      loadingExtradata: false,
      page: 1,
      totalPages: 1,
      page_number: 1,
    };
  }

  async componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    await Util.getUser().then(data => {
      console.log('getUser: ', data);

      this.setState({
        is_staff: data.is_staff,
        firstName: data.firstName,
        lastName: data.lastName,
        userId: data.id,

        avatar: Util.isValidData(data.avatar)
          ? {uri: URL_IMAGE_STUDENT_PHOTO + data.avatar}
          : require('../assets/user.png'),
      });
      if (data.is_staff) {
        this.get_Staff_Data();
        this.focusListener = this.props.navigation.addListener('focus', () => {
          this.get_Staff_Data();

          BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
          );
        });
      } else {
        this.getProfile();
        this.focusListener = this.props.navigation.addListener('focus', () => {
          this.getProfile();

          BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonClick,
          );
        });
      }
    });
    this.props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );
    });
  }
  componentWillUnmount() {
    this.focusListener();
  }
  handleBackButtonClick = () => {
    return true;
  };
  get_Staff_Data = async () => {
    try {
      console.log('this.state.page', this.state.page);

      var params = {
        page_size: 20,
        page_number: this.state.page,
      };
      await ApiCalling.apiCallBodyDataPost(
        'activity/getActivities',
        params,
      ).then(res => {
        // console.log(res.data.data);
        this.setState({
          totalPages: res.data.totalPages,
          page_number: res.data.page_number,
        });
        if (this.state.totalPages >= this.state.page_number) {
          res.data.data.filter(d => {
            {
              d.backColor = this.randomHex();
            }
          });
          console.log('totalPages==', res.data.totalPages);
          this.setState({
            data:
              this.state.page == 1
                ? res.data.data
                : [...this.state.data, ...res.data.data],
          });
          // console.log("data===",this.state.data);
        }
      });
    } catch (error) {}
  };
  LoadMoreData = () => {
    console.log('Last Index');
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => this.get_Staff_Data(),
    );
  };
  getProfile = async () => {
    // console.log("Get profile===",this.state.selectChild);

    try {
      Util.getSelectedChild().then(dataa => {
        this.setState({selectChild: dataa});
        ApiCalling.apiCallBodyDataGet(
          'activity/getByStudentId/' + dataa.id,
        ).then(res => {
          res.data.filter(d => {
            {
              d.backColor = this.randomHex();
            }
          });
          this.setState({data: res.data});
        });
        Util.getListChilde().then(ch => {
          this.setState({
            childList: ch,
          });
        });
      });
    } catch (error) {}
  };
  getSetData = async () => {
    try {
      Util.getUser().then(data => {
        console.log('getUser: ', data);

        if (data.is_staff) {
          Util.showMsg('Staff dashboard under development');
        }

        Util.getSelectedChild().then(dataa => {
          Util.getListChilde().then(ch => {
            console.log('dattttttttttttt', dataa);
            this.setState({
              childList: ch,
              firstName: data.firstName,
              lastName: data.lastName,
              userId: data.id,
              is_staff: data.is_staff,
              avatar: Util.isValidData(data.avatar)
                ? {uri: URL_IMAGE_STUDENT_PHOTO + data.avatar}
                : require('../assets/user.png'),
              selectChild: dataa,
            });
          });
        });
      });
    } catch (error) {}
  };
  updateDrawerState(isDrawerOpen) {
    this.setState({isDrawerOpen});
  }

  randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  toggleDrawer = () => {
    this.setState({isDrawerOpen: !this.state.isDrawerOpen});
  };

  gotoLogin() {
    Util.removeUser();
    Util.removeSelectedSchool();
    this.props.navigation.navigate('Login');
  }

  showLogoutAlert() {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from app?',
      [
        {
          text: 'No',
          onPress: () => console.log('Dismiss'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.gotoLogin(),
        },
      ],
      {cancelable: false},
    );
  }

  handleRefresh = () => {
    if (this.state.is_staff) {
      this.setState({page: 1});
      this.get_Staff_Data();
    } else {
      this.getProfile();
    }
  };

  likeUnLike = val => {
    ApiCalling.apiCallBodyDataPost('activity/like/' + val);
    if (this.state.is_staff) {
      this.setState({page: 1});
      this.get_Staff_Data();
    } else {
      this.getProfile();
    }
  };

  unLike = val => {
    ApiCalling.apiCallDelete('activity/Unlike/' + val);
    if (this.state.is_staff) {
      this.setState({page: 1});
      this.get_Staff_Data();
    } else {
      this.getProfile();
    }
  };

  HomeProfile() {
    console.log(
      'photo url:',
      URL_IMAGE_STUDENT_PHOTO + this.state.selectChild?.photo,
    );
    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            {Util.isValidData(this.state.selectChild?.photo) ? (
              <Image
                source={{
                  uri: URL_IMAGE_STUDENT_PHOTO + this.state.selectChild?.photo,
                }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 45 / 2,
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <TextAvatar
                backgroundColor={AppColors.colorPrimary}
                textColor={AppColors.white}
                size={40}
                type={'circle'} // optional
              >
                {this.state.selectChild?.firstName +
                  '' +
                  this.state.selectChild?.lastName}
              </TextAvatar>
            )}
          </View>
          <ChildSelect
            childList={this.state.childList}
            selectChild={this.state.selectChild}
            data={this.state.childList}
            onValueSelect={item => {
              Util.saveSelectedChild(item);
              console.log(item);
              console.log(this.state.childList);
              this.setState({
                selectChild: item,
              });
              this.getProfile();
              this.props.navigation.replace('TabNavigation');
              // this.props.selectItem(item)
            }}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('NotificationScreen')
            }>
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              color={AppColors.inactiveTab}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  showFile = async fileUrl => {
    Linking.openURL(fileUrl);
  };
  getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  render() {
    return (
      <View style={styles.container}>
        {this.state.is_staff ? (
          <ParentHeaderHome toolbarTitle={'Home'} />
        ) : (
          <Header toolbarTitle={this.HomeProfile()} />
        )}
        <View style={{flex: 1, backgroundColor: AppColors.colorGhostWhite}}>
          <View
            style={{
              flex: 1,
              backgroundColor: AppColors.white,
            }}>
            {ProgressDialog.CustomProgressBar(this.state.isLoading)}

            <View style={{flex: 1}}>
              {this.state.is_staff ? (
                <FlatList
                  data={this.state.data}
                  ItemSeparatorComponent={
                    <View
                      style={{height: 1, backgroundColor: AppColors.divider}}
                    />
                  }
                  contentContainerStyle={{
                    // flex:1,
                    paddingBottom: 15,
                  }}
                  refreshing={this.state.setRefreshing}
                  onRefresh={() => this.handleRefresh()}
                  renderItem={({item, index}) => {
                    // console.log(item);
                    var img = item.ActivityMedia.map(
                      i => URL_IMAGE_POST + i.name,
                    ).sort();

                    var x = item.ActivityLike.some(i => {
                      return i.created_by == this.state.userId;
                    });
                    // console.log(x);
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('PostDetails', {
                            parentPost: item,
                          });
                        }}
                        style={{
                          backgroundColor: AppColors.white,
                          // elevation: 3,
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          // borderRadius: 6,
                          // borderBottomWidth:0.5,
                          // borderBottomColor:Colors.grayCCC,
                          // marginBottom: 10,
                          position: 'relative',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingVertical: 4,
                          }}>
                          {item.CreatedBy.avatar != '' &&
                          item.CreatedBy.avatar != null ? (
                            <Image
                              source={{
                                uri:
                                  URL_IMAGE_MY_PROFILE + item.CreatedBy.avatar,
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
                              backgroundColor={AppColors.primary}
                              textColor={Colors.white}
                              size={45}
                              type={'circle'} // optional
                            >
                              {item.CreatedBy.firstName.toUpperCase() +
                                ' ' +
                                item.CreatedBy.lastName.toUpperCase()}
                            </TextAvatar>
                          )}

                          <View style={{paddingHorizontal: 8}}>
                            <Text
                              style={{
                                color: AppColors.accent,
                                ...AppStyle.TextStyle.titleLarge,
                              }}>
                              {item.CreatedBy.firstName +
                                ' ' +
                                item.CreatedBy.lastName}
                            </Text>
                            <Text
                              style={{
                                color: AppColors.subTitleColor,
                                fontSize: 11,
                                ...AppStyle.TextStyle.subTitle,
                              }}>
                              {moment(item.created_on).format('lll')}
                            </Text>
                          </View>
                          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ActivityDetails',{data:item.id})}} style={{marginBottom: 5, marginLeft: 'auto',padding:5}}>
                          <MaterialCommunityIconss
                            name="dots-three-horizontal"
                            size={20}
                            style={{}}
                            color={AppColors.searchIconColor}
                          />
                          </TouchableOpacity>
                        </View>
                        <ReadMore
                          numberOfLines={3}
                          seeMoreStyle={{color: Colors.skyBlue}}
                          seeLessStyle={{color: Colors.skyBlue}}
                          style={styles.caption}>
                          {item.description}
                        </ReadMore>
                        {/* <Text style={styles.caption}>{item.description}</Text> */}

                        <View>
                          {/* <GridImageView data={img} /> */}
                          {img.length != 0 && (
                            <View style={styles.imageContainer}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  marginBottom: 4,
                                }}>
                                {/* {img[1]?.match(/.pdf/) && (
                                  <View
                                    style={{flexDirection: 'row', padding: 5}}>
                                    <TouchableOpacity
                                      onPress={() => this.showFile(img[1])}>
                                      <MaterialCommunityIcons
                                        name="file-pdf-box"
                                        size={50}
                                        style={{}}
                                        color={AppColors.calendarPrimary}
                                      />
                                      <Text style={{marginLeft: 5}}>
                                        {item.name}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                )}
                                {img[0].match(/.mkv/) && (
                                  <View
                                    style={{flexDirection: 'row', padding: 5}}>
                                    <YoutubePlayer
                                      height={'100%'}
                                      width={width / 1.1}
                                      play={false}
                                      videoId={img[0]}
                                    />
                                  </View>
                                )} */}
                                {img[0]?.match(/.pdf/) ? (
                                  <View
                                    style={{flexDirection: 'row', padding: 5}}>
                                    <TouchableOpacity
                                      onPress={() => this.showFile(img[0])}>
                                      <MaterialCommunityIcons
                                        name="file-pdf-box"
                                        size={50}
                                        style={{}}
                                        color={AppColors.calendarPrimary}
                                      />
                                      <Text style={{marginLeft: 5}}>
                                        {item.name}
                                      </Text>
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
                                  <View
                                    style={{flexDirection: 'row', padding: 5}}>
                                    <TouchableOpacity
                                      onPress={() => this.showFile(img[1])}>
                                      <MaterialCommunityIcons
                                        name="file-pdf-box"
                                        size={50}
                                        style={{}}
                                        color={AppColors.calendarPrimary}
                                      />
                                      <Text style={{marginLeft: 5}}>
                                        {item.name}
                                      </Text>
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
                                <View
                                  style={{flexDirection: 'row', padding: 5}}>
                                  <TouchableOpacity
                                    onPress={() => this.showFile(img[2])}>
                                    <MaterialCommunityIcons
                                      name="file-pdf-box"
                                      size={50}
                                      style={{}}
                                      color={AppColors.calendarPrimary}
                                    />
                                    <Text style={{marginLeft: 5}}>
                                      {item.name}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                img[2] != null && (
                                  <View
                                    style={{flexDirection: 'row', height: 90}}>
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
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          padding: 5,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => this.showFile(img[3])}>
                                          <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={50}
                                            style={{}}
                                            color={AppColors.calendarPrimary}
                                          />
                                          <Text style={{marginLeft: 5}}>
                                            {item.name}
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
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          padding: 5,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => this.showFile(img[4])}>
                                          <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={50}
                                            style={{}}
                                            color={AppColors.calendarPrimary}
                                          />
                                          <Text style={{marginLeft: 5}}>
                                            {item.name}
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
                                            style={[
                                              styles.img,
                                              {marginLeft: 2},
                                            ]}
                                            source={{uri: img[4]}}
                                          />
                                        </TouchableOpacity>
                                      )
                                    )}
                                    {img[5]?.match(/.pdf/) ? (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          padding: 5,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => this.showFile(img[5])}>
                                          <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={50}
                                            style={{}}
                                            color={AppColors.calendarPrimary}
                                          />
                                          <Text style={{marginLeft: 5}}>
                                            {item.name}
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
                                                postAvtar:
                                                  item.CreatedBy.avatar,
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
                              justifyContent: 'space-between',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('PostDetails', {
                                  parentPost: item,
                                })
                              }>
                              <Text
                                style={{
                                  ...AppStyle.TextStyle.subTitle,
                                  color: AppColors.subTitleColor,
                                  fontSize: 11,
                                }}>
                                {Util.getLikeLabel(item.ActivityLike.length)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('PostDetails', {
                                  parentPost: item,
                                })
                              }>
                              <Text
                                style={{
                                  ...AppStyle.TextStyle.subTitle,
                                  color: AppColors.subTitleColor,
                                  fontSize: 11,
                                }}>
                                {Util.getCommentLabel(
                                  item.ActivityComments.length,
                                )}
                              </Text>
                            </TouchableOpacity>
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
                                onPress={() => this.unLike(item.id)}>
                                <MaterialCommunityIcons
                                  name="heart"
                                  size={25}
                                  style={{color: Colors.red}}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this.likeUnLike(item.id)}>
                                <MaterialCommunityIcons
                                  name="cards-heart-outline"
                                  size={25}
                                  style={{}}
                                  color={Colors.iconColor}
                                />
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              style={{marginLeft: 20}}
                              onPress={() =>
                                this.props.navigation.navigate('PostDetails', {
                                  parentPost: item,
                                })
                              }>
                              <MaterialCommunityIcons
                                name="message-reply-outline"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                          </View>
                          {/* <View
                            style={{
                              borderWidth: 0.3,
                              borderStyle: 'solid',
                              borderColor: AppColors.lightDivider,
                              marginTop: 4,
                            }}
                          /> */}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{color: Colors.placeholderColor, fontSize: 20}}>
                        No Post
                      </Text>
                    </View>
                  }
                  onEndReached={this.LoadMoreData}
                  onEndReachedThreshold={0.2}
                  keyExtractor={item => item.id}
                />
              ) : (
                <FlatList
                  data={this.state.data}
                  ItemSeparatorComponent={
                    <View
                      style={{height: 1, backgroundColor: AppColors.divider}}
                    />
                  }
                  contentContainerStyle={{
                    // flex:1,
                    paddingBottom: 15,
                  }}
                  refreshing={this.state.setRefreshing}
                  onRefresh={() => this.handleRefresh()}
                  renderItem={({item, index}) => {
                    console.log(item);
                    var img = item.ActivityMedia.map(
                      i => URL_IMAGE_POST + i.name,
                    ).sort();

                    var x = item.ActivityLike.some(i => {
                      return i.created_by == this.state.userId;
                    });
                    // console.log(x);
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('PostDetails', {
                            parentPost: item,
                          });
                        }}
                        style={{
                          backgroundColor: AppColors.white,
                          // elevation: 3,
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          // borderRadius: 6,
                          // borderBottomWidth:0.5,
                          // borderBottomColor:Colors.grayCCC,
                          // marginBottom: 10,
                          position: 'relative',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingVertical: 4,
                          }}>
                          {item.CreatedBy.avatar != '' &&
                          item.CreatedBy.avatar != null ? (
                            <Image
                              source={{
                                uri:
                                  URL_IMAGE_MY_PROFILE + item.CreatedBy.avatar,
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
                              backgroundColor={item.backColor}
                              textColor={Colors.white}
                              size={45}
                              type={'circle'} // optional
                            >
                              {item.CreatedBy.firstName.toUpperCase() +
                                ' ' +
                                item.CreatedBy.lastName.toUpperCase()}
                            </TextAvatar>
                          )}

                          <View style={{paddingHorizontal: 8}}>
                            <Text
                              style={{
                                color: AppColors.accent,
                                ...AppStyle.TextStyle.titleLarge,
                              }}>
                              {item.CreatedBy.firstName +
                                ' ' +
                                item.CreatedBy.lastName}
                            </Text>
                            <Text
                              style={{
                                color: AppColors.subTitleColor,
                                fontSize: 11,
                                ...AppStyle.TextStyle.subTitle,
                              }}>
                              {moment(item.created_on).format('lll')}
                            </Text>
                          </View>
                        </View>
                        <ReadMore
                          numberOfLines={3}
                          seeMoreStyle={{color: Colors.skyBlue}}
                          seeLessStyle={{color: Colors.skyBlue}}
                          style={styles.caption}>
                          {item.description}
                        </ReadMore>
                        {/* <Text style={styles.caption}>{item.description}</Text> */}

                        <View>
                          {/* <GridImageView data={img} /> */}
                          {img.length != 0 && (
                            <View style={styles.imageContainer}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  marginBottom: 4,
                                }}>
                                {img[0]?.match(/.pdf/) ? (
                                  <View
                                    style={{flexDirection: 'row', padding: 5}}>
                                    <TouchableOpacity
                                      onPress={() => this.showFile(img[0])}>
                                      <MaterialCommunityIcons
                                        name="file-pdf-box"
                                        size={50}
                                        style={{}}
                                        color={AppColors.calendarPrimary}
                                      />
                                      <Text style={{marginLeft: 5}}>
                                        {item.name}
                                      </Text>
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
                                  <View
                                    style={{flexDirection: 'row', padding: 5}}>
                                    <TouchableOpacity
                                      onPress={() => this.showFile(img[1])}>
                                      <MaterialCommunityIcons
                                        name="file-pdf-box"
                                        size={50}
                                        style={{}}
                                        color={AppColors.calendarPrimary}
                                      />
                                      <Text style={{marginLeft: 5}}>
                                        {item.name}
                                      </Text>
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
                                <View
                                  style={{flexDirection: 'row', padding: 5}}>
                                  <TouchableOpacity
                                    onPress={() => this.showFile(img[2])}>
                                    <MaterialCommunityIcons
                                      name="file-pdf-box"
                                      size={50}
                                      style={{}}
                                      color={AppColors.calendarPrimary}
                                    />
                                    <Text style={{marginLeft: 5}}>
                                      {item.name}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                img[2] != null && (
                                  <View
                                    style={{flexDirection: 'row', height: 90}}>
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
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          padding: 5,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => this.showFile(img[3])}>
                                          <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={50}
                                            style={{}}
                                            color={AppColors.calendarPrimary}
                                          />
                                          <Text style={{marginLeft: 5}}>
                                            {item.name}
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
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          padding: 5,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => this.showFile(img[4])}>
                                          <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={50}
                                            style={{}}
                                            color={AppColors.calendarPrimary}
                                          />
                                          <Text style={{marginLeft: 5}}>
                                            {item.name}
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
                                            style={[
                                              styles.img,
                                              {marginLeft: 2},
                                            ]}
                                            source={{uri: img[4]}}
                                          />
                                        </TouchableOpacity>
                                      )
                                    )}
                                    {img[5]?.match(/.pdf/) ? (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          padding: 5,
                                        }}>
                                        <TouchableOpacity
                                          onPress={() => this.showFile(img[5])}>
                                          <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={50}
                                            style={{}}
                                            color={AppColors.calendarPrimary}
                                          />
                                          <Text style={{marginLeft: 5}}>
                                            {item.name}
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
                                                postAvtar:
                                                  item.CreatedBy.avatar,
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
                              justifyContent: 'space-between',
                            }}>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('PostDetails', {
                                  parentPost: item,
                                })
                              }>
                              <Text
                                style={{
                                  ...AppStyle.TextStyle.subTitle,
                                  color: AppColors.subTitleColor,
                                  fontSize: 11,
                                }}>
                                {Util.getLikeLabel(item.ActivityLike.length)}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.navigation.navigate('PostDetails', {
                                  parentPost: item,
                                })
                              }>
                              <Text
                                style={{
                                  ...AppStyle.TextStyle.subTitle,
                                  color: AppColors.subTitleColor,
                                  fontSize: 11,
                                }}>
                                {Util.getCommentLabel(
                                  item.ActivityComments.length,
                                )}
                              </Text>
                            </TouchableOpacity>
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
                                onPress={() => this.unLike(item.id)}>
                                <MaterialCommunityIcons
                                  name="heart"
                                  size={25}
                                  style={{color: Colors.red}}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this.likeUnLike(item.id)}>
                                <MaterialCommunityIcons
                                  name="cards-heart-outline"
                                  size={25}
                                  style={{}}
                                  color={Colors.iconColor}
                                />
                              </TouchableOpacity>
                            )}

                            <TouchableOpacity
                              style={{marginLeft: 20}}
                              onPress={() =>
                                this.props.navigation.navigate('PostDetails', {
                                  parentPost: item,
                                })
                              }>
                              <MaterialCommunityIcons
                                name="message-reply-outline"
                                size={25}
                                style={{}}
                                color={Colors.iconColor}
                              />
                            </TouchableOpacity>
                          </View>
                          {/* <View
                          style={{
                            borderWidth: 0.3,
                            borderStyle: 'solid',
                            borderColor: AppColors.lightDivider,
                            marginTop: 4,
                          }}
                        /> */}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{color: Colors.placeholderColor, fontSize: 20}}>
                        No Post
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
            {this.state.is_staff && (
              <ActionButton buttonColor={AppColors.childColor}>
                <ActionButton.Item
                  buttonColor={Colors.black}
                  title="Announcement"
                  onPress={() => alert('Announcement')}>
                  <MaterialCommunityIcons
                    name="account-voice"
                    style={styles.actionButtonIcon}
                  />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor={Colors.black}
                  title="Holiday"
                  onPress={() => alert('Holiday')}>
                  <MaterialCommunityIcons
                    name="calendar-remove-outline"
                    style={styles.actionButtonIcon}
                  />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor={Colors.black}
                  title="Event"
                  onPress={() => alert('Event')}>
                  <IconFA1 name="event" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor={Colors.black}
                  title="Attendance"
                  onPress={() => alert('Attendance')}>
                  <MaterialCommunityIcons
                    name="calendar-range-outline"
                    style={styles.actionButtonIcon}
                  />
                </ActionButton.Item>
                <ActionButton.Item
                  buttonColor={Colors.black}
                  title="Post"
                  onPress={() =>
                    this.props.navigation.navigate('ActivityDetails')
                  }>
                  <MaterialCommunityIcons
                    name="plus-box-outline"
                    style={styles.actionButtonIcon}
                  />
                </ActionButton.Item>
              </ActionButton>
            )}

            {/* old slider */}

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
                      <IconFA
                        name="chevron-back"
                        size={50}
                        color={Colors.white}
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
                      {this.state.avatar != '' && this.state.avatar != null ? (
                        <Image
                          source={{
                            uri: URL_IMAGE_MY_PROFILE + this.state.postAvtar,
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
                          {this.state.firstName.toUpperCase() +
                            ' ' +
                            this.state.lastName.toUpperCase()}
                        </TextAvatar>
                      )}

                      <View>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: AppColors.white,
                            marginLeft: 10,
                          }}>
                          {this.state.firstName + ' ' + this.state.lastName}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: 20}}></View>
                </View>

                <View style={{justifyContent: 'center', flex: 1}}>
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
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    marginLeft: 7,
    fontWeight: '500',
  },
  subView: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: Colors.primary,
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
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 8,
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

  subView: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderColor: AppColors.accent,
  },
  headerTitle: {
    paddingHorizontal: 10,
    ...AppStyle.TextStyle.titleExtraLarge,
  },
  text: {
    color: AppColors.accentDark,
    fontSize: 14,
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
  toolbarStyle: {
    justifyContent: 'flex-start',
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
  dropdown: {
    backgroundColor: 'grey',
  },
});
