import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { ADDRESS_BASE_API, EXPIRY_TOKEN, ROLES } from './parameters/const_env';

var Utils = {
  downloadTemplate(data) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' };
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'File mẫu');
    const wbout = XLSX.write(workbook, wopts);
    saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `Template_${moment().format('HH:mm:ss DD-MM-YYYY')}.xlsx`
    );
  },
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },
  convertLink(_collection, _query) {
    if (!localStorage.accessToken) {
      alert('Session expired');
      this.clearCookie();
      window.location.reload();
      return;
    }
    var _link = `${ADDRESS_BASE_API}/${_collection}?accessToken=${localStorage.accessToken}`;
    if (_query) {
      Object.keys(_query).forEach((e, i) => {
        _link += `&${e}=${_query[e]}`;
      })
    }

    return _link;
  },
  setCookie(_user) {
    Object.keys(_user).forEach((e, i) => {
      localStorage.setItem(e, _user[e]);
    });
    // create time login
    localStorage.setItem('timeSession', Date.now()); // milliseconds
  },
  clearCookie() {
    localStorage.clear();
  },
  getItemCookie(_item) {
    return localStorage.getItem(_item);
  },
  checkSession() {
    let _now = new Date();
    if (_now.getTime() - this.getItemCookie('timeSession') > EXPIRY_TOKEN) {
      alert('Session expired! You must login to use service');
      this.clearCookie();
      this.resetLink('login');
      // window.location.reload();
    }
  },
  getPage(_total, _pageSize) {
    let _pages = 0;
    if (_total % _pageSize) {
      _pages = Math.floor(_total / _pageSize);
      _pages += 1;
    } else {
      _pages = _total / _pageSize;
    }

    return _pages;
  },
  convertTime(_date) {
    let d = new Date(_date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.toLocaleTimeString()}`
  },
  resetLink(_link) {
    let _replaceLink = _link ? _link : '';
    let _href = window.location.href;
    let _arr = _href.split('/');
    if (_arr && _arr.length) {
      window.location.href = _href.substring(0, _href.indexOf(_arr[_arr.length - 1])) + _replaceLink;
      // window.location.reload();
    }
  },
  selectRole() {
    let _temp = ROLES;
    switch (this.getItemCookie('role')) {
      case ROLES.security:
        delete _temp[ROLES.admin];
        return _temp;
      case ROLES.manager:
        delete _temp[ROLES.admin];
        delete _temp[ROLES.security];
        return _temp;
      default:
        return ROLES;
    }
  },
  showElementRole(_arrRoleBlock) {
    let _role = this.getItemCookie('role');
    let _temp = _arrRoleBlock.find(e => e === _role);
    if (_temp) return false;
    else return true;
  },
  convertArrayToStringList(_array) {
    try {
      var text = JSON.stringify(_array);
      text = text.substr(1, text.length - 2);
      text = text.replace(/"/g, "");
      text = text.replace(/'/g, "");
      return text;
    }
    catch{
      return '';
    }
  },
  convertStringListToArray(_stringList){
    var items = _stringList.split(',');
    var text = '';
    items.forEach(e => {
      text += `"${e.trim()}",`;
    });
    text = text.substr(0, text.length - 1);

    return JSON.parse(`[${text}]`);
  }
}

export default Utils;