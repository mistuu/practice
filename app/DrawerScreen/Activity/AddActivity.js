import React, {Component} from 'react';
import {
  View,
  BackHandler,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import Colors from '../../common/Colors';
import ApiCalling from '../../network/ApiCalling';
import CheckBox from '@react-native-community/checkbox';
import ToolBar from '../../components/ToolBar';
import Util from '../../utils/Util';
import AppColors from '../../common/AppColor';
import { Button } from 'react-native-paper';
import ProgressDialog from '../../components/ProgressDialog';

export default class AddActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      delchecked: false,
      selectAll: false,
      isLoading: false

      // checked: [],
      // student_id: [],
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    this.setState({isLoading:true})
    try {
      ApiCalling.apiCallBodyDataGet('student/list').then(async res => {
    this.setState({isLoading:false})
        await res.data.filter(d => {
          {
            d.checked = false;
          }
        });
        // console.log(res.data);

        this.setState({data: res.data});
      });
    } catch (error) {}
  };
  checkBox(index) {
    var checkedCopy = this.state.data;
    checkedCopy[index].checked = !checkedCopy[index].checked;

    this.setState({
      data: checkedCopy,
    });
  }
  goToDetails = async () => {
    let ch = [];
    await this.state.data.filter(d => {
      if (d.checked == true) {
        ch.push(d.id);
      }
    });
    console.log(ch);
    if (ch.length != 0) {
      this.props.navigation.navigate('ActivityDetails', {studId: ch});
    } else {
      Util.showMsg('Student must be Selected');
    }
  };
  checkAll = async val => {
    console.log(val);
    let data = await this.state.data.filter(d => (d.checked = val));
    console.log(data);

    this.setState({data: data});
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ToolBar
          toolBarTitle={'Select Student(s)'}
          showSubTitle={false}
          showBackIcon={true}
          showAll={true}
          showAllIcon={val => this.checkAll(val)}
          navigation={this.props.navigation}
          onHomeIconClick={() => {
            this.props.navigation.goBack(null);
          }}
        />
      {ProgressDialog.CustomProgressBar(this.state.isLoading)}

        <View style={{flex: 1}}>
          <FlatList
            data={this.state.data}
            // style={{margin: 5}}
            // numColumns={2}
            renderItem={({item, index}) => {
              return (
                <View style={{marginVertical: 5, marginHorizontal: 7}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 5,
                      backgroundColor: AppColors.white,
                      paddingVertical: 10,
                      elevation: 1,
                    }}>
                    <CheckBox
                      value={this.state.data[index].checked}
                      boxType={'circle'}
                      onValueChange={val => this.checkBox(index)}
                      style={{
                        borderColor: AppColors.textSecondary,
                        marginHorizontal: 7
                      }}
                    />
                    <Text style={{color: AppColors.textPrimary}}>
                      {item.first_name + ' ' + item.last_name}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.id}
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: '0%',
              alignSelf: 'center',
              backgroundColor: AppColors.white,
            }}>
              <Button
                  raised
                  mode="contained"
                  theme={{roundness: 5}}
                  labelStyle={{
                    color: AppColors.white,
                  }}
                  onPress={() => this.goToDetails()}
                  style={{
                    marginTop: 10,
                    marginBottom: 15,
                    marginHorizontal: 7,
                    backgroundColor: AppColors.colorCyan,
                  }}>
                  Next
                </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
