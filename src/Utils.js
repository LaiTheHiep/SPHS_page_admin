import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { ADDRESS_BASE_API } from './parameters/const_env';

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
    })
  },
  clearCookie() {
    localStorage.clear();
  },
  getItemCookie(_item) {
    return localStorage.getItem(_item);
  }
}

export default Utils;