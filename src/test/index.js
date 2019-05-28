"use strict";

require(['jquery', 'custom'], function ($, custom) {
  let n = 0;
  $('#id').click(function (param) {
    const id = custom.getQueryString('id');
    n += 1;
    $(this).html(id + n);
    console.log('sasdas');
  });
});