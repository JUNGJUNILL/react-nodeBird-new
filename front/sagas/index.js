import { all, fork } from 'redux-saga/effects';
//사가의 이펙트드들
import axios from 'axios';

import postSaga from './post';
import userSaga from './user';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

export default function* rootSaga() {

    //all은 배열을 받고, 배열안에 있는 걸 한방에 다 실행해 준다. 
  yield all([

     //fork는 함수를 실행하는 것이다. 
    fork(postSaga),
    fork(userSaga),
  ]);
}