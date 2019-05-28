"use strict";

require(['jquery', 'custom'], function ($, custom) {
  var n = 0;
  $('#id').click(function (param) {
    var id = custom.getQueryString('id');
    n += 1;
    $(this).html(id + n);
    console.log('sasdas');
  });
});