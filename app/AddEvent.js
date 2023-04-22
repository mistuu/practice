import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import AppColors from './common/AppColor';
import CloseButton from './CloseButton';
import {TextInput} from 'react-native-paper';
import {Switch, Button} from 'react-native-paper';
import AppStyle from './common/AppStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Close} from '@material-ui/icons';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native';

const data = [
  {id: 1, name: 'Reminder'},
  {id: 2, name: 'derc ss'},
  {id: 3, name: 'fraf'},
];
console.log(data);
const AddEvent = ({navigation}) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [isShowAddPeople, setIsShowAddPeople] = useState(false);
  const [people, setPeople] = useState('');
  const [selectOption, setSelectOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reminder, setReminder] = useState('Remidner');

  const onOptionClick = value => () => {
    setSelectOption(value);
    console.log(selectOption);
  };
  return (
    <SafeAreaView>
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
          <View style={styles.container}>
            <View
              style={{
                backgroundColor: AppColors.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 5,
              }}>
              <View
                style={{
                  width: 100,
                  height: 5,
                  backgroundColor: AppColors.indicator,
                  borderRadius: 50,
                  marginVertical: 5,
                  alignSelf: 'center',
                }}></View>

              <View style={{padding: 5}}>
                <CloseButton
                  hide={() => navigation.goBack('CalendarEvent')}
                  color={AppColors.closeButton}
                />
              </View>

              <View style={styles.inputArea}>
                <TextInput
                  outlineColor={AppColors.inputColor}
                  activeOutlineColor={AppColors.indicator}
                  style={styles.inputStyle}
                  placeholderTextColor={AppColors.accentBorder}
                  placeholder="Event name*"
                  mode="outlined"
                  inputMode="text"
                  theme={{roundness: 8}}
                />

                <TextInput
                  outlineColor={AppColors.inputColor}
                  activeOutlineColor={AppColors.indicator}
                  style={styles.inputStyle}
                  placeholderTextColor={AppColors.accentBorder}
                  placeholder="Add description"
                  mode="outlined"
                  inputMode="text"
                  multiline={true}
                  numberOfLines={3}
                  theme={{roundness: 8}}
                />
                <View
                  style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      ...AppStyle.TextStyle.inputTextFont,
                      color: AppColors.closeButton,
                    }}>
                    All-day
                  </Text>

                  <Switch
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    theme={AppColors.SmallTextColor}
                    color={AppColors.searchIconColor}
                    size={30}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: AppColors.inputColor,
                      borderRadius: 8,
                      flexGrow: 1,
                      marginRight: 4,
                      height: 50,
                      alignContent: 'center',
                      paddingHorizontal: 5,
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          ...AppStyle.TextStyle.inputTextFont,
                          color: AppColors.accentBorder,
                        }}>
                        Start Date
                      </Text>
                      <MaterialCommunityIcons
                        name="calendar-blank-outline"
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: AppColors.inputColor,
                      borderRadius: 8,
                      flexGrow: 1,
                      marginLeft: 4,
                      height: 50,
                      alignContent: 'center',
                      paddingHorizontal: 5,
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          ...AppStyle.TextStyle.inputTextFont,
                          color: AppColors.accentBorder,
                        }}>
                        Start time
                      </Text>
                      <MaterialCommunityIcons name="clock-outline" size={20} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: AppColors.inputColor,
                      borderRadius: 8,
                      flexGrow: 1,
                      marginRight: 4,
                      height: 50,
                      alignContent: 'center',
                      paddingHorizontal: 5,
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          ...AppStyle.TextStyle.inputTextFont,
                          color: AppColors.accentBorder,
                        }}>
                        End Date
                      </Text>
                      <MaterialCommunityIcons
                        name="calendar-blank-outline"
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: AppColors.inputColor,
                      borderRadius: 8,
                      flexGrow: 1,
                      marginLeft: 4,
                      height: 50,
                      alignContent: 'center',
                      paddingHorizontal: 5,
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          ...AppStyle.TextStyle.inputTextFont,
                          color: AppColors.accentBorder,
                        }}>
                        End time
                      </Text>
                      <MaterialCommunityIcons name="clock-outline" size={20} />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    ...AppStyle.TextStyle.titleLarge,
                    color: AppColors.accentBorder,
                    marginVertical: 10,
                  }}>
                  Add People
                </Text>

                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: AppColors.inputColor,
                    borderRadius: 8,
                    marginRight: 4,
                    height: 50,
                    alignContent: 'center',
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                  }}
                  onPress={() => setIsModalOpen(true)}>
                  <Text
                    style={{
                      ...AppStyle.TextStyle.titleNormal,
                      color: AppColors.accentBorder,
                      paddingHorizontal: 10,
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>

                <Modal visible={isModalOpen} animationType="fade">
                  <View style={styles.modelContainer}>
                    <View
                      style={{
                        width: 100,
                        height: 5,
                        backgroundColor: AppColors.indicator,
                        borderRadius: 50,
                        marginVertical: 5,
                        alignSelf: 'center',
                        marginTop: 15,
                      }}></View>

                    <View style={styles.inputArea}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          position: 'relative',
                        }}>
                        <TextInput
                          outlineColor={AppColors.inputColor}
                          activeOutlineColor={AppColors.indicator}
                          style={{
                            ...AppStyle.TextStyle.titleLarge,
                            marginBottom: 10,
                            backgroundColor: AppColors.white,
                            // fontSize: 16,
                            overflow: 'hidden',
                            position: 'relative',
                            width: '100%',
                          }}
                          placeholderTextColor={AppColors.accentBorder}
                          placeholder="Add People"
                          mode="outlined"
                          inputMode="text"
                          theme={{roundness: 8}}
                        />

                        <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                          <Text
                            style={{
                              ...AppStyle.TextStyle.descNormal,
                              position: 'absolute',
                              right: 10,
                              top: 22,
                            }}>
                            Done
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
                <Text
                  style={{
                    ...AppStyle.TextStyle.titleLarge,
                    color: AppColors.accentBorder,
                    marginVertical: 10,
                  }}>
                  Reminder
                </Text>

                <View
                  style={{
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: AppColors.inputColor,
                    height: 50,
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => setIsShowAddPeople(!isShowAddPeople)}>
                    <Text
                      style={{
                        ...AppStyle.TextStyle.inputTextFont,
                        color: AppColors.accentBorder,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {reminder}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsShowAddPeople(!isShowAddPeople)}>
                    {isShowAddPeople ? (
                      <MaterialIcons
                        name="keyboard-arrow-up"
                        size={25}
                        color={AppColors.closeButton}
                      />
                    ) : (
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        size={25}
                        color={AppColors.closeButton}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {isShowAddPeople && (
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: AppColors.ghostWhite,
                      borderRadius: 8,
                      padding: 8,
                    }}>
                    <FlatList
                      data={data}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{paddingHorizontal: 4, paddingVertical: 5}}>
                          <Text style={{height: 20}}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}

                <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => {
                    loginHandler();
                  }}
                  style={{
                    marginTop: 20,
                    marginBottom: 5,
                    fontFamily: 'Poppin-Medium',
                    ...AppStyle.TextStyle.titleLarge,
                    backgroundColor: AppColors.calendarPrimary,
                  }}>
                  Create Event
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
    elevation: 4,
    borderTopLeftRadius: 25,
    marginTop: 2,
    borderTopRightRadius: 25,
  },
  modelContainer: {
    flex: 1,
    elevation: 2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    margin: 0,
    padding: 0,
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
  inputArea: {
    padding: 10,
  },
});
