import AdminService from '../services';
import {adminSlice} from "./adminSlice";
import {message} from "antd";
import {errorsKey} from "../utils";


export function validateSnils(value) {
  let snils = value.replace(/[^+\d]/g, '')
  return async dispatch => {
    if (typeof snils === 'number') {
      snils = snils.toString();
    } else if (typeof snils !== 'string') {
      snils = '';
    }

    if (!snils.length) {
      dispatch(adminSlice.actions.fetchError('СНИЛС пуст'));
    } else if (/[^0-9]/.test(snils)) {
      dispatch(adminSlice.actions.fetchError('СНИЛС может состоять только из цифр'));
    } else if (snils.length !== 11) {
      dispatch(adminSlice.actions.fetchError('СНИЛС может состоять только из 11 цифр'));
    } else if (snils === '00000000000') {
      dispatch(adminSlice.actions.fetchError('СНИЛС не может состоять из одних нулей'))
    } else {

      let sum = 0;
      let checkDigit = 0;

      for (let i = 0; i < 9; i++) {
        sum += parseInt(snils[i]) * (9 - i);
      }

      if (sum < 100) {
        checkDigit = sum;
      } else if (sum > 101) {
        checkDigit = parseInt(sum % 101);
        if (checkDigit === 100) {
          checkDigit = 0;
        }
      }

      if (checkDigit === parseInt(snils.slice(-2))) {
        dispatch(adminSlice.actions.fetchError(''));
      } else {
        dispatch(adminSlice.actions.fetchError('Неправильное контрольное число'));
      }
    }
  }
}

// Рендер текущей страницы
const stayOnThisPage = (data, pagination, query, dispatch) => {
  const dataValue = {
    superAdmin: data,
    pagination: pagination,
    navigate: undefined,
    query: query,
  }
  dispatch(getAllUsers_Pagination(dataValue))
}

// @-Changed Отправка DaData
export const getUserGeoData = (token, query) => {
  const value = JSON.stringify({token, query})
  return async dispatch => {
    await AdminService.$getUserGeoData(value)
      .then(response => {
        if (response.data.status !== false) {
          let res = response.data.value;
          dispatch(adminSlice.actions.UserAddress(res))
        } else {
          const err = response.data.errors[0].key
          message.error(err)
        }
      })
  }
}

// Отправка DaDataInn
export const getUserInnData = (token, query) => {
  const value = JSON.stringify({token, query})
  return async dispatch => {
    await AdminService.$getUserInnData(value)
      .then(response => {
        if (response.data.status !== false) {
          let res = response.data.value;
          dispatch(adminSlice.actions.UserInn(res))
        } else {
          const err = response.data.errors[0].key
          message.error(err)
          // const show = errorsKey(err)
        }
      })
  }
}

//загрузка изображений
export const upload_file = (token, file) => {
  return async (dispatch) => {
    const blob = await fetch(file).then(f => f.blob());
    const data = new FormData();
    data.append('token', token)
    data.append('file', blob)
    await AdminService.$upload_File(data)
      .then(response => {
        if (response.data.status !== false) {
          dispatch(adminSlice.actions.UserPhoto(response.data.values[0]))
          message.success('вы успешно добавили фото профиля')
        }
        if (!response.data.status) {
          const err = response.data.errors[0].key
          // const show = errorsKey(err)
          message.error(err)
        }
      })
  }
}

export const addRole = (superAdmin, id, role, service) => {
  const data = {
    login: superAdmin.login,
    password: superAdmin.password,
    user_id: id,
    role: {service: service[0], role}
  };
  return async (dispatch) => {
    const value = JSON.stringify(data);
    await AdminService.$addRole(value)
      .then(response => {
        if (response.data.status !== false) {
          dispatch(adminSlice.actions.UserPhoto(response.data.values[0]))
          message.success('Вы успешно добавили роль')
        }
        if (!response.data.status) {
          const err = response.data.errors[0].key
          const show = errorsKey(err)
          message.error(show)
        }
      })
  }
}

