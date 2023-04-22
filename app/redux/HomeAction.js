import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

import BASE_URL from '../common/Config';
import Util from '../utils/Util';

import {RESTAURANT_SCHEMA, restaurantSchema} from '../model/restaurantSchema';
import {dataAvailable} from './HomeReducer';
import {START_LOADING, STOP_LOADING} from './actionTypes';

const Realm = require('realm');

const databaseOptions = {
  path: 'realmT4.realm',
  schema: [restaurantSchema],
  schemaVersion: 1,
};

export const fetchAndStoreToDatabase = () => {
  const url = BASE_URL + 'restaurants_list';
  console.log('url: ', url);
  return dispatch => {
    dispatch({type: START_LOADING});
    axios
      .get(url)
      .then(response => {
        console.log('response ayo' + JSON.stringify(response.data));
        const responseData = response.data;
        Realm.open(databaseOptions).then(realm => {
          realm.write(() => {
            responseData.data.forEach(obj => {
              realm.create(RESTAURANT_SCHEMA, obj);
            });
            console.log('size ' + realm.objects(RESTAURANT_SCHEMA).length);
            dispatch({type: STOP_LOADING});
            dispatch(dataAvailable(realm.objects(RESTAURANT_SCHEMA)));
          });
        });
      })
      .catch(error => {
        dispatch({type: ERROR});
      });
  };
};

export const getDataFromDatabase = () => {
  console.log('getDataFromDatabase');
  return dispatch => {
    Realm.open(databaseOptions).then(realm => {
      const res = realm.objects(RESTAURANT_SCHEMA);
      dispatch(dataAvailable(res));
    });
  };
};
