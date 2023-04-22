import Snackbar from 'react-native-snackbar';
import AppColors from '../common/AppColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, PermissionsAndroid} from 'react-native';

function showMsg(message) {
  setTimeout(() => {
    Snackbar.show({
      text: message,
      textColor: AppColors.white,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: AppColors.accentDarker,
    });
  }, 400);
}

function isValidData(data) {
  if (data === undefined) {
    return false;
  } else if (data === null) {
    return false;
  } else if (data === '') {
    return false;
  } else {
    return true;
  }
}

function isValidArray(array) {
  if (array === undefined) {
    return false;
  } else if (array === null) {
    return false;
  } else if (array === '') {
    return false;
  } else if (array === []) {
    return false;
  } else if (array.length === 0) {
    return false;
  } else {
    return true;
  }
}

const saveUser = async newData => {
  // localStorage.setItem(Const.KEY_USER, JSON.stringify(data));
  // AsyncStorage.removeItem('KEY_USER');
  AsyncStorage.setItem('KEY_USER', JSON.stringify(newData));
};

const getUser = async data => {
  const value = await AsyncStorage.getItem('KEY_USER');
  return JSON.parse(value);
  // return {id: 3}
};

const removeUser = async () => {
  AsyncStorage.removeItem('KEY_USER');
  removeSelectedChild();
};

const saveSelectedSchool = async data => {
  AsyncStorage.setItem('KEY_SELECTED_SCHOOL', JSON.stringify(data));
};

const getSelectedSchool = async () => {
  if (AsyncStorage.getItem('KEY_SELECTED_SCHOOL') != 'undefined') {
    const value = await AsyncStorage.getItem('KEY_SELECTED_SCHOOL');
    return JSON.parse(value);
  } else return {id: 0};
};

const saveListChilde = async newData => {
  AsyncStorage.setItem('KEY_LIST_CHILD', JSON.stringify(newData));
};

const getListChilde = async data => {
  const value = await AsyncStorage.getItem('KEY_LIST_CHILD');
  return JSON.parse(value);
};
const saveSelectedChild = async newData => {
  AsyncStorage.setItem('KEY_SELECTED_CHILD', JSON.stringify(newData));
};

const getSelectedChild = async data => {
  const value = await AsyncStorage.getItem('KEY_SELECTED_CHILD');
  return JSON.parse(value);
};

const removeSelectedChild = async () => {
  AsyncStorage.removeItem('KEY_SELECTED_CHILD');
};

const removeSelectedSchool = async () => {
  AsyncStorage.removeItem(Const.KEY_SELECTED_SCHOOL);
};

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else return true;
};

const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else return true;
};

const requestExternalReadPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External Storage Read Permission',
          message: 'App needs read permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else return true;
};

const getCommentLabel = (count) => {
  if (count === 0) {
    return 'No any comments';
  } else if (count === 1) {
    return 'View 1 comment';
  } else if (count > 1) {
    return 'View all ' + count + ' Comments';
  }
}

const getLikeLabel = (count) => {
  if (count === 0) {
    return '0 like';
  } else if (count === 1) {
    return '1 like';
  } else if (count > 1) {
    return  count + ' likes';
  }
}

export default {
  isValidData,
  showMsg,
  isValidArray,
  saveUser,
  getUser,
  removeUser,
  saveSelectedSchool,
  getSelectedSchool,
  removeSelectedSchool,
  saveListChilde,
  getListChilde,
  saveSelectedChild,
  getSelectedChild,
  removeSelectedChild,
  requestCameraPermission,
  requestExternalReadPermission,
  requestExternalWritePermission,
  getCommentLabel,
  getLikeLabel
};
