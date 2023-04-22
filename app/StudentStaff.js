import React, {useState, useEffect} from 'react';

import ApiCalling from './network/ApiCalling';
import Util from './utils/Util';

import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  StatusBar,
  Image,
  TouchableOpacity,
  List,
} from 'react-native';
import AppColors from './common/AppColor';
import App from '../App';


//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );

const StudentStaff = () => {
  const [studentList, setStudentList] = useState([]);

  const getStudentList = async () => {
    ApiCalling.apiCallParamsGet('student/list').then(res => {
      console.log(res);
      console.log(res.data);
      setStudentList(res.data);
    });
  };

  useEffect(() => {
    getStudentList();
    console.log('StudentList');
  }, []);

  return (
    <>
      <></>
      <SafeAreaView style={styles.container}>
        
        <View
          style={{
            borderTopWidth: 0,
            borderBottomWidth: 0,
            flex: 1,
            // marginTop: 60,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 5,
              borderBottomColor: AppColors.borderColor,
              borderBottomWidth: 0.8,
              textAlign: 'center',
            }}></View>

          <FlatList
            data={studentList}
            renderItem={({item}) => (
              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 30,
                    textAlign: 'left',
                    padding: 14,
                    borderBottomColor: AppColors.borderColor,
                    borderBottomWidth: 0.6,
                    color: 'black',
                  }}>
                  <View
                    style={{
                      borderColor: AppColors.accentLight,
                      borderRadius: 100,
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                      }}
                      source={{
                        uri: 'http://192.168.1.142:8003/photo/' + item.photo,
                      }}></Image>
                  </View>
                  <View
                    style={{
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{padding: 5, color: 'black', fontWeight: 'bold'}}>
                      {item.first_name}
                    </Text>
                    <View
                      style={{
                        borderRadius: 5,
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <Text style={{padding: 5, color: 'black', fontSize: 12}}>
                        {item.classroom.name}
                      </Text>
                      <Text style={{padding: 5, color: 'black', fontSize: 12}}>
                        {item.grade.title}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // alignSelf: 'stretch',
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    color: 'black',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  flatList: {
    backgroundColor: '#f4f7f6',
    padding: 5,
  },
  table: {
    backgroundColor: 'creem',
    flexDirection: 'row',
  },
  data: {
    color: 'black',
    padding: 10,
    backgroundColor: '#f4f7f6',
  },
});

export default StudentStaff;
