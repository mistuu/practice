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
  FlatList,
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
import BASE_URL from '../../common/Config';

export default class TagActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      temp: [],
      searchTxt: '',
      searchList:null,
    };
  }
  componentDidMount() {
    console.log(this.props.route.params?.temp + '=====' + 'undefined');
    if (this.props.route.params?.temp != undefined) {
      this.setState({temp: this.props.route.params?.temp});
    }
    this.getData();
  }

  getData = async () => {
    try {
      ApiCalling.apiCallBodyDataGet('stage/list').then(res => {
        console.log(res.data);
        this.setState({data: res.data});
      });
    } catch (error) {}
  };
  AddItem = (type, name, id) => {
    this.state.temp?.push({
      type: type == 1 ? 'stage' : type == 2 ? 'Grades' : 'Students',
      name: name,
      id: id,
    });
    this.setState({
      name: name,
      id: id,
    });
    if (type == 1 || type == 2) {
      let data = this.state.data;
      data = data.filter(x =>
        type == 1
          ? x.id !== id
          : type == 2 && x.Grades.filter(g => g.id !== id),
      );
      this.setState({data: data});
      console.log(this.state.data);
    }
  };
  removeItem = item => {
    let temp = this.state.temp;
    temp = temp.filter(x => x.id !== item);
    this.setState({temp: temp});
  };
  onChangeText = txt => {
    try {
      this.setState({searchTxt: txt});
      if (this.state.searchTxt.trim().length != 0) {
        ApiCalling.apiCallBodyDataGet('student/list/' + txt).then(res => {
          this.setState({searchList: res.data});
          console.log(res.data);
        });
      }
    } catch (error) {}
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <ToolBar
          toolBarTitle={'Tag Students'}
          showSubTitle={false}
          showBackIcon={true}
          navigation={this.props.navigation}
          onHomeIconClick={() => {
            this.props.navigation.replace('ActivityDetails', {
              key: this.state.temp,
              des: this.props.route.params?.des,
              allFiles: this.props.route.params?.allFiles,
              update:this.props.route.params?.update
            });
          }}
        />
        <View style={{flex: 1}}>
          <View style={{margin: 10}}>
            <Text>Tagged</Text>
            {this.state.temp?.length != 0 && (
              <FlatList
                data={this.state.temp}
                numColumns={2}
                style={{zIndex: 99}}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        marginLeft: 5,
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
          <View style={{marginHorizontal: 10}}>
            <TextInput
              placeholder="Search Student"
              mode="outlined"
              placeholderTextColor={AppColors.searchIconColor}
              value={this.state.searchTxt}
              style={styles.searchBox}
              onChangeText={text => this.onChangeText(text)}
            />
            <View style={{position: 'absolute', right: 20, top: 12}}>
              {this.state.searchTxt.trim().length != 0 ? (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({searchTxt: '', searchList: []})
                  }>
                  <MaterialCommunityIconss size={25} name="close" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <MaterialCommunityIconss size={25} name="magnify" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              // position: 'absolute',
              // top: 120,
              width: '100%',
              alignItems: 'center',
              alignSelf: 'center',
              zIndex: 2,
              backgroundColor: AppColors.white,
            }}>
            <FlatList
              data={this.state.searchList}
              style={{}}
              renderItem={({item, index}) => (
               
                  <TouchableOpacity
                    onPress={() => {
                      this.AddItem(3, item?.first_name, item?.id),
                        this.setState({searchTxt: '', searchList: []});
                    }}
                    style={{
                      backgroundColor: AppColors.white,
                      alignItems: 'center',
                      padding: 5,
                      zIndex: 100,
                      width: '100%',
                    }}>
                    <Text>
                      {item?.first_name} {item?.last_name}
                    </Text>
                  </TouchableOpacity>
               
              )}
              keyExtractor={item => item.id}
            />
          </View>
          <ScrollView
            contentContainerStyle={{alignItems: 'flex-start', zIndex: 1}}>
            {this.state.data?.map(d => {
              return (
                <View style={{margin: 10}}>
                  <TouchableOpacity
                    onPress={() => this.AddItem(1, d.stage, d.id)}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIconss
                        name={'account-group'}
                        size={24}
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        {d.stage}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {d.Grades.length != 0 &&
                    d.Grades?.map(g => {
                      return (
                        <View style={{marginLeft: 10}}>
                          <TouchableOpacity
                            onPress={() => this.AddItem(2, g.title, g.id)}>
                            <View style={{flexDirection: 'row'}}>
                              <MaterialCommunityIconss
                                name={'account-group'}
                                size={24}
                              />
                              <Text style={{marginLeft: 5}}>{g.title}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
              );
            })}
          </ScrollView>
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
  searchBox: {
    borderWidth: 0.5,
    borderColor: AppColors.searchIconColor,
    marginHorizontal: 10,
    borderRadius: 5,
    color: AppColors.black,
    position: 'relative',
    paddingHorizontal: 14,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    // marginHorizontal:10,
    marginVertical: 5,
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
