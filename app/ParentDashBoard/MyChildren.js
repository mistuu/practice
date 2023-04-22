import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import AppColors from '../common/AppColor';
import TextAvatar from 'react-native-text-avatar';
import ToolBar from '../components/ToolBar';
import {FAB} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput, Button} from 'react-native-paper';
import Util from '../utils/Util';

const data = [
  {
    id: 1,
    firstName: 'Whasib',
    relation: 'Father',
    schoolName: 'MY School 2',
  },
  {
    id: 2,
    firstName: 'Aaswwd',
    relation: 'Mother',
    schoolName: 'MY School',
  },
  {
    id: 3,
    firstName: 'Zolin',
    relation: 'Mother',
    schoolName: 'MY School 1',
  },
  {
    id: 4,
    firstName: 'Last Name',
    relation: 'Father',
    schoolName: 'MY School',
  },
  {
    id: 5,
    firstName: 'anees',
    relation: 'Father',
    schoolName: 'MY School 2',
  },
];

const FabButton = ({setAddChildModal}) => (
  <FAB
    color={AppColors.white}
    icon={'plus'}
    style={styles.fab}
    onPress={() => setAddChildModal(true)}
  />
);

const MyChildren = ({navigation}) => {
  const [addChildModal, setAddChildModal] = useState(false);
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState('');
  const [childList, setChildeList] = useState(null);
  const randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  useEffect(() => {
    getChilderan();
  }, []);
  const getChilderan = async () => {
    Util.getUser().then(async data => {
      console.log(data.Parents), console.log(data.Parents);
      await data.Parents.filter(d => {
        {
          d.backgroundColor = randomHex();
        }
      });
      setChildeList(data.Parents);
    });
  };
  const childAddHandle = () => {
    if (code == '') {
      setCodeErr('Please Enter your code');
    } else if (code.length < 10) {
      setCodeErr('It should be min 10 character code');
      console.log('Invalid code');
      //   isValid = false;
    } else {
      console.log('code valid');
      setCodeErr('');
    }
  };

  return (
    <View style={styles.container}>
      <ToolBar
        toolBarTitle={'My Children'}
        showSubTitle={false}
        showBackIcon={true}
        navigation={navigation}
        onHomeIconClick={() => {
          navigation.goBack(null);
        }}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FlatList
          style={{marginTop: 10}}
          data={childList}
          renderItem={({item}) => (
            console.log('Item==',item),
            
              <View style={styles.flatList}>
                <TextAvatar
                  backgroundColor={item.backgroundColor}
                  textColor={'#fff'}
                  size={40}
                  type={'circle'}>
                  {item.Student.first_name}
                </TextAvatar>

                <TouchableOpacity
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingVertical: 1,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text style={styles.firstName}>
                        {item.Student.first_name}
                      </Text>
                      <Text style={styles.relation}>
                        {item.StudentParentRelationType?.type}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: 'relative',
                        right: 25,
                      }}>
                      <Text style={styles.mySchoolName}>
                        {item.Student.School?.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            
          )}
          keyExtractor={item => item.id}
        />
      </View>
      <FabButton setAddChildModal={setAddChildModal} />

      <View>
        <Modal animationType="fade" visible={addChildModal}>
          <View style={styles.modalCard}>
            <Text style={styles.label}>Add Child</Text>
            <TouchableOpacity
              onPress={() => setAddChildModal(false)}
              style={{position: 'absolute', top: 8, right: 8, padding: 5}}>
              <MaterialCommunityIcons name="close" size={25} />
            </TouchableOpacity>

            <Text style={styles.helperText}>
              Please Enter the 10 characters Code sent by your school
            </Text>

            <TextInput
              outlineColor={AppColors.accent}
              activeOutlineColor={AppColors.colorPrimary}
              label="Enter your code"
              mode="outlined"
              value={code}
              onChangeText={text => {
                setCode(text);
                //   setCodeErr('');
              }}
              style={styles.input}
            />
            <Text style={styles.error}>
              {codeErr !== '' ? <> {codeErr} </> : ''}
            </Text>

            <View
              style={{
                borderBottomWidth: 1,
                marginHorizontal: 10,
                marginTop: 30,
                borderBottomColor: AppColors.divider,
              }}
            />

            <Button
              raised
              mode="contained"
              theme={{roundness: 5}}
              labelStyle={{
                color: AppColors.white,
              }}
              onPress={childAddHandle}
              style={{
                marginTop: 15,
                marginBottom: 5,
                backgroundColor: AppColors.colorPrimary,
                marginRight: 10,
                marginHorizontal: 10,
              }}>
              Done
            </Button>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default MyChildren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  item: {
    padding: 15,
    marginHorizontal: 10,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.colorPrimary,
  },
  flatList: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',

    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 35,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.divider,
  },
  firstName: {
    color: AppColors.black,
    fontSize: 15,
    fontWeight: '500',
  },
  modalCard: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 3,
    marginTop: 100,
  },
  label: {
    fontSize: 18,
    color: AppColors.black,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  helperText: {
    fontSize: 12,
    color: AppColors.colorDanger,
    marginHorizontal: 10,
    fontWeight: '500',
    marginVertical: 10,
  },
  input: {
    marginTop: 5,
    justifyContent: 'center',
    fontSize: 15,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
  relation: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginVertical: 2,
  },
  mySchoolName: {
    fontSize: 13,
    color: AppColors.textSecondary,
    marginVertical: 2,
  },
  error: {
    fontSize: 12,
    color: 'red',
    paddingHorizontal: 10,
    marginVertical: 2,
  },
});
