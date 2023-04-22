import axios from 'axios';
import BASE_URL from '../common/Config';
import Util from '../utils/Util';
export const axiosGet = async url => {
  try {
    let {data: response} = await axios.get(BASE_URL + url);

    //   console.log("Axios responses=====:",response);
    //   if (response.ResponseCode !== 200)r
    //     store.dispatch(errorHandler(response.message));
    //   store.dispatch(errorEmpty());
    if (response.data) return response.data;
    else return response;
  } catch (error) {
    console.log(error);
  }
};
export const axiosPost = async (url, payload) => {
  try {
    let {data: response} = await axios.post(BASE_URL + url, payload);
    if (response.data) return response.data;
    else return response;
  } catch (error) {
    console.log(error);
  }
};

async function apiCallLogout(url, bodyData) {
  console.log('url: ', url);

  const user = await Util.getUser();
  console.log('user: ', user);
  let header = {};
  if (Util.isValidData(user)) {
    header.user = user.id;
  }

  console.log('header: ', header);

  return axios({
    url: BASE_URL + url,
    method: 'POST',
    // timeout: timeoutTimeT,
    data: bodyData,
    headers: header,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      console.log(error.response.status);
      return error;
    });
}

async function apiCallBodyDataPost(url, bodyData) {
  console.log('url: ', url);

  const user = await Util.getUser();
  console.log('user: ', user);
  let header = {};
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  if (Util.isValidData(selectedSchool)) {
    header.school = selectedSchool.id;
  }
  console.log('header: ', header);

  return axios({
    url: BASE_URL + url,
    method: 'POST',
    // timeout: timeoutTimeT,
    data: bodyData,
    headers: header,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      console.log(error.response.status);
      return error;
    });
}

async function apiCallBodyDataPostMultipart(url, bodyData) {
  // console.log('url: ', url);

  const user = await Util.getUser();
  console.log('user: ', user);
  let header = {
    'Content-Type': 'multipart/form-data',
  };
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  if (Util.isValidData(selectedSchool)) {
    header.school = selectedSchool.id;
  }
  console.log('header: ', header);

  return axios({
    url: BASE_URL + url,
    method: 'POST',
    data: bodyData,
    headers: header,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      // alert(JSON.stringify(error))
      console.log(error.message);
      return error;
    });
}
async function apiPostMultipartProfile(url, bodyData) {
  // console.log('url: ', url);

  const user = await Util.getUser();
  console.log('user: ', user);
  let header = {
    'Content-Type': 'multipart/form-data',
  };
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  // if (Util.isValidData(selectedSchool)) {
  //   header.school = selectedSchool.id;
  // }
  console.log('header: ', header);

  return axios({
    url: BASE_URL + url,
    method: 'POST',
    data: bodyData,
    headers: header,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      // alert(JSON.stringify(error))
      console.log(error.message);
      return error;
    });
}
async function apiCallBodyDataGet(url, bodyData) {
  console.log('url: ', url);

  const user = await Util.getUser();
  let header = {};
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  if (Util.isValidData(selectedSchool)) {
    header.school = selectedSchool.id;
  }

  console.log(header);

  return axios({
    url: BASE_URL + url,
    method: 'GET',
    data: bodyData,
    headers: header,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

async function apiCallParamsPost(url) {
  console.log('url: ', url);

  const user = await Util.getUser();
  let header = {};
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  if (Util.isValidData(selectedSchool)) {
    header.school = selectedSchool.id;
  }

  return axios
    .post(BASE_URL + url, {}, {headers: header})
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

async function apiCallParamsGet(url) {
  console.log('url: ', url);

  const user = await Util.getUser();
  console.log('user:', user);
  let header = {};
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  console.log('selectedSchool:', selectedSchool);
  if (Util.isValidData(selectedSchool)) {
    header.school = selectedSchool.id;
  }
  console.log('header:', header);
  return axios
    .get(BASE_URL + url, {headers: header})
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

async function apiCallDelete(url, bodyData) {
  console.log('url: ', url);

  const user = await Util.getUser();
  console.log('user: ', user);
  let header = {};
  if (Util.isValidData(user)) {
    header.user = user.id;
  }
  const selectedSchool = await Util.getSelectedSchool();
  if (Util.isValidData(selectedSchool)) {
    header.school = selectedSchool.id;
  }
  console.log('header: ', header);

  return axios({
    url: BASE_URL + url,
    method: 'DELETE',
    headers: header,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

async function apiCallParamsPostWithHeader(url, header) {
  console.log('url: ', url);

  return axios
    .post(BASE_URL + url, {}, {headers: header})
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

async function apiCallParamsGetWithHeader(url, header) {
  console.log('url: ', url);
  console.log('header: ', header);

  return axios
    .get(BASE_URL + url, {headers: header})
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}

export default {
  apiCallBodyDataPost,
  apiCallBodyDataGet,
  apiCallParamsPost,
  apiCallParamsGet,
  apiPostMultipartProfile,
  apiCallDelete,
  apiCallLogout,
  apiCallBodyDataPostMultipart,
  apiCallParamsPostWithHeader,
  apiCallParamsGetWithHeader
};
