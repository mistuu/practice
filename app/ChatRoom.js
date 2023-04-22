import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import DocumentPickerHandle from 'react-native-document-picker';
import ToolBar from './components/ToolBar';
import TextAvatar from 'react-native-text-avatar';
import AppColors from './common/AppColor';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon2 from 'react-native-vector-icons/Feather';
import MaterialIcon3 from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-paper';
import socketIOClient, {io} from 'socket.io-client';
import Util from './utils/Util';
import BASE_URL, {
  URL_IMAGE_MY_PROFILE,
  URL_IMAGE_STUDENT_PHOTO,
} from './common/Config';
import ApiCalling from './network/ApiCalling';
import moment from 'moment';
import Colors from './common/Colors';
import PhoneInput from 'react-native-phone-number-input';
import * as ImagePicker from 'react-native-image-picker';
import AppStyle from './common/AppStyle';
import {Image} from 'react-native';

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
const NEW_CHAT_MESSAGE_EVENT = 'events';
const NEW_CHAT_MESSAGE_READ = 'read';

const ChatRoom = ({route, navigation, item}) => {
  // console.log(route);

  const firstName = route.params?.firstName;
  const lastName = route.params?.lastName;
  const designation = route.params.designation;
  const randomColors = route.params.randomColors;
  const avatar = route.params.avatar;
  const [loginId, setLoginId] = useState(null);
  const [fileSendModal, setFileSendModal] = useState(false);

  const [messagesHistory, setMessagesHistory] = useState([]);
  const [roomId, setRoomId] = useState(route.params.roomId);
  const [sendTextMessage, setSendTextMessage] = useState(null);
  const [keyboardShown, setIsKeyboardShown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const socketRef = useRef();

  useEffect(() => {
    Util.getUser().then(data => {
      setLoginId(data.id);
    });
    getMessage();
    if (roomId !== '') {
      socketRef.current = io(BASE_URL, {
        query: {roomId},
      });
      console.log('socketRef.current', socketRef.current);

      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, message => {
        console.log('message:', message);
        console.log('messageRecevie:=:', messagesHistory);

        if (message?.chatroom_id === roomId) {
          const incomingMessage = {
            ...message,
            ownedByCurrentUser: message.senderId === socketRef.current.id,
            read_on: null,
          };
          console.log('messages Incoming==', incomingMessage);
          console.log('old list====', ...messagesHistory);
          if (messagesHistory.length != 0) {
            var msg = messagesHistory;
            msg.filter(i => {
              console.log(
                i.date +
                  '========Date Compare====' +
                  moment(incomingMessage.sent_on).format('YYYY-MM-DD'),
              );
              if (
                i.date == moment(incomingMessage.sent_on).format('YYYY-MM-DD')
              ) {
                console.log('If True');
                i.mesgData.unshift(incomingMessage);
              }
            });
            // else if(i.mesgData.includes(incomingMessage)){
            //   console.log('Else True');
            //   {
            //     i.date = moment().format('YYYY-MM-DD'),
            //       i.mesgData = [incomingMessage];
            //   }
            // }

            // setMessagesHistory([...msg]);
          }
          var msgs = {
            date: moment(incomingMessage.sent_on).format('YYYY-MM-DD'),
            mesgData: [incomingMessage],
          };
          console.log('messages Incoming==', msgs);
          setMessagesHistory(messages =>
            messages.map(msg =>
              msg.date == moment(incomingMessage.sent_on).format('YYYY-MM-DD')
                ? {
                    ...msg,
                    mesgData: [incomingMessage, ...msg.mesgData],
                  }
                : msg.date !=
                    moment(incomingMessage.sent_on).format('YYYY-MM-DD') &&
                  moment().format('YYYY-MM-DD') ==
                    moment(incomingMessage.sent_on).format('YYYY-MM-DD')
                ? {
                    ...msg,
                    date: moment(incomingMessage.sent_on).format('YYYY-MM-DD'),
                    mesgData: [incomingMessage],
                  }
                : {
                    ...msg,
                  },
            ),
          );

          // var msg = messagesHistory;
          // msg.splice(0,0,incomingMessage)
          // setMessagesHistory(messages => [incomingMessage, ...messages]);
          // console.log('msg', msg);
          // setMessagesHistory(msg);

          // console.log(msg);
        }
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [roomId]);
  // useEffect(() => {
  //   const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
  //     setIsKeyboardShown(true);
  //   });
  //   const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
  //     setIsKeyboardShown(false);
  //   });

  //   // return () => {
  //   //   showKeyboard.removeListener('keyboardDidShow');
  //   //   hideKeyboard.removeListener('keyboardDidHide');
  //   // };
  // });
  const filterArray = async incomingMessage => {
    console.log('Old Data=====', messagesHistory);
    if (messagesHistory.length != 0) {
      var msg = messagesHistory;
      msg.filter(i => {
        if (i.date == moment(incomingMessage.sent_on).format('YYYY-MM-DD')) {
          console.log('If True');
          i.mesgData.unshift(incomingMessage);
        } else {
          console.log('Else True');
          {
            (i.date = incomingMessage.sent_on),
              (i.mesgData = [incomingMessage]);
          }
        }
      });
      console.log('messages Incoming==', [...msg]);
      setMessagesHistory([...msg]);
    }
  };
  const selectImage = async () => {
    let isCameraPermitted = await Util.requestCameraPermission();
    let isStoragePermitted = await Util.requestExternalWritePermission();
    let isStorageReadPermitted = await Util.requestExternalReadPermission();

    console.log('isCameraPermitted', isCameraPermitted);
    console.log('isStoragePermitted', isStoragePermitted);
    console.log('isStorageReadPermitted', isStorageReadPermitted);

    if (isCameraPermitted || isStoragePermitted || isStorageReadPermitted) {
      setFileSendModal(!fileSendModal);
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
  const onSelectFile = async () => {
    try {
      var res = await DocumentPickerHandle.pick({
        type: [DocumentPickerHandle.types.doc,DocumentPickerHandle.types.docx, DocumentPickerHandle.types.pdf,DocumentPickerHandle.types.audio],
      });
      console.log('All Files Pick===', res);
    } catch (error) {}
  };
  const onImageSelectionResponse = response => {
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
    setSelectedImage(response.assets[0]);
    setFileSendModal(false);
    // setAvtar({uri: response.assets[0].uri});
    // this.setState({
    //   selectedImage: response.assets[0],
    // });
  };
  function updateMessage(item) {
    if (item?.read_on === null) {
      socketRef.current.emit(NEW_CHAT_MESSAGE_READ, {
        senderId: socketRef.current.id,
        id: item?.id,
      });
    }
  }
  const getMessage = async () => {
    try {
      await ApiCalling.apiCallBodyDataGet('chatroom/room/' + roomId).then(
        ress => {
          if (ress.data.length > 0) {
            // console.log(ress.data[0]);

            // this gives an object with dates as keys
            var groups = ress.data?.reverse().reduce((groups, game) => {
              // console.log('List=', game.sent_on);

              const date = game.sent_on?.split('T')[0];
              if (!groups[date]) {
                groups[date] = [];
              }

              groups[date].push(game);
              return groups;
            }, {});

            var groupArrays = Object.keys(groups).map(date => {
              return {
                date,
                mesgData: groups[date],
              };
            });
            console.log(groupArrays);
            setMessagesHistory(groupArrays);
          }
        },
      );
    } catch (error) {}
  };
  const sendMessages = () => {
    console.log(sendTextMessage);
    if (sendTextMessage.trim().length != 0) {
      try {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
          body: sendTextMessage,
          senderId: socketRef.current.id,
          id: loginId,
        });
        setSendTextMessage('');
      } catch (error) {}
    } else {
      Util.showMsg('Message Not be empty.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <ToolBar
          toolBarTitle={
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {Util.isValidData(avatar) ? (
                <Image
                  source={{
                    uri: URL_IMAGE_MY_PROFILE + avatar,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40 / 2,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
              ) : (
                <TextAvatar
                  backgroundColor={randomColors}
                  textColor={'#fff'}
                  size={40}
                  style={{marginRight: 10}}
                  type={'circle'}>
                  {firstName}
                </TextAvatar>
              )}
              <View>
                <Text style={styles.firstName}>
                  {firstName} {lastName}
                </Text>
                {/* <Text style={styles.lastName}>{designation} </Text> */}
              </View>
            </View>
          }
          showBackIcon={true}
          headerColor={Colors.chatBackground}
          navigation={navigation}
          onHomeIconClick={() => {
            navigation.goBack(null);
          }}
        />

        <View
          style={{
            backgroundColor: AppColors.settingbgColor,
            height: '85%',
            paddingBottom: keyboardShown == true ? 50 : 20,
          }}>
          <FlatList
            data={messagesHistory}
            // style={{flex:1}}
            inverted={-1}
            renderItem={({item, index}) => {
              // console.log(item);
              var date = '';
              if (item?.date == moment().format('YYYY-MM-DD')) {
                date = 'Today';
              } else if (
                moment(item?.date).format('YYYY-MM-DD') >=
                moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD')
              ) {
                date = moment(item?.date).format('dddd');
              } else {
                date = moment(item?.date).format('DD-MM-YYYY');
              }
              return (
                <View
                  style={{
                    marginBottom: 80,
                    marginVertical: 25,
                  }}>
                  <Text
                    style={{
                      color: Colors.iconColor,
                      backgroundColor: Colors.messageBackground,
                      alignSelf: 'center',
                      textAlign: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      fontSize: 12,
                      borderRadius: 5,
                      alignItems: 'center',
                      ...AppStyle.TextStyle.subTitle,
                    }}>
                    {date.toUpperCase()}
                  </Text>

                  {item?.mesgData?.length != 0 && (
                    <FlatList
                      data={item?.mesgData}
                      // style={{flex:1}}
                      inverted={-1}
                      keyExtractor={item => item?.id}
                      renderItem={({item, index}) => {
                        updateMessage(item);
                        // console.log(item.read_on);
                        return (
                          <View
                            style={{
                              position: 'relative',
                              flex: 1,
                            }}>
                            {loginId == item?.sent_by ? (
                              <View style={styles.userTwo}>
                                <Text style={styles.messageSend}>
                                  {item?.message}
                                </Text>
                                <View
                                  style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    right: 8,
                                  }}>
                                  {item.read_on === null ? (
                                    <MaterialCommunityIcons
                                      name="check"
                                      size={14}
                                      color={Colors.iconColor}
                                    />
                                  ) : (
                                    <MaterialCommunityIcons
                                      name="check-all"
                                      size={14}
                                    />
                                  )}
                                </View>
                                <Text style={styles.timeDate}>
                                  {moment(item?.sent_on).format('hh:mm a')}
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.userOne}>
                                <Text
                                  style={{
                                    // fontWeight: 'bold',
                                    color: '#CC4124',
                                    ...AppStyle.TextStyle.title,
                                    fontSize: 14,
                                  }}>
                                  {route.params?.firstName}
                                </Text>
                                <Text style={styles.message}>
                                  {item?.message}
                                </Text>
                                <Text style={styles.userOneDate}>
                                  {moment(item?.sent_on).format('hh:mm a')}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      }}
                    />
                  )}
                </View>
              );
            }}
            // keyExtractor={item => item?.id}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          {fileSendModal && (
            <View
              style={{
                backgroundColor: Colors.white,
                zIndex: 99,
                marginRight: 30,
                borderRadius: 4,
                marginLeft: 30,
                flexDirection: 'row',
                padding: 10,
                elevation: 5,
                alignItems: 'center',
              }}>
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
                        onImageSelectionResponse(response);
                      },
                    )
                  }>
                  <MaterialIcon2
                    name="camera"
                    size={20}
                    color={Colors.iconColor}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.iconColor,
                      ...AppStyle.TextStyle.secondaryFont,
                    }}>
                    Camera
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', marginLeft: 14}}>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() =>
                    ImagePicker.launchImageLibrary(options, response => {
                      onImageSelectionResponse(response);
                    })
                  }>
                  <MaterialIcon
                    name="photo"
                    size={20}
                    color={Colors.iconColor}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.iconColor,
                      ...AppStyle.TextStyle.secondaryFont,
                    }}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', marginLeft: 14}}>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => onSelectFile()}>
                  <MaterialCommunityIcons
                    name="headphones"
                    size={20}
                    color={Colors.iconColor}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.iconColor,
                      ...AppStyle.TextStyle.secondaryFont,
                    }}>
                    Audio
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{alignItems: 'center', marginLeft: 14}}>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => onSelectFile()}>
                  <MaterialIcon3
                    name="document-outline"
                    size={20}
                    color={Colors.iconColor}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.iconColor,
                      ...AppStyle.TextStyle.secondaryFont,
                    }}>
                    Document
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 45 / 2,
                height: 45,
                width: 45,
                backgroundColor: AppColors.calendarPrimary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => selectImage()}>
              <MaterialCommunityIcons
                name="plus"
                size={26}
                color={Colors.white}
              />
            </TouchableOpacity>
            <View style={styles.inputOuter}>
              <TextInput
                outlineColor={AppColors.white}
                activeOutlineColor={AppColors.white}
                style={styles.inputStyle}
                // placeholderTextColor={AppColors.accentBorder}
                placeholder="Type a message..."
                mode="outlined"
                inputMode="text"
                onChangeText={txt => setSendTextMessage(txt)}
                value={sendTextMessage}
                // theme={{roundness: 10}}
                multiline={true}
                numberOfLines={2}
              />
              <TouchableOpacity
                style={styles.sendMessageBtn}
                onPress={() => sendMessages()}>
                <View style={{position: 'absolute', top: 15, left: 10}}>
                  <MaterialIcon2
                    size={23}
                    name="send"
                    color={AppColors.sendButtonColor}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firstName: {
    color: AppColors.titleBlackColor,
    fontSize: 18,
    width: '100%',
    ...AppStyle.TextStyle.titleLarge,
  },
  lastName: {
    color: AppColors.titleBlackColor,
    fontSize: 11,
    ...AppStyle.TextStyle.subTitle,
  },
  chatArea: {
    backgroundColor: AppColors.white,
    height: '80%',
    paddingVertical: 10,
    marginVertical: 20,
    marginTop: 40,
    // paddingBottom:keyboardShown==true?40:20,
    // position: 'relative',
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
    backgroundColor: AppColors.white,
  },

  message: {
    fontSize: 14,
    ...AppStyle.TextStyle.title,
    backgroundColor: Colors.white,
    color: AppColors.black,
  },
  timeDate: {
    fontSize: 10,
    position: 'relative',
    top: 5,
    left: -18,
    textAlign: 'right',
    ...AppStyle.TextStyle.title,
  },
  userOneDate: {
    fontSize: 10,
    position: 'relative',
    top: 5,
    right: 0,
    textAlign: 'right',
    ...AppStyle.TextStyle.title,
  },
  userOne: {
    marginBottom: 15,
    borderRadius: 8,
    marginRight: 50,
    alignSelf: 'flex-start',
    marginLeft: 10,
    minWidth: '25%',
    maxWidth: '65%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  userTwo: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.messageBackground,
    marginRight: 10,
    minWidth: '25%',
    maxWidth: '65%',
    marginLeft: 'auto',
    marginTop: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  messageSend: {
    // backgroundColor: AppColors.mainColor,

    fontSize: 14,
    color: AppColors.black,
    ...AppStyle.TextStyle.title,
  },
  userSend: {
    borderRadius: 10,
    textAlign: 'center',
    color: AppColors.white,
    paddingVertical: 5,
    marginTop: 5,
    justifyContent: 'flex-end',
    ...AppStyle.TextStyle.secondaryFont,
  },

  messageInputBox: {
    borderWidth: 0.5,
    borderColor: AppColors.darkFadeText,
    marginHorizontal: 10,
    borderRadius: 6,
    position: 'relative',
    paddingHorizontal: 14,
    marginVertical: 5,
    backgroundColor: AppColors.white,
    width: '80%',
  },
  sendMessageBtn: {
    position: 'absolute',
    right: 5,
    // backgroundColor: AppColors.mainColor,
    borderRadius: 100,
    padding: 3,
    width: 45,
    height: 45,
    ...AppStyle.TextStyle.secondaryFont,
  },
  inputOuter: {
    backgroundColor: AppColors.white,
    fontSize: 16,
    ...AppStyle.TextStyle.title,
    overflow: 'hidden',
    position: 'relative',
    width: '85%',
    height: 56,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  inputStyle: {
    marginBottom: 10,
    backgroundColor: AppColors.white,
    fontSize: 16,
    ...AppStyle.TextStyle.title,
    overflow: 'hidden',
    position: 'relative',
    width: '80%',
  },
});
