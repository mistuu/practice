import {
  ERROR,
  GET_DASHBOARD,
  SUCCESSFULLY_FETCHED_DASHBOARD,
} from './actionTypes';

const initialState = {
  dataList: [],
  loading: false,
  error: false,
};

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case GET_DASHBOARD:
      return {
        ...state,
        loading: true,
      };
    case SUCCESSFULLY_FETCHED_DASHBOARD:
      return {...state, dataList: action.payload, loading: false};
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

export default dashboardReducer;
