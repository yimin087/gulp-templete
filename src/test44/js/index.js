"use strict";
require(['jquery', 'custom'], function ($, custom) {
  let n = 0;
  $('#id').click(function (param) {
    getNum().then(num => {
      const id = custom.getQueryString('id');
      n += num;
      $(this).html(id + n);
    })
    
    console.log('sasdas');
  });
  const getNum = () => {
    return new Promise((resolve, reject) => {
      setTimeout(()=> {
        resolve(3)
      }, 2000)
    })
  }
});