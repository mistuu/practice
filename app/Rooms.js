import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import AppColors from './common/AppColor';
import ToolBar from './components/ToolBar';
import {FAB} from 'react-native-paper';
import CloseButton from './CloseButton';
import {TextInput, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {dummyData} from './common/Config';

export const AddStage = ({show}) => {
  return (
    <>
      <FAB
        color={AppColors.white}
        icon={'plus'}
        label="Add Stage"
        style={styles.fab}
        onPress={show}
      />
    </>
  );
};

const Rooms = ({navigation}) => {
  const [addStages, setAddStages] = useState('');
  const [addSort, setAddSort] = useState('');
  const [addStageModal, setStageShowModal] = useState(false);
  const [dataList, setDataList] = useState(dummyData);
  const [addGrade, setAddGrade] = useState('');
  const [gradeShow, setGradeShow] = useState(false);
  const {gradeList, setGradeList} = useState([]);
  const [selectedStagePos, setSelectedStagePos] = useState(-1);
  const [collapse, setCollapse] = useState(false);

  return (
    <View style={styles.container}>
      <ToolBar
        toolBarTitle={'Rooms'}
        showSubTitle={false}
        showBackIcon={true}
        navigation={navigation}
        onHomeIconClick={() => {
          navigation.goBack(null);
        }}
      />

      <View style={styles.stageCard}>
        <View>
          <FlatList
            data={dataList}
            value={selectedStagePos}
            renderItem={({item, index}) => (
              <>
                <View
                  style={{
                    backgroundColor: AppColors.ghostWhite,
                    marginBottom: 10,
                    borderRadius: 4,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    padding: 2,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.bold}>{item.stage}</Text>
                  {/* <Text>{item.sort}</Text> */}

                  <TouchableOpacity
                    onPress={() => {
                      // setCollapse((collapse) => (collapse == index ? null : index));
                      setCollapse(!collapse);
                      setSelectedStagePos(index);
                    }}>
                    {collapse ? (
                      <MaterialCommunityIcons
                        name="chevron-up"
                        size={25}
                        color={AppColors.accent}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={25}
                        color={AppColors.accent}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {collapse && (
                  <View
                    style={{
                      backgroundColor: '#ccc',
                      borderRadius: 4,
                      padding: 5,
                      marginBottom: 10,
                      paddingHorizontal: 10,
                    }}>
                    <Text>Grade</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setGradeShow(true);
                        setSelectedStagePos(index);
                        setCollapse(true);
                      }}>
                      <MaterialCommunityIcons
                        name="account-edit-outline"
                        size={20}
                        color={AppColors.accent}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: AppColors.ghostWhite,
          marginBottom: 10,
          borderRadius: 4,
          paddingVertical: 10,
          paddingHorizontal: 10,
          padding: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}></View>
      <Modal visible={gradeShow}>
        <View style={styles.stageCard}>
          <View style={styles.close}>
            <CloseButton
              color={AppColors.black}
              hide={() => setGradeShow(false)}
            />
          </View>
          <Text style={styles.bold}>Register New Grade</Text>
          <TextInput
            activeOutlineColor={AppColors.colorPrimary}
            style={styles.input}
            label="Grade Title"
            mode="outlined"
            value={addGrade}
            onChangeText={text => setAddGrade(text)}
          />

          <Button
            raised
            mode="contained"
            theme={{roundness: 5}}
            labelStyle={{
              color: AppColors.white,
            }}
            onPress={() => {
              const temp = [...dataList];
              const gradeTemp = [...temp[selectedStagePos].gradeList];
              gradeTemp.push({grade: addGrade});
              temp[selectedStagePos].gradeList = gradeTemp;
              setDataList(temp);
              console.log(temp);
              setGradeShow(false);
              console.log(gradeTemp);
            }}
            style={{
              marginTop: 20,
              marginBottom: 5,
              backgroundColor: AppColors.colorCyan,
              paddingHorizontal: 15,
            }}>
            {/* {heading == 0 ? 'Save' : 'Update'} */}
            Save
          </Button>
        </View>
      </Modal>

      <Modal visible={addStageModal}>
        <View style={styles.stageCard}>
          <View style={styles.close}>
            <CloseButton
              color={AppColors.black}
              hide={() => setStageShowModal(false)}
            />
          </View>
          <Text style={styles.bold}>Register New Stage</Text>
          <TextInput
            activeOutlineColor={AppColors.colorPrimary}
            placeholder="Stage"
            style={styles.input}
            label="Stage"
            mode="outlined"
            value={addStages}
            onChangeText={text => setAddStages(text)}
          />
          <TextInput
            activeOutlineColor={AppColors.colorPrimary}
            placeholder="Stage"
            style={styles.input}
            label="Sort"
            mode="outlined"
            value={addSort}
            onChangeText={text => setAddSort(text)}
          />
          <Button
            raised
            mode="contained"
            theme={{roundness: 5}}
            labelStyle={{
              color: AppColors.white,
            }}
            onPress={() => {
              const temp = [...dataList];
              temp.push({stage: addStages, sort: addSort});
              setDataList(temp);
              setStageShowModal(false);
              console.log(temp);
            }}
            style={{
              marginTop: 20,
              marginBottom: 5,
              backgroundColor: AppColors.colorCyan,
              paddingHorizontal: 15,
            }}>
            {/* {heading == 0 ? 'Save' : 'Update'} */}
            Save
          </Button>
        </View>
      </Modal>
      <AddStage show={() => setStageShowModal(true)} />
    </View>
  );
};

export default Rooms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stageCard: {
    margin: 10,
    elevation: 4,
    padding: 20,
    backgroundColor: AppColors.white,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.colorPrimary,
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
  },
  bold: {
    fontWeight: '500',
    color: AppColors.accent,
    paddingHorizontal: 10,
  },
  input: {
    marginTop: 5,
    justifyContent: 'center',
    fontSize: 15,
    borderRadius: 6,
    borderColor: AppColors.accent,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
});
