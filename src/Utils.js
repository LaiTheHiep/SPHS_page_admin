import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { ADDRESS_BASE_API, EXPIRY_TOKEN } from './parameters/const_env';

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
      window.location.reload();
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
  resetLink() {
    let _href = window.location.href;
    let _arr = _href.split('/');
    if (_arr && _arr.length) {
      window.location.href = _href.substring(0, _href.indexOf(_arr[_arr.length - 1]));
      // window.location.reload();
    }
  }
}

export default Utils;