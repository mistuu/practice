import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {Platform} from 'react-native';
import Flavor, {BaseURL} from '../utils/Flavor';
import Util from '../utils/Util';
import {ERROR, GET_DASHBOARD, SUCCESSFULLY_FETCHED_DASHBOARD} from './actionTypes';

export const getDashboard = params => {
  const url = 'Login/Dashboard?STU_Id=' + params;
  console.log('url: ', url);
  try {
    return async dispatch => {
      dispatch({type: GET_DASHBOARD});

      const isConnected = (await NetInfo.fetch()).isConnected;
      if (isConnected) {
        const response = await axios.get(BaseURL + url, {});
        const responseData = JSON.parse(JSON.stringify(response.data));
        if (responseData.ResponseCode === 1) {
          if (Util.isValidData(responseData.Data)) {
            console.log('getDashboard --->');
            console.log(responseData.Data?.upcomingTimeTable);

            const timetableList = responseData.Data?.upcomingTimeTable;
            let tmpList = Object.values(
              timetableList.reduce((acc, item) => {
                if (!acc[item.TTA_Date])
                  acc[item.TTA_Date] = {
                    TTA_Date: item.TTA_Date,
                    lecture: [],
                  };
                acc[item.TTA_Date].lecture.push(item);
                return acc;
              }, {}),
            );
            let sortedList = tmpList.sort(
              (a, b) => new Date(a.TTA_Date) - new Date(b.TTA_Date),
            );

            dispatch({
              type: SUCCESSFULLY_FETCHED_DASHBOARD,
              payload: sortedList,
            });
          } else {
            dispatch({type: ERROR});
            console.log('response.Message: ', responseData.Message);
            Util.showMsg(responseData.Message);
          }
        } else {
          dispatch({type: ERROR});
          console.log('Error while fetching data');
          Util.showMsg('Error while fetching data');
        }
      } else {
        dispatch({type: ERROR});
        Util.showMsg('Check your internet connection');
        console.log('No internet connection');
      }
    };
  } catch (error) {
    dispatch({type: ERROR});
    Util.showMsg('Error while fetching data');
    console.log(error);
  }
};
