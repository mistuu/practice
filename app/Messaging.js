import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  Image,
} from 'react-native';
import AppColors from './common/AppColor';
import ToolBar from './components/ToolBar';
import TextAvatar from 'react-native-text-avatar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiCalling from './network/ApiCalling';
import ProgressDialog from './components/ProgressDialog';
import Colors from './common/Colors';
import AppStyle from './common/AppStyle';
import Util from './utils/Util';
import {URL_IMAGE_MY_PROFILE, URL_IMAGE_STUDENT_PHOTOS} from './common/Config';

const Messaging = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const unreadMSG = false;
  const [isStaff, setisStaff] = useState(false);

  const [isActiveTab, setIsActiveTab] = useState(0);
  const [read, setRead] = useState(0);
  const [search_Staff, setSearch_Staff] = useState('');
  const [chatListForParent, setChatListForParent] = useState([]);
  const [parentData, setParentData] = useState([]);
  const [searchBtn, showSearchBtn] = useState(false);
  const [userData, setUserData] = useState([]);
  const randomColors = () => {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = '#' + hex.toString(16);
    return color;
  };
  useEffect(() => {
    getData();
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('getData()');
      getData();
      getDataForParentUser();
    });

    return () => {
      unsubscribe;
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    //for staff

    ApiCalling.apiCallBodyDataGet('chatroom/staff-rooms')
      .then(res => {
        console.log('satff', res.data);
        if (Array.isArray(res.data)) {
          res.data.filter(d => {
            {
              // d.backColor = this.randomHex();
              d.backColor = AppColors.colorPrimary;
            }
          });
          setUserData(res.data);
          setChatListForParent(res.data);
        }
      })
      .catch(err => {
        setLoading(false);
      });

    //for Parent
    ApiCalling.apiCallBodyDataGet('chatroom/parent-rooms')
      .then(res => {
        if (Array.isArray(res.data)) {
          console.log('isValidArray: ', true);
          res.data.filter(d => {
            {
              d.backColor = AppColors.colorPrimary;
            }
          });
          // console.log(res.data);
          setParentData(res.data);
        } else {
          // Util.showMsg(res.data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('err :', err);
      });
  };

  const getDataForParentUser = async () => {
    const child = await Util.getSelectedChild();
    console.log(child);

    if (isLoading) {
      return;
    }
    setLoading(true);
    Util.getUser().then(data => {
      setisStaff(data.is_staff);
      if (data.is_staff) {
        ApiCalling.apiCallBodyDataGet('chatroom/staff-rooms')
          .then(res => {
            console.log('satff', res.data);
            if (Array.isArray(res.data)) {
              res.data.filter(d => {
                {
                  // d.backColor = this.randomHex();
                  d.backColor = AppColors.colorPrimary;
                }
              });
              setChatListForParent(res.data);
            }
          })
          .catch(err => {
            setLoading(false);
          });
      } else {
        ApiCalling.apiCallBodyDataGet('chatroom/student-rooms/' + child?.id)
          .then(res => {
            console.log(res.data);
            // if (Array.isArray(res.data)) {
            console.log('isValidArray: ', true);
            res.data.filter(d => {
              {
                d.backColor = AppColors.colorPrimary;
              }
            });
            // console.log(res.data);
            setChatListForParent(res.data);
            // } else {
            //   Util.showMsg(res.data.message);
            // }
            setLoading(false);
          })
          .catch(err => {
            setLoading(false);
            console.log('err :', err);
          });
      }
    });
  };
  const Item = ({firstName, lable, read}) => (
    console.log(firstName),
    (
      <View style={styles.item}>
        <Text
          style={{
            color: AppColors.black,
            fontWeight: read != 0 ? 'bold' : 'normal',
          }}>
          {firstName}
        </Text>
        <Text
          style={{
            fontSize: 10,
            color: AppColors.darkFadeText,
            fontWeight: read != 0 ? 'bold' : 'normal',
          }}>
          {lable}
        </Text>
      </View>
    )
  );
  randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const openMessageRoom = async (
    name,
    lastName,
    designation,
    color,
    id,
    avatar,
  ) => {
    let data = {
      user_id: id,
    };
    await ApiCalling.apiCallBodyDataPost('chatroom/add-chatroom', data).then(
      async res => {
        console.log('create chat room==', res.data);
        navigation.navigate('ChatRoom', {
          firstName: name,
          lastName: lastName,
          designation: designation,
          randomColors: color,
          roomId: res.data.chatroom.id,
          avatar: avatar,
        });
      },
    );
  };
  return (
    <View style={styles.container}>
      <ToolBar
        toolBarTitle={'Messages'}
        showSubTitle={false}
        showBackIcon={true}
        elevations={0}
        showSearchButton={true}
        showSearchIcon={val => showSearchBtn(val)}
        navigation={navigation}
        onHomeIconClick={() => {
          navigation.goBack(null);
        }}
      />
      {ProgressDialog.CustomProgressBar(isLoading)}
      {searchBtn && (
        <View style={{marginHorizontal: 10}}>
          <TextInput
            placeholder="Search"
            mode="outlined"
            value={search_Staff}
            style={styles.searchBox}
            onChangeText={text => {
              setSearch_Staff(text);
            }}
          />
          {/* <View style={{position: 'absolute', right: 20, top: 12}}>
          <TouchableOpacity>
            <MaterialCommunityIcons size={25} name="magnify" />
          </TouchableOpacity>
        </View> */}
        </View>
      )}
      {isStaff ? (
        <View>
          <View style={styles.switchChat}>
            <TouchableOpacity
              style={{
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: isActiveTab == 1 ? '#49c5b6' : 'transparent',
              }}
              onPress={() => {
                setIsActiveTab(1);
              }}>
              <Text
                style={{
                  color: isActiveTab == 1 ? '#fff' : '#999',
                  fontWeight: '700',
                }}>
                Parent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: isActiveTab == 0 ? '#49c5b6' : 'transparent',
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                setIsActiveTab(0);
              }}>
              <Text
                style={{
                  color: isActiveTab == 0 ? '#fff' : '#999',
                  fontWeight: '700',
                }}>
                Staff
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {isActiveTab == 1 ? (
              <View style={styles.chatwrap}>
                <FlatList
                  data={parentData.filter(value => {
                    if (search_Staff == '') {
                      return value;
                    } else if (
                      value.Users[0].User?.firstName
                        .toLowerCase()
                        .includes(search_Staff.toLocaleLowerCase())
                    ) {
                      return value;
                    }
                    return;
                  })}
                  scrollEnabled={false}
                  renderItem={({item, index}) => (
                    console.log('Parent==', item.Users[0].User.id),
                    (
                      <TouchableOpacity
                        onPress={() => {
                          openMessageRoom(
                            item.Users[0].User?.firstName
                              .charAt(0)
                              .toUpperCase() +
                              item.Users[0].User?.firstName.slice(1),
                            item.Users[0].User?.lastName
                              .charAt(0)
                              .toUpperCase() +
                              item.Users[0].User?.lastName.slice(1),
                            'Teacher',
                            item.backColor,
                            item.Users[0].User?.id,
                            item.Users[0].User?.avatar,
                          );
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          marginBottom: 8,
                          borderRadius: 8,
                          marginHorizontal: 10,
                          backgroundColor:
                            item.unread != 0
                              ? 'rgba(78, 165, 167, .1)'
                              : AppColors.listInactiveColor,
                        }}>
                        <View
                          style={{
                            fontFamily: 'NunitoSans-Bold',
                          }}>
                          {/* {Util.isValidData(item.user.User?.avatar) ? (
                          <Image
                            source={{
                              uri: URL_IMAGE_MY_PROFILE + item.user.User?.avatar,
                            }}
                            style={{
                              width: 45,
                              height: 45,
                              borderRadius: 45 / 2,
                              resizeMode: 'center',
                            }}
                          />
                        ) : ( */}
                          <TextAvatar
                            backgroundColor={item.backColor}
                            size={45}
                            type={'circle'}>
                            {item.Users[0].User?.firstName
                              .charAt(0)
                              .toUpperCase() +
                              item.Users[0].User?.lastName
                                .charAt(0)
                                .toUpperCase()}
                          </TextAvatar>
                          {/* )} */}
                        </View>

                        <View>
                          <View style={styles.item}>
                            <Text
                              style={{
                                color: AppColors.settingPrimaryColor,
                                fontFamily: 'NunitoSans-SemiBold',
                                fontWeight:
                                  item.unread != 0 ? 'bold' : 'normal',
                                fontSize: 15,
                              }}>
                              {item.Users[0].User?.firstName
                                .charAt(0)
                                .toUpperCase() +
                                item.Users[0].User?.firstName.slice(1)}{' '}
                              {item.Users[0].User?.lastName
                                .charAt(0)
                                .toUpperCase() +
                                item.Users[0].User?.lastName.slice(1)}
                            </Text>
                            {/* <Text
                          numberOfLines={1}
                            style={{
                              fontSize: 12,
                              fontFamily: 'NunitoSans-SemiBold',
                              color: AppColors.SmallTextColor,
                              fontWeight: item.unread != 0 ? 'bold' : 'normal',
                              marginTop: 5,
                            }}>
                            {item.lastMessage}
                          </Text> */}
                          </View>
                        </View>

                        {item.unread != 0 && (
                          <View
                            style={{
                              backgroundColor: AppColors.countBadge,
                              height: 20,
                              width: 20,
                              borderRadius: 20 / 2,
                              alignItems: 'center',
                              position: 'absolute',
                              right: 20,
                            }}>
                            <Text style={{color: AppColors.white}}>
                              {item.unread}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    )
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            ) : (
              <View style={styles.chatwrap}>
                <FlatList
                  data={userData.filter(value => {
                    if (search_Staff == '') {
                      return value;
                    } else if (
                      value.user.firstName
                        .toLowerCase()
                        .includes(search_Staff.toLocaleLowerCase())
                    ) {
                      return value;
                    }
                    return;
                  })}
                  scrollEnabled={false}
                  renderItem={({item}) => (
                    console.log(item),
                    (
                      <TouchableOpacity
                        onPress={() => {
                          openMessageRoom(
                            item.user?.firstName.charAt(0).toUpperCase() +
                              item.user?.firstName.slice(1),
                            item.user?.lastName.charAt(0).toUpperCase() +
                              item.user?.lastName.slice(1),
                            'Teacher',
                            item.backColor,
                            item.user?.id,
                            item.user?.avatar,
                          );
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 8,
                          marginBottom: 8,
                          borderRadius: 8,
                          marginHorizontal: 10,
                          backgroundColor:
                            item.unread != 0
                              ? 'rgba(78, 165, 167, .1)'
                              : AppColors.listInactiveColor,
                        }}>
                        <View
                          style={{
                            fontFamily: 'NunitoSans-Bold',
                          }}>
                          {/* {Util.isValidData(item.user.User?.avatar) ? (
                          <Image
                            source={{
                              uri:
                                URL_IMAGE_MY_PROFILE + item.user.User?.avatar,
                            }}
                            style={{
                              width: 45,
                              height: 45,
                              borderRadius: 45 / 2,
                              resizeMode: 'center',
                            }}
                          />
                        ) : ( */}
                          <TextAvatar
                            backgroundColor={AppColors.primary}
                            size={45}
                            type={'circle'}>
                            {item.user?.firstName.charAt(0).toUpperCase() +
                              item.user?.lastName.charAt(0).toUpperCase()}
                          </TextAvatar>
                          {/* )} */}
                        </View>

                        <View>
                          <View style={styles.item}>
                            <Text
                              style={{
                                color: AppColors.settingPrimaryColor,
                                fontFamily: 'NunitoSans-SemiBold',
                                fontWeight:
                                  item.unread != 0 ? 'bold' : 'normal',
                                fontSize: 15,
                              }}>
                              {item.user?.firstName.charAt(0).toUpperCase() +
                                item.user?.firstName.slice(1)}{' '}
                              {item.user?.lastName.charAt(0).toUpperCase() +
                                item.user?.lastName.slice(1)}
                            </Text>
                            {/* <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 12,
                              fontFamily: 'NunitoSans-SemiBold',
                              color: AppColors.SmallTextColor,
                              fontWeight: item.unread != 0 ? 'bold' : 'normal',
                              marginTop: 5,
                            }}>
                            {item.lastMessage}
                          </Text> */}
                          </View>
                        </View>

                        {item.unread != 0 && (
                          <View
                            style={{
                              backgroundColor: AppColors.countBadge,
                              height: 20,
                              width: 20,
                              borderRadius: 20 / 2,
                              alignItems: 'center',
                              position: 'absolute',
                              right: 20,
                            }}>
                            <Text style={{color: AppColors.white}}>
                              {item.unread}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    )
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.chatwrap}>
            <FlatList
              data={chatListForParent.filter(value => {
                if (search_Staff == '') {
                  return value;
                } else if (
                  value.user.User.firstName
                    .toLowerCase()
                    .includes(search_Staff.toLocaleLowerCase()) ||
                  value.user.User.lastName
                    .toLowerCase()
                    .includes(search_Staff.toLocaleLowerCase())
                ) {
                  return value;
                }
                return;
              })}
              scrollEnabled={false}
              renderItem={({item}) => {
                console.log('Item', item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      openMessageRoom(
                        item.user.User?.firstName.charAt(0).toUpperCase() +
                          item.user.User?.firstName.slice(1),
                        item.user.User?.lastName.charAt(0).toUpperCase() +
                          item.user.User?.lastName.slice(1),
                        'Teacher',
                        item.backColor,
                        item.user.User?.id,
                        item.user.User?.avatar,
                      );
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 8,
                      marginBottom: 8,
                      borderRadius: 8,
                      marginHorizontal: 10,
                      backgroundColor:
                        item.unread != 0
                          ? 'rgba(78, 165, 167, .1)'
                          : AppColors.listInactiveColor,
                    }}>
                    <View
                      style={{
                        fontFamily: 'NunitoSans-Bold',
                      }}>
                      {Util.isValidData(item.user.User?.avatar) ? (
                        <Image
                          source={{
                            uri: URL_IMAGE_MY_PROFILE + item.user.User?.avatar,
                          }}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                            resizeMode: 'center',
                          }}
                        />
                      ) : (
                        <TextAvatar
                          backgroundColor={item.backColor}
                          size={45}
                          type={'circle'}>
                          {item.user.User?.firstName.charAt(0).toUpperCase() +
                            item.user.User?.lastName.charAt(0).toUpperCase()}
                        </TextAvatar>
                      )}
                    </View>

                    <View>
                      <View style={styles.item}>
                        <Text
                          style={{
                            color: AppColors.settingPrimaryColor,
                            fontFamily: 'NunitoSans-SemiBold',
                            fontWeight: item.unread != 0 ? 'bold' : 'normal',
                            fontSize: 15,
                          }}>
                          {item.user.User?.firstName.charAt(0).toUpperCase() +
                            item.user.User?.firstName.slice(1)}{' '}
                          {item.user.User?.lastName.charAt(0).toUpperCase() +
                            item.user.User?.lastName.slice(1)}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: 12,
                            fontFamily: 'NunitoSans-SemiBold',
                            color: AppColors.SmallTextColor,
                            fontWeight: item.unread != 0 ? 'bold' : 'normal',
                            marginTop: 5,
                          }}>
                          {item.lastMessage}
                        </Text>
                      </View>
                    </View>

                    {item.unread != 0 && (
                      <View
                        style={{
                          backgroundColor: AppColors.countBadge,
                          height: 20,
                          width: 20,
                          borderRadius: 20 / 2,
                          alignItems: 'center',
                          position: 'absolute',
                          right: 20,
                        }}>
                        <Text style={{color: AppColors.white}}>
                          {item.unread}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Messaging;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    // backgroundColor: AppColors.settingbgColor,
  },

  item: {
    padding: 15,
    marginHorizontal: 10,
    paddingVertical: 20,
  },
  switchChat: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.6,
    borderBottomColor: AppColors.mainColor,
    marginVertical: 5,
    marginHorizontal: 5,
    paddingBottom: 4,
  },
  searchBox: {
    borderWidth: 0.5,
    borderColor: Colors.iconColor,
    marginHorizontal: 10,
    borderRadius: 5,
    position: 'relative',
    paddingHorizontal: 14,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    // marginHorizontal:10,
    marginVertical: 5,
  },
  inputStyle: {
    marginBottom: 10,
    backgroundColor: AppColors.white,
    fontSize: 16,
    ...AppStyle.TextStyle.inputTextFont,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  chatwrap: {marginTop: 10},
  gradientColor: {
    backgroundGradient: 'vertical',
    backgroundGradientTop: '#333333',
    backgroundGradientBottom: '#666666',
  },
  badge: {
    width: 25,
    height: 25,
    backgroundColor: AppColors.countBadge,
    color: AppColors.white,
    borderRadius: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
  },
  whitToast: {
    width: 12,
    height: 12,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    position: 'absolute',
    bottom: 2,
    right: 1,
  },
  greenToast: {
    width: 10,
    height: 10,
    backgroundColor: AppColors.onlineToastColor,
    borderRadius: 50,
    position: 'absolute',
    bottom: 1,
    right: 1,
  },
});
