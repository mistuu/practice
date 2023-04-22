import React from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import AppColors from './common/AppColor';
import AppStyle from './common/AppStyle';
import {ScrollView} from 'react-native-gesture-handler';
import ApiCalling from './network/ApiCalling';
import Util from './utils/Util';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AccordionList} from 'react-native-accordion-list-view';

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    this.getNotification();
  }
  getNotification = async () => {
    try {
      Util.getSelectedChild().then(data => {
        console.log(data.id);
        ApiCalling.apiCallParamsGet('parent/' + data.id).then(res => {
          console.log('contacts== list=', res.data);
          this.setState({data: res.data});
        });
      });
    } catch (error) {}
  };
  render() {
    return (
      <View style={styles.container}>
        <AccordionList
          data={this.state?.data}
          customTitle={item => (
            <View
              style={{
                backgroundColor: AppColors.todayColor,
                elevation: 5,
                margin: 10,
                flex: 1,
                flexDirection:'row',
                padding: 7,
                borderRadius: 5,
              }}>
                 <MaterialIcons
                        name="person"
                        size={20}
                        color={AppColors.white}
                      />
              <Text style={{color: AppColors.white,marginLeft:5, fontWeight: 'bold'}}>
                {item.User.firstName} {item.User.lastName}
              </Text>
              <Text style={{marginLeft:'auto',color: AppColors.white,fontWeight: 'bold',marginRight:50}}>{item.StudentParentRelationType.type}</Text>
            </View>
          )}
          customBody={item => (
            <View style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: AppColors.white,
                  elevation: 5,
                  margin: 10,
                  padding: 7,
                  borderRadius: 5,
                }}>
                <Text style={{fontSize: 20, textAlign: 'center'}}>Details</Text>
                <View
                  style={{
                    borderWidth: 0.3,
                    borderStyle: 'solid',
                    borderColor: AppColors.lightDivider,
                    marginTop: 4,
                  }}
                />
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <Text style={{fontWeight: 'bold'}}>Name</Text>
                    <Text>
                      {item.User.firstName} {item.User.lastName}
                    </Text>
                    <Text style={{fontWeight: 'bold', marginTop: 5}}>
                      Phone
                    </Text>
                    <Text>{item.User.mobile}</Text>
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={{fontWeight: 'bold'}}>Relation</Text>
                    <Text>{item.StudentParentRelationType.type}</Text>
                    <Text style={{fontWeight: 'bold', marginTop: 5}}>
                      Email
                    </Text>

                    <Text>{item.User.email}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          animationDuration={400}
          expandMultiple={true}
        />
        {/* <FlatList
          data={this.state?.data}
          // style={{flex: 1}}
          renderItem={({item}) => {
            console.log(item);

            return (
              <View style={{flex: 1}}>
                <View
                  style={{
                    backgroundColor: AppColors.white,
                    elevation: 5,
                    margin: 10,
                    padding: 7,
                    borderRadius: 5,
                  }}>
                  <Text style={{fontSize: 20, textAlign: 'center'}}>
                    Details
                  </Text>
                  <View
                    style={{
                      borderWidth: 0.3,
                      borderStyle: 'solid',
                      borderColor: AppColors.lightDivider,
                      marginTop: 4,
                    }}
                  />
                  <View style={{}}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="id-card"
                        size={20}
                        color={AppColors.black}
                      />
                      <Text style={{marginLeft:5,fontSize:15,color:AppColors.black, fontWeight: 'bold'}}>Name:-</Text>
                      <Text style={{marginLeft:5,fontSize:15}}>
                        {item.User.firstName} {item.User.lastName}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialIcons
                        name="call"
                        size={20}
                        color={AppColors.black}
                      />
                      
                      <Text style={{marginLeft:5,fontSize:15,color:AppColors.black, fontWeight: 'bold'}}>
                      Phone:-
                    </Text>
                    <Text style={{marginLeft:5,fontSize:15}}>
                        {item.User.mobile}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                    <MaterialIcons
                        name="person"
                        size={20}
                        color={AppColors.black}
                      />
                       
                      <Text style={{marginLeft:5,fontSize:15,color:AppColors.black, fontWeight: 'bold'}}>
                      Relation:-
                    </Text>
                    <Text style={{marginLeft:5,fontSize:15}}>
                        {item.StudentParentRelationType.type}</Text>
                
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="email"
                        size={20}
                        color={AppColors.black}
                      />
                      <Text style={{marginLeft:5,fontSize:15,color:AppColors.black, fontWeight: 'bold'}}>Email:-</Text>
                      <Text style={{marginLeft:5,fontSize:15}}>
                        {item.User.email}
                      </Text>
                    </View>
                    
                  </View>
                </View>
              </View>
            );
          }}
        /> */}
      </View>
    );
  }
}

export default Contacts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.settingbgColor,
  },
  detialstxt: {},
  titleTxt: {},
  dataText: {},
});
