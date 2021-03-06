import { call, put, select } from 'redux-saga/effects'
import { path } from 'ramda'
import AuthActions from '../Redux/AuthRedux'
import { AsyncStorage } from 'react-native'

export function * checkPasscode (api, action) {
  const { passcode } = action
  // make the call to the api
  const response = yield call(api.checkPasscode, passcode)
  if (response.status === 200 && response.data.status) {
    // do data conversion here if needed
    AsyncStorage.setItem('@irate-passcode', passcode);
    yield put(AuthActions.authSuccess(passcode))
  } else {
    switch(response.problem){
      case 'NETWORK_ERROR':
        yield put(AuthActions.authFailure("Network Connection is not available"));
        break;
      case 'CONNECTION_ERROR':
        yield put(AuthActions.authFailure("Server is not available"));
        break;                                                           
      default:
        yield put(AuthActions.authFailure(response.data.message));
        break;
    }
  }
}

export function * verifyPhoneNumber (api, action) {
  const { lang, phone_number } = action
  console.log('Action=', action);
  // make the call to the api
  const response = yield call(api.verifyPhoneNumber, lang, phone_number)
  console.log('Response=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    console.log('VerifySuccess');
    yield put(AuthActions.verifySuccess())
  }
  else
  {
    console.log('VerifyFailure');
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.verifyFailure(response.data.errors.phone_number))
    }
    else{
      yield put(AuthActions.verifyFailure('Error occured while connecting to server'))
    }
  }
}

export function * logIn (api, action) {
  const { lang, code, phone_number } = action
  console.log('Action=', action);
  // make the call to the api
  const response = yield call(api.logIn, lang, phone_number, code)
  console.log('Response=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    yield put(AuthActions.loginSuccess(response.data.token))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.loginFailure(response.data.errors.code))
    }
    else{
      yield put(AuthActions.loginFailure('Error occured while connecting to server'))
    }
  }
}

export function * getStoreList (api, action) {
  const { lang, token } = action
  console.log('Action=', action);
  // make the call to the api
  const response = yield call(api.getStoreList, lang, token)
  console.log('Response=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    yield put(AuthActions.storeSuccess(response.data.name, response.data.stores))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.storeFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

export function * createEmptyProduct (api, action) {
  const { store_id } = action
  console.log('Store_Id=', store_id);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang

  const token = yield select(getToken)
  const lang = yield select(getLang)

  const response = yield call(api.createProductId, token, lang, store_id)
  console.log('Response=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    yield put(AuthActions.createProductSuccess(response.data.id))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

export function * searchBarcode (api, action) {
  const { barcode } = action
  console.log('BARCODE_IN_SAGA=', barcode);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang
  const getStoreId = (state) => state.auth.store_id

  const token = yield select(getToken)
  const lang = yield select(getLang)
  const store_id = yield select(getStoreId)

  const response = yield call(api.searchByBarcode, token, lang, store_id, barcode)
  console.log('SEARCH_BARCODE_RESPONSE=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    const {data:{id}} = yield call(api.getReference, token, lang, store_id, response.data.id)
    const good_info = yield call(api.getGood, token, lang, store_id, id)
    yield put(AuthActions.getGoodSuccess(good_info.data))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}
 
export function * getGood (api, action) {
  const { good_id } = action
  console.log('good_id=', good_id);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang
  const getStoreId = (state) => state.auth.store_id

  const token = yield select(getToken)
  const lang = yield select(getLang)
  const store_id = yield select(getStoreId)
  const {data:{id}} = yield call(api.getReference, token, lang, store_id, good_id)
  const response = yield call(api.getGood, token, lang, store_id, id)
  console.log('GET_GOOD->GOOD_INFO=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    yield put(AuthActions.getGoodSuccess(response.data))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

export function * getReference (api, action) {
  const { barcode } = action
  console.log('BARCODE_IN_SAGA=', barcode);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang
  const getStoreId = (state) => state.auth.store_id

  const token = yield select(getToken)
  const lang = yield select(getLang)
  const store_id = yield select(getStoreId)

  const response = yield call(api.searchByBarcode, token, lang, store_id, barcode)
  console.log('SEARCH_BARCODE_RESPONSE=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    const good_info = yield call(api.getGood, token, lang, store_id, response.data.id)
    yield put(AuthActions.getGoodSuccess(good_info))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

export function * searchByName (api, action) {
  const { name } = action
  console.log('PROD_NAME=', name);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang
  const getStoreId = (state) => state.auth.store_id

  const token = yield select(getToken)
  const store_id = yield select(getStoreId)
  const lang = yield select(getLang)

  const response = yield call(api.searchByName, token, name, store_id, lang)
  console.log('SEARCH_By_NAME_RESPONSE=', response);
  if (response.status === 200 && response.data.result === 'done') {
    console.log('Goods are retriedved');
    yield put(AuthActions.searchNameSuccess(response.data.goods))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

export function * uploadImage (api, action) {
  const { good_id, pic1, pic2 } = action
  console.log('GOOD_ID=', good_id);
  console.log('pic', pic1);
  console.log('pic', pic2);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang
  const getStoreId = (state) => state.auth.store_id

  const token = yield select(getToken)
  const lang = yield select(getLang)
  const store_id = yield select(getStoreId)

  const response = yield call(api.uploadImage, token, store_id, good_id, pic1, pic2)
  console.log('SEARCH_BARCODE_RESPONSE=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    yield put(AuthActions.uploadImageSuccess(response.data.images))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

export function * saveLeftInfoRequest (api, action) {
  const { price_usual, price_mode, properties } = action
  console.log('price_usual=', price_usual);
  console.log('price_mode=', price_mode);
  console.log('properties=', properties);
  const getToken = (state) => state.auth.token
  const getLang = (state) => state.auth.lang
  const getStoreId = (state) => state.auth.store_id
  const goodId = (state) => state.auth.good_info.id

  const good_id = yield select(goodId)
  const token = yield select(getToken)
  const lang = yield select(getLang)
  const store_id = yield select(getStoreId)

  const response = yield call(api.saveLeftInfo, store_id, lang, token, good_id, price_usual, price_mode, properties)
  console.log('SAVE_LEFT_INFO_RESPONSE=', response);
  if (response.status === 200 && response.data.result === 'done') {
    // do data conversion here if needed
    console.log('GET_GOOD_AFTER_UPDATE with good_id=', good_id)
    yield put(AuthActions.getGoodRequest(good_id))

    yield put(AuthActions.saveLeftinfoSuccess(response.data.changes))
  }
  else
  {
    if (response.status === 200 && response.data.result === 'error') {
      yield put(AuthActions.createProductFailure(response.data.report))
    }
    else{
      yield put(AuthActions.storeFailure('Error occured while connecting to server'))
    }
  }
}

