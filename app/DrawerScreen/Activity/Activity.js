import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../common/Colors';
import ApiCalling, {axiosGet} from '../../network/ApiCalling';
import {getItem} from '../../utils/AsyncConfig';
import Util from '../../utils/Util';
import moment from 'moment';
import BASE_URL from '../../common/Config';
import ToolBar from '../../components/ToolBar';
import TextAvatar from 'react-native-text-avatar';
import MaterialIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon2 from 'react-native-vector-icons/MaterialIcons';
import AppColors from '../../common/AppColor';
import ProgressDialog from '../../components/ProgressDialog';

export default class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      likeColor: false,
      setRefreshing: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({isLoading: true});
    try {
      ApiCalling.apiCallParamsGet('activity/getActivities').then(async res => {
        console.log(res);
        console.log(res.data);
        this.setState({isLoading: false});
        await res.data.filter(d => {
          {
            d.backColor = this.randomHex();
          }
        });
        console.log(res.data);
        this.setState({data: res.data});
        this.setState({setRefreshing: false});
      });
    } catch (error) {}
  };

  randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  handleRefresh() {
    this.setState({setRefreshing: true});
    this.getData();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {ProgressDialog.CustomProgressBar(this.state.isLoading)}

        <ToolBar
          toolBarTitle={'Activity'}
          showSubTitle={false}
          showBackIcon={true}
          navigation={this.props.navigation}
          onHomeIconClick={() => {
            this.props.navigation.goBack(null);
          }}
        />
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.data}
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingBottom: 50,
              paddingHorizontal: 5,
            }}
            refreshing={this.state.setRefreshing}
            onRefresh={() => this.handleRefresh()}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: 5,
                    alignSelf: 'center',
                    marginHorizontal: 5,
                  }}
                  key={index}>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderRadius: 13,
                      marginTop: 10,
                      backgroundColor: Colors.white,
                      elevation: 0.5,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingBottom: 5,
                        alignItems: 'center',
                      }}>
                      <TextAvatar
                        backgroundColor={item.backColor}
                        textColor={Colors.white}
                        size={50}
                        type={'circle'} // optional
                      >
                        {item.CreatedBy.firstName.toUpperCase() +
                          ' ' +
                          item.CreatedBy.lastName.toUpperCase()}
                      </TextAvatar>
                      <View style={{marginLeft: 7}}>
                        <Text style={{fontWeight: 'bold', color: Colors.black}}>
                          {item.CreatedBy.firstName +
                            ' ' +
                            item.CreatedBy.lastName}
                        </Text>
                        <Text style={{}}>{'feeder'}</Text>
                      </View>
                    </View>
                    {item?.image != '' && item?.image != null && (
                      <Image
                        source={{uri: item?.image}}
                        style={{
                          // marginTop: -4,
                          width: '100%',
                          height: 150,
                          overlayColor: Colors.white,
                          borderRadius: 13,
                          //  width: '100%',
                          backgroundColor: Colors.white,
                          resizeMode: 'contain',
                          alignSelf: 'center',
                        }}
                      />
                    )}

                    <Text style={styles.title}>{item.Category.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.date1}>
                        {item.isduration == true
                          ? item.start_time + '-' + item.end_time
                          : moment(item.created_on).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                    <View
                      style={{
                        marginLeft: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: AppColors.textSecondary,
                          marginRight: 5,
                        }}>
                        tagged:
                      </Text>
                      {item?.Students.map((d, index) => {
                        if (index < 3) {
                          return (
                            <Image
                              source={{uri: BASE_URL + 'photo/' + d.photo}}
                              style={{
                                height: 30,
                                borderRadius: 13,
                                width: 25,
                                marginLeft: 2,
                                resizeMode: 'contain',
                              }}
                            />
                          );
                        }
                      })}
                      {item.Students.length > 3 && (
                        <Text style={{marginLeft: 5, fontSize: 15}}>
                          ...+{item.Students.length - 1} More
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 10,
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        style={{marginRight: 7}}
                        onPress={() =>
                          this.setState({likeColor: !this.state.likeColor})
                        }>
                        {this.state.likeColor ? (
                          <MaterialIcon
                            name="heart"
                            size={20}
                            solid
                            color={AppColors.colorDanger}
                          />
                        ) : (
                          <MaterialIcon
                            name="heart"
                            size={20}
                            color={AppColors.textPrimary}
                          />
                        )}
                      </TouchableOpacity>
                      <MaterialIcon2
                        name="message"
                        size={20}
                        color={AppColors.textPrimary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={item => item.id}
          />
          <View style={{position: 'absolute', bottom: '3%', right: '4%'}}>
            <TouchableOpacity
              style={{
                borderRadius: 55 / 2,
                height: 55,
                width: 55,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.navigate('AddActivity')}>
              <MaterialIcon2 name="add" size={50} color={Colors.white} />
              {/* <Text style={{ alignSelf: 'center', marginBottom: 6, color: COLORS.white, fontSize: (Platform.OS === 'ios') ? 42 : 50, }}>+</Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: AppColors.textPrimary,
    marginLeft: 5,
    fontWeight: '700',
  },
  description: {
    color: AppColors.textPrimary,
    // marginVertical:5,
    marginLeft: 5,
  },
  date: {
    // color: Colors.black,
    margin: 5,
    // marginLeft:'auto',
    marginRight: 10,
    marginTop: 5,
    fontStyle: 'italic',
  },
  date1: {
    color: AppColors.textSecondary,
    margin: 5,
    marginLeft: 'auto',
    marginRight: 10,
    marginTop: 5,
    fontStyle: 'italic',
    fontSize: 12,
  },
});