export const getAllUsers_Pagination = ({superAdmin, pagination, navigate, query}) => async (dispatch) => {
  dispatch(adminSlice.actions.usersFetchingLoading(true));
  const paginate = {
    login: superAdmin.login,
    password: superAdmin.password,
    pages: {
      limit: pagination && pagination.limit,
      page: pagination && pagination.page
    },
    query: query
  };

  const value = JSON.stringify(paginate);
  const response = await AdminService.$getAllUsers(value);

  if (response && response.data.status !== false) {
    localStorage.setItem('superAdmin', JSON.stringify(superAdmin));
    let user = response.data.values[0];
    if (!user.count && user.count !== 0) {
      user = {users: [user], count: 1}
    }
    dispatch(adminSlice.actions.usersFetchingSuccess(user))

    navigate && navigate('/admin');
  }
  if (response && response.data.status !== true) {
    const err = response.data.errors[0].message;
    dispatch(adminSlice.actions.usersFetchingError(err));
    message.error(err);
  }
}

export const deactivate_user = (superAdmin, user_id, pagination, query) => async (dispatch) => {
  dispatch(adminSlice.actions.usersFetchingLoading(true));

  const data = {
    user_id,
    login: superAdmin.login,
    password: superAdmin.password,
  };
  const value = JSON.stringify(data);
  const response = await AdminService.$deactivateUser(value);

  if (response && response.data.status !== false) {
    stayOnThisPage(data, pagination, query, dispatch)
  }

  if (response && response.data.status !== true) {
    const err = response.data.errors[0].message;
    message.error(err);
  }

  dispatch(adminSlice.actions.usersFetchingLoading(false));
}

export const delete_user = (superAdmin, user_id, pagination, query) => async (dispatch) => {
  dispatch(adminSlice.actions.usersFetchingLoading(true));

  const data = {
    user_id,
    login: superAdmin.login,
    password: superAdmin.password,
  };
  const value = JSON.stringify(data);
  const response = await AdminService.$deleteUser(value);

  if (response && response.data.status !== false) {
    stayOnThisPage(data, pagination, query, dispatch)
  }

  if (response && response.data.status !== true) {
    const err = response.data.errors[0].message;
    message.error(err);
  }

  dispatch(adminSlice.actions.usersFetchingLoading(false));
}

export const get_user_token = (superAdmin, user_id, service) => async (dispatch) => {
  dispatch(adminSlice.actions.usersFetchingLoading(true));

  const data = {
    login: superAdmin.login,
    password: superAdmin.password,
    user_id,
    service
  };
  const value = JSON.stringify(data);
  const response = await AdminService.$getUserToken(value);
  if (response && response.data.status !== false) {
    const userToken = response.data.values[0];
    dispatch(getUserData(userToken));
    dispatch(adminSlice.actions.fetchUserToken(userToken));
  }

  if (response && response.data.status !== true) {
    const err = response.data.errors[0].message;
    message.error(err);
  }

  dispatch(adminSlice.actions.usersFetchingLoading(false));
}

export const getUserData = (token) => async dispatch => {
  dispatch(adminSlice.actions.usersFetchingLoading(false));

  const response = await AdminService.$getUserData(JSON.stringify({token}));
  if (response && response.data.status !== false) {
    const res = response.data.values[0];
    dispatch(adminSlice.actions.usersFetchForEditSuccess(res));
  }

  if (response && response.data.status !== true) {
    const err = response.data.errors[0].message;
    message.error(err);
  }

  dispatch(adminSlice.actions.usersFetchingLoading(false));
}

export const set_users = (data, setIsEditModule) => {
  return async (dispatch) => {
    await AdminService.$set_User(data)
      .then(response => {
        if (response.data.status !== false) {
          dispatch(adminSlice.actions.usersFetchingLoading(true));
          message.success('Вы успешно изменили данные');
          setIsEditModule(false);
        }
        if (response.data.status !== true) {
          const err = response.data.errors[0].key
          message.error(err)
          dispatch(adminSlice.actions.usersFetchingLoading(false));
        }
      })
  }
}

// Активация пользователя
export const activate_user = (superAdmin, user_id, pagination, query) => async (dispatch) => {
  dispatch(adminSlice.actions.usersFetchingLoading(true));

  const data = {
    user_id,
    login: superAdmin.login,
    password: superAdmin.password,
  };
  const value = JSON.stringify(data);
  const response = await AdminService.$activateUser(value);

  debugger
  if (response && response.data.status !== false) {
    stayOnThisPage(data, pagination, query, dispatch)
  }

  if (response && response.data.status !== true) {
    const err = response.data.errors[0].message;
    message.error(err);
  }

  dispatch(adminSlice.actions.usersFetchingLoading(false));
}