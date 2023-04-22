import React, {useState} from 'react';
import {
  Text,
  Button,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AppColors from './common/AppColor';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Label} from '@material-ui/icons';
import CloseButton from './CloseButton';

const Stages = ({label}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <View style={styles.stageWrap}>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text style={styles.boldText}>{label}</Text>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={25}
            color={AppColors.white}
          />
        </TouchableOpacity>

        <Modal animationType="fade" visible={showModal}>
          <View
            style={{
              margin: 10,
              elevation: 3,
              padding: 20,
              paddingVertical: 40,
              backgroundColor: AppColors.white,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Grade</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={25}
                  color={AppColors.black}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.close}>
              <CloseButton
                color={AppColors.black}
                hide={() => setShowModal(false)}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Stages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stageWrap: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: AppColors.white,
    borderRadius: 5,
    backgroundColor: AppColors.accent,
    marginBottom: 5,
  },
  boldText: {
    color: AppColors.white,
    fontWeight: '500',
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
  input: {
    marginTop: 5,
    justifyContent: 'center',
    fontSize: 15,
    borderRadius: 6,
    backgroundColor: AppColors.white,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
});
