// 弹窗
define(function() {
  return {
    toast:function (message) {
      var hint = document.createElement('div')
      hint.classList.add('toast-container')
      hint.innerHTML = '<p class="toast-message">' + message + '</p>'
      document.body.appendChild(hint)
      setTimeout(function() {
        document.body.removeChild(hint)
      }, 1500)
    },

    // 获取cookie
    getCookie:function (c_name) {
      if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + '=')
        if (c_start != -1) {
          c_start = c_start + c_name.length + 1
          var c_end = document.cookie.indexOf(';', c_start)
          if (c_end == -1) c_end = document.cookie.length
          // return unescape(document.cookie.substring(c_start,c_end))
          return document.cookie.substring(c_start, c_end)
        }
      }
      return ''
    },

    // 获取url参数
    getQueryString:function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      // if (r != null) return unescape(r[2]);
      if (r != null) return r[2]
      return null
    }
  } 
})
