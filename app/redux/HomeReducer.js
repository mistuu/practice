import {DATA_LOADED, ERROR, START_LOADING, STOP_LOADING,} from './actionTypes';

const initialState = {
  dataList: [],
  loading: false,
  error: false,
};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case DATA_LOADED:
      return {
        ...state,
        loading: false,
        dataList: action.payload,
      };
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      };
    default:
      return state;
  }
}

export const dataAvailable = (data) => {
  return {
    type: DATA_LOADED,
    payload: data,
  };
};

export default homeReducer;
