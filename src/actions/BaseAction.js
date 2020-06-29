import axios from 'axios';
import Utils from '../Utils';
import { ADDRESS_BASE_API, LINK_SPECIALS } from '../parameters/const_env';

var BaseAction = {
  get(_collection, _query) {
    let _link = Utils.convertLink(_collection, _query);
    return axios.get(_link);
  },
  post(_collection, _body) {
    let _link = Utils.convertLink(_collection, undefined);
    return axios.post(_link, _body);
  },
  put(_collection, _body) {
    let _link = Utils.convertLink(_collection, undefined);
    return axios.put(_link, _body);
  },
  delete(_collection, _id) {
    let _link = Utils.convertLink(_collection, { _id: _id });
    return axios.delete(_link);
  },
  authentication(_username, _password) {
    return axios.post(`${ADDRESS_BASE_API}/${LINK_SPECIALS.authentication}`, {
      account: _username,
      password: _password
    });
  }
}

export default BaseAction;