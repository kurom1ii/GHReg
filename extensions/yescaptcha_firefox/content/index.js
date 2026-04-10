/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getLocalVersion = exports.localVersion = exports.getIsBlackWhitePass = exports.getClickTime = exports.waitDo = exports.waitforbackgroundWithTimeout = exports.waitforbackground = exports.imageready = exports.waitFor = exports.notneedcontinue = exports.div2base64 = exports.delay = exports.captchaClassification = exports.messageHide = exports.message = undefined;

var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/promise.js");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/asyncToGenerator.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.testnetwork = testnetwork;
exports.post = post;
exports.get = get;
exports.getBalance = getBalance;
exports.getconfig = getconfig;
exports.setconfig = setconfig;
exports.getParentUrl = getParentUrl;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 为替换pc客户端实现一个同样的接口的对象，这样就不用改之前的captcha.js的代码了
// 测试key  a2000da995ef93962df8a4f6d200004b1fdd4c943
// 需实现的接口
// 1.onopen  启动时调用
// 2.onclose 关闭时调用
// 3.onmessage 接收到消息时调用
// 4.send 方法发送消息
// onmessage  时需返回 json字符串+"##" 作为结束标志
// 返回对象需要有 type 属性 10,表示是否开启自动识别,2表示结果,
// 服务器版本信息

var chrome = window.chrome;

// 设置页面信息显示和隐藏
var message = exports.message = function message(_ref) {
  var _ref$text = _ref.text,
      text = _ref$text === undefined ? '' : _ref$text,
      _ref$color = _ref.color,
      color = _ref$color === undefined ? 'red' : _ref$color;

  var message = document.getElementById('mymessage');
  if (!message) {
    message = document.createElement('div');
    message.id = 'mymessage';

    // message.className = 'fankui'
    message.style.position = 'fixed';
    message.style.top = '0px';
    message.style.left = '0px';

    // message.style.width = '100%'
    // message.style.height = '100%'
    message.style.zIndex = '99999999';
    // // message.style.backgroundColor = 'rgba(0,0,0,0.5)'
    // message.style.border = '1px solid red'
    // message.style.textAlign = 'left'
    // message.style.lineHeight = '100%'
    // message.style.fontSize = '20px'
    message.innerText = text;
    document.body.appendChild(message);
  } else {
    message.innerText = text;
  }
  color === 'green' ? message.className = 'fankui' : message.className = 'fankui2';
  message.style.display = 'block';
  // message.style.color = color === 'green' ? 'red' : 'green'
};

// 设置页面信息显示和隐藏
var messageHide = exports.messageHide = function messageHide() {
  var message = document.getElementById('mymessage');
  if (message) {
    message.style.display = 'none';
  }
};

// 定义页面识别方法
var captchaClassification = exports.captchaClassification = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref3, times, result, typelist, i;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getconfig();

          case 2:
            _ref3 = _context.sent;
            times = _ref3.times;
            _context.next = 6;
            return delay(times * 10);

          case 6:
            result = null;
            // 对不同页面判断的定义 title 表示使用的接口，url_keywork 为url中的关键字,div 为判断是否这个页面

            typelist = [{
              title: 'imageclassification',
              url_keyword: 'recaptcha',
              div: '#recaptcha-anchor-label',
              imagediv: '#recaptcha-token' // 图片的div 和点击的框架为两个不同的框架

            }, {
              title: 'hcaptcha',
              url_keyword: 'hcaptcha.com',
              div: '#anchor-state',
              imagediv: '.challenge-container' // hcaptcha 图片的div 和点击的框架为两个不同的框架
            }, {
              title: 'hcaptcha',
              url_keyword: 'hcaptcha-assets.ecosec.on.epicgames.com',
              div: '#anchor-state',
              imagediv: '.challenge-container' // hcaptcha 图片的div 和点击的框架为两个不同的框架
            }, {
              title: 'rainbow',
              // assets-us-west-2.queue-it.net
              // assets-us-west-2.queue-it.net
              url_keyword: 'queue-it.net',
              div: '#enqueue-error > a:nth-child(3) > div > strong'
            }, {
              title: 'imagetotext',
              url_keyword: 'queue',
              // div: '#challenge-container > button'
              div: '#lbHeaderP'
            }];
            i = 0;

          case 9:
            if (!(i < typelist.length)) {
              _context.next = 16;
              break;
            }

            if (!(window.location.href.indexOf(typelist[i].url_keyword) > -1 && (document.querySelector(typelist[i].div) || typelist[i].imagediv && document.querySelector(typelist[i].imagediv)))) {
              _context.next = 13;
              break;
            }

            result = typelist[i];

            return _context.abrupt('break', 16);

          case 13:
            i++;
            _context.next = 9;
            break;

          case 16:
            return _context.abrupt('return', result);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function captchaClassification() {
    return _ref2.apply(this, arguments);
  };
}();

// 网络测试
function testnetwork(url) {
  return new _promise2.default(function (resolve, reject) {
    if (window.self === window.top) {
      browser.runtime.sendMessage({ action: 'testnetwork', url: url }, function (response) {
        resolve(response);
      });
    } else {
      resolve(true);
    }
  });
}

// post 请求代理
function post(url, data) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var tries = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

  return new _promise2.default(function (resolve, reject) {
    browser.runtime.sendMessage({ action: 'post', url: url, data: data, delay: delay, tries: tries }, function (response) {
      if (response === "fail") {
        reject("fail");
      }
      resolve(response);
    });
  });
}
function get(url) {
  return new _promise2.default(function (resolve, reject) {
    browser.runtime.sendMessage({ action: 'get', url: url }, function (response) {
      resolve(response);
    });
  });
}

// 获取余额
function getBalance(_ref4) {
  var host = _ref4.host,
      clientKey = _ref4.clientKey;

  return post(new URL('getBalance', host).href, {
    clientKey: clientKey
  });
}
var delay = exports.delay = function delay(s) {
  return new _promise2.default(function (resolve) {
    setTimeout(resolve, s);
  });
};

function getconfig() {
  return new _promise2.default(function (resolve, reject) {
    browser.runtime.sendMessage({ action: 'getconfig' }, function (response) {
      response.times = response.times || 100;
      resolve(response);
    });
  });
}
function setconfig(config) {
  return new _promise2.default(function (resolve, reject) {
    browser.runtime.sendMessage({ action: 'setconfig', config: config }, function (response) {
      resolve(response);
    });
  });
}

var div2base64 = exports.div2base64 = function div2base64(src) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 128;
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 128;

  return new _promise2.default(function (resolve, reject) {
    if (!src) resolve(null);
    var img = new Image();
    img.setAttribute('crossOrigin', 'Anonymous');
    img.src = src;
    img.width = width;
    img.height = height;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    img.onload = function () {
      // 图片加载完，再draw 和 toDataURL
      context.drawImage(img, 0, 0, width, height);
      var base64 = canvas.toDataURL();
      // console.log('base64', base64)
      var out = base64.replace('data:image/png;base64,', '');

      resolve(out);
    };
  });
};

function getParentUrl() {
  var url = null;
  if (parent !== window) {
    try {
      url = parent.location.href;
    } catch (e) {
      url = document.referrer;
    }
  }
  return url;
};

// 无需返回的错误码
var notneedcontinue = exports.notneedcontinue = function notneedcontinue(errorstr) {
  return errorstr && 'ERROR_REQUIRED_FIELDS\n  ERROR_KEY_DOES_NOT_EXIST\n  ERROR_ZERO_BALANCE\n  ERROR_ZERO_CAPTCHA_FILESIZE\n  ERROR_DOMAIN_NOT_ALLOWED\n  ERROR_TOO_BIG_CAPTCHA_FILESIZE\n  ERROR_ILLEGAL_IMAGE\n  ERROR_IP_BANNED\n  ERROR_IP_BLOCKED_5MIN\n  ERROR_CLIENTKEY_UNAUTHORIZED'.includes(errorstr);
};
// 等待dom元素存在,超时 默认10秒
var waitFor = exports.waitFor = function waitFor(divstr) {
  var outtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  return new _promise2.default(function (resolve, reject) {
    var timer = setInterval(function () {
      if (document.querySelector(divstr)) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
    setTimeout(function () {
      clearInterval(timer);
      resolve(true);
    }, outtime * 1000);
  });
};
// 等待图像加载完
var imageready = exports.imageready = function imageready(imgsrc) {
  return new _promise2.default(function (resolve, reject) {
    var img = new Image();
    img.src = imgsrc;
    img.onload = function () {
      resolve(true);
    };
  });
};
// 等待背景图片属性存在
var waitforbackground = exports.waitforbackground = function waitforbackground(div) {
  return new _promise2.default(function (resolve, reject) {
    var timer = setInterval(function () {
      if (div.style && div.style.background) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
  });
};

// 等待背景图片属性存在
var waitforbackgroundWithTimeout = exports.waitforbackgroundWithTimeout = function waitforbackgroundWithTimeout(div) {
  return new _promise2.default(function (resolve, reject) {
    var timer = setInterval(function () {
      if (div.style.background) {
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
    var timeoutTimer = setTimeout(function () {
      clearInterval(timer);
      clearTimeout(timeoutTimer);
      resolve(false);
    }, 3000);
  });
};

// 等待func返回true,超时默认10秒
var waitDo = exports.waitDo = function waitDo(func) {
  var outtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  return new _promise2.default(function (resolve, reject) {
    var timer = setInterval(function () {
      if (func()) {
        console.log('func true');
        clearInterval(timer);
        resolve(true);
      }
    }, 100);
    setTimeout(function () {
      console.log('func false');
      clearInterval(timer);
      resolve(false);
    }, outtime * 1000);
  });
};

// 客户端获取版本号

function getLocalVersion() {
  return new _promise2.default(function (resolve) {
    browser.runtime.sendMessage({
      getLocalVersion: true
    }, function (ver) {
      resolve(ver);
    });
  });
}
var getClickTime = exports.getClickTime = function getClickTime() {
  var configTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var rate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;


  var timeFloatLimit = configTime * rate;

  var timeFloat = Math.random() * 2 * timeFloatLimit - timeFloatLimit;

  return Math.ceil(timeFloat) + configTime;
};

var getIsBlackWhitePass = exports.getIsBlackWhitePass = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(config) {
    var isInUrlList, judgeBlackWhite, queryCurrentUrl, currentTabUrl, blackWhiteResult;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isInUrlList = function isInUrlList(urlList, url) {
              var index = urlList.findIndex(function (pattern) {
                return url.indexOf(pattern) > -1;
              });
              return index > -1;
            };

            judgeBlackWhite = function judgeBlackWhite(config, url) {
              var isOpenBlackList = config.blackListConfig.isOpen;
              var isOpenWhiteList = config.whiteListConfig.isOpen;
              if (isOpenWhiteList) {
                var whiteResult = isInUrlList(config.whiteListConfig.urlList || [], url);
                if (whiteResult) return 'inWhiteList';else return 'notInWhiteList';
              }
              if (isOpenBlackList) {
                var blackListResult = isInUrlList(config.blackListConfig.urlList || [], url);
                if (blackListResult) return 'inBlackList';else return 'notInBlackList';
              } else return 'normal';
            };

            queryCurrentUrl = function queryCurrentUrl() {
              return new _promise2.default(function (resolve) {
                browser.runtime.sendMessage({ action: 'queryCurrentUrl' }, function (response) {
                  resolve(response);
                });
              });
            };

            _context2.next = 5;
            return queryCurrentUrl();

          case 5:
            currentTabUrl = _context2.sent;
            blackWhiteResult = judgeBlackWhite(config, currentTabUrl);
            _context2.t0 = blackWhiteResult;
            _context2.next = _context2.t0 === 'inWhiteList' ? 10 : _context2.t0 === 'notInWhiteList' ? 11 : _context2.t0 === 'inBlackList' ? 12 : _context2.t0 === 'notInBlackList' ? 13 : _context2.t0 === 'normal' ? 14 : 15;
            break;

          case 10:
            return _context2.abrupt('return', true);

          case 11:
            return _context2.abrupt('return', false);

          case 12:
            return _context2.abrupt('return', false);

          case 13:
            return _context2.abrupt('return', true);

          case 14:
            return _context2.abrupt('return', true);

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getIsBlackWhitePass(_x9) {
    return _ref5.apply(this, arguments);
  };
}();

// 本地版本信息

function localVersion() {
  return localStorage.version ? localStorage.version : 1;
}
exports.localVersion = localVersion;
exports.getLocalVersion = getLocalVersion;

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var config = exports.config = { develop: true };

/***/ }),

/***/ "./src/jsonall.js":
/*!************************!*\
  !*** ./src/jsonall.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.jsonall = exports.hcaptchaItemlist = undefined;

var _defineProperty2 = __webpack_require__(/*! babel-runtime/helpers/defineProperty */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/defineProperty.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _hcaptchaItemlist, _jsonall;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-dupe-keys */

var hcaptchaItemlist = exports.hcaptchaItemlist = (_hcaptchaItemlist = {
  'airplane': '飞机',
  'seaplane': '飞机',
  'motorbus': '巴士',
  'bus': '巴士',
  'boat': '船'
}, (0, _defineProperty3.default)(_hcaptchaItemlist, 'bus', '公交车'), (0, _defineProperty3.default)(_hcaptchaItemlist, 'train', '火车'), (0, _defineProperty3.default)(_hcaptchaItemlist, 'truck', '卡车'), (0, _defineProperty3.default)(_hcaptchaItemlist, 'motorcycle', '摩托车'), (0, _defineProperty3.default)(_hcaptchaItemlist, 'bicycle', '自行车'), _hcaptchaItemlist);

var jsonall = exports.jsonall = (_jsonall = {
  // 白俄罗斯
  горыабопагоркі: '/m/09d_r',
  знакіпрыпынку: '/m/02pv19',
  вулічныязнакі: '/m/01mqdt',
  расліны: '/m/05s2s',
  дрэвы: '/m/07j7r',
  трава: '/m/08t9c_',
  хмызнякоў: '/m/0gqbt',
  кактус: '/m/025_v',
  пальмы: '/m/0cdl1',
  прыроды: '/m/05h0n',
  вадаспады: '/m/0j2kx',
  горы: '/m/09d_r',
  пагоркі: '/m/09d_r',
  вадаёмы: '/m/03ktm1',
  рэкі: '/m/06cnp',
  пляжы: '/m/0b3yr',
  Сонца: '/m/06m_p',
  Месяц: '/m/04wv_',
  неба: '/m/01bqvp',
  транспартныхсродкаў: '/m/0k4j',
  машыны: '/m/0k4j',
  веласіпеды: '/m/0199g',
  матацыклы: '/m/04_sv',
  пікапы: '/m/0cvq3',
  камерцыйныягрузавікі: '/m/0fkwjg',
  лодкі: '/m/019jd',
  лімузіны: '/m/01lcw4',
  таксі: '/m/0pg52',
  школьныаўтобус: '/m/02yvhj',
  аўтобус: '/m/01bjv',
  будаўнічаямашына: '/m/02gx17',
  статуі: '/m/013_1c',
  фантаны: '/m/0h8lhkg',
  мост: '/m/015kr',
  прыстань: '/m/01phq4',
  хмарачос: '/m/079cl',
  слупыабокалоны: '/m/01_m7',
  вітражы: '/m/011y23',
  дом: '/m/03jm5',
  жылыдом: '/m/01nblt',
  светлавыдом: '/m/04h7h',
  чыгуначнаястанцыя: '/m/0py27',
  попелам: '/m/01n6fd',
  вогнегадрант: '/m/01pns0',
  рэкламнышчыт: '/m/01knjb',
  дарогі: '/m/06gfj',
  пешаходныяпераходы: '/m/014xcs',
  святлафор: '/m/015qff',
  гаражныядзверы: '/m/08l941',
  аўтобусныяпрыпынкі: '/m/01jw_1',
  трафіку: '/m/03sy7v',
  паркоматары: '/m/015qbp',
  лесвіцы: '/m/01lynh',
  коміны: '/m/01jk_4',
  трактары: '/m/013xlm',

  // 泰语
  ภูเขาหรือเนินเขา: '/m/09d_r',
  ป้ายหยุด: '/m/02pv19',
  ป้ายถนน: '/m/01mqdt',
  พืช: '/m/05s2s',
  ต้นไม้: '/m/07j7r',
  หญ้า: '/m/08t9c_',
  พุ่มไม้: '/m/0gqbt',
  กระบองเพชร: '/m/025_v',
  ต้นปาล์ม: '/m/0cdl1',
  ธรรมชาติ: '/m/05h0n',
  น้ำตก: '/m/0j2kx',
  ภูเขา: '/m/09d_r',
  เนินเขา: '/m/09d_r',
  แหล่งน้ำ: '/m/03ktm1',
  แม่น้ำ: '/m/06cnp',
  ชายหาด: '/m/0b3yr',
  ดวงอาทิตย์: '/m/06m_p',
  ดวงจันทร์: '/m/04wv_',
  ท้องฟ้า: '/m/01bqvp',
  ยานพาหนะ: '/m/0k4j',
  รถ: '/m/0k4j',
  จักรยาน: '/m/0199g',
  รถจักรยานยนต์: '/m/04_sv',
  รถปิคอัพ: '/m/0cvq3',
  รถบรรทุกเชิงพาณิชย์: '/m/0fkwjg',
  เรือ: '/m/019jd',
  รถลีมูซีน: '/m/01lcw4',
  แท็กซี่: '/m/0pg52',
  รถโรงเรียน: '/m/02yvhj',
  รสบัส: '/m/01bjv',
  รถก่อสร้าง: '/m/02gx17',
  รูปปั้น: '/m/013_1c',
  น้ำพุ: '/m/0h8lhkg',
  สะพาน: '/m/015kr',
  ท่าเรือ: '/m/01phq4',
  ตึกระฟ้า: '/m/079cl',
  เสาเสา: '/m/01_m7',
  กระจกสี: '/m/011y23',
  บ้าน: '/m/03jm5',
  ตึกอพาร์ตเมนท์: '/m/01nblt',
  ประภาคาร: '/m/04h7h',
  สถานีรถไฟ: '/m/0py27',
  เถ้าถ่าน: '/m/01n6fd',
  ดับเพลิง: '/m/01pns0',
  ป้ายบิลบอร์ด: '/m/01knjb',
  ถนน: '/m/06gfj',
  ทางม้าลาย: '/m/014xcs',
  ไฟจราจร: '/m/015qff',
  ประตูโรงรถ: '/m/08l941',
  ป้ายรถเมล์: '/m/01jw_1',
  กรวยจราจร: '/m/03sy7v',
  เมตรที่จอดรถ: '/m/015qbp',
  บันได: '/m/01lynh',
  ปล่องไฟ: '/m/01jk_4',
  รถแทรกเตอร์: '/m/013xlm',
  รถบัส: '/m/01bjv',
  รถจักรยาน: '/m/0199g',
  หัวก๊อกน้ำดับเพลิง: '/m/01pns0',
  รถยนต์: '/m/0k4j',

  // 土耳其
  dağlarveyatepeler: '/m/09d_r',
  'dur"işaretleri': '/m/02pv19',
  sokakişaretleri: '/m/01mqdt',
  bitkiler: '/m/05s2s',
  ağaçlar: '/m/07j7r',
  Çimen: '/m/08t9c_',
  çalılar: '/m/0gqbt',
  kaktüs: '/m/025_v',
  Palmiyeağaçları: '/m/0cdl1',
  Doğa: '/m/05h0n',
  şelaleler: '/m/0j2kx',
  dağlar: '/m/09d_r',
  tepeler: '/m/09d_r',
  suyunbedenleri: '/m/03ktm1',
  nehirler: '/m/06cnp',
  Sahiller: '/m/0b3yr',
  Güneş: '/m/06m_p',
  Ay: '/m/04wv_',
  gökyüzü: '/m/01bqvp',
  Araçlar: '/m/0k4j',
  arabalar: '/m/0k4j',
  bisikletler: '/m/0199g',
  motosikletler: '/m/04_sv',
  kamyonetler: '/m/0cvq3',
  ticarikamyonlar: '/m/0fkwjg',
  tekneler: '/m/019jd',
  limuzinler: '/m/01lcw4',
  taksiler: '/m/0pg52',
  okulotobüsü: '/m/02yvhj',
  otobüs: '/m/01bjv',
  inşaataracı: '/m/02gx17',
  heykeller: '/m/013_1c',
  çeşmeler: '/m/0h8lhkg',
  köprü: '/m/015kr',
  iskele: '/m/01phq4',
  gökdelen: '/m/079cl',
  sütunsütunları: '/m/01_m7',
  vitray: '/m/011y23',
  ev: '/m/03jm5',
  apartmanbinası: '/m/01nblt',
  hafifev: '/m/04h7h',
  trenistasyonu: '/m/0py27',
  kül: '/m/01n6fd',
  yangınmusluğu: '/m/01pns0',
  reklampanosu: '/m/01knjb',
  yollar: '/m/06gfj',
  yayageçitleri: '/m/014xcs',
  trafikışıkları: '/m/015qff',
  garajkapıları: '/m/08l941',
  otobüsdurakları: '/m/01jw_1',
  trafikKonileri: '/m/03sy7v',
  Parksayacı: '/m/015qbp',
  merdivenler: '/m/01lynh',
  bacalar: '/m/01jk_4',
  traktörler: '/m/013xlm',
  Yangınmusluğu: '/m/01pns0',

  Traktör: '/m/013xlm',
  Trafiklambası: '/m/015qff',
  Motosikletin: '/m/04_sv',
  Baca: '/m/01jk_4',
  Merdiven: '/m/01lynh',
  Dağveyatepe: '/m/09d_r',
  Palmiyeağacı: '/m/0cdl1',
  Yayageçidi: '/m/014xcs',
  Köprü: '/m/015kr',
  Taksi: '/m/0pg52',
  Tekne: '/m/019jd',
  Otobüs: '/m/01bjv',
  Bisiklet: '/m/0199g',
  Motosiklet: '/m/04_sv',
  Taşıt: '/m/0k4j',
  Araba: '/m/0k4j',

  // 日语
  ストップサイン: '/m/02pv19',
  道路標識: '/m/01mqdt',
  植物: '/m/05s2s',
  木: '/m/07j7r',
  草: '/m/08t9c_',
  低木: '/m/0gqbt',
  カクタス: '/m/025_v',
  ヤシの木: '/m/0cdl1',
  自然: '/m/05h0n',
  滝: '/m/0j2kx',
  山: '/m/09d_r',
  丘: '/m/09d_r',
  水域: '/m/03ktm1',
  河川: '/m/06cnp',
  ビーチ: '/m/0b3yr',
  太陽: '/m/06m_p',
  月: '/m/04wv_',
  空: '/m/01bqvp',
  車両: '/m/0k4j',
  自動車: '/m/0k4j',
  車: '/m/0k4j',
  自転車: '/m/0199g',
  オートバイ: '/m/04_sv',
  ピックアップトラック: '/m/0cvq3',
  コマーシャルトラック: '/m/0fkwjg',
  ボート: '/m/019jd',
  リムジン: '/m/01lcw4',
  タクシー: '/m/0pg52',
  スクールバス: '/m/02yvhj',
  バス: '/m/01bjv',
  建設車両: '/m/02gx17',
  彫像: '/m/013_1c',
  噴水: '/m/0h8lhkg',
  橋: '/m/015kr',
  橋脚: '/m/01phq4',
  超高層ビル: '/m/079cl',
  柱または柱: '/m/01_m7',
  ステンドグラス: '/m/011y23',
  家: '/m/03jm5',
  アナパートメントビル: '/m/01nblt',
  灯台: '/m/04h7h',
  でんしゃのりば: '/m/0py27',
  小屋: '/m/01n6fd',
  消火剤: '/m/01pns0',
  アビルボード: '/m/01knjb',
  道路: '/m/06gfj',
  横断歩道: '/m/014xcs',
  信号機: '/m/015qff',
  交通灯: '/m/015qff',
  ガレージドア: '/m/08l941',
  バス停: '/m/01jw_1',
  トラフィックコーン: '/m/03sy7v',
  パーキングメーター: '/m/015qbp',
  階段: '/m/01lynh',
  煙突: '/m/01jk_4',
  トラクター: '/m/013xlm',

  山や丘: '/m/09d_r',

  // 繁体中文: 台湾
  停車標誌: '/m/02pv19',
  路牌: '/m/01mqdt',
  樹木: '/m/07j7r',
  灌木: '/m/0gqbt',
  仙人掌: '/m/025_v',
  棕櫚樹: '/m/0cdl1',
  瀑布: '/m/0j2kx',
  高山或山丘: '/m/09d_r',
  丘陵: '/m/09d_r',
  水體: '/m/03ktm1',
  河流: '/m/06cnp',
  海灘: '/m/0b3yr',
  月亮: '/m/04wv_',
  天空: '/m/01bqvp',
  車輛: '/m/0k4j',
  汽車: '/m/0k4j',
  腳踏車: '/m/0199g',
  自行車: '/m/0199g',
  機車: '/m/04_sv',
  摩托車: '/m/04_sv',
  皮卡車: '/m/0cvq3',
  商用卡車: '/m/0fkwjg',
  船: '/m/019jd',
  豪華轎車: '/m/01lcw4',
  出租車: '/m/0pg52',
  校車: '/m/02yvhj',
  公車: '/m/01bjv',
  公共汽車: '/m/01bjv',
  施工車輛: '/m/02gx17',
  雕像: '/m/013_1c',
  噴泉: '/m/0h8lhkg',
  橋梁: '/m/015kr',
  碼頭: '/m/01phq4',
  摩天大樓: '/m/079cl',
  柱子或柱子: '/m/01_m7',
  彩色玻璃: '/m/011y23',
  房子: '/m/03jm5',
  公寓樓: '/m/01nblt',
  燈塔: '/m/04h7h',
  火車站: '/m/0py27',
  一棚: '/m/01n6fd',
  消防栓: '/m/01pns0',
  廣告牌: '/m/01knjb',
  行人穿越道: '/m/014xcs',
  人行橫道: '/m/014xcs',
  紅綠燈: '/m/015qff',
  車庫門: '/m/08l941',
  巴士站: '/m/01jw_1',
  交通錐: '/m/03sy7v',
  停車場計價表: '/m/015qbp',
  樓梯: '/m/01lynh',
  煙囪: '/m/01jk_4',
  拖拉機: '/m/013xlm',

  // 繁体中文：香港
  電單車: '/m/04_sv',
  單車: '/m/0199g',
  巴士: '/m/01bjv',
  十字路口: '/m/014xcs',
  交通燈: '/m/015qff',
  斑馬線: '/m/014xcs',
  計程車: '/m/0pg52',
  的士: '/m/0pg52',
  船隻: '/m/019jd',
  山峰或山: '/m/09d_r',
  橋樑: '/m/015kr',

  // 俄语
  'стоп-сигналы': '/m/02pv19',
  'дорожные знаки': '/m/01mqdt',
  растения: '/m/05s2s',
  деревья: '/m/07j7r',
  кустарники: '/m/0gqbt',
  'пальмовые деревья': '/m/0cdl1',
  природа: '/m/05h0n',
  водопады: '/m/0j2kx',
  холмы: '/m/09d_r',
  водоемы: '/m/03ktm1',
  реки: '/m/06cnp',
  пляжи: '/m/0b3yr',
  солнце: '/m/06m_p',
  Луна: '/m/04wv_',
  небо: '/m/01bqvp',
  'транспортные средства': '/m/0k4j',
  машины: '/m/0k4j',
  велосипеды: '/m/0199g',
  мотоциклы: '/m/04_sv',
  пикапы: '/m/0cvq3',
  'коммерческие грузовики': '/m/0fkwjg',
  лодки: '/m/019jd',
  лимузины: '/m/01lcw4',
  Таксис: '/m/0pg52',
  'школьный автобус': '/m/02yvhj',
  автобус: '/m/01bjv',
  'строительная машина': '/m/02gx17',
  статуи: '/m/013_1c',
  фонтаны: '/m/0h8lhkg',
  пирс: '/m/01phq4',
  небоскреб: '/m/079cl',
  'столбыили колонны': '/m/01_m7',
  витраж: '/m/011y23',
  'многоквартирный дом': '/m/01nblt',
  'светлый дом': '/m/04h7h',
  'железнодорожная станция': '/m/0py27',
  пепельный: '/m/01n6fd',
  'пожарный гидрант': '/m/01pns0',
  'рекламный щит': '/m/01knjb',
  дороги: '/m/06gfj',
  'пешеходные переходы': '/m/014xcs',
  светофор: '/m/015qff',
  'гаражные ворота': '/m/08l941',
  'автобусные остановки': '/m/01jw_1',
  конусы: '/m/03sy7v',
  'парковочные счетчики': '/m/015qbp',
  лестница: '/m/01lynh',
  дымоходы: '/m/01jk_4',
  тракторы: '/m/013xlm',

  автомобили: '/m/0k4j',
  горыилихолмы: '/m/09d_r',
  светофоры: '/m/015qff',
  транспортныесредства: '/m/0k4j',
  пешеходныепереходы: '/m/014xcs',
  пожарныегидранты: '/m/01pns0',
  лестницы: '/m/01lynh',
  гидрантами: '/m/01pns0',
  автобусы: '/m/01bjv',
  дымовыетрубы: '/m/01jk_4',
  трактора: '/m/013xlm',
  такси: '/m/0pg52',
  мостами: '/m/015kr',

  // 乌克兰语
  горичипагорби: '/m/09d_r',
  знакизупинки: '/m/02pv19',
  дорожнізнаки: '/m/01mqdt',
  рослини: '/m/05s2s',
  дерева: '/m/07j7r',
  чагарники: '/m/0gqbt',
  пальмовідерева: '/m/0cdl1',
  водоспади: '/m/0j2kx',
  гори: '/m/09d_r',
  пагорби: '/m/09d_r',
  водойми: '/m/03ktm1',
  річки: '/m/06cnp',
  пляжі: '/m/0b3yr',
  сонце: '/m/06m_p',
  Місяць: '/m/04wv_'
}, (0, _defineProperty3.default)(_jsonall, '\u043D\u0435\u0431\u043E', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u0456\u0437\u0430\u0441\u043E\u0431\u0438', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u0456\u0432', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0432\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434\u0438', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u043C\u043E\u0442\u043E\u0446\u0438\u043A\u043B\u0438', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u043F\u0456\u043A\u0430\u043F\u0438', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, '\u043A\u043E\u043C\u0435\u0440\u0446\u0456\u0439\u043D\u0456\u0432\u0430\u043D\u0442\u0430\u0436\u0456\u0432\u043A\u0438', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u0447\u043E\u0432\u043D\u0438', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u043B\u0456\u043C\u0443\u0437\u0438\u043D\u0438', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u0442\u0430\u043A\u0441\u0456', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u0448\u043A\u0456\u043B\u044C\u043D\u0438\u0439\u0430\u0432\u0442\u043E\u0431\u0443\u0441', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\u0430\u0432\u0442\u043E\u0431\u0443\u0441', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u0431\u0443\u0434\u0456\u0432\u0435\u043B\u044C\u043D\u0438\u0439\u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u044C', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0442\u0430\u0442\u0443\u0457', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u0444\u043E\u043D\u0442\u0430\u043D\u0438', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, '\u043C\u0456\u0441\u0442', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u043F\u0440\u0438\u0441\u0442\u0430\u043D\u044C', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, '\u0445\u043C\u0430\u0440\u043E\u0447\u043E\u0441', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0442\u043E\u0432\u043F\u0438\u0430\u0431\u043E\u043A\u043E\u043B\u043E\u043D\u0438', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u0432\u0456\u0442\u0440\u0430\u0436\u043D\u0435\u0441\u043A\u043B\u043E', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u0431\u0443\u0434\u0438\u043D\u043E\u043A', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u0431\u0430\u0433\u0430\u0442\u043E\u043A\u0432\u0430\u0440\u0442\u0438\u0440\u043D\u0438\u0439\u0431\u0443\u0434\u0438\u043D\u043E\u043A', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0432\u0456\u0442\u043B\u0438\u0439\u0431\u0443\u0434\u0438\u043D\u043E\u043A', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, '\u0437\u0430\u043B\u0456\u0437\u043D\u0438\u0447\u043D\u0430\u0441\u0442\u0430\u043D\u0446\u0456\u044F', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, '\u043F\u043E\u043F\u0456\u043B', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u0432\u043E\u0433\u043D\u0435\u0433\u0456\u0434\u0440\u0430\u043D\u0442', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0431\u0456\u043B\u0431\u043E\u0440\u0434', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, '\u0434\u043E\u0440\u043E\u0433\u0438', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u043F\u0456\u0448\u043E\u0445\u0456\u0434\u043D\u0456\u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0438', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0432\u0456\u0442\u043B\u043E\u0444\u043E\u0440', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u0433\u0430\u0440\u0430\u0436\u043D\u0456\u0434\u0432\u0435\u0440\u0456', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u0430\u0432\u0442\u043E\u0431\u0443\u0441\u043D\u0456\u0437\u0443\u043F\u0438\u043D\u043A\u0438', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, '\u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u0456\u043A\u043E\u043D\u0443\u0441\u0438', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u043F\u0430\u0440\u043A\u043E\u043C\u0430\u0442\u0438', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0445\u043E\u0434\u0438', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u0434\u0438\u043C\u0430\u0440\u0456', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u0442\u0440\u0430\u043A\u0442\u043E\u0440\u0438', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0456\u043B\u0456', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0433\u043E\u0440\u0438\u0447\u0438\u043F\u0430\u0433\u043E\u0440\u0431\u0438', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u0456\u0437\u0430\u0441\u043E\u0431\u0438', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u043A\u043E\u043C\u0438\u043D\u0438', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u043F\u0456\u0448\u043E\u0445\u0456\u0434\u043D\u0456\u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0438', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0432\u0456\u0442\u043B\u043E\u0444\u043E\u0440\u0438', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u043C\u043E\u0441\u0442\u0438', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u043F\u043E\u0436\u0435\u0436\u043D\u0438\u0439\u0433\u0456\u0434\u0440\u0430\u043D\u0442', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u043F\u0430\u043B\u044C\u043C\u0438', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u0430\u0432\u0442\u043E\u0431\u0443\u0441\u0438', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u0441\u0443\u0434\u043D\u0430', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u043F\u043E\u0436\u0435\u0436\u043D\u0456\u0433\u0456\u0434\u0440\u0430\u043D\u0442\u0438', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'monta\xF1asocolinas', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'se\xF1alesdealto', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'Se\xF1alesdetransito', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'plantas', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\xE1rboles', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'c\xE9sped', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'arbustos', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'cactus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'palmeras', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'naturaleza', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'cascadas', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'monta\xF1as', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'sierras', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'cuerposdeagua', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'r\xEDos', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'playas', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'sol', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Luna', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'cielo', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'veh\xEDculos', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'coches', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'bicicletas', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'motocicletas', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'camionetas', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'camionescomerciales', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'barcos', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limusinas', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'Taxis', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'autob\xFAsescolar', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'autob\xFAs', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'veh\xEDculodeconstrucci\xF3n', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'estatuas', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'fuentes', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'puente', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'muelle', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'rascacielos', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'pilaresocolumnas', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'Vitral', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'casa', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'Unedificiodeapartamentos', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'casaligera', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'estaci\xF3ndetren', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'cenizas', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'unabocadeincendios', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'cartelera', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'carreteras', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'crucesdepeatones', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'sem\xE1foros', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'puertasdegaraje', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'paradasdeautobus', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'conosdetr\xE1fico', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'parqu\xEDmetros', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'escalera', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'chimeneas', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'tractores', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'pasosdepeatones', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'autobuses', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'puentes', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'escaleras', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'bocasdeincendios', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'montagnesoucollines', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, "panneauxd'arrêt", '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'panneauxdesignalisation', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'lesplantes', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'desarbres', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'gazon', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'arbustes', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'cactus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'palmiers', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'lanature', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'cascades', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'montagnes', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'collines', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, "corpsd'eau", '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'rivi\xE8res', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'desplages', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'soleil', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Lune', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'ciel', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'V\xE9hicules', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'voitures', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'V\xE9los', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'motocyclettes', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'camionnettes', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'camionscommerciaux', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'bateaux', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limousines', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'Taxis', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'busscolaire', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'bus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'v\xE9hiculedeconstruction', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'statues', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'fontaines', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'pont', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'jet\xE9e', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'gratte-ciel', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'piliersoucolonnes', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'vitrail', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'loger', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'unimmeuble', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'maisonlumineuse', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'gare', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'encendres', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, "unebouched'incendie", '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, "unpanneaud'affichage", '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'routes', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'passagespourpi\xE9tons', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'feuxdecirculation', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'portesdegarage', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, "arrêtsd'autobus", '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'c\xF4nesdesignalisation', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'parcom\xE8tres', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'escaliers', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'chemin\xE9es', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'tracteurs', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'v\xE9hicules', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, "bouchesd'incendie", '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'v\xE9los', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'ponts', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, "borned'incendie", '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'motos', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'BergeoderH\xFCgel', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'StoppSchilder', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'Stra\xDFenschilder', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'Pflanzen', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'B\xE4ume', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'Gras', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'Str\xE4ucher', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'Kaktus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'Palmen', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'Natur', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'Wasserf\xE4lle', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'Berge', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'H\xFCgel', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'Wasserk\xF6rper', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'Fl\xFCsse', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'Str\xE4nde', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'Sonne', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Mond', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'Himmel', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'Fahrzeuge', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'Autos', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'Fahrr\xE4der', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'Motorr\xE4der', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'Pickups', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'Nutzfahrzeuge', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'Boote', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'Limousinen', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'Taxen', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'Schulbus', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'Bus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'Baufahrzeug', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'Statuen', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'Brunnen', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'Br\xFCcke', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'Seebr\xFCcke', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'Wolkenkratzer', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'S\xE4ulenoderS\xE4ulen', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'Buntglas', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'Haus', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'einWohnhaus', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'Leuchtturm', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'Bahnhof', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'einSchuppen', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'einHydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'eineWerbetafel', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'Stra\xDFen', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'Zebrastreifen', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'Ampeln', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'Garagentore', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'Bushaltestellen', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'Leitkegel', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'Parkuhren', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'Treppe', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'Schornsteine', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'Traktoren', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'Treppen(stufen)', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'BergenoderH\xFCgeln', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'Fahrzeugen', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'Hydranten', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'Zweir\xE4dern', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'Fahrr\xE4dern', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'Fu\xDFg\xE4nger\xFCberwegen', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'Pkws', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'Schornsteinen', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'Motorr\xE4dern', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'Bussen', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'Br\xFCcken', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'Booten', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'Feuerhydranten', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u062C\u0628\u0627\u0644\u0623\u0648\u0627\u0644\u062A\u0644\u0627\u0644', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0639\u0644\u0627\u0645\u0627\u062A\u0627\u0644\u062A\u0648\u0642\u0641', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, '\u0644\u0627\u0641\u062A\u0627\u062A\u0627\u0644\u0634\u0648\u0627\u0631\u0639', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0646\u0628\u0627\u062A\u0627\u062A', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0623\u0634\u062C\u0627\u0631', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, '\u0639\u0634\u0628', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0634\u062C\u064A\u0631\u0627\u062A', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, '\u0635\u0628\u0627\u0631', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, '\u0623\u0634\u062C\u0627\u0631\u0627\u0644\u0646\u062E\u064A\u0644', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u0637\u0628\u064A\u0639\u0629\u0633\u062C\u064A\u0629', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0634\u0644\u0627\u0644\u0627\u062A', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u062C\u0628\u0627\u0644', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u062A\u0644\u0627\u0644', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0645\u0633\u0637\u062D\u0627\u062A\u0627\u0644\u0645\u0627\u0626\u064A\u0629', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0623\u0646\u0647\u0627\u0631', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0634\u0648\u0627\u0637\u0626', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0634\u0645\u0633', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0642\u0645\u0631', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, '\u0633\u0645\u0627\u0621', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0631\u0643\u0628\u0627\u062A', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0633\u064A\u0627\u0631\u0627\u062A', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u0627\u062C\u0627\u062A', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u0627\u062C\u0627\u062A\u0646\u0627\u0631\u064A\u0629', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u0634\u0627\u062D\u0646\u0627\u062A\u0635\u063A\u064A\u0631\u0629', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, '\u0634\u0627\u062D\u0646\u0627\u062A\u062A\u062C\u0627\u0631\u064A\u0629', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0642\u0648\u0627\u0631\u0628', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u0633\u064A\u0627\u0631\u0627\u062A\u0627\u0644\u0644\u064A\u0645\u0648\u0632\u064A\u0646', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u0633\u064A\u0627\u0631\u0627\u062A\u0627\u0644\u0623\u062C\u0631\u0629', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u0628\u0627\u0635\u0627\u0644\u0645\u062F\u0631\u0633\u0629', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\u0623\u0648\u062A\u0648\u0628\u064A\u0633', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0631\u0643\u0628\u0629\u0627\u0644\u0628\u0646\u0627\u0621', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u062A\u0645\u0627\u062B\u064A\u0644', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u0646\u0648\u0627\u0641\u064A\u0631', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, '\u0643\u0648\u0628\u0631\u064A', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0631\u0635\u064A\u0641\u0628\u062D\u0631\u064A', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, '\u0646\u0627\u0637\u062D\u0629\u0633\u062D\u0627\u0628', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, '\u0623\u0639\u0645\u062F\u0629\u0627\u0644\u0623\u0639\u0645\u062F\u0629', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u0632\u062C\u0627\u062C\u0645\u0644\u0648\u0646', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u0628\u064A\u062A', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0628\u0646\u0649\u0633\u0643\u0646\u064A', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0646\u0627\u0631\u0629', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, '\u0645\u062D\u0637\u0629\u0627\u0644\u0642\u0637\u0627\u0631', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, '\u0623\u0634\u064A\u062F', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u0637\u0641\u0627\u064A\u0629\u062D\u0631\u064A\u0642', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'abillboard', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0637\u0631\u0642', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0645\u0631\u0627\u062A\u0627\u0644\u0645\u0634\u0627\u0629', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0625\u0634\u0627\u0631\u0627\u062A\u0627\u0644\u0645\u0631\u0648\u0631', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0631\u0622\u0628', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u0645\u062D\u0637\u0627\u062A\u0627\u0644\u062D\u0627\u0641\u0644\u0627\u062A', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u0623\u0642\u0645\u0627\u0639\u0627\u0644\u0645\u0631\u0648\u0631\u064A\u0629', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u0639\u062F\u0627\u062F\u0627\u062A\u0645\u0648\u0627\u0642\u0641\u0627\u0644\u0633\u064A\u0627\u0631\u0627\u062A', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u062C', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u0645\u062F\u0627\u062E\u0646', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u0627\u0644\u062C\u0631\u0627\u0631\u0627\u062A', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u0635\u0646\u0627\u0628\u064A\u0631\u0625\u0637\u0641\u0627\u0621\u062D\u0631\u0627\u0626\u0642', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0625\u0634\u0627\u0631\u0627\u062A\u0645\u0631\u0648\u0631', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u062D\u0627\u0641\u0644\u0629', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u0651\u0627\u062C\u0627', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u0651\u0627\u062C\u0627\u062A', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0633\u064A\u0627\u0631\u0627\u062A\u0623\u062C\u0631\u0629', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u062C\u0633\u0648\u0631', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u062F\u064E\u0631\u064E\u062C', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u0645\u062F\u0627\u062E\u0650\u0646', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u0627\u062C\u0627\u062A\u0647\u0648\u0627\u0626\u064A\u0629', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0645\u0631\u0651\u0627\u062A\u0644\u0644\u0645\u0634\u0627\u0629', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0645\u062D\u0628\u0633\u0625\u0637\u0641\u0627\u0621\u062D\u0631\u064A\u0642', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0633\u064A\u0627\u0631\u0629\u0623\u062C\u0631\u0629', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u0642\u0648\u0627\u0631\u0628', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u062C\u0628\u0627\u0644\u0623\u0648\u062A\u0644\u0627\u0644', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u062C\u0631\u0627\u0631\u0627\u062A', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u0623\u0634\u062C\u0627\u0631\u0646\u062E\u064A\u0644', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u0645\u0646\u0627\u0637\u0642\u0639\u0628\u0648\u0631\u0645\u0634\u0627\u0629', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u062D\u0627\u0641\u0644\u0627\u062A', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u062F\u0631\u0651\u0627\u062C\u0627\u062A\u0628\u062E\u0627\u0631\u064A\u0629', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u062C\u0631\u0651\u0627\u0631\u0627\u062A', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0939\u093E\u0921\u093C\u092F\u093E\u092A\u0939\u093E\u0921\u093C\u093F\u092F\u093E\u0901', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0938\u094D\u091F\u0949\u092A\u0938\u093E\u0907\u0928\u094D\u0938', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, '\u0938\u0921\u093C\u0915\u0915\u0947\u0938\u0902\u0915\u0947\u0924', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, '\u092A\u094C\u0927\u094B\u0902', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0947\u0921\u093C', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, '\u0918\u093E\u0938', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, '\u091D\u093E\u0921\u093C\u093F\u092F\u093E\u0902', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, '\u0915\u0948\u0915\u094D\u091F\u0938', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, '\u0916\u091C\u0942\u0930\u0915\u0947\u092A\u0947\u0921\u093C', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u092A\u094D\u0930\u0915\u0943\u0924\u093F', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, '\u091D\u0930\u0928\u0947', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0939\u093E\u0921\u093C\u094B\u0902', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0939\u093F\u0932\u094D\u0938', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u091C\u0932\u0928\u093F\u0915\u093E\u092F\u094B\u0902', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, '\u0928\u0926\u093F\u092F\u094B\u0902', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, '\u0938\u092E\u0941\u0926\u094D\u0930\u0924\u091F\u094B\u0902', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, '\u0930\u0935\u093F', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, '\u091A\u0902\u0926\u094D\u0930\u092E\u093E', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, '\u0906\u0915\u093E\u0936', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u0935\u093E\u0939\u0928\u094B\u0902', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0915\u093E\u0930\u094B\u0902', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0938\u093E\u0907\u0915\u093F\u0932\u0947\u0902', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u092E\u094B\u091F\u0930\u0938\u093E\u0907\u0915\u093F\u0932\u0947\u0902', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u0922\u094B\u0928\u0947\u0935\u093E\u0932\u0947\u091F\u094D\u0930\u0915\u094B\u0902', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, '\u0935\u093E\u0923\u093F\u091C\u094D\u092F\u093F\u0915\u091F\u094D\u0930\u0915', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u0928\u094C\u0915\u093E\u0913\u0902', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limousines', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u091F\u0948\u0915\u094D\u0938\u0940', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u0938\u094D\u0915\u0942\u0932\u092C\u0938', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\u092C\u0938', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u0928\u093F\u0930\u094D\u092E\u093E\u0923\u0935\u093E\u0939\u0928', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u092E\u0942\u0930\u094D\u0924\u093F\u092F\u094B\u0902', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u092B\u0935\u094D\u0935\u093E\u0930\u0947', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0941\u0932', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0918\u093E\u091F', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, '\u0917\u0917\u0928\u091A\u0941\u0902\u092C\u0940\u0907\u092E\u093E\u0930\u0924', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, '\u0938\u094D\u0924\u0902\u092D\u092F\u093E\u0938\u094D\u0924\u0902\u092D', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u0930\u0902\u0917\u0940\u0928\u0915\u093E\u0902\u091A', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u092E\u0915\u093E\u0928', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u0905\u092A\u093E\u0930\u094D\u091F\u092E\u0947\u0902\u091F\u0907\u092E\u093E\u0930\u0924', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, '\u0932\u093E\u0907\u091F\u0939\u093E\u0909\u0938', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, '\u0930\u0947\u0932\u0935\u0947\u0938\u094D\u091F\u0947\u0936\u0928', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, '\u090F\u0915\u091B\u092A\u094D\u092A\u0930', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u0905\u0917\u094D\u0928\u093F\u0939\u093E\u0907\u0921\u094D\u0930\u0947\u0902\u091F', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u092C\u093F\u0932\u092C\u094B\u0930\u094D\u0921', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, '\u0938\u0921\u093C\u0915\u0947\u0902', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u0915\u094D\u0930\u0949\u0938\u0935\u0949\u0915', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u092F\u093E\u0924\u093E\u092F\u093E\u0924\u092C\u0924\u094D\u0924\u093F\u092F\u093E', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u0917\u0948\u0930\u0947\u091C\u0915\u0947\u0926\u0930\u0935\u093E\u091C\u0947', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u092C\u0938\u0930\u0942\u0915\u0928\u0947\u0915\u0940\u091C\u0917\u0939', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, '\u091F\u094D\u0930\u0948\u092B\u093F\u0915\u0915\u094B\u0928\u0938', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u092A\u093E\u0930\u094D\u0915\u093F\u0902\u0917\u092E\u0940\u091F\u0930', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u0938\u0940\u0922\u093C\u093F\u092F\u093E\u0902', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u091A\u093F\u092E\u0928\u093F\u092F\u093E\u0902', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u091F\u094D\u0930\u0948\u0915\u094D\u091F\u0930', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u0905\u0917\u094D\u0928\u093F\u0936\u093E\u092E\u0915\u0939\u093E\u0908\u0921\u094D\u0930\u0947\u0902\u091F', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0948\u0926\u0932\u092A\u093E\u0930\u092A\u0925', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u091F\u094D\u0930\u0948\u092B\u093C\u093F\u0915\u0932\u093E\u0907\u091F', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0941\u0932\u094B\u0902', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0938\u0940\u095D\u093F\u092F\u094B\u0902', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u092A\u0939\u093E\u0921\u093C\u092F\u093E\u092A\u0939\u093E\u0921\u093C\u0940', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0935\u093E\u0939\u0928', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u092E\u094B\u091F\u0930\u0938\u093E\u0907\u0915\u0932', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u0938\u093E\u0907\u0915\u0932', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u091A\u093F\u092E\u0928\u0940', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u0938\u093E\u0907\u0915\u0932\u094B\u0902', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'bergenofheuvels', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'stoptekens', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'verkeersborden', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'planten', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'bomen', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'gras', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'struiken', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'cactus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'palmbomen', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'natuur', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'watervallen', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'bergen', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'heuvels', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'waterlichamen', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'rivieren', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'stranden', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'zon', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Maan', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'lucht', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'voertuigen', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, "auto's", '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'fietsen', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'motorfietsen', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'pick-uptrucks', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'commerci\xEBlevrachtwagens', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'boten', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limousines', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, "taxi's", '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'schoolbus', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'bus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'bouwvoertuig', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'standbeelden', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'fonteinen', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'brug', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'pier', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'wolkenkrabber', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'pijlersofkolommen', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'glas-in-lood', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'huis', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'eenappartementsgebouw', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'vuurtoren', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'treinstation', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'indeasgelegd', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'brandkraan', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'prikbord', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'wegen', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'zebrapaden', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'verkeerslichten', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'garagedeuren', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'busstopt', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'verkeerskegels', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'parkeermeters', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'trap', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'schoorstenen', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'tractoren', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'eenbrandkraan', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'trappen', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'eenbrandkraan', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'oversteekplaatsen', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'bussen', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'bussen', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'bruggen', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'gunungataubukit', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'tandaberhenti', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'rambujalan', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'tanaman', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'pohon', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'rumput', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'semakbelukar', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'kaktus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'pohon-pohonpalem', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'alam', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'airterjun', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'pegunungan', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'bukit', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'badanair', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'sungai', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'pantai', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'matahari', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Bulan', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'langit', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'kendaraan', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'mobil', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'sepeda', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'sepedamotor', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'trukpickup', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'trukkomersial', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'perahu', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limusin', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'taksi', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'bussekolah', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'bis', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'kendaraankonstruksi', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'patung', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'airmancur', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'menjembatani', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'dermaga', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'gedungpencakarlangit', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'pilarataukolom', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'kacaberwarna', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'rumah', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'sebuahgedungapartemen', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'rumahcahaya', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'Stasiunkereta', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'pucat', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'pemadamkebakaran', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'papanreklame', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'jalan', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'penyeberangan', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'lampulalulintas', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'pintugarasi', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'haltebus', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'kerucutlalulintas', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'meteranparkir', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'tangga', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'cerobong', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'traktor', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'hidrankebakaran', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'jembatan', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'zebracross', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'motor', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'cerobongasap', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'pohonpalem', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'montanhasoucolinas', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'sinaisdeparada', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'Sinaisdetransito', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'plantas', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\xE1rvores', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'Relva', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'arbustos', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'cacto', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'Palmeiras', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'natureza', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'cachoeiras', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'montanhas', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'Colinas', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'corposde\xE1gua', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'rios', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'praias', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'sol', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Lua', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'c\xE9u', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 've\xEDculos', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'carros', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'bicicletas', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'motocicletas', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'Caminh\xF5es', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'caminh\xF5escomerciais', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'barcos', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limusines', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'T\xE1xis', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\xF4nibusescolar', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\xF4nibus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 've\xEDculodeconstru\xE7\xE3o', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'est\xE1tuas', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'fontes', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'Ponte', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'cais', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'arranha-céu', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'pilaresoucolunas', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'vitrais', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'lar', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'umpr\xE9diodeapartamentos', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'casadeluz', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'esta\xE7\xE3odetrem', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'cinza', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'hidrante', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'quadrodeavisos', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'estradas', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'faixasdepedestres', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'luzesdetr\xE2nsito', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'portasdegaragem', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'pontode\xF4nibus', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'Conesdetr\xE1fego', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'parqu\xEDmetros', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'escadaria', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'chamin\xE9s', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'tratores', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'escadas', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'faixasdepedestre', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'palmeiras', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'umhidrante', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'pontes', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 't\xE1xis', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'hidrantes', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'hidrantes', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'n\xFAiho\u1EB7c\u0111\u1ED3i', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0111i\u1EC3md\u1EEBng', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, '\u0111\u01B0\u1EDDngph\u1ED1', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'c\xE2y', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'b\xE3ic\u1ECF', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'c\xE2yb\u1EE5i', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'c\xE2yx\u01B0\u01A1ngr\u1ED3ng', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'c\xE2yc\u1ECD', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'Thi\xEAnnhi\xEAn', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'th\xE1cn\u01B0\u1EDBc', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'n\xFAinon', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0111\u1ED3in\xFAi', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'ngu\u1ED3nn\u01B0\u1EDBc', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 's\xF4ng', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'b\xE3ibi\u1EC3n', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'm\u1EB7ttr\u1EDDi', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'M\u1EB7ttr\u0103ng', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'b\u1EA7utr\u1EDDi', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'xec\u1ED9', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\xF4t\xF4', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'xe\u0111\u1EA1p', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'xem\xE1y', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'xeb\xE1nt\u1EA3i', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'xet\u1EA3ith\u01B0\u01A1ngm\u1EA1i', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'thuy\u1EC1n', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'xelimousine', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'taxi', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'xebu\xFDtc\u1EE7atr\u01B0\u1EDDng', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'xebu\xFDt', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'xex\xE2yd\u1EF1ng', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'nh\u1EEFngb\u1EE9ct\u01B0\u1EE3ng', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u0111\xE0iphunn\u01B0\u1EDBc', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'c\u1EA7u', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0111\xEA', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 't\xF2anh\xE0ch\u1ECDctr\u1EDDi', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'c\u1ED9ttr\u1EE5', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'k\xEDnhm\xE0u', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'nh\xE0\u1EDF', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 't\xF2anh\xE0chungc\u01B0', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'ng\xF4inh\xE0\xE1nhs\xE1ng', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'gaxel\u1EEDa', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'trot\xE0n', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'afirehydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'abillboard', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'nh\u1EEFngcon\u0111\u01B0\u1EDDng', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'b\u0103ngqua\u0111\u01B0\u1EDDng', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0111\xE8ngiaoth\xF4ng', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'nh\xE0\u0111\u1EC3xe', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'tr\u1EA1md\u1EEBngxebu\xFDt', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'giaoth\xF4ng', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u0111\u1ED3ngh\u1ED3\u0111\u1ED7xe', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'c\u1EA7uthang', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u1ED1ngkh\xF3i', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'm\xE1yk\xE9o', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'v\u1EA1chqua\u0111\u01B0\u1EDDng', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'xeh\u01A1i', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'tr\u1EE5c\u1EA5pn\u01B0\u1EDBcch\u1EEFach\xE1y', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'v\xF2il\u1EA5yn\u01B0\u1EDBcch\u1EEFach\xE1y', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'xeg\u1EAFnm\xE1y', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'bundokoburol', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'stopsigns', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'Tandangmgakalye', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'halaman', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'mgapuno', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'damo', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'mgapalumpong', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'cactus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'mgapunongpalma', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'kalikasan', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'talon', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'mgabundok', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'mgaburol', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'anyongtubig', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'mgailog', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'mgabeach', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'Araw', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Buwan', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'langit', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'mgasasakyan', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'mgabisikleta', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'mgamotorsiklo', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'mgapickuptruck', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'mgakomersyalnatrak', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'mgabangka', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'mgalimousine', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'mgataxi', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'busngeskwelahan', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'bus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'sasakyangpang-konstruksyon', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'mgaestatwa', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'mgafountain', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'tulay', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'pier', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'napakataasnagusali', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'mgahaligiohaligi', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'minantsahangsalamin', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'bahay', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'gusalingisangapartment', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'ilawnabahay', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'istasyonngtren', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'abo', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'afirehydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'abillboard', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'mgakalsada', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'mgatawiran', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'ilawtrapiko', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'mgagarageddoor', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'hintuanngbus', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'mgatrafficcone', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'metrongparadahan', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'hagdan', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'mgatsimenea', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'mgatraktora', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'mgacrosswalk', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'mgailaw-trapiko', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'firehydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'mgakotse', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'mgachimney', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'mgapalmtree', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'mgahagdan', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'mgabus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'mgafirehydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'mgatulay', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0E9E\u0EB9\u0EC0\u0E82\u0EBB\u0EB2\u0EAB\u0EBC\u0EB7\u0EC0\u0E99\u0EB5\u0E99\u0E9E\u0EB9', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0E9B\u0EC9\u0EB2\u0E8D\u0EA2\u0EB8\u0E94', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, '\u0E9B\u0EC9\u0EB2\u0E8D\u0E96\u0EB0\u0EDC\u0EBB\u0E99', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, '\u0E9E\u0EB7\u0E94', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\u0E95\u0EBB\u0EC9\u0E99\u0EC4\u0EA1\u0EC9', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, '\u0EAB\u0E8D\u0EC9\u0EB2', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, '\u0EC4\u0EA1\u0EC9\u0E9E\u0EB8\u0EC8\u0EA1', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, '\u0E81\u0EB0\u0E97\u0EBD\u0EA1', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, '\u0EC4\u0EA1\u0EC9\u200B\u0EA2\u0EB7\u0E99\u200B\u0E95\u0EBB\u0EC9\u0E99\u200B\u0E9B\u0EB2\u0EA1', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u0E97\u0ECD\u0EB2\u0EA1\u0EB0\u0E8A\u0EB2\u0E94', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, '\u0E99\u0EC9\u0EB3\u0E95\u0EBB\u0E81\u0E95\u0EB2\u0E94', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, '\u0E9E\u0EB9\u0EC0\u0E82\u0EBB\u0EB2', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0EC0\u0E99\u0EB5\u0E99\u200B\u0E9E\u0EB9', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0EAE\u0EC8\u0EB2\u0E87\u0E81\u0EB2\u0E8D\u0E82\u0EAD\u0E87\u0E99\u0EC9\u0ECD\u0EB2', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, '\u0EC1\u0EA1\u0EC8\u0E99\u0EC9\u0EB3', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, '\u0EAB\u0EB2\u0E94\u0E8A\u0EB2\u0E8D', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, '\u0E95\u0EB2\u0EC0\u0EA7\u0EB1\u0E99', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, '\u0E94\u0EA7\u0E87\u0E88\u0EB1\u0E99', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, '\u0E97\u0EAD\u0E87\u0E9F\u0EC9\u0EB2', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u0E9E\u0EB2\u0EAB\u0EB0\u0E99\u0EB0', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0E96\u0EB5\u0E9A', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0E88\u0EB1\u0E81', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0E81\u0EB0\u0E9A\u0EB0', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0E9A\u0EB1\u0E99\u0E97\u0EB8\u0E81\u0E81\u0EB2\u0E99\u0E84\u0EC9\u0EB2', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u0EC0\u0EAE\u0EB7\u0EAD', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0EA5\u0EB5\u0EA1\u0EB9\u0E8A\u0EB5\u0E99', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u0EC1\u0E97\u0EB1\u0E81\u0E8A\u0EB5', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u200B\u0EC0\u0EA1\u200B\u0EC2\u0EAE\u0E87\u200B\u0EAE\u0EBD\u0E99', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0EC0\u0EA1', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u0E9E\u0EB2\u0EAB\u0EB0\u0E99\u0EB0\u0E81\u0ECD\u0EC8\u0EAA\u0EC9\u0EB2\u0E87', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u0EAE\u0EB9\u0E9A\u0E9B\u0EB1\u0EC9\u0E99', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u0E99\u0EC9\u0EB3\u0E9E\u0EB8', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, '\u0E82\u0EBB\u0EA7', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u0E97\u0EC8\u0EB2\u0EC0\u0EAE\u0EB7\u0EAD', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, '\u0E95\u0EB6\u0E81\u0EAA\u0EB9\u0E87', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, '\u0E96\u0EB1\u0E99\u0EC0\u0EAA\u0EBB\u0EB2', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u0EC1\u0E81\u0EC9\u0EA7\u0EAA\u0EB5', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u0EC0\u0EAE\u0EB7\u0EAD\u0E99', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u0E95\u0EB6\u0E81\u0EAD\u0EB2\u0E9E\u0EB2\u0E94\u0EC0\u0EA1\u0EB1\u0E99', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, '\u0EC0\u0EAE\u0EB7\u0EAD\u0E99\u0EC1\u0EAA\u0E87\u0EAA\u0EB0\u0EAB\u0EA7\u0EC8\u0EB2\u0E87', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, '\u0EAA\u0EB0\u0E96\u0EB2\u0E99\u0EB5\u0EA5\u0EBB\u0E94\u0EC4\u0E9F', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, '\u0E82\u0EB5\u0EC9\u0EC0\u0E97\u0EBB\u0EC8\u0EB2', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u0E99\u0ECD\u0EC9\u0EB2\u0E94\u0EB1\u0E9A\u0EC0\u0E9E\u0EB5\u0E87', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0E9B\u0EC9\u0EB2\u0E8D\u0EC2\u0E84\u0EAA\u0EB0\u0E99\u0EB2', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, '\u0E96\u0EB0\u0EDC\u0EBB\u0E99\u0EAB\u0EBB\u0E99\u0E97\u0EB2\u0E87', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u0E97\u0EB2\u0E87\u0E82\u0EC9\u0EB2\u0EA1', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0EC4\u0E9F\u200B\u0EAD\u0ECD\u0EB2\u200B\u0E99\u0EB2\u0E94', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'garagedoors', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u0E9B\u0EC9\u0EB2\u0E8D\u0EA5\u0EBB\u0E94\u0EC0\u0EA1', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, '\u0EC2\u0E84\u0E99\u0E81\u0EB2\u0E99\u0E88\u0EB0\u0EA5\u0EB2\u0E88\u0EAD\u0E99', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u0EC1\u0EA1\u0EB1\u0E94\u0E9A\u0EC8\u0EAD\u0E99\u0E88\u0EAD\u0E94\u0EA5\u0EBB\u0E94', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u0E82\u0EB1\u0EC9\u0E99\u0EC4\u0E94', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u0E97\u0ECD\u0EC8\u0EC4\u0E9F', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0EC4\u0E96\u0E99\u0EB2', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0EC3\u0EAB\u0E8D\u0EC8', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0E9E\u0EB9\u0EAB\u0EBC\u0EB7\u0E9C\u0EB2', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0EC3\u0EAB\u0E8D\u0EC8', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u0EC4\u0E9F\u0E88\u0EB0\u0EA5\u0EB2\u0E88\u0EAD\u0E99', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u0E9A\u0EC8\u0EAD\u0E99\u0E82\u0EC9\u0EB2\u0EA1\u0E97\u0EB2\u0E87', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'ຫົວ​ສີດ​ນ້ຳ​ດັບ​ເພີງ', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0E97\u0EB2\u0E87\u0EA1\u0EC9\u0EB2\u0EA5\u0EB2\u0E8D', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u0E95\u0EBB\u0EC9\u0E99\u0E9B\u0EB2\u0EA1', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u0E9B\u0EC8\u0EAD\u0E87\u0E84\u0EA7\u0EB1\u0E99\u0EC4\u0E9F', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u0EA5\u0EBB\u0E94\u0EC1\u0E97\u0EA3\u0EB1\u0E81\u0EC0\u0E95\u0EB5', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u0EAB\u0EBB\u0EA7\u0E94\u0EB1\u0E9A\u0EC0\u0E9E\u0EB5\u0E87', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u0EAB\u0EBB\u0EA7\u0E94\u0EB1\u0E9A\u0EC0\u0E9E\u0EB5\u0E87', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u1010\u1031\u102C\u1004\u103A\u1019\u103B\u102C\u1038\u101E\u102D\u102F\u1037\u1019\u101F\u102F\u1010\u103A\u1010\u1031\u102C\u1004\u103A\u1019\u103B\u102C\u1038', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u1019\u103E\u1010\u103A\u1010\u102D\u102F\u1004\u103A\u1019\u103B\u102C\u1038', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, '\u101C\u1019\u103A\u1038\u1006\u102D\u102F\u1004\u103A\u1038\u1018\u102F\u1010\u103A\u1019\u103B\u102C\u1038', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, '\u1021\u1015\u1004\u103A\u1019\u103B\u102C\u1038', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\u101E\u1005\u103A\u1015\u1004\u103A\u1019\u103B\u102C\u1038', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, '\u1019\u103C\u1000\u103A', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, '\u1015\u1031\u102B\u1000\u103A\u1015\u1004\u103A\u1019\u103B\u102C\u1038', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, '\u101B\u103E\u102C\u1038\u1005\u1031\u102C\u1004\u103A\u1038', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, '\u1011\u1014\u103A\u1038\u1015\u1004\u103A\u1019\u103B\u102C\u1038', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u101E\u1018\u102C\u101D', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, '\u101B\u1031\u1010\u1036\u1001\u103D\u1014\u103A\u1019\u103B\u102C\u1038', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, '\u1010\u1031\u102C\u1004\u103A\u1019\u103B\u102C\u1038', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u1010\u1031\u102C\u1004\u103A\u1010\u103D\u1031', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u101B\u1031\u1010\u103D\u1004\u103A\u1038', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, '\u1019\u103C\u1005\u103A\u1019\u103B\u102C\u1038', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, '\u1000\u1019\u103A\u1038\u1001\u103C\u1031\u1019\u103B\u102C\u1038', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, '\u1014\u1031\u1019\u1004\u103A\u1038', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, '\u1019\u103D\u1014\u103A\u1038', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, '\u1000\u1031\u102C\u1004\u103A\u1038\u1000\u1004\u103A', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u101A\u102C\u1009\u103A\u1019\u103B\u102C\u1038', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u1000\u102C\u1038\u1019\u103B\u102C\u1038', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u1005\u1000\u103A\u1018\u102E\u1038', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u1006\u102D\u102F\u1004\u103A\u1000\u101A\u103A\u1019\u103B\u102C\u1038', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u1015\u1005\u103A\u1000\u1015\u103A\u1000\u102C\u1038\u1019\u103B\u102C\u1038', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, '\u1000\u102F\u1014\u103A\u1010\u1004\u103A\u1000\u102C\u1038\u1019\u103B\u102C\u1038', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u101C\u103E\u1031\u1019\u103B\u102C\u1038', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u1007\u102D\u1019\u103A\u1001\u1036\u1000\u102C\u1038\u1019\u103B\u102C\u1038', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u1021\u1004\u103E\u102C\u1038\u101A\u102C\u1009\u103A\u1019\u103B\u102C\u1038', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u1000\u103B\u1031\u102C\u1004\u103A\u1038\u1000\u102C\u1038', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\u1018\u1010\u103A\u1005\u103A\u1000\u102C\u1038', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u1006\u1031\u102C\u1000\u103A\u101C\u102F\u1015\u103A\u101B\u1031\u1038\u101A\u102C\u1009\u103A', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u101B\u102F\u1015\u103A\u1015\u103D\u102C\u1038\u1010\u1031\u102C\u103A\u1019\u103B\u102C\u1038', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u1005\u1019\u103A\u1038\u101B\u1031', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, '\u1010\u1036\u1010\u102C\u1038', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u1006\u102D\u1015\u103A\u1001\u1036', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, '\u1019\u102D\u102F\u1038\u1019\u103B\u103E\u1031\u102C\u103A\u1010\u102D\u102F\u1000\u103A', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, '\u1010\u102D\u102F\u1004\u103A\u1019\u103B\u102C\u1038', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u101B\u1031\u102C\u1004\u103A\u1005\u102F\u1036\u1019\u103E\u1014\u103A', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u1021\u102D\u1019\u103A', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u1010\u102D\u102F\u1000\u103A\u1001\u1014\u103A\u1038\u1021\u1006\u1031\u102C\u1000\u103A\u1021\u1026', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, '\u1019\u102E\u1038\u1021\u102D\u1019\u103A', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, '\u1018\u1030\u1010\u102C\u101B\u102F\u1036', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, '\u1015\u103C\u102C', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u1019\u102E\u1038\u101E\u1010\u103A\u1006\u1031\u1038\u1018\u1030\u1038', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u1000\u103C\u1031\u102C\u103A\u1004\u103C\u102C\u1018\u102F\u1010\u103A', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, '\u101C\u1019\u103A\u1038\u1019\u103B\u102C\u1038', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u101C\u1030\u1000\u1030\u1038\u1019\u103B\u1009\u103A\u1038\u1000\u103C\u102C\u1038\u1019\u103B\u102C\u1038', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u1019\u102E\u1038\u1015\u103D\u102D\u102F\u1004\u1037\u103A', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u1000\u102C\u1038\u1002\u102D\u102F\u1012\u1031\u102B\u1004\u103A\u1019\u103B\u102C\u1038', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u1018\u1010\u103A\u1005\u103A\u1000\u102C\u1038\u1019\u103E\u1010\u103A\u1010\u102D\u102F\u1004\u103A\u1019\u103B\u102C\u1038', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'trafficcones', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u1000\u102C\u1038\u1015\u102B\u1000\u1004\u103A\u1019\u102E\u1010\u102C', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u101C\u103E\u1031\u1000\u102C\u1038', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u1019\u102E\u1038\u1001\u102D\u102F\u1038\u1001\u1031\u102B\u1004\u103A\u1038\u1010\u102D\u102F\u1004\u103A\u1019\u103B\u102C\u1038', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u1011\u103D\u1014\u103A\u1005\u1000\u103A\u1019\u103B\u102C\u1038', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'firehydrants', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'buses', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 't\xE0uthuy\u1EC1n', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'gunungataubukit', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'tandaberhenti', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'tandajalan', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'tumbuhan', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'pokok', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'rumput', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'pokokrenek', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'kaktus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'pokokpalma', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'alamsemulajadi', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'airterjun', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'pergunungan', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'bukitbukau', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'badanair', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'sungai-sungai', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'pantai', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'matahari', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'Bulan', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'langit', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'kenderaan', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'kereta', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'basikal', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'motosikal', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'trakpikap', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'trakkomersial', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'bot', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limosin', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'teksi', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'bassekolah', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'bas', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'kenderaanpembinaan', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'patung-patung', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'airpancut', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'jambatan', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'jeti', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'bangunanpencakarlangit', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'tiangatautiang', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'kacaberwarna', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'rumah', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'bangunananapartmen', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'rumahcahaya', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'stesenKeretapi', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'abu', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'afirehydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'papaniklan', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'jalanraya', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'lintasanpejalankaki', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'lampuisyarat', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'pintugaraged', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'perhentianbas', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'Kontrafik', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'metertempatletakkereta', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'tangga', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'cerobongasap', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'traktor', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, 'pilibomba', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'serombongasap', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'stopsigns', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, 'streetsigns', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, 'plants', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, 'trees', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, 'grass', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, 'shrubs', '/m/0gqbt'), (0, _defineProperty3.default)(_jsonall, 'cactus', '/m/025_v'), (0, _defineProperty3.default)(_jsonall, 'palmtrees', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, 'nature', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, 'waterfalls', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, 'mountainsorhills', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, 'bodiesofwater', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, 'rivers', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, 'beaches', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, 'theSun', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, 'theMoon', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, 'thesky', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, 'vehicles', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'cars', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, 'bicycles', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, 'motorcycles', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, 'pickuptrucks', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, 'commercialtrucks', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, 'boats', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, 'limousines', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, 'taxis', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, 'schoolbus', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, 'bus', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, 'constructionvehicle', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, 'statues', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, 'fountains', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, 'bridges', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, 'pier', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, 'skyscraper', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, 'pillarsorcolumns', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, 'stainedglass', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, 'ahouse', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, 'anapartmentbuilding', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, 'alighthouse', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, 'atrainstation', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, 'ashed', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, 'afirehydrant', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, 'abillboard', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, 'roads', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, 'crosswalks', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, 'trafficlights', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, 'garagedoors', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, 'busstops', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, 'trafficcones', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, 'parkingmeters', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, 'stairs', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, 'chimneys', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, 'tractors', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u8DEF\u6807', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, '\u82B1', '/m/0c9ph5'), (0, _defineProperty3.default)(_jsonall, '\u6811\u6728', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, '\u68D5\u6988\u6811', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u7011\u5E03', '/m/0j2kx'), (0, _defineProperty3.default)(_jsonall, '\u5C71', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u6C34\u57DF', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, '\u6CB3\u6D41', '/m/06cnp'), (0, _defineProperty3.default)(_jsonall, '\u6D77\u6EE9', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, '\u592A\u9633', '/m/06m_p'), (0, _defineProperty3.default)(_jsonall, '\u6708\u4EAE', '/m/04wv_'), (0, _defineProperty3.default)(_jsonall, '\u5929\u7A7A', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u4EA4\u901A\u5DE5\u5177', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u5C0F\u8F7F\u8F66', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u673A\u52A8\u8F66', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u81EA\u884C\u8F66', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\u6469\u6258\u8F66', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u76AE\u5361\u8F66', '/m/0cvq3'), (0, _defineProperty3.default)(_jsonall, '\u5546\u7528\u5361\u8F66', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u8239', '/m/019jd'), (0, _defineProperty3.default)(_jsonall, '\u8C6A\u534E\u8F7F\u8F66', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u51FA\u79DF\u8F66', '/m/0pg52'), (0, _defineProperty3.default)(_jsonall, '\u6821\u8F66', '/m/02yvhj'), (0, _defineProperty3.default)(_jsonall, '\u516C\u4EA4\u8F66', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u706B\u8F66', '/m/07jdr'), (0, _defineProperty3.default)(_jsonall, '\u65BD\u5DE5\u8F66\u8F86', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u96D5\u50CF', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u55B7\u6CC9', '/m/0h8lhkg'), (0, _defineProperty3.default)(_jsonall, '\u6865', '/m/015kr'), (0, _defineProperty3.default)(_jsonall, '\u7801\u5934', '/m/01phq4'), (0, _defineProperty3.default)(_jsonall, '\u6469\u5929\u5927\u697C', '/m/079cl'), (0, _defineProperty3.default)(_jsonall, '\u67F1\u5B50', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u5F69\u8272\u73BB\u7483', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u623F\u5C4B', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u516C\u5BD3\u697C', '/m/01nblt'), (0, _defineProperty3.default)(_jsonall, '\u706F\u5854', '/m/04h7h'), (0, _defineProperty3.default)(_jsonall, '\u706B\u8F66\u7AD9', '/m/0py27'), (0, _defineProperty3.default)(_jsonall, '\u906E\u68DA', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u6D88\u9632\u6813', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u6D88\u706B\u6813', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u5E7F\u544A\u724C', '/m/01knjb'), (0, _defineProperty3.default)(_jsonall, '\u9053\u8DEF', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u4EBA\u884C\u6A2A\u9053', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u8FC7\u8857\u4EBA\u884C\u9053', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u7EA2\u7EFF\u706F', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u8F66\u5E93\u95E8', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u516C\u4EA4\u7AD9', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, '\u9525\u5F62\u4EA4\u901A\u8DEF\u6807', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u505C\u8F66\u8BA1\u65F6\u5668', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u505C\u8F66\u8BA1\u4EF7\u8868', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u697C\u68AF', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u70DF\u56F1', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\u62D6\u62C9\u673A', '/m/013xlm'), (0, _defineProperty3.default)(_jsonall, '\u505C\u8F66\u6807\u5FD7', '/m/02pv19'), (0, _defineProperty3.default)(_jsonall, '\u8DEF\u724C', '/m/01mqdt'), (0, _defineProperty3.default)(_jsonall, '\u690D\u7269', '/m/05s2s'), (0, _defineProperty3.default)(_jsonall, '\u6811', '/m/07j7r'), (0, _defineProperty3.default)(_jsonall, '\u8349', '/m/08t9c_'), (0, _defineProperty3.default)(_jsonall, '\u68D5\u6988\u6811', '/m/0cdl1'), (0, _defineProperty3.default)(_jsonall, '\u81EA\u7136', '/m/05h0n'), (0, _defineProperty3.default)(_jsonall, '\u4E18\u9675', '/m/09d_r'), (0, _defineProperty3.default)(_jsonall, '\u6C34\u4F53', '/m/03ktm1'), (0, _defineProperty3.default)(_jsonall, '\u6D77\u6EE9', '/m/0b3yr'), (0, _defineProperty3.default)(_jsonall, '\u5929\u7A7A', '/m/01bqvp'), (0, _defineProperty3.default)(_jsonall, '\u8F66\u8F86', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u6C7D\u8F66', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\u6469\u6258\u8F66', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\u5546\u4E1A\u5361\u8F66', '/m/0fkwjg'), (0, _defineProperty3.default)(_jsonall, '\u8C6A\u534E\u8F7F\u8F66', '/m/01lcw4'), (0, _defineProperty3.default)(_jsonall, '\u516C\u5171\u6C7D\u8F66', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\u5EFA\u7B51\u8F66\u8F86', '/m/02gx17'), (0, _defineProperty3.default)(_jsonall, '\u96D5\u50CF', '/m/013_1c'), (0, _defineProperty3.default)(_jsonall, '\u652F\u67F1\u67F1', '/m/01_m7'), (0, _defineProperty3.default)(_jsonall, '\u5F69\u8272\u73BB\u7483', '/m/011y23'), (0, _defineProperty3.default)(_jsonall, '\u623F\u5B50', '/m/03jm5'), (0, _defineProperty3.default)(_jsonall, '\u7070\u70EC', '/m/01n6fd'), (0, _defineProperty3.default)(_jsonall, '\u6D88\u706B\u6813', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\u9053\u8DEF', '/m/06gfj'), (0, _defineProperty3.default)(_jsonall, '\u4EBA\u884C\u6A2A\u9053', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\u4EA4\u901A\u706F', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\u8F66\u5E93\u95E8', '/m/08l941'), (0, _defineProperty3.default)(_jsonall, '\u5DF4\u58EB\u7AD9', '/m/01jw_1'), (0, _defineProperty3.default)(_jsonall, '\u4EA4\u901A\u9525', '/m/03sy7v'), (0, _defineProperty3.default)(_jsonall, '\u505C\u8F66\u54AA\u8868', '/m/015qbp'), (0, _defineProperty3.default)(_jsonall, '\u697C\u68AF', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\u70DF\u56F1', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\uD6A1\uB2E8\uBCF4\uB3C4', '/m/014xcs'), (0, _defineProperty3.default)(_jsonall, '\uC790\uB3D9\uCC28', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\uC790\uC804\uAC70', '/m/0199g'), (0, _defineProperty3.default)(_jsonall, '\uBC84\uC2A4', '/m/01bjv'), (0, _defineProperty3.default)(_jsonall, '\uC2E0\uD638\uB4F1', '/m/015qff'), (0, _defineProperty3.default)(_jsonall, '\uACC4\uB2E8', '/m/01lynh'), (0, _defineProperty3.default)(_jsonall, '\uC18C\uD654\uC804', '/m/01pns0'), (0, _defineProperty3.default)(_jsonall, '\uAD74\uB69D', '/m/01jk_4'), (0, _defineProperty3.default)(_jsonall, '\uC624\uD1A0\uBC14\uC774', '/m/04_sv'), (0, _defineProperty3.default)(_jsonall, '\uCC28\uB7C9', '/m/0k4j'), (0, _defineProperty3.default)(_jsonall, '\uAD50\uAC01', '/m/01phq4'), _jsonall);

/***/ }),

/***/ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/array/from.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/array/from.js ***!
  \***************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/array/from */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/array/from.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/object/define-property.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/object/define-property.js ***!
  \***************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/object/define-property.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/promise.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/promise.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/promise */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/promise.js"), __esModule: true };

/***/ }),

/***/ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/asyncToGenerator.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/asyncToGenerator.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _promise = __webpack_require__(/*! ../core-js/promise */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/promise.js");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/***/ }),

/***/ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/defineProperty.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/defineProperty.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/object/define-property.js");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports["default"] = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),

/***/ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/regenerator/index.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/regenerator/index.js ***!
  \**************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/.store/regenerator-runtime@0.11.1/node_modules/regenerator-runtime/runtime-module.js");


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/array/from.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/array/from.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ../../modules/es6.string.iterator */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../../modules/es6.array.from */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.array.from.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js").Array.from;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/object/define-property.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/object/define-property.js ***!
  \******************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ../../modules/es6.object.define-property */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.object.define-property.js");
var $Object = (__webpack_require__(/*! ../../modules/_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js").Object);
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/promise.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/fn/promise.js ***!
  \***************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ../modules/es6.object.to-string */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.object.to-string.js");
__webpack_require__(/*! ../modules/es6.string.iterator */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.string.iterator.js");
__webpack_require__(/*! ../modules/web.dom.iterable */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/web.dom.iterable.js");
__webpack_require__(/*! ../modules/es6.promise */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.promise.js");
__webpack_require__(/*! ../modules/es7.promise.finally */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es7.promise.finally.js");
__webpack_require__(/*! ../modules/es7.promise.try */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es7.promise.try.js");
module.exports = __webpack_require__(/*! ../modules/_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js").Promise;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_a-function.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_a-function.js ***!
  \************************************************************************************************/
/***/ ((module) => {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_add-to-unscopables.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_add-to-unscopables.js ***!
  \********************************************************************************************************/
/***/ ((module) => {

module.exports = function () { /* empty */ };


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-instance.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-instance.js ***!
  \*************************************************************************************************/
/***/ ((module) => {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_array-includes.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_array-includes.js ***!
  \****************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-iobject.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-absolute-index.js");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_classof.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_classof.js ***!
  \*********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_cof.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_cof.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_cof.js ***!
  \*****************************************************************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js ***!
  \******************************************************************************************/
/***/ ((module) => {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_create-property.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_create-property.js ***!
  \*****************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $defineProperty = __webpack_require__(/*! ./_object-dp */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_property-desc.js");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_defined.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_defined.js ***!
  \*********************************************************************************************/
/***/ ((module) => {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js ***!
  \*************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_dom-create.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_dom-create.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js");
var document = (__webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js").document);
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_enum-bug-keys.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_enum-bug-keys.js ***!
  \***************************************************************************************************/
/***/ ((module) => {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js ***!
  \********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_has.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_fails.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_fails.js ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_for-of.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_for-of.js ***!
  \********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js");
var call = __webpack_require__(/*! ./_iter-call */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-call.js");
var isArrayIter = __webpack_require__(/*! ./_is-array-iter */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-array-iter.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-length.js");
var getIterFn = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/core.get-iterator-method.js");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js ***!
  \********************************************************************************************/
/***/ ((module) => {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_has.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_has.js ***!
  \*****************************************************************************************/
/***/ ((module) => {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_html.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_html.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var document = (__webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js").document);
module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ie8-dom-define.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \****************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_invoke.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_invoke.js ***!
  \********************************************************************************************/
/***/ ((module) => {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iobject.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iobject.js ***!
  \*********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_cof.js");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-array-iter.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-array-iter.js ***!
  \***************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// check on default Array iterator
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-call.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-call.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-create.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-create.js ***!
  \*************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var create = __webpack_require__(/*! ./_object-create */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-create.js");
var descriptor = __webpack_require__(/*! ./_property-desc */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_property-desc.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-to-string-tag.js");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-define.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-define.js ***!
  \*************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_library.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js");
var $iterCreate = __webpack_require__(/*! ./_iter-create */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-create.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-to-string-tag.js");
var getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-gpo.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-detect.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-detect.js ***!
  \*************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-step.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-step.js ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js ***!
  \***********************************************************************************************/
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_library.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_library.js ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = true;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_microtask.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_microtask.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var macrotask = (__webpack_require__(/*! ./_task */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_task.js").set);
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(/*! ./_cof */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_cof.js")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_new-promise-capability.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_new-promise-capability.js ***!
  \************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_a-function.js");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-create.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-create.js ***!
  \***************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
var dPs = __webpack_require__(/*! ./_object-dps */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dps.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_enum-bug-keys.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_dom-create.js")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  (__webpack_require__(/*! ./_html */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_html.js").appendChild)(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dps.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dps.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-gpo.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-gpo.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(/*! ./_has */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_has.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-object.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-keys-internal.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-keys-internal.js ***!
  \**********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var has = __webpack_require__(/*! ./_has */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_has.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-iobject.js");
var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_array-includes.js")(false);
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-keys.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-keys.js ***!
  \*************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_perform.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_perform.js ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_promise-resolve.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_promise-resolve.js ***!
  \*****************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js");
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_new-promise-capability.js");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_property-desc.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_property-desc.js ***!
  \***************************************************************************************************/
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_redefine-all.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_redefine-all.js ***!
  \**************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hide = __webpack_require__(/*! ./_hide */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js");
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_redefine.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_redefine.js ***!
  \**********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./_hide */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js");


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-species.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-species.js ***!
  \*************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js");
var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-to-string-tag.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-to-string-tag.js ***!
  \*******************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var def = (__webpack_require__(/*! ./_object-dp */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js").f);
var has = __webpack_require__(/*! ./_has */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_has.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared-key.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared-key.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared.js")('keys');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_uid.js");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared.js ***!
  \********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var core = __webpack_require__(/*! ./_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(/*! ./_library */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_library.js") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_species-constructor.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_species-constructor.js ***!
  \*********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-object.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_a-function.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_string-at.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_string-at.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_task.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_task.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js");
var invoke = __webpack_require__(/*! ./_invoke */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_invoke.js");
var html = __webpack_require__(/*! ./_html */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_html.js");
var cel = __webpack_require__(/*! ./_dom-create */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_dom-create.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(/*! ./_cof */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_cof.js")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-absolute-index.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-absolute-index.js ***!
  \*******************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-integer.js");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-integer.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-integer.js ***!
  \************************************************************************************************/
/***/ ((module) => {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-iobject.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-iobject.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iobject.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-length.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-length.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-object.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-object.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-primitive.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-primitive.js ***!
  \**************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_uid.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_uid.js ***!
  \*****************************************************************************************/
/***/ ((module) => {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_user-agent.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_user-agent.js ***!
  \************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var store = __webpack_require__(/*! ./_shared */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_shared.js")('wks');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_uid.js");
var Symbol = (__webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js").Symbol);
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/core.get-iterator-method.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/core.get-iterator-method.js ***!
  \*************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(/*! ./_classof */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_classof.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js");
module.exports = (__webpack_require__(/*! ./_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js").getIteratorMethod) = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.array.from.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.array.from.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-object.js");
var call = __webpack_require__(/*! ./_iter-call */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-call.js");
var isArrayIter = __webpack_require__(/*! ./_is-array-iter */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-array-iter.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-length.js");
var createProperty = __webpack_require__(/*! ./_create-property */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_create-property.js");
var getIterFn = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/core.get-iterator-method.js");

$export($export.S + $export.F * !__webpack_require__(/*! ./_iter-detect */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-detect.js")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.array.iterator.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.array.iterator.js ***!
  \*******************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_add-to-unscopables.js");
var step = __webpack_require__(/*! ./_iter-step */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-step.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-define.js")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.object.define-property.js":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.object.define-property.js ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js");
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_descriptors.js"), 'Object', { defineProperty: (__webpack_require__(/*! ./_object-dp */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_object-dp.js").f) });


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.object.to-string.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.object.to-string.js ***!
  \*********************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.promise.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.promise.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_library.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_ctx.js");
var classof = __webpack_require__(/*! ./_classof */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_classof.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_is-object.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_a-function.js");
var anInstance = __webpack_require__(/*! ./_an-instance */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_an-instance.js");
var forOf = __webpack_require__(/*! ./_for-of */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_for-of.js");
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_species-constructor.js");
var task = (__webpack_require__(/*! ./_task */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_task.js").set);
var microtask = __webpack_require__(/*! ./_microtask */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_microtask.js")();
var newPromiseCapabilityModule = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_new-promise-capability.js");
var perform = __webpack_require__(/*! ./_perform */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_perform.js");
var userAgent = __webpack_require__(/*! ./_user-agent */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_user-agent.js");
var promiseResolve = __webpack_require__(/*! ./_promise-resolve */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_promise-resolve.js");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(/*! ./_redefine-all */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_redefine-all.js")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-to-string-tag.js")($Promise, PROMISE);
__webpack_require__(/*! ./_set-species */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_set-species.js")(PROMISE);
Wrapper = __webpack_require__(/*! ./_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(/*! ./_iter-detect */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-detect.js")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.string.iterator.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.string.iterator.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $at = __webpack_require__(/*! ./_string-at */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iter-define.js")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es7.promise.finally.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es7.promise.finally.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// https://github.com/tc39/proposal-promise-finally

var $export = __webpack_require__(/*! ./_export */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_species-constructor.js");
var promiseResolve = __webpack_require__(/*! ./_promise-resolve */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_promise-resolve.js");

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es7.promise.try.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es7.promise.try.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// https://github.com/tc39/proposal-promise-try
var $export = __webpack_require__(/*! ./_export */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_export.js");
var newPromiseCapability = __webpack_require__(/*! ./_new-promise-capability */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_new-promise-capability.js");
var perform = __webpack_require__(/*! ./_perform */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_perform.js");

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });


/***/ }),

/***/ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/web.dom.iterable.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/web.dom.iterable.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ./es6.array.iterator */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/es6.array.iterator.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_iterators.js");
var TO_STRING_TAG = __webpack_require__(/*! ./_wks */ "./node_modules/.store/core-js@2.6.12/node_modules/core-js/library/modules/_wks.js")('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),

/***/ "./node_modules/.store/regenerator-runtime@0.11.1/node_modules/regenerator-runtime/runtime-module.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/.store/regenerator-runtime@0.11.1/node_modules/regenerator-runtime/runtime-module.js ***!
  \***********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ "./node_modules/.store/regenerator-runtime@0.11.1/node_modules/regenerator-runtime/runtime.js");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ "./node_modules/.store/regenerator-runtime@0.11.1/node_modules/regenerator-runtime/runtime.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.store/regenerator-runtime@0.11.1/node_modules/regenerator-runtime/runtime.js ***!
  \****************************************************************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = "object" === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************!*\
  !*** ./src/content/captcha2.js ***!
  \*********************************/


var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/promise.js");

var _promise2 = _interopRequireDefault(_promise);

var _from = __webpack_require__(/*! babel-runtime/core-js/array/from */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/core-js/array/from.js");

var _from2 = _interopRequireDefault(_from);

var _regenerator = __webpack_require__(/*! babel-runtime/regenerator */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/regenerator/index.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = __webpack_require__(/*! babel-runtime/helpers/asyncToGenerator */ "./node_modules/.store/babel-runtime@6.26.0/node_modules/babel-runtime/helpers/asyncToGenerator.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// 彩虹点击流程
var rainbow = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var _ref4, times, chrome;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _common.getconfig)();

          case 2:
            _ref4 = _context4.sent;
            times = _ref4.times;
            chrome = window.chrome;

            console.log(location.href, 'location.href');
            // await delay(3000)

          case 6:
            if (false) {}

            _context4.next = 9;
            return (0, _common.waitFor)('strong');

          case 9:
            if (!(document.querySelector('strong') && document.getElementById('enqueue-error').style.display !== 'none')) {
              _context4.next = 13;
              break;
            }

            console.log('找到了按钮');
            browser.runtime.sendMessage({ action: 'gettabs' }, function () {
              var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(tabs) {
                var totaltabs;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        totaltabs = tabs.length;

                        document.querySelector('strong').click();
                        _context3.next = 4;
                        return (0, _common.delay)(20 * times);

                      case 4:
                        browser.runtime.sendMessage({ action: 'gettabs' }, function (tabs) {
                          if (totaltabs === tabs.length) {
                            console.log('点击失败');
                            return;
                          }
                          console.log('点击成功');
                          browser.runtime.sendMessage({ action: 'removetab' });
                        });

                      case 5:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));

              return function (_x2) {
                return _ref5.apply(this, arguments);
              };
            }());

            return _context4.abrupt('break', 15);

          case 13:
            _context4.next = 6;
            break;

          case 15:
            return _context4.abrupt('return', true);

          case 16:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function rainbow() {
    return _ref3.apply(this, arguments);
  };
}();

// 英文数字转文本流程


var imagetotext = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(config) {
    var DoOcr = function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var imgsrc, base64img, data, res;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // if (document.querySelector('#solution') && document.querySelector('#solution').value) {
                //   console.log('刷新页面')
                //   location.reload()
                // }
                console.log('等待加载图片');
                // await waitFor('#challenge-container > div > fieldset > div.botdetect-label > img')

              case 1:
                if (document.querySelector('#challenge-container > div > fieldset > div.botdetect-label > img')) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 4;
                return (0, _common.delay)(10 * times);

              case 4:
                _context5.next = 1;
                break;

              case 6:
                console.log('获取到图片');
                imgsrc = document.querySelector('#challenge-container > div > fieldset > div.botdetect-label > img').src;

                console.log('图片地址', imgsrc);

                // 重复识别验证

                if (!ImageCache[imgsrc]) {
                  _context5.next = 14;
                  break;
                }

                console.log('ocr: 图片已经识别过');
                return _context5.abrupt('return');

              case 14:
                ImageCache[imgsrc] = 1;

              case 15:
                _context5.next = 17;
                return (0, _common.div2base64)(imgsrc, 250, 50);

              case 17:
                base64img = _context5.sent;
                data = {
                  'clientKey': config.clientKey,
                  'task': {
                    'type': 'ImageToTextTaskTest',
                    'body': base64img
                  }
                };
                _context5.next = 21;
                return (0, _common.post)(new URL('createTask', config.host).href, data);

              case 21:
                res = _context5.sent;

                if (!res.errorDescription) {
                  _context5.next = 28;
                  break;
                }

                // 出错时显示出错信息然后跳过
                console.log('出错:', res.errorDescription);
                (0, _common.message)({ text: res.errorDescription, color: 'red' });

                if (!(0, _common.notneedcontinue)(res.errorCode)) {
                  _context5.next = 28;
                  break;
                }

                console.log('不需要继续,程序退出');
                return _context5.abrupt('return');

              case 28:
                console.log(res);

                if (!(res.solution && res.solution.text)) {
                  _context5.next = 37;
                  break;
                }

                _context5.next = 32;
                return (0, _common.delay)(10 * times);

              case 32:
                document.querySelector('#solution').value = res.solution.text;
                _context5.next = 35;
                return (0, _common.delay)(10 * times);

              case 35:
                document.querySelector('.botdetect-button') && document.querySelector('.botdetect-button').click();
                console.log('点击提交按钮');

              case 37:
                return _context5.abrupt('return');

              case 38:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function DoOcr() {
        return _ref8.apply(this, arguments);
      };
    }();

    var _ref7, times, ImageCache;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _common.getconfig)();

          case 2:
            _ref7 = _context6.sent;
            times = _ref7.times;
            ImageCache = [];

            // await delay(2000)

            console.log('英文数字转文本');

            // 监听页面变动
            document.addEventListener('DOMSubtreeModified', function (e) {
              // console.log(e.target)

              if (e.target == document.querySelector('#challenge-container')) {
                console.log("e.target", e.target);
                // console.log("visualViewport.width", visualViewport.width)
                DoOcr();
              }
            });

            DoOcr();

          case 8:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function imagetotext(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

// 图像识别分类第四版


var imageclassification_v4 = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(config) {
    var _ref10, times, isAutoClickCheckBox, checkBoxClickDelayTime, isAutoSubmit, img11, img11Score, timeid, watchService, stuckCount, stuckRefreshTimes, ImageCache, isVerifyEnd, isBramePage, isAnchorPage, refresh, getquestion, clicktime, watchCheckbox, reTarget, rcImageselectTarget, errorSelectMore, errorDynamicMore, needMore, CheckforStuck, ImageToBase64, getindex, DoOcr, Clicks, domModifyCb;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            domModifyCb = function domModifyCb(e) {
              // 反馈变动的DOM
              // console.log("e.target:");
              // console.log(e.target);

              // 对DOM添加监听事件: 如果图片发生变化
              if (e.target == document.querySelector('#rc-imageselect-target') && document.querySelector('#rc-imageselect-target > table > tbody > tr> td>div>div>img')) {
                // 绑定每一张图片的加载事件，当加载就执行OCR
                document.querySelector('div.rc-image-tile-wrapper > img').onload = function () {
                  // 当图片加载时，对图片进行识别
                  DoOcr(document.querySelector('div.rc-image-tile-wrapper > img'));
                };

                // var lsurl = document.querySelector(
                //   '#rc-imageselect-target > table > tbody > tr> td>div>div>img').src;
                // if (ImageCache.indexOf(lsurl) == -1){
                // 直接执行OCR：不明白为什么要这么写
                DoOcr(document.querySelector('#rc-imageselect-target > table > tbody > tr> td>div>div>img'));
                // }
              } else {
                var image = e.target.querySelector(' div > div.rc-image-tile-wrapper > img');
                if (image) {
                  // 获取发生变化的位置
                  var index = getindex(image, '#rc-imageselect-target > table > tbody > tr> td> div > div.rc-image-tile-wrapper > img');
                  var imagecode = image.className.substring(image.className.length - 2);
                  if (imagecode * 1 == 11) {
                    clearTimeout(timeid);
                    img11['_' + index] = 'y';
                    // 图像识别
                    DoOcr(image, index);
                  }
                }
              }
            };

            getindex = function getindex(obj, objall) {
              var objall = document.querySelectorAll(objall);
              for (var i = 0; i < objall.length; i++) {
                if (obj == objall[i]) {
                  return i;
                }
              }
              return -1;
            };

            ImageToBase64 = function ImageToBase64(img) {
              var canvas = document.createElement('canvas');
              var widthx = img.naturalWidth;
              canvas.width = widthx;
              canvas.height = widthx;
              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, widthx, widthx);
              var dataURL = canvas.toDataURL('image/jpeg');
              var base = dataURL.replace('data:image/jpeg;base64,', '');
              if (base == 'data:,') {
                return;
              }
              return base;
            };

            CheckforStuck = function CheckforStuck() {
              if (needMore()) {
                stuckCount = stuckCount + 1;
              } else {
                // console.log('CheckforStuck: clear!')
                stuckCount = 0;
              }
              if (stuckCount >= stuckRefreshTimes) {
                console.log('CheckforStuck: 6 times for refresh()');
                refresh();
              }
            };

            clicktime = function clicktime() {
              // 如果有白屏，则等待3秒后再试
              if (document.querySelector('td.rc-imageselect-dynamic-selected')) {
                console.log('find selected image');
                // await delay(3000)
                clearTimeout(timeid);
                timeid = setTimeout(clicktime, 1000);
                return;
              }

              if (img11.length == 0) {

                if (isAutoSubmit) {
                  document.querySelector('#recaptcha-verify-button').click();
                }
              }
            };

            _context9.next = 7;
            return (0, _common.getconfig)();

          case 7:
            _ref10 = _context9.sent;
            times = _ref10.times;
            isAutoClickCheckBox = _ref10.isAutoClickCheckBox;
            checkBoxClickDelayTime = _ref10.checkBoxClickDelayTime;
            isAutoSubmit = _ref10.isAutoSubmit;
            img11 = [];
            img11Score = {};
            timeid = 0;
            watchService = 0;
            stuckCount = 0;
            stuckRefreshTimes = 5;
            ImageCache = [];
            isVerifyEnd = false;

            // 确定是九宫格页面

            isBramePage = window.self.location.href.match(/\/recaptcha\/(.*?)\/bframe\?/) != null;

            // 确定是勾选框页

            isAnchorPage = window.self.location.href.match(/\/recaptcha\/(.*?)\/anchor\?/) != null;

            // 刷新

            refresh = function refresh() {
              return document.querySelector('.rc-button-reload') && document.querySelector('.rc-button-reload').click();
            };
            // 获取问题


            getquestion = function getquestion() {
              return document.querySelector('strong').innerText.replace(/\s/g, '');
            };
            // 提交


            if (!isAnchorPage) {
              _context9.next = 31;
              break;
            }

            // 自动勾选识别框
            watchCheckbox = function watchCheckbox() {
              if (document.querySelector('#recaptcha-anchor')) {
                if (document.querySelector('#recaptcha-anchor').getAttribute('aria-checked') == 'false' && getComputedStyle(document.querySelector('#recaptcha-anchor > div.recaptcha-checkbox-border')).getPropertyValue('border') == '.125rem solid rgb(255, 0, 0)' && document.querySelector('#rc-anchor-container > div.rc-anchor-error-msg-container').style.display == 'none') {
                  location.reload();
                } else {
                  if (document.querySelector('#recaptcha-anchor').getAttribute('aria-checked') == 'false') {
                    isVerifyEnd = false;
                    getIsEnd().then(function (result) {
                      if (!result) {
                        document.querySelector('#recaptcha-anchor').click();
                      } else {
                        (0, _common.message)({ text: getWords('content_message_11'), color: 'green' });
                      }
                    });
                  } else {
                    if (!isVerifyEnd) {
                      window.parent.postMessage({ type: "yesCaptchaEndSuccess" }, "*");
                    }
                    isVerifyEnd = true;
                  }
                }
              }
            };

            if (isAutoClickCheckBox) {
              _context9.next = 28;
              break;
            }

            return _context9.abrupt('return');

          case 28:
            if (!watchService) {
              _context9.next = 30;
              break;
            }

            return _context9.abrupt('return');

          case 30:
            setTimeout(function () {
              watchService = setInterval(watchCheckbox, 2000);
            }, Number(checkBoxClickDelayTime));

          case 31:

            // 验证码图片框
            reTarget = function reTarget() {
              return document.querySelector('#rc-imageselect-target');
            };
            // 验证码图片对象： 返回九张图


            rcImageselectTarget = function rcImageselectTarget() {
              return document.querySelector('div.rc-image-tile-wrapper > img');
            };
            // 提示：请选择所有相符的图片。


            errorSelectMore = function errorSelectMore() {
              return document.querySelector('div.rc-imageselect-error-select-more');
            };
            // 提示：另外，您还需查看新显示的图片。


            errorDynamicMore = function errorDynamicMore() {
              return document.querySelector('div.rc-imageselect-error-dynamic-more');
            };
            // 需要选择更多


            needMore = function needMore() {
              return errorSelectMore() && errorSelectMore().style.display != 'none' || errorDynamicMore() && errorDynamicMore().style.display != 'none';
            };

            // 一个循环检测方法，防止卡住不动


            ;

            // 图片转BASE64
            ;

            // 获取对象的位置
            ;

            // 对图片进行识别

            DoOcr = function () {
              var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(image, index) {
                var isEnd, data, questionstr, res, _ref12, _ref12$recaptchaVerif, recaptchaVerifyFailDelay, _ref12$recaptchaVerif2, recaptchaVerifyTry;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return getIsEnd();

                      case 2:
                        isEnd = _context7.sent;

                        if (!isEnd) {
                          _context7.next = 6;
                          break;
                        }

                        (0, _common.message)({ text: getWords('content_message_11'), color: 'green' });
                        return _context7.abrupt('return');

                      case 6:
                        if (!(!image || !image.src)) {
                          _context7.next = 9;
                          break;
                        }

                        console.log('ocr: imgae src not found');
                        return _context7.abrupt('return');

                      case 9:

                        // 图像识别参数
                        data = {
                          'clientKey': config.clientKey, callurl: (0, _common.getParentUrl)(),
                          'task': { 'type': 'ReCaptchaV2Classification', 'image': null, 'question': null }
                          // 转换图片
                        };
                        data.task.image = ImageToBase64(image);

                        if (data.task.image) {
                          _context7.next = 20;
                          break;
                        }

                        console.log('ocr: error: image is null retry...');
                        stuckCount = 0;
                        // clearTimeout(timeid);
                        _context7.next = 16;
                        return (0, _common.delay)(20 * times);

                      case 16:
                        data.task.image = ImageToBase64(image);

                        if (data.task.image) {
                          _context7.next = 20;
                          break;
                        }

                        console.log('ocr: error: image not found');
                        return _context7.abrupt('return', false);

                      case 20:
                        if (!ImageCache[image.src]) {
                          _context7.next = 25;
                          break;
                        }

                        console.log('ocr: exist');
                        return _context7.abrupt('return');

                      case 25:
                        ImageCache[image.src] = 1;

                      case 26:

                        // 获取当前问题
                        questionstr = getquestion();

                        data.task.question = _jsonall.jsonall[questionstr] || questionstr;

                        if (data.task.question) {
                          _context7.next = 31;
                          break;
                        }

                        console.log('ocr: error: question not found');
                        return _context7.abrupt('return', false);

                      case 31:
                        // 如果是33或44图片，清空小图和提交按钮任务
                        if (!index) {
                          img11 = [], clearTimeout(timeid);
                        }
                        // 提交后端识别
                        console.log('ocr: index:', index || -1);
                        res = void 0;
                        _context7.prev = 34;
                        _ref12 = config.network || {}, _ref12$recaptchaVerif = _ref12.recaptchaVerifyFailDelay, recaptchaVerifyFailDelay = _ref12$recaptchaVerif === undefined ? 1000 : _ref12$recaptchaVerif, _ref12$recaptchaVerif2 = _ref12.recaptchaVerifyTry, recaptchaVerifyTry = _ref12$recaptchaVerif2 === undefined ? 1 : _ref12$recaptchaVerif2;
                        _context7.next = 38;
                        return (0, _common.post)(new URL('createTask', config.host).href, data, recaptchaVerifyFailDelay, recaptchaVerifyTry);

                      case 38:
                        res = _context7.sent;
                        _context7.next = 45;
                        break;

                      case 41:
                        _context7.prev = 41;
                        _context7.t0 = _context7['catch'](34);

                        (0, _common.message)({ text: getWords('content_message_9'), color: 'red' });
                        return _context7.abrupt('return');

                      case 45:
                        console.log('ocr: response:', res);

                        // 处理识别结果: 出错

                        if (!res.errorDescription) {
                          _context7.next = 59;
                          break;
                        }

                        console.log('ocr: errorDescription:', res.errorDescription);
                        (0, _common.message)({ text: res.errorDescription, color: 'green' });

                        if (!(0, _common.notneedcontinue)(res.errorCode)) {
                          _context7.next = 54;
                          break;
                        }

                        console.log('ocr: exit.');
                        return _context7.abrupt('return', false);

                      case 54:
                        // 点刷新按钮
                        console.log('ocr: refresh.');
                        _context7.next = 57;
                        return (0, _common.delay)(20 * times);

                      case 57:
                        refresh();
                        return _context7.abrupt('return', true);

                      case 59:
                        if (!res.solution) {
                          _context7.next = 63;
                          break;
                        }

                        _context7.next = 62;
                        return Clicks(image, res.solution, index);

                      case 62:
                        return _context7.abrupt('return', _context7.sent);

                      case 63:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, this, [[34, 41]]);
              }));

              return function DoOcr(_x5, _x6) {
                return _ref11.apply(this, arguments);
              };
            }();

            // 点击图片对象


            Clicks = function () {
              var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(image, solution, index) {
                var delayTime, resultlist, i;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        delayTime = times;

                        if (/44/.test(image.className)) {
                          console.log('44!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                          delayTime = times / 2;
                        }
                        console.log('click: index: ' + index);
                        // 增加延时，防止被识别为机器人
                        _context8.next = 5;
                        return (0, _common.delay)((0, _common.getClickTime)(Number(delayTime)));

                      case 5:
                        if (!(index && solution.hasObject)) {
                          _context8.next = 13;
                          break;
                        }

                        // 点击小图
                        console.log('click: 1x1: ' + index);
                        _context8.next = 9;
                        return (0, _common.delay)((0, _common.getClickTime)(Number(delayTime)));

                      case 9:
                        if (document.querySelectorAll('#rc-imageselect-target > table > tbody > tr> td>div>div>img')[index] && image.src == document.querySelectorAll('#rc-imageselect-target > table > tbody > tr> td>div>div>img')[index].src) {
                          document.querySelectorAll('#rc-imageselect-target > table > tbody > tr> td')[index].click();
                        }
                        return _context8.abrupt('return');

                      case 13:
                        if (!(index && !solution.hasObject)) {
                          _context8.next = 20;
                          break;
                        }

                        // 不点击返回
                        delete img11['_' + index];
                        // 记录分值
                        // console.log('click: score: ' + solution.confidence)
                        // img11Score['_' + index] = solution.confidence
                        // console.log('click: img11Score: ' + JSON.stringify(img11Score))
                        clearTimeout(timeid);
                        timeid = setTimeout(clicktime, 30 * times);
                        return _context8.abrupt('return');

                      case 20:
                        if (!(image.naturalWidth == 100 && !index)) {
                          _context8.next = 23;
                          break;
                        }

                        console.log('click: no index return');
                        return _context8.abrupt('return');

                      case 23:

                        // 列出所有图片
                        resultlist = (0, _from2.default)(document.querySelectorAll('#rc-imageselect-target > table > tbody > tr> td'));
                        i = 0;

                      case 25:
                        if (!(i < solution.objects.length)) {
                          _context8.next = 33;
                          break;
                        }

                        _context8.next = 28;
                        return (0, _common.delay)((0, _common.getClickTime)(Number(delayTime)));

                      case 28:
                        console.log('click: ojbects: ' + (solution.objects[i] + 1));
                        resultlist[solution.objects[i]].click();

                      case 30:
                        i++;
                        _context8.next = 25;
                        break;

                      case 33:
                        if (!(image.naturalWidth == 450)) {
                          _context8.next = 39;
                          break;
                        }

                        _context8.next = 36;
                        return (0, _common.delay)(10 * times);

                      case 36:
                        //这里
                        if (isAutoSubmit) {
                          document.querySelector('#recaptcha-verify-button').click();
                        }
                        // 300 的图片需要延迟3秒后检查1x1图片
                        _context8.next = 40;
                        break;

                      case 39:
                        if (image.naturalWidth == 300) {
                          clearTimeout(timeid);
                          timeid = setTimeout(clicktime, 3000);
                        }

                      case 40:
                      case 'end':
                        return _context8.stop();
                    }
                  }
                }, _callee8, this);
              }));

              return function Clicks(_x7, _x8, _x9) {
                return _ref13.apply(this, arguments);
              };
            }();

            // 九宫格页面进行点击
            if (isBramePage) {
              // 每秒检测一次是否未识别，6次以上自动刷新，防止卡住不动
              setInterval(CheckforStuck, 1000);
              document.addEventListener('DOMSubtreeModified', domModifyCb);
            }

            // 添加一个事件监听
            window.addEventListener('message', function (event) {
              if (event.data == 'doSomething') {
                console.log('doSomething');
              }
              if (event.data === 'DoOcr') {
                DoOcr(document.querySelector('#rc-imageselect-target > table > tbody > tr> td>div>div>img'));
              }
            });
            // 发送消息给父窗口
            window.parent.postMessage('ready', '*');

          case 44:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function imageclassification_v4(_x4) {
    return _ref9.apply(this, arguments);
  };
}();

// iframe 逻辑


var getIsEnd = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var promise;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            promise = new _promise2.default(function (resolve) {
              var cb = function cb(event) {
                var data = event.data;

                if (data.type === "isYesCaptchaEnd") {
                  resolve(data.isEnd);
                  window.removeEventListener("message", cb);
                }
              };
              var timer = setTimeout(function () {
                resolve(false);
                clearTimeout(timer);
              }, 300);
              window.addEventListener("message", cb);
            });

            window.parent.postMessage({ type: "isYesCaptchaEnd" }, "*");
            return _context10.abrupt('return', promise);

          case 3:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function getIsEnd() {
    return _ref14.apply(this, arguments);
  };
}();

var _common = __webpack_require__(/*! ../common */ "./src/common.js");

var _jsonall = __webpack_require__(/*! ../jsonall */ "./src/jsonall.js");

var _config = __webpack_require__(/*! ../config */ "./src/config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getWords = function getWords(key) {
  return browser.i18n.getMessage(key);
};
if (!_config.config.develop) window.console.log = function () {}; // 清除调试代码
(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
  var config, isBlackWhitePass, times, documentObj, f;
  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(window.inject === true)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt('return');

        case 4:
          window.inject = true;

        case 5:
          _context2.next = 7;
          return (0, _common.getconfig)();

        case 7:
          config = _context2.sent;
          _context2.next = 10;
          return (0, _common.getIsBlackWhitePass)(config);

        case 10:
          isBlackWhitePass = _context2.sent;

          if (isBlackWhitePass) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt('return');

        case 13:
          times = config.times;
          // console.log(config)

          if (config.autorun) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt('return');

        case 16:
          _context2.next = 18;
          return (0, _common.captchaClassification)();

        case 18:
          documentObj = _context2.sent;

          if (config.clientKey) {
            _context2.next = 23;
            break;
          }

          console.log('请先配置clientKey');
          // alert('Please enter a client key')
          (0, _common.message)({ text: getWords('content_message_0'), color: 'red' });
          return _context2.abrupt('return');

        case 23:
          if (!(!documentObj || !config[documentObj['title']])) {
            _context2.next = 29;
            break;
          }

          _context2.next = 26;
          return (0, _common.waitFor)('iframe[src*="bframe"]');

        case 26:
          f = document.querySelector('iframe[src*="bframe"]');

          if (f) {
            window.addEventListener('message', function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
                var isHidden;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(event.data == 'ready')) {
                          _context.next = 12;
                          break;
                        }

                      case 1:
                        if (false) {}

                        _context.next = 4;
                        return (0, _common.delay)(times * 10);

                      case 4:
                        if (!(!f.parentElement || !f.parentElement.parentElement)) {
                          _context.next = 6;
                          break;
                        }

                        return _context.abrupt('return', false);

                      case 6:
                        isHidden = f.parentElement.parentElement.style.visibility == 'hidden';

                        if (!isHidden) {
                          f.contentWindow.postMessage('DoOcr', '*');
                        }
                        _context.next = 10;
                        return (0, _common.delay)(2000);

                      case 10:
                        _context.next = 1;
                        break;

                      case 12:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }() // 等待1秒
            );
          }

          return _context2.abrupt('return', false);

        case 29:
          (0, _common.message)({ text: getWords('content_message_2'), color: 'green' });
          console.log('documentObj', documentObj['title']);
          // 显示自动识别已经启动

          // reCapthca的点击勾选逻辑在其他地方
          // if (window.self.location.href.match(/\/recaptcha\/(.*?)\/anchor\?/) == null) {
          // // 点击我是人类
          // // 20220301  等待显示后才点击
          //   while (visualViewport.width === 0) {
          //     await delay(times * 10) // 等待1秒
          //   }
          //   document.getElementById('checkbox') && document.getElementById('checkbox').click()
          //   document.body.click()
          // }

          // var f = document.querySelector('iframe[src*="bframe"]')


          // 根据不同的页面类型，进行不同的操作
          _context2.t0 = documentObj['title'];
          _context2.next = _context2.t0 === 'imageclassification' ? 34 : _context2.t0 === 'imagetotext' ? 38 : _context2.t0 === 'rainbow' ? 41 : 45;
          break;

        case 34:
          if (!(!config.recaptchaConfig.isUseNewScript && config.recaptchaConfig.isOpen)) {
            _context2.next = 37;
            break;
          }

          _context2.next = 37;
          return imageclassification_v4(config);

        case 37:
          return _context2.abrupt('break', 45);

        case 38:
          _context2.next = 40;
          return imagetotext(config);

        case 40:
          return _context2.abrupt('break', 45);

        case 41:
          (0, _common.messageHide)();
          _context2.next = 44;
          return rainbow();

        case 44:
          return _context2.abrupt('break', 45);

        case 45:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
}))();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFVBQVU7QUFDVjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDLGNBQWM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxtQkFBbUI7QUFDcEQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUEsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwrQ0FBK0MsUUFBUTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsYUFBYTtBQUM3Qjs7Ozs7OztVQ3R0QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7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R0s7QUFsR0w7QUFBQSxpQkFtR1cwYixTQW5HWDs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQUQsSyIsInNvdXJjZXMiOlsid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vc3JjL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9zcmMvanNvbmFsbC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2JhYmVsLXJ1bnRpbWVANi4yNi4wL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvYXJyYXkvZnJvbS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2JhYmVsLXJ1bnRpbWVANi4yNi4wL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2JhYmVsLXJ1bnRpbWVANi4yNi4wL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2JhYmVsLXJ1bnRpbWVANi4yNi4wL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvYXN5bmNUb0dlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2JhYmVsLXJ1bnRpbWVANi4yNi4wL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9iYWJlbC1ydW50aW1lQDYuMjYuMC9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLXN0ZXAuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWljcm90YXNrLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcGVyZm9ybS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvbWlzZS1yZXNvbHZlLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS1hbGwuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190YXNrLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL191c2VyLWFnZW50LmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL2NvcmUtanNAMi42LjEyL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5wcm9taXNlLmZpbmFsbHkuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9jb3JlLWpzQDIuNi4xMi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UudHJ5LmpzIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL25vZGVfbW9kdWxlcy8uc3RvcmUvY29yZS1qc0AyLjYuMTIvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50Ly4vbm9kZV9tb2R1bGVzLy5zdG9yZS9yZWdlbmVyYXRvci1ydW50aW1lQDAuMTEuMS9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLW1vZHVsZS5qcyIsIndlYnBhY2s6Ly9lemJ1eV9hc3Npc3RhbnQvLi9ub2RlX21vZHVsZXMvLnN0b3JlL3JlZ2VuZXJhdG9yLXJ1bnRpbWVAMC4xMS4xL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJ3ZWJwYWNrOi8vZXpidXlfYXNzaXN0YW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V6YnV5X2Fzc2lzdGFudC8uL3NyYy9jb250ZW50L2NhcHRjaGEyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIOS4uuabv+aNonBj5a6i5oi356uv5a6e546w5LiA5Liq5ZCM5qC355qE5o6l5Y+j55qE5a+56LGh77yM6L+Z5qC35bCx5LiN55So5pS55LmL5YmN55qEY2FwdGNoYS5qc+eahOS7o+eggeS6hlxyXG4vLyDmtYvor5VrZXkgIGEyMDAwZGE5OTVlZjkzOTYyZGY4YTRmNmQyMDAwMDRiMWZkZDRjOTQzXHJcbi8vIOmcgOWunueOsOeahOaOpeWPo1xyXG4vLyAxLm9ub3BlbiAg5ZCv5Yqo5pe26LCD55SoXHJcbi8vIDIub25jbG9zZSDlhbPpl63ml7bosIPnlKhcclxuLy8gMy5vbm1lc3NhZ2Ug5o6l5pS25Yiw5raI5oGv5pe26LCD55SoXHJcbi8vIDQuc2VuZCDmlrnms5Xlj5HpgIHmtojmga9cclxuLy8gb25tZXNzYWdlICDml7bpnIDov5Tlm54ganNvbuWtl+espuS4sitcIiMjXCIg5L2c5Li657uT5p2f5qCH5b+XXHJcbi8vIOi/lOWbnuWvueixoemcgOimgeaciSB0eXBlIOWxnuaApyAxMCzooajnpLrmmK/lkKblvIDlkK/oh6rliqjor4bliKssMuihqOekuue7k+aenCxcclxuLy8g5pyN5Yqh5Zmo54mI5pys5L+h5oGvXHJcblxyXG5sZXQgY2hyb21lID0gd2luZG93LmNocm9tZVxyXG5cclxuLy8g6K6+572u6aG16Z2i5L+h5oGv5pi+56S65ZKM6ZqQ6JePXHJcbmV4cG9ydCBjb25zdCBtZXNzYWdlID0gKHsgdGV4dCA9ICcnLCBjb2xvciA9ICdyZWQnIH0pID0+IHtcclxuICBsZXQgbWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteW1lc3NhZ2UnKVxyXG4gIGlmICghbWVzc2FnZSkge1xyXG4gICAgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBtZXNzYWdlLmlkID0gJ215bWVzc2FnZSdcclxuXHJcbiAgICAvLyBtZXNzYWdlLmNsYXNzTmFtZSA9ICdmYW5rdWknXHJcbiAgICBtZXNzYWdlLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xyXG4gICAgbWVzc2FnZS5zdHlsZS50b3AgPSAnMHB4J1xyXG4gICAgbWVzc2FnZS5zdHlsZS5sZWZ0ID0gJzBweCdcclxuXHJcbiAgICAvLyBtZXNzYWdlLnN0eWxlLndpZHRoID0gJzEwMCUnXHJcbiAgICAvLyBtZXNzYWdlLnN0eWxlLmhlaWdodCA9ICcxMDAlJ1xyXG4gICAgbWVzc2FnZS5zdHlsZS56SW5kZXggPSAnOTk5OTk5OTknXHJcbiAgICAvLyAvLyBtZXNzYWdlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsMCwwLDAuNSknXHJcbiAgICAvLyBtZXNzYWdlLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgcmVkJ1xyXG4gICAgLy8gbWVzc2FnZS5zdHlsZS50ZXh0QWxpZ24gPSAnbGVmdCdcclxuICAgIC8vIG1lc3NhZ2Uuc3R5bGUubGluZUhlaWdodCA9ICcxMDAlJ1xyXG4gICAgLy8gbWVzc2FnZS5zdHlsZS5mb250U2l6ZSA9ICcyMHB4J1xyXG4gICAgbWVzc2FnZS5pbm5lclRleHQgPSB0ZXh0XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lc3NhZ2UpXHJcbiAgfSBlbHNlIHtcclxuICAgIG1lc3NhZ2UuaW5uZXJUZXh0ID0gdGV4dFxyXG4gIH1cclxuICBjb2xvciA9PT0gJ2dyZWVuJyA/IChtZXNzYWdlLmNsYXNzTmFtZSA9ICdmYW5rdWknKSA6IChtZXNzYWdlLmNsYXNzTmFtZSA9ICdmYW5rdWkyJylcclxuICBtZXNzYWdlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXHJcbiAgLy8gbWVzc2FnZS5zdHlsZS5jb2xvciA9IGNvbG9yID09PSAnZ3JlZW4nID8gJ3JlZCcgOiAnZ3JlZW4nXHJcbn1cclxuXHJcbi8vIOiuvue9rumhtemdouS/oeaBr+aYvuekuuWSjOmakOiXj1xyXG5leHBvcnQgY29uc3QgbWVzc2FnZUhpZGUgPSAoKSA9PiB7XHJcbiAgbGV0IG1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXltZXNzYWdlJylcclxuICBpZiAobWVzc2FnZSkge1xyXG4gICAgbWVzc2FnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXHJcbiAgfVxyXG59XHJcblxyXG4vLyDlrprkuYnpobXpnaLor4bliKvmlrnms5VcclxuZXhwb3J0IGNvbnN0IGNhcHRjaGFDbGFzc2lmaWNhdGlvbiA9IGFzeW5jICgpID0+IHtcclxuICAvLyByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gIC8vIHdpbmRvdy5vbmxvYWQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHsgdGltZXMgfSA9IGF3YWl0IGdldGNvbmZpZygpXHJcbiAgYXdhaXQgZGVsYXkodGltZXMgKiAxMClcclxuICBsZXQgcmVzdWx0ID0gbnVsbFxyXG4gIC8vIOWvueS4jeWQjOmhtemdouWIpOaWreeahOWumuS5iSB0aXRsZSDooajnpLrkvb/nlKjnmoTmjqXlj6PvvIx1cmxfa2V5d29yayDkuLp1cmzkuK3nmoTlhbPplK7lrZcsZGl2IOS4uuWIpOaWreaYr+WQpui/meS4qumhtemdolxyXG4gIGxldCB0eXBlbGlzdCA9IFt7XHJcbiAgICB0aXRsZTogJ2ltYWdlY2xhc3NpZmljYXRpb24nLFxyXG4gICAgdXJsX2tleXdvcmQ6ICdyZWNhcHRjaGEnLFxyXG4gICAgZGl2OiAnI3JlY2FwdGNoYS1hbmNob3ItbGFiZWwnLFxyXG4gICAgaW1hZ2VkaXY6ICcjcmVjYXB0Y2hhLXRva2VuJyAvLyDlm77niYfnmoRkaXYg5ZKM54K55Ye755qE5qGG5p625Li65Lik5Liq5LiN5ZCM55qE5qGG5p62XHJcblxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGl0bGU6ICdoY2FwdGNoYScsXHJcbiAgICB1cmxfa2V5d29yZDogJ2hjYXB0Y2hhLmNvbScsXHJcbiAgICBkaXY6ICcjYW5jaG9yLXN0YXRlJyxcclxuICAgIGltYWdlZGl2OiAnLmNoYWxsZW5nZS1jb250YWluZXInIC8vIGhjYXB0Y2hhIOWbvueJh+eahGRpdiDlkozngrnlh7vnmoTmoYbmnrbkuLrkuKTkuKrkuI3lkIznmoTmoYbmnrZcclxuICB9LFxyXG4gIHtcclxuICAgIHRpdGxlOiAnaGNhcHRjaGEnLFxyXG4gICAgdXJsX2tleXdvcmQ6ICdoY2FwdGNoYS1hc3NldHMuZWNvc2VjLm9uLmVwaWNnYW1lcy5jb20nLFxyXG4gICAgZGl2OiAnI2FuY2hvci1zdGF0ZScsXHJcbiAgICBpbWFnZWRpdjogJy5jaGFsbGVuZ2UtY29udGFpbmVyJyAvLyBoY2FwdGNoYSDlm77niYfnmoRkaXYg5ZKM54K55Ye755qE5qGG5p625Li65Lik5Liq5LiN5ZCM55qE5qGG5p62XHJcbiAgfSxcclxuICB7XHJcbiAgICB0aXRsZTogJ3JhaW5ib3cnLFxyXG4gICAgLy8gYXNzZXRzLXVzLXdlc3QtMi5xdWV1ZS1pdC5uZXRcclxuICAgIC8vIGFzc2V0cy11cy13ZXN0LTIucXVldWUtaXQubmV0XHJcbiAgICB1cmxfa2V5d29yZDogJ3F1ZXVlLWl0Lm5ldCcsXHJcbiAgICBkaXY6ICcjZW5xdWV1ZS1lcnJvciA+IGE6bnRoLWNoaWxkKDMpID4gZGl2ID4gc3Ryb25nJ1xyXG4gIH0sXHJcbiAge1xyXG4gICAgdGl0bGU6ICdpbWFnZXRvdGV4dCcsXHJcbiAgICB1cmxfa2V5d29yZDogJ3F1ZXVlJyxcclxuICAgIC8vIGRpdjogJyNjaGFsbGVuZ2UtY29udGFpbmVyID4gYnV0dG9uJ1xyXG4gICAgZGl2OiAnI2xiSGVhZGVyUCdcclxuICB9XHJcbiAgXVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZWxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fJylcclxuICAgIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5sb2NhdGlvbi5ocmVmLCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKHR5cGVsaXN0W2ldLnVybF9rZXl3b3JkKSA+IC0xKVxyXG4gICAgLy8gY29uc29sZS5sb2coZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0eXBlbGlzdFtpXS5kaXYpKVxyXG4gICAgLy8gY29uc29sZS5sb2coKHR5cGVsaXN0W2ldLmltYWdlZGl2ICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHlwZWxpc3RbaV0uaW1hZ2VkaXYpKSlcclxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKHR5cGVsaXN0W2ldLnVybF9rZXl3b3JkKSA+IC0xICYmXHJcbiAgICAgIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHR5cGVsaXN0W2ldLmRpdikgfHwgKHR5cGVsaXN0W2ldLmltYWdlZGl2ICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodHlwZWxpc3RbaV0uaW1hZ2VkaXYpKSkpIHtcclxuICAgICAgcmVzdWx0ID0gdHlwZWxpc3RbaV1cclxuXHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIHJlc29sdmUocmVzdWx0KVxyXG4gIHJldHVybiByZXN1bHRcclxuICAvLyB9XHJcbiAgLy8gfSlcclxufVxyXG5cclxuLy8g572R57uc5rWL6K+VXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0bmV0d29yayh1cmwpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgaWYgKHdpbmRvdy5zZWxmID09PSB3aW5kb3cudG9wKSB7XHJcbiAgICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7IGFjdGlvbjogJ3Rlc3RuZXR3b3JrJywgdXJsOiB1cmwgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZSlcclxuICAgICAgfSlcclxuICAgIH0gZWxzZSB7IHJlc29sdmUodHJ1ZSkgfVxyXG4gIH0pXHJcbn1cclxuXHJcbi8vIHBvc3Qg6K+35rGC5Luj55CGXHJcbmV4cG9ydCBmdW5jdGlvbiBwb3N0KHVybCwgZGF0YSwgZGVsYXkgPSAwLCB0cmllcyA9IDEpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHsgYWN0aW9uOiAncG9zdCcsIHVybCwgZGF0YSwgZGVsYXksIHRyaWVzIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICBpZiAocmVzcG9uc2UgPT09IFwiZmFpbFwiKSB7XHJcbiAgICAgICAgcmVqZWN0KFwiZmFpbFwiKVxyXG4gICAgICB9XHJcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldCh1cmwpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHsgYWN0aW9uOiAnZ2V0JywgdXJsOiB1cmwgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbi8vIOiOt+WPluS9meminVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFsYW5jZSh7IGhvc3QsIGNsaWVudEtleSB9KSB7XHJcbiAgcmV0dXJuIHBvc3QobmV3IFVSTCgnZ2V0QmFsYW5jZScsIGhvc3QpLmhyZWYsIHtcclxuICAgIGNsaWVudEtleVxyXG4gIH0pXHJcbn1cclxuZXhwb3J0IGNvbnN0IGRlbGF5ID0gKHMpID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgcylcclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Y29uZmlnKCkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyBhY3Rpb246ICdnZXRjb25maWcnIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICByZXNwb25zZS50aW1lcyA9IHJlc3BvbnNlLnRpbWVzIHx8IDEwMFxyXG4gICAgICByZXNvbHZlKHJlc3BvbnNlKVxyXG4gICAgfSlcclxuICB9KVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRjb25maWcoY29uZmlnKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7IGFjdGlvbjogJ3NldGNvbmZpZycsIGNvbmZpZyB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgcmVzb2x2ZShyZXNwb25zZSlcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRpdjJiYXNlNjQgPSAoc3JjLCB3aWR0aCA9IDEyOCwgaGVpZ2h0ID0gMTI4KSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGlmICghc3JjKSByZXNvbHZlKG51bGwpXHJcbiAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ0Fub255bW91cycpXHJcbiAgICBpbWcuc3JjID0gc3JjXHJcbiAgICBpbWcud2lkdGggPSB3aWR0aFxyXG4gICAgaW1nLmhlaWdodCA9IGhlaWdodFxyXG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXHJcbiAgICB2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGhcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkgeyAvLyDlm77niYfliqDovb3lrozvvIzlho1kcmF3IOWSjCB0b0RhdGFVUkxcclxuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICBsZXQgYmFzZTY0ID0gY2FudmFzLnRvRGF0YVVSTCgpXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdiYXNlNjQnLCBiYXNlNjQpXHJcbiAgICAgIGxldCBvdXQgPSBiYXNlNjQucmVwbGFjZSgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LCcsICcnKVxyXG5cclxuICAgICAgcmVzb2x2ZShvdXQpXHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmVudFVybCgpIHtcclxuICB2YXIgdXJsID0gbnVsbFxyXG4gIGlmIChwYXJlbnQgIT09IHdpbmRvdykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdXJsID0gcGFyZW50LmxvY2F0aW9uLmhyZWZcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdXJsID0gZG9jdW1lbnQucmVmZXJyZXJcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHVybFxyXG59O1xyXG5cclxuLy8g5peg6ZyA6L+U5Zue55qE6ZSZ6K+v56CBXHJcbmV4cG9ydCBjb25zdCBub3RuZWVkY29udGludWUgPSBlcnJvcnN0ciA9PiB7XHJcbiAgcmV0dXJuIGVycm9yc3RyICYmIGBFUlJPUl9SRVFVSVJFRF9GSUVMRFNcclxuICBFUlJPUl9LRVlfRE9FU19OT1RfRVhJU1RcclxuICBFUlJPUl9aRVJPX0JBTEFOQ0VcclxuICBFUlJPUl9aRVJPX0NBUFRDSEFfRklMRVNJWkVcclxuICBFUlJPUl9ET01BSU5fTk9UX0FMTE9XRURcclxuICBFUlJPUl9UT09fQklHX0NBUFRDSEFfRklMRVNJWkVcclxuICBFUlJPUl9JTExFR0FMX0lNQUdFXHJcbiAgRVJST1JfSVBfQkFOTkVEXHJcbiAgRVJST1JfSVBfQkxPQ0tFRF81TUlOXHJcbiAgRVJST1JfQ0xJRU5US0VZX1VOQVVUSE9SSVpFRGAuaW5jbHVkZXMoZXJyb3JzdHIpXHJcbn1cclxuLy8g562J5b6FZG9t5YWD57Sg5a2Y5ZyoLOi2heaXtiDpu5jorqQxMOenklxyXG5leHBvcnQgY29uc3Qgd2FpdEZvciA9IChkaXZzdHIsIG91dHRpbWUgPSAxMCkgPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBsZXQgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGRpdnN0cikpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKVxyXG4gICAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgICAgfVxyXG4gICAgfSwgMTAwKVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpXHJcbiAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgIH0sIG91dHRpbWUgKiAxMDAwKVxyXG4gIH0pXHJcbn1cclxuLy8g562J5b6F5Zu+5YOP5Yqg6L295a6MXHJcbmV4cG9ydCBjb25zdCBpbWFnZXJlYWR5ID0gKGltZ3NyYykgPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBsZXQgaW1nID0gbmV3IEltYWdlKClcclxuICAgIGltZy5zcmMgPSBpbWdzcmNcclxuICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgIH1cclxuICB9KVxyXG59XHJcbi8vIOetieW+heiDjOaZr+WbvueJh+WxnuaAp+WtmOWcqFxyXG5leHBvcnQgY29uc3Qgd2FpdGZvcmJhY2tncm91bmQgPSBkaXYgPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBsZXQgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmIChkaXYuc3R5bGUgJiYgZGl2LnN0eWxlLmJhY2tncm91bmQpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKVxyXG4gICAgICAgIHJlc29sdmUodHJ1ZSlcclxuICAgICAgfVxyXG4gICAgfSwgMTAwKVxyXG4gIH0pXHJcbn1cclxuXHJcbi8vIOetieW+heiDjOaZr+WbvueJh+WxnuaAp+WtmOWcqFxyXG5leHBvcnQgY29uc3Qgd2FpdGZvcmJhY2tncm91bmRXaXRoVGltZW91dCA9IGRpdiA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGxldCB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgaWYgKGRpdi5zdHlsZS5iYWNrZ3JvdW5kKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcilcclxuICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgIH1cclxuICAgIH0sIDEwMClcclxuICAgIGNvbnN0IHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjbGVhckludGVydmFsKHRpbWVyKVxyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxyXG4gICAgICByZXNvbHZlKGZhbHNlKVxyXG4gICAgfSwgMzAwMCk7XHJcbiAgfSlcclxufVxyXG5cclxuLy8g562J5b6FZnVuY+i/lOWbnnRydWUs6LaF5pe26buY6K6kMTDnp5JcclxuZXhwb3J0IGNvbnN0IHdhaXREbyA9IChmdW5jLCBvdXR0aW1lID0gMTApID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgbGV0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAoZnVuYygpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Z1bmMgdHJ1ZScpXHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcilcclxuICAgICAgICByZXNvbHZlKHRydWUpXHJcbiAgICAgIH1cclxuICAgIH0sIDEwMClcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnZnVuYyBmYWxzZScpXHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpXHJcbiAgICAgIHJlc29sdmUoZmFsc2UpXHJcbiAgICB9LCBvdXR0aW1lICogMTAwMClcclxuICB9KVxyXG59XHJcblxyXG4vLyDlrqLmiLfnq6/ojrflj5bniYjmnKzlj7dcclxuXHJcbmZ1bmN0aW9uIGdldExvY2FsVmVyc2lvbigpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcclxuICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XHJcbiAgICAgIGdldExvY2FsVmVyc2lvbjogdHJ1ZVxyXG4gICAgfSwgZnVuY3Rpb24gKHZlcikge1xyXG4gICAgICByZXNvbHZlKHZlcilcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG5leHBvcnQgY29uc3QgZ2V0Q2xpY2tUaW1lID0gKGNvbmZpZ1RpbWUgPSAwLCByYXRlID0gMC4xKSA9PiB7XHJcblxyXG4gIGNvbnN0IHRpbWVGbG9hdExpbWl0ID0gY29uZmlnVGltZSAqIHJhdGVcclxuXHJcbiAgY29uc3QgdGltZUZsb2F0ID0gTWF0aC5yYW5kb20oKSAqIDIgKiB0aW1lRmxvYXRMaW1pdCAtIHRpbWVGbG9hdExpbWl0XHJcblxyXG4gIHJldHVybiBNYXRoLmNlaWwodGltZUZsb2F0KSArIGNvbmZpZ1RpbWVcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgY29uc3QgZ2V0SXNCbGFja1doaXRlUGFzcyA9IGFzeW5jIChjb25maWcpID0+IHtcclxuICBjb25zdCBpc0luVXJsTGlzdCA9ICh1cmxMaXN0LCB1cmwpID0+IHtcclxuICAgIGNvbnN0IGluZGV4ID0gdXJsTGlzdC5maW5kSW5kZXgocGF0dGVybiA9PlxyXG4gICAgICB1cmwuaW5kZXhPZihwYXR0ZXJuKSA+IC0xXHJcbiAgICApXHJcbiAgICByZXR1cm4gaW5kZXggPiAtMTtcclxuICB9XHJcbiAgY29uc3QganVkZ2VCbGFja1doaXRlID0gKGNvbmZpZywgdXJsKSA9PiB7XHJcbiAgICBjb25zdCBpc09wZW5CbGFja0xpc3QgPSBjb25maWcuYmxhY2tMaXN0Q29uZmlnLmlzT3BlbjtcclxuICAgIGNvbnN0IGlzT3BlbldoaXRlTGlzdCA9IGNvbmZpZy53aGl0ZUxpc3RDb25maWcuaXNPcGVuO1xyXG4gICAgaWYgKGlzT3BlbldoaXRlTGlzdCkge1xyXG4gICAgICBjb25zdCB3aGl0ZVJlc3VsdCA9IGlzSW5VcmxMaXN0KGNvbmZpZy53aGl0ZUxpc3RDb25maWcudXJsTGlzdCB8fCBbXSwgdXJsKVxyXG4gICAgICBpZiAod2hpdGVSZXN1bHQpIHJldHVybiAnaW5XaGl0ZUxpc3QnXHJcbiAgICAgIGVsc2UgcmV0dXJuICdub3RJbldoaXRlTGlzdCdcclxuICAgIH1cclxuICAgIGlmIChpc09wZW5CbGFja0xpc3QpIHtcclxuICAgICAgY29uc3QgYmxhY2tMaXN0UmVzdWx0ID0gaXNJblVybExpc3QoY29uZmlnLmJsYWNrTGlzdENvbmZpZy51cmxMaXN0IHx8IFtdLCB1cmwpXHJcbiAgICAgIGlmIChibGFja0xpc3RSZXN1bHQpIHJldHVybiAnaW5CbGFja0xpc3QnXHJcbiAgICAgIGVsc2UgcmV0dXJuICdub3RJbkJsYWNrTGlzdCdcclxuICAgIH1cclxuICAgIGVsc2UgcmV0dXJuICdub3JtYWwnXHJcblxyXG4gIH1cclxuXHJcbiAgY29uc3QgcXVlcnlDdXJyZW50VXJsID0gKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7IGFjdGlvbjogJ3F1ZXJ5Q3VycmVudFVybCcgfSwgKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpXHJcbiAgICB9KVxyXG4gIH0pXHJcbiAgY29uc3QgY3VycmVudFRhYlVybCA9IGF3YWl0IHF1ZXJ5Q3VycmVudFVybCgpXHJcbiAgY29uc3QgYmxhY2tXaGl0ZVJlc3VsdCA9IGp1ZGdlQmxhY2tXaGl0ZShjb25maWcsIGN1cnJlbnRUYWJVcmwpXHJcbiAgc3dpdGNoIChibGFja1doaXRlUmVzdWx0KSB7XHJcbiAgICBjYXNlICdpbldoaXRlTGlzdCc6XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICAvL+S4jeWcqOeZveWQjeWNlSDnm7TmjqXnu5PmnZ/kuoZcclxuICAgIGNhc2UgJ25vdEluV2hpdGVMaXN0JzpcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAvL+WcqOm7keWQjeWNlemHjCDnm7TmjqXnu5PmnZ/kuoZcclxuICAgIGNhc2UgJ2luQmxhY2tMaXN0JzpcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICBjYXNlICdub3RJbkJsYWNrTGlzdCc6XHJcbiAgICAgIHJldHVybiB0cnVlXHJcbiAgICBjYXNlICdub3JtYWwnOlxyXG4gICAgICByZXR1cm4gdHJ1ZVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIOacrOWcsOeJiOacrOS/oeaBr1xyXG5cclxuZnVuY3Rpb24gbG9jYWxWZXJzaW9uKCkge1xyXG4gIHJldHVybiBsb2NhbFN0b3JhZ2UudmVyc2lvbiA/IGxvY2FsU3RvcmFnZS52ZXJzaW9uIDogMVxyXG59XHJcbmV4cG9ydCB7XHJcbiAgbG9jYWxWZXJzaW9uLFxyXG4gIGdldExvY2FsVmVyc2lvblxyXG59XHJcbiIsImV4cG9ydCBjb25zdCBjb25maWcgPSB7ZGV2ZWxvcDogdHJ1ZX1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWR1cGUta2V5cyAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IGhjYXB0Y2hhSXRlbWxpc3QgPSB7XHJcbiAgJ2FpcnBsYW5lJzogJ+mjnuacuicsXHJcbiAgJ3NlYXBsYW5lJzogJ+mjnuacuicsXHJcbiAgJ21vdG9yYnVzJzogJ+W3tOWjqycsXHJcbiAgJ2J1cyc6ICflt7Tlo6snLFxyXG4gICdib2F0JzogJ+iIuScsXHJcbiAgJ2J1cyc6ICflhazkuqTovaYnLFxyXG4gICd0cmFpbic6ICfngavovaYnLFxyXG4gICd0cnVjayc6ICfljaHovaYnLFxyXG4gICdtb3RvcmN5Y2xlJzogJ+aRqeaJmOi9picsXHJcbiAgJ2JpY3ljbGUnOiAn6Ieq6KGM6L2mJ1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGpzb25hbGwgPSB7XHJcbiAgLy8g55m95L+E572X5pavXHJcbiAg0LPQvtGA0YvQsNCx0L7Qv9Cw0LPQvtGA0LrRljogJy9tLzA5ZF9yJyxcclxuICDQt9C90LDQutGW0L/RgNGL0L/Ri9C90LrRgzogJy9tLzAycHYxOScsXHJcbiAg0LLRg9C70ZbRh9C90YvRj9C30L3QsNC60ZY6ICcvbS8wMW1xZHQnLFxyXG4gINGA0LDRgdC70ZbQvdGLOiAnL20vMDVzMnMnLFxyXG4gINC00YDRjdCy0Ys6ICcvbS8wN2o3cicsXHJcbiAg0YLRgNCw0LLQsDogJy9tLzA4dDljXycsXHJcbiAg0YXQvNGL0LfQvdGP0LrQvtGeOiAnL20vMGdxYnQnLFxyXG4gINC60LDQutGC0YPRgTogJy9tLzAyNV92JyxcclxuICDQv9Cw0LvRjNC80Ys6ICcvbS8wY2RsMScsXHJcbiAg0L/RgNGL0YDQvtC00Ys6ICcvbS8wNWgwbicsXHJcbiAg0LLQsNC00LDRgdC/0LDQtNGLOiAnL20vMGoya3gnLFxyXG4gINCz0L7RgNGLOiAnL20vMDlkX3InLFxyXG4gINC/0LDQs9C+0YDQutGWOiAnL20vMDlkX3InLFxyXG4gINCy0LDQtNCw0ZHQvNGLOiAnL20vMDNrdG0xJyxcclxuICDRgNGN0LrRljogJy9tLzA2Y25wJyxcclxuICDQv9C70Y/QttGLOiAnL20vMGIzeXInLFxyXG4gINCh0L7QvdGG0LA6ICcvbS8wNm1fcCcsXHJcbiAg0JzQtdGB0Y/RhjogJy9tLzA0d3ZfJyxcclxuICDQvdC10LHQsDogJy9tLzAxYnF2cCcsXHJcbiAg0YLRgNCw0L3RgdC/0LDRgNGC0L3Ri9GF0YHRgNC+0LTQutCw0Z46ICcvbS8wazRqJyxcclxuICDQvNCw0YjRi9C90Ys6ICcvbS8wazRqJyxcclxuICDQstC10LvQsNGB0ZbQv9C10LTRizogJy9tLzAxOTlnJyxcclxuICDQvNCw0YLQsNGG0YvQutC70Ys6ICcvbS8wNF9zdicsXHJcbiAg0L/RltC60LDQv9GLOiAnL20vMGN2cTMnLFxyXG4gINC60LDQvNC10YDRhtGL0LnQvdGL0Y/Qs9GA0YPQt9Cw0LLRltC60ZY6ICcvbS8wZmt3amcnLFxyXG4gINC70L7QtNC60ZY6ICcvbS8wMTlqZCcsXHJcbiAg0LvRltC80YPQt9GW0L3RizogJy9tLzAxbGN3NCcsXHJcbiAg0YLQsNC60YHRljogJy9tLzBwZzUyJyxcclxuICDRiNC60L7Qu9GM0L3Ri9Cw0Z7RgtC+0LHRg9GBOiAnL20vMDJ5dmhqJyxcclxuICDQsNGe0YLQvtCx0YPRgTogJy9tLzAxYmp2JyxcclxuICDQsdGD0LTQsNGe0L3RltGH0LDRj9C80LDRiNGL0L3QsDogJy9tLzAyZ3gxNycsXHJcbiAg0YHRgtCw0YLRg9GWOiAnL20vMDEzXzFjJyxcclxuICDRhNCw0L3RgtCw0L3RizogJy9tLzBoOGxoa2cnLFxyXG4gINC80L7RgdGCOiAnL20vMDE1a3InLFxyXG4gINC/0YDRi9GB0YLQsNC90Yw6ICcvbS8wMXBocTQnLFxyXG4gINGF0LzQsNGA0LDRh9C+0YE6ICcvbS8wNzljbCcsXHJcbiAg0YHQu9GD0L/Ri9Cw0LHQvtC60LDQu9C+0L3RizogJy9tLzAxX203JyxcclxuICDQstGW0YLRgNCw0LbRizogJy9tLzAxMXkyMycsXHJcbiAg0LTQvtC8OiAnL20vMDNqbTUnLFxyXG4gINC20YvQu9GL0LTQvtC8OiAnL20vMDFuYmx0JyxcclxuICDRgdCy0LXRgtC70LDQstGL0LTQvtC8OiAnL20vMDRoN2gnLFxyXG4gINGH0YvQs9GD0L3QsNGH0L3QsNGP0YHRgtCw0L3RhtGL0Y86ICcvbS8wcHkyNycsXHJcbiAg0L/QvtC/0LXQu9Cw0Lw6ICcvbS8wMW42ZmQnLFxyXG4gINCy0L7Qs9C90LXQs9Cw0LTRgNCw0L3RgjogJy9tLzAxcG5zMCcsXHJcbiAg0YDRjdC60LvQsNC80L3Ri9GI0YfRi9GCOiAnL20vMDFrbmpiJyxcclxuICDQtNCw0YDQvtCz0ZY6ICcvbS8wNmdmaicsXHJcbiAg0L/QtdGI0LDRhdC+0LTQvdGL0Y/Qv9C10YDQsNGF0L7QtNGLOiAnL20vMDE0eGNzJyxcclxuICDRgdCy0Y/RgtC70LDRhNC+0YA6ICcvbS8wMTVxZmYnLFxyXG4gINCz0LDRgNCw0LbQvdGL0Y/QtNC30LLQtdGA0Ys6ICcvbS8wOGw5NDEnLFxyXG4gINCw0Z7RgtC+0LHRg9GB0L3Ri9GP0L/RgNGL0L/Ri9C90LrRljogJy9tLzAxandfMScsXHJcbiAg0YLRgNCw0YTRltC60YM6ICcvbS8wM3N5N3YnLFxyXG4gINC/0LDRgNC60L7QvNCw0YLQsNGA0Ys6ICcvbS8wMTVxYnAnLFxyXG4gINC70LXRgdCy0ZbRhtGLOiAnL20vMDFseW5oJyxcclxuICDQutC+0LzRltC90Ys6ICcvbS8wMWprXzQnLFxyXG4gINGC0YDQsNC60YLQsNGA0Ys6ICcvbS8wMTN4bG0nLFxyXG5cclxuICAvLyDms7Dor61cclxuICDguKDguLnguYDguILguLLguKvguKPguLfguK3guYDguJnguLTguJnguYDguILguLI6ICcvbS8wOWRfcicsXHJcbiAg4Lib4LmJ4Liy4Lii4Lir4Lii4Li44LiUOiAnL20vMDJwdjE5JyxcclxuICDguJvguYnguLLguKLguJbguJnguJk6ICcvbS8wMW1xZHQnLFxyXG4gIOC4nuC4t+C4ijogJy9tLzA1czJzJyxcclxuICDguJXguYnguJnguYTguKHguYk6ICcvbS8wN2o3cicsXHJcbiAg4Lir4LiN4LmJ4LiyOiAnL20vMDh0OWNfJyxcclxuICDguJ7guLjguYjguKHguYTguKHguYk6ICcvbS8wZ3FidCcsXHJcbiAg4LiB4Lij4Liw4Lia4Lit4LiH4LmA4Lie4LiK4LijOiAnL20vMDI1X3YnLFxyXG4gIOC4leC5ieC4meC4m+C4suC4peC5jOC4oTogJy9tLzBjZGwxJyxcclxuICDguJjguKPguKPguKHguIrguLLguJXguLQ6ICcvbS8wNWgwbicsXHJcbiAg4LiZ4LmJ4Liz4LiV4LiBOiAnL20vMGoya3gnLFxyXG4gIOC4oOC4ueC5gOC4guC4sjogJy9tLzA5ZF9yJyxcclxuICDguYDguJnguLTguJnguYDguILguLI6ICcvbS8wOWRfcicsXHJcbiAg4LmB4Lir4Lil4LmI4LiH4LiZ4LmJ4LizOiAnL20vMDNrdG0xJyxcclxuICDguYHguKHguYjguJnguYnguLM6ICcvbS8wNmNucCcsXHJcbiAg4LiK4Liy4Lii4Lir4Liy4LiUOiAnL20vMGIzeXInLFxyXG4gIOC4lOC4p+C4h+C4reC4suC4l+C4tOC4leC4ouC5jDogJy9tLzA2bV9wJyxcclxuICDguJTguKfguIfguIjguLHguJnguJfguKPguYw6ICcvbS8wNHd2XycsXHJcbiAg4LiX4LmJ4Lit4LiH4Lif4LmJ4LiyOiAnL20vMDFicXZwJyxcclxuICDguKLguLLguJnguJ7guLLguKvguJnguLA6ICcvbS8wazRqJyxcclxuICDguKPguJY6ICcvbS8wazRqJyxcclxuICDguIjguLHguIHguKPguKLguLLguJk6ICcvbS8wMTk5ZycsXHJcbiAg4Lij4LiW4LiI4Lix4LiB4Lij4Lii4Liy4LiZ4Lii4LiZ4LiV4LmMOiAnL20vMDRfc3YnLFxyXG4gIOC4o+C4luC4m+C4tOC4hOC4reC4seC4njogJy9tLzBjdnEzJyxcclxuICDguKPguJbguJrguKPguKPguJfguLjguIHguYDguIrguLTguIfguJ7guLLguJPguLTguIrguKLguYw6ICcvbS8wZmt3amcnLFxyXG4gIOC5gOC4o+C4t+C4rTogJy9tLzAxOWpkJyxcclxuICDguKPguJbguKXguLXguKHguLnguIvguLXguJk6ICcvbS8wMWxjdzQnLFxyXG4gIOC5geC4l+C5h+C4geC4i+C4teC5iDogJy9tLzBwZzUyJyxcclxuICDguKPguJbguYLguKPguIfguYDguKPguLXguKLguJk6ICcvbS8wMnl2aGonLFxyXG4gIOC4o+C4quC4muC4seC4qjogJy9tLzAxYmp2JyxcclxuICDguKPguJbguIHguYjguK3guKrguKPguYnguLLguIc6ICcvbS8wMmd4MTcnLFxyXG4gIOC4o+C4ueC4m+C4m+C4seC5ieC4mTogJy9tLzAxM18xYycsXHJcbiAg4LiZ4LmJ4Liz4Lie4Li4OiAnL20vMGg4bGhrZycsXHJcbiAg4Liq4Liw4Lie4Liy4LiZOiAnL20vMDE1a3InLFxyXG4gIOC4l+C5iOC4suC5gOC4o+C4t+C4rTogJy9tLzAxcGhxNCcsXHJcbiAg4LiV4Li24LiB4Lij4Liw4Lif4LmJ4LiyOiAnL20vMDc5Y2wnLFxyXG4gIOC5gOC4quC4suC5gOC4quC4sjogJy9tLzAxX203JyxcclxuICDguIHguKPguLDguIjguIHguKrguLU6ICcvbS8wMTF5MjMnLFxyXG4gIOC4muC5ieC4suC4mTogJy9tLzAzam01JyxcclxuICDguJXguLbguIHguK3guJ7guLLguKPguYzguJXguYDguKHguJnguJfguYw6ICcvbS8wMW5ibHQnLFxyXG4gIOC4m+C4o+C4sOC4oOC4suC4hOC4suC4ozogJy9tLzA0aDdoJyxcclxuICDguKrguJbguLLguJnguLXguKPguJbguYTguJ86ICcvbS8wcHkyNycsXHJcbiAg4LmA4LiW4LmJ4Liy4LiW4LmI4Liy4LiZOiAnL20vMDFuNmZkJyxcclxuICDguJTguLHguJrguYDguJ7guKXguLTguIc6ICcvbS8wMXBuczAnLFxyXG4gIOC4m+C5ieC4suC4ouC4muC4tOC4peC4muC4reC4o+C5jOC4lDogJy9tLzAxa25qYicsXHJcbiAg4LiW4LiZ4LiZOiAnL20vMDZnZmonLFxyXG4gIOC4l+C4suC4h+C4oeC5ieC4suC4peC4suC4ojogJy9tLzAxNHhjcycsXHJcbiAg4LmE4Lif4LiI4Lij4Liy4LiI4LijOiAnL20vMDE1cWZmJyxcclxuICDguJvguKPguLDguJXguLnguYLguKPguIfguKPguJY6ICcvbS8wOGw5NDEnLFxyXG4gIOC4m+C5ieC4suC4ouC4o+C4luC5gOC4oeC4peC5jDogJy9tLzAxandfMScsXHJcbiAg4LiB4Lij4Lin4Lii4LiI4Lij4Liy4LiI4LijOiAnL20vMDNzeTd2JyxcclxuICDguYDguKHguJXguKPguJfguLXguYjguIjguK3guJTguKPguJY6ICcvbS8wMTVxYnAnLFxyXG4gIOC4muC4seC4meC5hOC4lDogJy9tLzAxbHluaCcsXHJcbiAg4Lib4Lil4LmI4Lit4LiH4LmE4LifOiAnL20vMDFqa180JyxcclxuICDguKPguJbguYHguJfguKPguIHguYDguJXguK3guKPguYw6ICcvbS8wMTN4bG0nLFxyXG4gIOC4o+C4luC4muC4seC4qjogJy9tLzAxYmp2JyxcclxuICDguKPguJbguIjguLHguIHguKPguKLguLLguJk6ICcvbS8wMTk5ZycsXHJcbiAg4Lir4Lix4Lin4LiB4LmK4Lit4LiB4LiZ4LmJ4Liz4LiU4Lix4Lia4LmA4Lie4Lil4Li04LiHOiAnL20vMDFwbnMwJyxcclxuICDguKPguJbguKLguJnguJXguYw6ICcvbS8wazRqJyxcclxuXHJcbiAgLy8g5Zyf6ICz5YW2XHJcbiAgZGHEn2xhcnZleWF0ZXBlbGVyOiAnL20vMDlkX3InLFxyXG4gICdkdXJcImnFn2FyZXRsZXJpJzogJy9tLzAycHYxOScsXHJcbiAgc29rYWtpxZ9hcmV0bGVyaTogJy9tLzAxbXFkdCcsXHJcbiAgYml0a2lsZXI6ICcvbS8wNXMycycsXHJcbiAgYcSfYcOnbGFyOiAnL20vMDdqN3InLFxyXG4gIMOHaW1lbjogJy9tLzA4dDljXycsXHJcbiAgw6dhbMSxbGFyOiAnL20vMGdxYnQnLFxyXG4gIGtha3TDvHM6ICcvbS8wMjVfdicsXHJcbiAgUGFsbWl5ZWHEn2HDp2xhcsSxOiAnL20vMGNkbDEnLFxyXG4gIERvxJ9hOiAnL20vMDVoMG4nLFxyXG4gIMWfZWxhbGVsZXI6ICcvbS8wajJreCcsXHJcbiAgZGHEn2xhcjogJy9tLzA5ZF9yJyxcclxuICB0ZXBlbGVyOiAnL20vMDlkX3InLFxyXG4gIHN1eXVuYmVkZW5sZXJpOiAnL20vMDNrdG0xJyxcclxuICBuZWhpcmxlcjogJy9tLzA2Y25wJyxcclxuICBTYWhpbGxlcjogJy9tLzBiM3lyJyxcclxuICBHw7xuZcWfOiAnL20vMDZtX3AnLFxyXG4gIEF5OiAnL20vMDR3dl8nLFxyXG4gIGfDtmt5w7x6w7w6ICcvbS8wMWJxdnAnLFxyXG4gIEFyYcOnbGFyOiAnL20vMGs0aicsXHJcbiAgYXJhYmFsYXI6ICcvbS8wazRqJyxcclxuICBiaXNpa2xldGxlcjogJy9tLzAxOTlnJyxcclxuICBtb3Rvc2lrbGV0bGVyOiAnL20vMDRfc3YnLFxyXG4gIGthbXlvbmV0bGVyOiAnL20vMGN2cTMnLFxyXG4gIHRpY2FyaWthbXlvbmxhcjogJy9tLzBma3dqZycsXHJcbiAgdGVrbmVsZXI6ICcvbS8wMTlqZCcsXHJcbiAgbGltdXppbmxlcjogJy9tLzAxbGN3NCcsXHJcbiAgdGFrc2lsZXI6ICcvbS8wcGc1MicsXHJcbiAgb2t1bG90b2LDvHPDvDogJy9tLzAyeXZoaicsXHJcbiAgb3RvYsO8czogJy9tLzAxYmp2JyxcclxuICBpbsWfYWF0YXJhY8SxOiAnL20vMDJneDE3JyxcclxuICBoZXlrZWxsZXI6ICcvbS8wMTNfMWMnLFxyXG4gIMOnZcWfbWVsZXI6ICcvbS8waDhsaGtnJyxcclxuICBrw7ZwcsO8OiAnL20vMDE1a3InLFxyXG4gIGlza2VsZTogJy9tLzAxcGhxNCcsXHJcbiAgZ8O2a2RlbGVuOiAnL20vMDc5Y2wnLFxyXG4gIHPDvHR1bnPDvHR1bmxhcsSxOiAnL20vMDFfbTcnLFxyXG4gIHZpdHJheTogJy9tLzAxMXkyMycsXHJcbiAgZXY6ICcvbS8wM2ptNScsXHJcbiAgYXBhcnRtYW5iaW5hc8SxOiAnL20vMDFuYmx0JyxcclxuICBoYWZpZmV2OiAnL20vMDRoN2gnLFxyXG4gIHRyZW5pc3Rhc3lvbnU6ICcvbS8wcHkyNycsXHJcbiAga8O8bDogJy9tLzAxbjZmZCcsXHJcbiAgeWFuZ8Sxbm11c2x1xJ91OiAnL20vMDFwbnMwJyxcclxuICByZWtsYW1wYW5vc3U6ICcvbS8wMWtuamInLFxyXG4gIHlvbGxhcjogJy9tLzA2Z2ZqJyxcclxuICB5YXlhZ2XDp2l0bGVyaTogJy9tLzAxNHhjcycsXHJcbiAgdHJhZmlrxLHFn8Sxa2xhcsSxOiAnL20vMDE1cWZmJyxcclxuICBnYXJhamthcMSxbGFyxLE6ICcvbS8wOGw5NDEnLFxyXG4gIG90b2LDvHNkdXJha2xhcsSxOiAnL20vMDFqd18xJyxcclxuICB0cmFmaWtLb25pbGVyaTogJy9tLzAzc3k3dicsXHJcbiAgUGFya3NheWFjxLE6ICcvbS8wMTVxYnAnLFxyXG4gIG1lcmRpdmVubGVyOiAnL20vMDFseW5oJyxcclxuICBiYWNhbGFyOiAnL20vMDFqa180JyxcclxuICB0cmFrdMO2cmxlcjogJy9tLzAxM3hsbScsXHJcbiAgWWFuZ8Sxbm11c2x1xJ91OiAnL20vMDFwbnMwJyxcclxuXHJcbiAgVHJha3TDtnI6ICcvbS8wMTN4bG0nLFxyXG4gIFRyYWZpa2xhbWJhc8SxOiAnL20vMDE1cWZmJyxcclxuICBNb3Rvc2lrbGV0aW46ICcvbS8wNF9zdicsXHJcbiAgQmFjYTogJy9tLzAxamtfNCcsXHJcbiAgTWVyZGl2ZW46ICcvbS8wMWx5bmgnLFxyXG4gIERhxJ92ZXlhdGVwZTogJy9tLzA5ZF9yJyxcclxuICBQYWxtaXllYcSfYWPEsTogJy9tLzBjZGwxJyxcclxuICBZYXlhZ2XDp2lkaTogJy9tLzAxNHhjcycsXHJcbiAgS8O2cHLDvDogJy9tLzAxNWtyJyxcclxuICBUYWtzaTogJy9tLzBwZzUyJyxcclxuICBUZWtuZTogJy9tLzAxOWpkJyxcclxuICBPdG9iw7xzOiAnL20vMDFianYnLFxyXG4gIEJpc2lrbGV0OiAnL20vMDE5OWcnLFxyXG4gIE1vdG9zaWtsZXQ6ICcvbS8wNF9zdicsXHJcbiAgVGHFn8SxdDogJy9tLzBrNGonLFxyXG4gIEFyYWJhOiAnL20vMGs0aicsXHJcblxyXG4gIC8vIOaXpeivrVxyXG4gIOOCueODiOODg+ODl+OCteOCpOODszogJy9tLzAycHYxOScsXHJcbiAg6YGT6Lev5qiZ6K2YOiAnL20vMDFtcWR0JyxcclxuICDmpI3niak6ICcvbS8wNXMycycsXHJcbiAg5pyoOiAnL20vMDdqN3InLFxyXG4gIOiNiTogJy9tLzA4dDljXycsXHJcbiAg5L2O5pyoOiAnL20vMGdxYnQnLFxyXG4gIOOCq+OCr+OCv+OCuTogJy9tLzAyNV92JyxcclxuICDjg6Tjgrfjga7mnKg6ICcvbS8wY2RsMScsXHJcbiAg6Ieq54S2OiAnL20vMDVoMG4nLFxyXG4gIOa7nTogJy9tLzBqMmt4JyxcclxuICDlsbE6ICcvbS8wOWRfcicsXHJcbiAg5LiYOiAnL20vMDlkX3InLFxyXG4gIOawtOWfnzogJy9tLzAza3RtMScsXHJcbiAg5rKz5bedOiAnL20vMDZjbnAnLFxyXG4gIOODk+ODvOODgTogJy9tLzBiM3lyJyxcclxuICDlpKrpmb06ICcvbS8wNm1fcCcsXHJcbiAg5pyIOiAnL20vMDR3dl8nLFxyXG4gIOepujogJy9tLzAxYnF2cCcsXHJcbiAg6LuK5LihOiAnL20vMGs0aicsXHJcbiAg6Ieq5YuV6LuKOiAnL20vMGs0aicsXHJcbiAg6LuKOiAnL20vMGs0aicsXHJcbiAg6Ieq6Lui6LuKOiAnL20vMDE5OWcnLFxyXG4gIOOCquODvOODiOODkOOCpDogJy9tLzA0X3N2JyxcclxuICDjg5Tjg4Pjgq/jgqLjg4Pjg5fjg4jjg6njg4Pjgq86ICcvbS8wY3ZxMycsXHJcbiAg44Kz44Oe44O844K344Oj44Or44OI44Op44OD44KvOiAnL20vMGZrd2pnJyxcclxuICDjg5zjg7zjg4g6ICcvbS8wMTlqZCcsXHJcbiAg44Oq44Og44K444OzOiAnL20vMDFsY3c0JyxcclxuICDjgr/jgq/jgrfjg7w6ICcvbS8wcGc1MicsXHJcbiAg44K544Kv44O844Or44OQ44K5OiAnL20vMDJ5dmhqJyxcclxuICDjg5Djgrk6ICcvbS8wMWJqdicsXHJcbiAg5bu66Kit6LuK5LihOiAnL20vMDJneDE3JyxcclxuICDlvavlg486ICcvbS8wMTNfMWMnLFxyXG4gIOWZtOawtDogJy9tLzBoOGxoa2cnLFxyXG4gIOapizogJy9tLzAxNWtyJyxcclxuICDmqYvohJo6ICcvbS8wMXBocTQnLFxyXG4gIOi2hemrmOWxpOODk+ODqzogJy9tLzA3OWNsJyxcclxuICDmn7Hjgb7jgZ/jga/mn7E6ICcvbS8wMV9tNycsXHJcbiAg44K544OG44Oz44OJ44Kw44Op44K5OiAnL20vMDExeTIzJyxcclxuICDlrrY6ICcvbS8wM2ptNScsXHJcbiAg44Ki44OK44OR44O844OI44Oh44Oz44OI44OT44OrOiAnL20vMDFuYmx0JyxcclxuICDnga/lj7A6ICcvbS8wNGg3aCcsXHJcbiAg44Gn44KT44GX44KD44Gu44KK44GwOiAnL20vMHB5MjcnLFxyXG4gIOWwj+WxizogJy9tLzAxbjZmZCcsXHJcbiAg5raI54Gr5YmkOiAnL20vMDFwbnMwJyxcclxuICDjgqLjg5Pjg6vjg5zjg7zjg4k6ICcvbS8wMWtuamInLFxyXG4gIOmBk+i3rzogJy9tLzA2Z2ZqJyxcclxuICDmqKrmlq3mranpgZM6ICcvbS8wMTR4Y3MnLFxyXG4gIOS/oeWPt+apnzogJy9tLzAxNXFmZicsXHJcbiAg5Lqk6YCa54GvOiAnL20vMDE1cWZmJyxcclxuICDjgqzjg6zjg7zjgrjjg4njgqI6ICcvbS8wOGw5NDEnLFxyXG4gIOODkOOCueWBnDogJy9tLzAxandfMScsXHJcbiAg44OI44Op44OV44Kj44OD44Kv44Kz44O844OzOiAnL20vMDNzeTd2JyxcclxuICDjg5Hjg7zjgq3jg7PjgrDjg6Hjg7zjgr/jg7w6ICcvbS8wMTVxYnAnLFxyXG4gIOmajuautTogJy9tLzAxbHluaCcsXHJcbiAg54WZ56qBOiAnL20vMDFqa180JyxcclxuICDjg4jjg6njgq/jgr/jg7w6ICcvbS8wMTN4bG0nLFxyXG5cclxuICDlsbHjgoTkuJg6ICcvbS8wOWRfcicsXHJcblxyXG4gIC8vIOe5geS9k+S4reaWhzog5Y+w5rm+XHJcbiAg5YGc6LuK5qiZ6KqMOiAnL20vMDJwdjE5JyxcclxuICDot6/niYw6ICcvbS8wMW1xZHQnLFxyXG4gIOaoueacqDogJy9tLzA3ajdyJyxcclxuICDngYzmnKg6ICcvbS8wZ3FidCcsXHJcbiAg5LuZ5Lq65o6MOiAnL20vMDI1X3YnLFxyXG4gIOajlearmuaouTogJy9tLzBjZGwxJyxcclxuICDngJHluIM6ICcvbS8wajJreCcsXHJcbiAg6auY5bGx5oiW5bGx5LiYOiAnL20vMDlkX3InLFxyXG4gIOS4mOmZtTogJy9tLzA5ZF9yJyxcclxuICDmsLTpq5Q6ICcvbS8wM2t0bTEnLFxyXG4gIOays+a1gTogJy9tLzA2Y25wJyxcclxuICDmtbfngZg6ICcvbS8wYjN5cicsXHJcbiAg5pyI5LquOiAnL20vMDR3dl8nLFxyXG4gIOWkqeepujogJy9tLzAxYnF2cCcsXHJcbiAg6LuK6LybOiAnL20vMGs0aicsXHJcbiAg5rG96LuKOiAnL20vMGs0aicsXHJcbiAg6IWz6LiP6LuKOiAnL20vMDE5OWcnLFxyXG4gIOiHquihjOi7ijogJy9tLzAxOTlnJyxcclxuICDmqZ/ou4o6ICcvbS8wNF9zdicsXHJcbiAg5pGp5omY6LuKOiAnL20vMDRfc3YnLFxyXG4gIOearuWNoei7ijogJy9tLzBjdnEzJyxcclxuICDllYbnlKjljaHou4o6ICcvbS8wZmt3amcnLFxyXG4gIOiIuTogJy9tLzAxOWpkJyxcclxuICDosaroj6/ovY7ou4o6ICcvbS8wMWxjdzQnLFxyXG4gIOWHuuenn+i7ijogJy9tLzBwZzUyJyxcclxuICDmoKHou4o6ICcvbS8wMnl2aGonLFxyXG4gIOWFrOi7ijogJy9tLzAxYmp2JyxcclxuICDlhazlhbHmsb3ou4o6ICcvbS8wMWJqdicsXHJcbiAg5pa95bel6LuK6LybOiAnL20vMDJneDE3JyxcclxuICDpm5Xlg486ICcvbS8wMTNfMWMnLFxyXG4gIOWZtOaziTogJy9tLzBoOGxoa2cnLFxyXG4gIOapi+aigTogJy9tLzAxNWtyJyxcclxuICDnorzpoK06ICcvbS8wMXBocTQnLFxyXG4gIOaRqeWkqeWkp+aokzogJy9tLzA3OWNsJyxcclxuICDmn7HlrZDmiJbmn7HlrZA6ICcvbS8wMV9tNycsXHJcbiAg5b2p6Imy546755KDOiAnL20vMDExeTIzJyxcclxuICDmiL/lrZA6ICcvbS8wM2ptNScsXHJcbiAg5YWs5a+T5qiTOiAnL20vMDFuYmx0JyxcclxuICDnh4jloZQ6ICcvbS8wNGg3aCcsXHJcbiAg54Gr6LuK56uZOiAnL20vMHB5MjcnLFxyXG4gIOS4gOajmjogJy9tLzAxbjZmZCcsXHJcbiAg5raI6Ziy5qCTOiAnL20vMDFwbnMwJyxcclxuICDlu6PlkYrniYw6ICcvbS8wMWtuamInLFxyXG4gIOihjOS6uuepv+i2iumBkzogJy9tLzAxNHhjcycsXHJcbiAg5Lq66KGM5qmr6YGTOiAnL20vMDE0eGNzJyxcclxuICDntIXntqDnh4g6ICcvbS8wMTVxZmYnLFxyXG4gIOi7iuW6q+mWgDogJy9tLzA4bDk0MScsXHJcbiAg5be05aOr56uZOiAnL20vMDFqd18xJyxcclxuICDkuqTpgJrpjJA6ICcvbS8wM3N5N3YnLFxyXG4gIOWBnOi7iuWgtOioiOWDueihqDogJy9tLzAxNXFicCcsXHJcbiAg5qiT5qKvOiAnL20vMDFseW5oJyxcclxuICDnhZnlm6o6ICcvbS8wMWprXzQnLFxyXG4gIOaLluaLieapnzogJy9tLzAxM3hsbScsXHJcblxyXG4gIC8vIOe5geS9k+S4reaWh++8mummmea4r1xyXG4gIOmbu+WWrui7ijogJy9tLzA0X3N2JyxcclxuICDllq7ou4o6ICcvbS8wMTk5ZycsXHJcbiAg5be05aOrOiAnL20vMDFianYnLFxyXG4gIOWNgeWtl+i3r+WPozogJy9tLzAxNHhjcycsXHJcbiAg5Lqk6YCa54eIOiAnL20vMDE1cWZmJyxcclxuICDmlpHppqznt5o6ICcvbS8wMTR4Y3MnLFxyXG4gIOioiOeoi+i7ijogJy9tLzBwZzUyJyxcclxuICDnmoTlo6s6ICcvbS8wcGc1MicsXHJcbiAg6Ii56Zq7OiAnL20vMDE5amQnLFxyXG4gIOWxseWzsOaIluWxsTogJy9tLzA5ZF9yJyxcclxuICDmqYvmqJE6ICcvbS8wMTVrcicsXHJcblxyXG4gIC8vIOS/hOivrVxyXG4gICfRgdGC0L7Qvy3RgdC40LPQvdCw0LvRiyc6ICcvbS8wMnB2MTknLFxyXG4gICfQtNC+0YDQvtC20L3Ri9C1INC30L3QsNC60LgnOiAnL20vMDFtcWR0JyxcclxuICDRgNCw0YHRgtC10L3QuNGPOiAnL20vMDVzMnMnLFxyXG4gINC00LXRgNC10LLRjNGPOiAnL20vMDdqN3InLFxyXG4gINC60YPRgdGC0LDRgNC90LjQutC4OiAnL20vMGdxYnQnLFxyXG4gICfQv9Cw0LvRjNC80L7QstGL0LUg0LTQtdGA0LXQstGM0Y8nOiAnL20vMGNkbDEnLFxyXG4gINC/0YDQuNGA0L7QtNCwOiAnL20vMDVoMG4nLFxyXG4gINCy0L7QtNC+0L/QsNC00Ys6ICcvbS8wajJreCcsXHJcbiAg0YXQvtC70LzRizogJy9tLzA5ZF9yJyxcclxuICDQstC+0LTQvtC10LzRizogJy9tLzAza3RtMScsXHJcbiAg0YDQtdC60Lg6ICcvbS8wNmNucCcsXHJcbiAg0L/Qu9GP0LbQuDogJy9tLzBiM3lyJyxcclxuICDRgdC+0LvQvdGG0LU6ICcvbS8wNm1fcCcsXHJcbiAg0JvRg9C90LA6ICcvbS8wNHd2XycsXHJcbiAg0L3QtdCx0L46ICcvbS8wMWJxdnAnLFxyXG4gICfRgtGA0LDQvdGB0L/QvtGA0YLQvdGL0LUg0YHRgNC10LTRgdGC0LLQsCc6ICcvbS8wazRqJyxcclxuICDQvNCw0YjQuNC90Ys6ICcvbS8wazRqJyxcclxuICDQstC10LvQvtGB0LjQv9C10LTRizogJy9tLzAxOTlnJyxcclxuICDQvNC+0YLQvtGG0LjQutC70Ys6ICcvbS8wNF9zdicsXHJcbiAg0L/QuNC60LDQv9GLOiAnL20vMGN2cTMnLFxyXG4gICfQutC+0LzQvNC10YDRh9C10YHQutC40LUg0LPRgNGD0LfQvtCy0LjQutC4JzogJy9tLzBma3dqZycsXHJcbiAg0LvQvtC00LrQuDogJy9tLzAxOWpkJyxcclxuICDQu9C40LzRg9C30LjQvdGLOiAnL20vMDFsY3c0JyxcclxuICDQotCw0LrRgdC40YE6ICcvbS8wcGc1MicsXHJcbiAgJ9GI0LrQvtC70YzQvdGL0Lkg0LDQstGC0L7QsdGD0YEnOiAnL20vMDJ5dmhqJyxcclxuICDQsNCy0YLQvtCx0YPRgTogJy9tLzAxYmp2JyxcclxuICAn0YHRgtGA0L7QuNGC0LXQu9GM0L3QsNGPINC80LDRiNC40L3QsCc6ICcvbS8wMmd4MTcnLFxyXG4gINGB0YLQsNGC0YPQuDogJy9tLzAxM18xYycsXHJcbiAg0YTQvtC90YLQsNC90Ys6ICcvbS8waDhsaGtnJyxcclxuICDQv9C40YDRgTogJy9tLzAxcGhxNCcsXHJcbiAg0L3QtdCx0L7RgdC60YDQtdCxOiAnL20vMDc5Y2wnLFxyXG4gICfRgdGC0L7Qu9Cx0YvQuNC70Lgg0LrQvtC70L7QvdC90YsnOiAnL20vMDFfbTcnLFxyXG4gINCy0LjRgtGA0LDQtjogJy9tLzAxMXkyMycsXHJcbiAgJ9C80L3QvtCz0L7QutCy0LDRgNGC0LjRgNC90YvQuSDQtNC+0LwnOiAnL20vMDFuYmx0JyxcclxuICAn0YHQstC10YLQu9GL0Lkg0LTQvtC8JzogJy9tLzA0aDdoJyxcclxuICAn0LbQtdC70LXQt9C90L7QtNC+0YDQvtC20L3QsNGPINGB0YLQsNC90YbQuNGPJzogJy9tLzBweTI3JyxcclxuICDQv9C10L/QtdC70YzQvdGL0Lk6ICcvbS8wMW42ZmQnLFxyXG4gICfQv9C+0LbQsNGA0L3Ri9C5INCz0LjQtNGA0LDQvdGCJzogJy9tLzAxcG5zMCcsXHJcbiAgJ9GA0LXQutC70LDQvNC90YvQuSDRidC40YInOiAnL20vMDFrbmpiJyxcclxuICDQtNC+0YDQvtCz0Lg6ICcvbS8wNmdmaicsXHJcbiAgJ9C/0LXRiNC10YXQvtC00L3Ri9C1INC/0LXRgNC10YXQvtC00YsnOiAnL20vMDE0eGNzJyxcclxuICDRgdCy0LXRgtC+0YTQvtGAOiAnL20vMDE1cWZmJyxcclxuICAn0LPQsNGA0LDQttC90YvQtSDQstC+0YDQvtGC0LAnOiAnL20vMDhsOTQxJyxcclxuICAn0LDQstGC0L7QsdGD0YHQvdGL0LUg0L7RgdGC0LDQvdC+0LLQutC4JzogJy9tLzAxandfMScsXHJcbiAg0LrQvtC90YPRgdGLOiAnL20vMDNzeTd2JyxcclxuICAn0L/QsNGA0LrQvtCy0L7Rh9C90YvQtSDRgdGH0LXRgtGH0LjQutC4JzogJy9tLzAxNXFicCcsXHJcbiAg0LvQtdGB0YLQvdC40YbQsDogJy9tLzAxbHluaCcsXHJcbiAg0LTRi9C80L7RhdC+0LTRizogJy9tLzAxamtfNCcsXHJcbiAg0YLRgNCw0LrRgtC+0YDRizogJy9tLzAxM3hsbScsXHJcblxyXG4gINCw0LLRgtC+0LzQvtCx0LjQu9C4OiAnL20vMGs0aicsXHJcbiAg0LPQvtGA0YvQuNC70LjRhdC+0LvQvNGLOiAnL20vMDlkX3InLFxyXG4gINGB0LLQtdGC0L7RhNC+0YDRizogJy9tLzAxNXFmZicsXHJcbiAg0YLRgNCw0L3RgdC/0L7RgNGC0L3Ri9C10YHRgNC10LTRgdGC0LLQsDogJy9tLzBrNGonLFxyXG4gINC/0LXRiNC10YXQvtC00L3Ri9C10L/QtdGA0LXRhdC+0LTRizogJy9tLzAxNHhjcycsXHJcbiAg0L/QvtC20LDRgNC90YvQtdCz0LjQtNGA0LDQvdGC0Ys6ICcvbS8wMXBuczAnLFxyXG4gINC70LXRgdGC0L3QuNGG0Ys6ICcvbS8wMWx5bmgnLFxyXG4gINCz0LjQtNGA0LDQvdGC0LDQvNC4OiAnL20vMDFwbnMwJyxcclxuICDQsNCy0YLQvtCx0YPRgdGLOiAnL20vMDFianYnLFxyXG4gINC00YvQvNC+0LLRi9C10YLRgNGD0LHRizogJy9tLzAxamtfNCcsXHJcbiAg0YLRgNCw0LrRgtC+0YDQsDogJy9tLzAxM3hsbScsXHJcbiAg0YLQsNC60YHQuDogJy9tLzBwZzUyJyxcclxuICDQvNC+0YHRgtCw0LzQuDogJy9tLzAxNWtyJyxcclxuXHJcbiAgLy8g5LmM5YWL5YWw6K+tXHJcbiAg0LPQvtGA0LjRh9C40L/QsNCz0L7RgNCx0Lg6ICcvbS8wOWRfcicsXHJcbiAg0LfQvdCw0LrQuNC30YPQv9C40L3QutC4OiAnL20vMDJwdjE5JyxcclxuICDQtNC+0YDQvtC20L3RltC30L3QsNC60Lg6ICcvbS8wMW1xZHQnLFxyXG4gINGA0L7RgdC70LjQvdC4OiAnL20vMDVzMnMnLFxyXG4gINC00LXRgNC10LLQsDogJy9tLzA3ajdyJyxcclxuICDRh9Cw0LPQsNGA0L3QuNC60Lg6ICcvbS8wZ3FidCcsXHJcbiAg0L/QsNC70YzQvNC+0LLRltC00LXRgNC10LLQsDogJy9tLzBjZGwxJyxcclxuICDQstC+0LTQvtGB0L/QsNC00Lg6ICcvbS8wajJreCcsXHJcbiAg0LPQvtGA0Lg6ICcvbS8wOWRfcicsXHJcbiAg0L/QsNCz0L7RgNCx0Lg6ICcvbS8wOWRfcicsXHJcbiAg0LLQvtC00L7QudC80Lg6ICcvbS8wM2t0bTEnLFxyXG4gINGA0ZbRh9C60Lg6ICcvbS8wNmNucCcsXHJcbiAg0L/Qu9GP0LbRljogJy9tLzBiM3lyJyxcclxuICDRgdC+0L3RhtC1OiAnL20vMDZtX3AnLFxyXG4gINCc0ZbRgdGP0YbRjDogJy9tLzA0d3ZfJyxcclxuICDQvdC10LHQvjogJy9tLzAxYnF2cCcsXHJcbiAg0YLRgNCw0L3RgdC/0L7RgNGC0L3RltC30LDRgdC+0LHQuDogJy9tLzBrNGonLFxyXG4gINCw0LLRgtC+0LzQvtCx0ZbQu9GW0LI6ICcvbS8wazRqJyxcclxuICDQstC10LvQvtGB0LjQv9C10LTQuDogJy9tLzAxOTlnJyxcclxuICDQvNC+0YLQvtGG0LjQutC70Lg6ICcvbS8wNF9zdicsXHJcbiAg0L/RltC60LDQv9C4OiAnL20vMGN2cTMnLFxyXG4gINC60L7QvNC10YDRhtGW0LnQvdGW0LLQsNC90YLQsNC20ZbQstC60Lg6ICcvbS8wZmt3amcnLFxyXG4gINGH0L7QstC90Lg6ICcvbS8wMTlqZCcsXHJcbiAg0LvRltC80YPQt9C40L3QuDogJy9tLzAxbGN3NCcsXHJcbiAg0YLQsNC60YHRljogJy9tLzBwZzUyJyxcclxuICDRiNC60ZbQu9GM0L3QuNC50LDQstGC0L7QsdGD0YE6ICcvbS8wMnl2aGonLFxyXG4gINCw0LLRgtC+0LHRg9GBOiAnL20vMDFianYnLFxyXG4gINCx0YPQtNGW0LLQtdC70YzQvdC40LnQsNCy0YLQvtC80L7QsdGW0LvRjDogJy9tLzAyZ3gxNycsXHJcbiAg0YHRgtCw0YLRg9GXOiAnL20vMDEzXzFjJyxcclxuICDRhNC+0L3RgtCw0L3QuDogJy9tLzBoOGxoa2cnLFxyXG4gINC80ZbRgdGCOiAnL20vMDE1a3InLFxyXG4gINC/0YDQuNGB0YLQsNC90Yw6ICcvbS8wMXBocTQnLFxyXG4gINGF0LzQsNGA0L7Rh9C+0YE6ICcvbS8wNzljbCcsXHJcbiAg0YHRgtC+0LLQv9C40LDQsdC+0LrQvtC70L7QvdC4OiAnL20vMDFfbTcnLFxyXG4gINCy0ZbRgtGA0LDQttC90LXRgdC60LvQvjogJy9tLzAxMXkyMycsXHJcbiAg0LHRg9C00LjQvdC+0Lo6ICcvbS8wM2ptNScsXHJcbiAg0LHQsNCz0LDRgtC+0LrQstCw0YDRgtC40YDQvdC40LnQsdGD0LTQuNC90L7QujogJy9tLzAxbmJsdCcsXHJcbiAg0YHQstGW0YLQu9C40LnQsdGD0LTQuNC90L7QujogJy9tLzA0aDdoJyxcclxuICDQt9Cw0LvRltC30L3QuNGH0L3QsNGB0YLQsNC90YbRltGPOiAnL20vMHB5MjcnLFxyXG4gINC/0L7Qv9GW0Ls6ICcvbS8wMW42ZmQnLFxyXG4gINCy0L7Qs9C90LXQs9GW0LTRgNCw0L3RgjogJy9tLzAxcG5zMCcsXHJcbiAg0LHRltC70LHQvtGA0LQ6ICcvbS8wMWtuamInLFxyXG4gINC00L7RgNC+0LPQuDogJy9tLzA2Z2ZqJyxcclxuICDQv9GW0YjQvtGF0ZbQtNC90ZbQv9C10YDQtdGF0L7QtNC4OiAnL20vMDE0eGNzJyxcclxuICDRgdCy0ZbRgtC70L7RhNC+0YA6ICcvbS8wMTVxZmYnLFxyXG4gINCz0LDRgNCw0LbQvdGW0LTQstC10YDRljogJy9tLzA4bDk0MScsXHJcbiAg0LDQstGC0L7QsdGD0YHQvdGW0LfRg9C/0LjQvdC60Lg6ICcvbS8wMWp3XzEnLFxyXG4gINGC0YDQsNC90YHQv9C+0YDRgtC90ZbQutC+0L3Rg9GB0Lg6ICcvbS8wM3N5N3YnLFxyXG4gINC/0LDRgNC60L7QvNCw0YLQuDogJy9tLzAxNXFicCcsXHJcbiAg0YHRhdC+0LTQuDogJy9tLzAxbHluaCcsXHJcbiAg0LTQuNC80LDRgNGWOiAnL20vMDFqa180JyxcclxuICDRgtGA0LDQutGC0L7RgNC4OiAnL20vMDEzeGxtJyxcclxuXHJcbiAg0LDQstGC0L7QvNC+0LHRltC70ZY6ICcvbS8wazRqJyxcclxuICDQs9C+0YDQuNGH0LjQv9Cw0LPQvtGA0LHQuDogJy9tLzA5ZF9yJyxcclxuICDRgtGA0LDQvdGB0L/QvtGA0YLQvdGW0LfQsNGB0L7QsdC4OiAnL20vMGs0aicsXHJcbiAg0LrQvtC80LjQvdC4OiAnL20vMDFqa180JyxcclxuICDQv9GW0YjQvtGF0ZbQtNC90ZbQv9C10YDQtdGF0L7QtNC4OiAnL20vMDE0eGNzJyxcclxuICDRgdCy0ZbRgtC70L7RhNC+0YDQuDogJy9tLzAxNXFmZicsXHJcbiAg0LzQvtGB0YLQuDogJy9tLzAxNWtyJyxcclxuICDQv9C+0LbQtdC20L3QuNC50LPRltC00YDQsNC90YI6ICcvbS8wMXBuczAnLFxyXG4gINC/0LDQu9GM0LzQuDogJy9tLzBjZGwxJyxcclxuICDQsNCy0YLQvtCx0YPRgdC4OiAnL20vMDFianYnLFxyXG4gINGB0YPQtNC90LA6ICcvbS8wMTlqZCcsXHJcbiAg0L/QvtC20LXQttC90ZbQs9GW0LTRgNCw0L3RgtC4OiAnL20vMDFwbnMwJyxcclxuXHJcbiAgLy8g6KW/54+t54mZ6K+tXHJcbiAgbW9udGHDsWFzb2NvbGluYXM6ICcvbS8wOWRfcicsXHJcbiAgc2XDsWFsZXNkZWFsdG86ICcvbS8wMnB2MTknLFxyXG4gIFNlw7FhbGVzZGV0cmFuc2l0bzogJy9tLzAxbXFkdCcsXHJcbiAgcGxhbnRhczogJy9tLzA1czJzJyxcclxuICDDoXJib2xlczogJy9tLzA3ajdyJyxcclxuICBjw6lzcGVkOiAnL20vMDh0OWNfJyxcclxuICBhcmJ1c3RvczogJy9tLzBncWJ0JyxcclxuICBjYWN0dXM6ICcvbS8wMjVfdicsXHJcbiAgcGFsbWVyYXM6ICcvbS8wY2RsMScsXHJcbiAgbmF0dXJhbGV6YTogJy9tLzA1aDBuJyxcclxuICBjYXNjYWRhczogJy9tLzBqMmt4JyxcclxuICBtb250YcOxYXM6ICcvbS8wOWRfcicsXHJcbiAgc2llcnJhczogJy9tLzA5ZF9yJyxcclxuICBjdWVycG9zZGVhZ3VhOiAnL20vMDNrdG0xJyxcclxuICByw61vczogJy9tLzA2Y25wJyxcclxuICBwbGF5YXM6ICcvbS8wYjN5cicsXHJcbiAgc29sOiAnL20vMDZtX3AnLFxyXG4gIEx1bmE6ICcvbS8wNHd2XycsXHJcbiAgY2llbG86ICcvbS8wMWJxdnAnLFxyXG4gIHZlaMOtY3Vsb3M6ICcvbS8wazRqJyxcclxuICBjb2NoZXM6ICcvbS8wazRqJyxcclxuICBiaWNpY2xldGFzOiAnL20vMDE5OWcnLFxyXG4gIG1vdG9jaWNsZXRhczogJy9tLzA0X3N2JyxcclxuICBjYW1pb25ldGFzOiAnL20vMGN2cTMnLFxyXG4gIGNhbWlvbmVzY29tZXJjaWFsZXM6ICcvbS8wZmt3amcnLFxyXG4gIGJhcmNvczogJy9tLzAxOWpkJyxcclxuICBsaW11c2luYXM6ICcvbS8wMWxjdzQnLFxyXG4gIFRheGlzOiAnL20vMHBnNTInLFxyXG4gIGF1dG9iw7pzZXNjb2xhcjogJy9tLzAyeXZoaicsXHJcbiAgYXV0b2LDunM6ICcvbS8wMWJqdicsXHJcbiAgdmVow61jdWxvZGVjb25zdHJ1Y2Npw7NuOiAnL20vMDJneDE3JyxcclxuICBlc3RhdHVhczogJy9tLzAxM18xYycsXHJcbiAgZnVlbnRlczogJy9tLzBoOGxoa2cnLFxyXG4gIHB1ZW50ZTogJy9tLzAxNWtyJyxcclxuICBtdWVsbGU6ICcvbS8wMXBocTQnLFxyXG4gIHJhc2NhY2llbG9zOiAnL20vMDc5Y2wnLFxyXG4gIHBpbGFyZXNvY29sdW1uYXM6ICcvbS8wMV9tNycsXHJcbiAgVml0cmFsOiAnL20vMDExeTIzJyxcclxuICBjYXNhOiAnL20vMDNqbTUnLFxyXG4gIFVuZWRpZmljaW9kZWFwYXJ0YW1lbnRvczogJy9tLzAxbmJsdCcsXHJcbiAgY2FzYWxpZ2VyYTogJy9tLzA0aDdoJyxcclxuICBlc3RhY2nDs25kZXRyZW46ICcvbS8wcHkyNycsXHJcbiAgY2VuaXphczogJy9tLzAxbjZmZCcsXHJcbiAgdW5hYm9jYWRlaW5jZW5kaW9zOiAnL20vMDFwbnMwJyxcclxuICBjYXJ0ZWxlcmE6ICcvbS8wMWtuamInLFxyXG4gIGNhcnJldGVyYXM6ICcvbS8wNmdmaicsXHJcbiAgY3J1Y2VzZGVwZWF0b25lczogJy9tLzAxNHhjcycsXHJcbiAgc2Vtw6Fmb3JvczogJy9tLzAxNXFmZicsXHJcbiAgcHVlcnRhc2RlZ2FyYWplOiAnL20vMDhsOTQxJyxcclxuICBwYXJhZGFzZGVhdXRvYnVzOiAnL20vMDFqd18xJyxcclxuICBjb25vc2RldHLDoWZpY286ICcvbS8wM3N5N3YnLFxyXG4gIHBhcnF1w61tZXRyb3M6ICcvbS8wMTVxYnAnLFxyXG4gIGVzY2FsZXJhOiAnL20vMDFseW5oJyxcclxuICBjaGltZW5lYXM6ICcvbS8wMWprXzQnLFxyXG4gIHRyYWN0b3JlczogJy9tLzAxM3hsbScsXHJcblxyXG4gIHBhc29zZGVwZWF0b25lczogJy9tLzAxNHhjcycsXHJcbiAgYXV0b2J1c2VzOiAnL20vMDFianYnLFxyXG4gIHB1ZW50ZXM6ICcvbS8wMTVrcicsXHJcbiAgZXNjYWxlcmFzOiAnL20vMDFseW5oJyxcclxuICBib2Nhc2RlaW5jZW5kaW9zOiAnL20vMDFwbnMwJyxcclxuXHJcbiAgLy8g5rOV6K+tXHJcbiAgbW9udGFnbmVzb3Vjb2xsaW5lczogJy9tLzA5ZF9yJyxcclxuICBcInBhbm5lYXV4ZCdhcnLDqnRcIjogJy9tLzAycHYxOScsXHJcbiAgcGFubmVhdXhkZXNpZ25hbGlzYXRpb246ICcvbS8wMW1xZHQnLFxyXG4gIGxlc3BsYW50ZXM6ICcvbS8wNXMycycsXHJcbiAgZGVzYXJicmVzOiAnL20vMDdqN3InLFxyXG4gIGdhem9uOiAnL20vMDh0OWNfJyxcclxuICBhcmJ1c3RlczogJy9tLzBncWJ0JyxcclxuICBjYWN0dXM6ICcvbS8wMjVfdicsXHJcbiAgcGFsbWllcnM6ICcvbS8wY2RsMScsXHJcbiAgbGFuYXR1cmU6ICcvbS8wNWgwbicsXHJcbiAgY2FzY2FkZXM6ICcvbS8wajJreCcsXHJcbiAgbW9udGFnbmVzOiAnL20vMDlkX3InLFxyXG4gIGNvbGxpbmVzOiAnL20vMDlkX3InLFxyXG4gIFwiY29ycHNkJ2VhdVwiOiAnL20vMDNrdG0xJyxcclxuICByaXZpw6hyZXM6ICcvbS8wNmNucCcsXHJcbiAgZGVzcGxhZ2VzOiAnL20vMGIzeXInLFxyXG4gIHNvbGVpbDogJy9tLzA2bV9wJyxcclxuICBMdW5lOiAnL20vMDR3dl8nLFxyXG4gIGNpZWw6ICcvbS8wMWJxdnAnLFxyXG4gIFbDqWhpY3VsZXM6ICcvbS8wazRqJyxcclxuICB2b2l0dXJlczogJy9tLzBrNGonLFxyXG4gIFbDqWxvczogJy9tLzAxOTlnJyxcclxuICBtb3RvY3ljbGV0dGVzOiAnL20vMDRfc3YnLFxyXG4gIGNhbWlvbm5ldHRlczogJy9tLzBjdnEzJyxcclxuICBjYW1pb25zY29tbWVyY2lhdXg6ICcvbS8wZmt3amcnLFxyXG4gIGJhdGVhdXg6ICcvbS8wMTlqZCcsXHJcbiAgbGltb3VzaW5lczogJy9tLzAxbGN3NCcsXHJcbiAgVGF4aXM6ICcvbS8wcGc1MicsXHJcbiAgYnVzc2NvbGFpcmU6ICcvbS8wMnl2aGonLFxyXG4gIGJ1czogJy9tLzAxYmp2JyxcclxuICB2w6loaWN1bGVkZWNvbnN0cnVjdGlvbjogJy9tLzAyZ3gxNycsXHJcbiAgc3RhdHVlczogJy9tLzAxM18xYycsXHJcbiAgZm9udGFpbmVzOiAnL20vMGg4bGhrZycsXHJcbiAgcG9udDogJy9tLzAxNWtyJyxcclxuICBqZXTDqWU6ICcvbS8wMXBocTQnLFxyXG4gICdncmF0dGUtY2llbCc6ICcvbS8wNzljbCcsXHJcbiAgcGlsaWVyc291Y29sb25uZXM6ICcvbS8wMV9tNycsXHJcbiAgdml0cmFpbDogJy9tLzAxMXkyMycsXHJcbiAgbG9nZXI6ICcvbS8wM2ptNScsXHJcbiAgdW5pbW1ldWJsZTogJy9tLzAxbmJsdCcsXHJcbiAgbWFpc29ubHVtaW5ldXNlOiAnL20vMDRoN2gnLFxyXG4gIGdhcmU6ICcvbS8wcHkyNycsXHJcbiAgZW5jZW5kcmVzOiAnL20vMDFuNmZkJyxcclxuICBcInVuZWJvdWNoZWQnaW5jZW5kaWVcIjogJy9tLzAxcG5zMCcsXHJcbiAgXCJ1bnBhbm5lYXVkJ2FmZmljaGFnZVwiOiAnL20vMDFrbmpiJyxcclxuICByb3V0ZXM6ICcvbS8wNmdmaicsXHJcbiAgcGFzc2FnZXNwb3VycGnDqXRvbnM6ICcvbS8wMTR4Y3MnLFxyXG4gIGZldXhkZWNpcmN1bGF0aW9uOiAnL20vMDE1cWZmJyxcclxuICBwb3J0ZXNkZWdhcmFnZTogJy9tLzA4bDk0MScsXHJcbiAgXCJhcnLDqnRzZCdhdXRvYnVzXCI6ICcvbS8wMWp3XzEnLFxyXG4gIGPDtG5lc2Rlc2lnbmFsaXNhdGlvbjogJy9tLzAzc3k3dicsXHJcbiAgcGFyY29tw6h0cmVzOiAnL20vMDE1cWJwJyxcclxuICBlc2NhbGllcnM6ICcvbS8wMWx5bmgnLFxyXG4gIGNoZW1pbsOpZXM6ICcvbS8wMWprXzQnLFxyXG4gIHRyYWN0ZXVyczogJy9tLzAxM3hsbScsXHJcblxyXG4gIHbDqWhpY3VsZXM6ICcvbS8wazRqJyxcclxuICBcImJvdWNoZXNkJ2luY2VuZGllXCI6ICcvbS8wMXBuczAnLFxyXG4gIHbDqWxvczogJy9tLzAxOTlnJyxcclxuICBwb250czogJy9tLzAxNWtyJyxcclxuICBcImJvcm5lZCdpbmNlbmRpZVwiOiAnL20vMDFwbnMwJyxcclxuICBtb3RvczogJy9tLzA0X3N2JyxcclxuXHJcbiAgLy8g5b636K+tXHJcbiAgQmVyZ2VvZGVySMO8Z2VsOiAnL20vMDlkX3InLFxyXG4gIFN0b3BwU2NoaWxkZXI6ICcvbS8wMnB2MTknLFxyXG4gIFN0cmHDn2Vuc2NoaWxkZXI6ICcvbS8wMW1xZHQnLFxyXG4gIFBmbGFuemVuOiAnL20vMDVzMnMnLFxyXG4gIELDpHVtZTogJy9tLzA3ajdyJyxcclxuICBHcmFzOiAnL20vMDh0OWNfJyxcclxuICBTdHLDpHVjaGVyOiAnL20vMGdxYnQnLFxyXG4gIEtha3R1czogJy9tLzAyNV92JyxcclxuICBQYWxtZW46ICcvbS8wY2RsMScsXHJcbiAgTmF0dXI6ICcvbS8wNWgwbicsXHJcbiAgV2Fzc2VyZsOkbGxlOiAnL20vMGoya3gnLFxyXG4gIEJlcmdlOiAnL20vMDlkX3InLFxyXG4gIEjDvGdlbDogJy9tLzA5ZF9yJyxcclxuICBXYXNzZXJrw7ZycGVyOiAnL20vMDNrdG0xJyxcclxuICBGbMO8c3NlOiAnL20vMDZjbnAnLFxyXG4gIFN0csOkbmRlOiAnL20vMGIzeXInLFxyXG4gIFNvbm5lOiAnL20vMDZtX3AnLFxyXG4gIE1vbmQ6ICcvbS8wNHd2XycsXHJcbiAgSGltbWVsOiAnL20vMDFicXZwJyxcclxuICBGYWhyemV1Z2U6ICcvbS8wazRqJyxcclxuICBBdXRvczogJy9tLzBrNGonLFxyXG4gIEZhaHJyw6RkZXI6ICcvbS8wMTk5ZycsXHJcbiAgTW90b3Jyw6RkZXI6ICcvbS8wNF9zdicsXHJcbiAgUGlja3VwczogJy9tLzBjdnEzJyxcclxuICBOdXR6ZmFocnpldWdlOiAnL20vMGZrd2pnJyxcclxuICBCb290ZTogJy9tLzAxOWpkJyxcclxuICBMaW1vdXNpbmVuOiAnL20vMDFsY3c0JyxcclxuICBUYXhlbjogJy9tLzBwZzUyJyxcclxuICBTY2h1bGJ1czogJy9tLzAyeXZoaicsXHJcbiAgQnVzOiAnL20vMDFianYnLFxyXG4gIEJhdWZhaHJ6ZXVnOiAnL20vMDJneDE3JyxcclxuICBTdGF0dWVuOiAnL20vMDEzXzFjJyxcclxuICBCcnVubmVuOiAnL20vMGg4bGhrZycsXHJcbiAgQnLDvGNrZTogJy9tLzAxNWtyJyxcclxuICBTZWVicsO8Y2tlOiAnL20vMDFwaHE0JyxcclxuICBXb2xrZW5rcmF0emVyOiAnL20vMDc5Y2wnLFxyXG4gIFPDpHVsZW5vZGVyU8OkdWxlbjogJy9tLzAxX203JyxcclxuICBCdW50Z2xhczogJy9tLzAxMXkyMycsXHJcbiAgSGF1czogJy9tLzAzam01JyxcclxuICBlaW5Xb2huaGF1czogJy9tLzAxbmJsdCcsXHJcbiAgTGV1Y2h0dHVybTogJy9tLzA0aDdoJyxcclxuICBCYWhuaG9mOiAnL20vMHB5MjcnLFxyXG4gIGVpblNjaHVwcGVuOiAnL20vMDFuNmZkJyxcclxuICBlaW5IeWRyYW50OiAnL20vMDFwbnMwJyxcclxuICBlaW5lV2VyYmV0YWZlbDogJy9tLzAxa25qYicsXHJcbiAgU3RyYcOfZW46ICcvbS8wNmdmaicsXHJcbiAgWmVicmFzdHJlaWZlbjogJy9tLzAxNHhjcycsXHJcbiAgQW1wZWxuOiAnL20vMDE1cWZmJyxcclxuICBHYXJhZ2VudG9yZTogJy9tLzA4bDk0MScsXHJcbiAgQnVzaGFsdGVzdGVsbGVuOiAnL20vMDFqd18xJyxcclxuICBMZWl0a2VnZWw6ICcvbS8wM3N5N3YnLFxyXG4gIFBhcmt1aHJlbjogJy9tLzAxNXFicCcsXHJcbiAgVHJlcHBlOiAnL20vMDFseW5oJyxcclxuICBTY2hvcm5zdGVpbmU6ICcvbS8wMWprXzQnLFxyXG4gIFRyYWt0b3JlbjogJy9tLzAxM3hsbScsXHJcblxyXG4gICdUcmVwcGVuKHN0dWZlbiknOiAnL20vMDFseW5oJyxcclxuICBCZXJnZW5vZGVySMO8Z2VsbjogJy9tLzA5ZF9yJyxcclxuICBGYWhyemV1Z2VuOiAnL20vMGs0aicsXHJcbiAgSHlkcmFudGVuOiAnL20vMDFwbnMwJyxcclxuICBad2VpcsOkZGVybjogJy9tLzA0X3N2JyxcclxuICBGYWhycsOkZGVybjogJy9tLzAxOTlnJyxcclxuICBGdcOfZ8OkbmdlcsO8YmVyd2VnZW46ICcvbS8wMTR4Y3MnLFxyXG4gIFBrd3M6ICcvbS8wazRqJyxcclxuICBTY2hvcm5zdGVpbmVuOiAnL20vMDFqa180JyxcclxuICBNb3RvcnLDpGRlcm46ICcvbS8wNF9zdicsXHJcbiAgQnVzc2VuOiAnL20vMDFianYnLFxyXG4gIEJyw7xja2VuOiAnL20vMDE1a3InLFxyXG4gIEJvb3RlbjogJy9tLzAxOWpkJyxcclxuICBGZXVlcmh5ZHJhbnRlbjogJy9tLzAxcG5zMCcsXHJcblxyXG4gIC8vIOmYv+aLieS8r+ivrVxyXG4gINin2YTYrNio2KfZhNij2YjYp9mE2KrZhNin2YQ6ICcvbS8wOWRfcicsXHJcbiAg2LnZhNin2YXYp9iq2KfZhNiq2YjZgtmBOiAnL20vMDJwdjE5JyxcclxuICDZhNin2YHYqtin2KrYp9mE2LTZiNin2LHYuTogJy9tLzAxbXFkdCcsXHJcbiAg2KfZhNmG2KjYp9iq2KfYqjogJy9tLzA1czJzJyxcclxuICDYp9mE2KPYtNis2KfYsTogJy9tLzA3ajdyJyxcclxuICDYudi02Kg6ICcvbS8wOHQ5Y18nLFxyXG4gINin2YTYtNis2YrYsdin2Ko6ICcvbS8wZ3FidCcsXHJcbiAg2LXYqNin2LE6ICcvbS8wMjVfdicsXHJcbiAg2KPYtNis2KfYsdin2YTZhtiu2YrZhDogJy9tLzBjZGwxJyxcclxuICDYt9io2YrYudip2LPYrNmK2Kk6ICcvbS8wNWgwbicsXHJcbiAg2KfZhNi02YTYp9mE2KfYqjogJy9tLzBqMmt4JyxcclxuICDYp9mE2KzYqNin2YQ6ICcvbS8wOWRfcicsXHJcbiAg2KfZhNiq2YTYp9mEOiAnL20vMDlkX3InLFxyXG4gINin2YTZhdiz2LfYrdin2KrYp9mE2YXYp9im2YrYqTogJy9tLzAza3RtMScsXHJcbiAg2KfZhNij2YbZh9in2LE6ICcvbS8wNmNucCcsXHJcbiAg2KfZhNi02YjYp9i32KY6ICcvbS8wYjN5cicsXHJcbiAg2KfZhNi02YXYszogJy9tLzA2bV9wJyxcclxuICDYp9mE2YLZhdixOiAnL20vMDR3dl8nLFxyXG4gINiz2YXYp9ihOiAnL20vMDFicXZwJyxcclxuICDZhdix2YPYqNin2Ko6ICcvbS8wazRqJyxcclxuICDYs9mK2KfYsdin2Ko6ICcvbS8wazRqJyxcclxuICDYr9ix2KfYrNin2Ko6ICcvbS8wMTk5ZycsXHJcbiAg2K/Ysdin2KzYp9iq2YbYp9ix2YrYqTogJy9tLzA0X3N2JyxcclxuICDYtNin2K3Zhtin2KrYtdi62YrYsdipOiAnL20vMGN2cTMnLFxyXG4gINi02KfYrdmG2KfYqtiq2KzYp9ix2YrYqTogJy9tLzBma3dqZycsXHJcbiAg2KfZhNmC2YjYp9ix2Kg6ICcvbS8wMTlqZCcsXHJcbiAg2LPZitin2LHYp9iq2KfZhNmE2YrZhdmI2LLZitmGOiAnL20vMDFsY3c0JyxcclxuICDYs9mK2KfYsdin2KrYp9mE2KPYrNix2Kk6ICcvbS8wcGc1MicsXHJcbiAg2KjYp9i12KfZhNmF2K/Ysdiz2Kk6ICcvbS8wMnl2aGonLFxyXG4gINij2YjYqtmI2KjZitizOiAnL20vMDFianYnLFxyXG4gINmF2LHZg9io2KnYp9mE2KjZhtin2KE6ICcvbS8wMmd4MTcnLFxyXG4gINiq2YXYp9ir2YrZhDogJy9tLzAxM18xYycsXHJcbiAg2YbZiNin2YHZitixOiAnL20vMGg4bGhrZycsXHJcbiAg2YPZiNio2LHZijogJy9tLzAxNWtyJyxcclxuICDYsdi12YrZgdio2K3YsdmKOiAnL20vMDFwaHE0JyxcclxuICDZhtin2LfYrdip2LPYrdin2Kg6ICcvbS8wNzljbCcsXHJcbiAg2KPYudmF2K/Yqdin2YTYo9i52YXYr9ipOiAnL20vMDFfbTcnLFxyXG4gINiy2KzYp9is2YXZhNmI2YY6ICcvbS8wMTF5MjMnLFxyXG4gINio2YrYqjogJy9tLzAzam01JyxcclxuICDZhdio2YbZidiz2YPZhtmKOiAnL20vMDFuYmx0JyxcclxuICDZhdmG2KfYsdipOiAnL20vMDRoN2gnLFxyXG4gINmF2K3Yt9ip2KfZhNmC2LfYp9ixOiAnL20vMHB5MjcnLFxyXG4gINij2LTZitivOiAnL20vMDFuNmZkJyxcclxuICDYt9mB2KfZitip2K3YsdmK2YI6ICcvbS8wMXBuczAnLFxyXG4gIGFiaWxsYm9hcmQ6ICcvbS8wMWtuamInLFxyXG4gINin2YTYt9ix2YI6ICcvbS8wNmdmaicsXHJcbiAg2YXZhdix2KfYqtin2YTZhdi02KfYqTogJy9tLzAxNHhjcycsXHJcbiAg2KXYtNin2LHYp9iq2KfZhNmF2LHZiNixOiAnL20vMDE1cWZmJyxcclxuICDZhdix2KLYqDogJy9tLzA4bDk0MScsXHJcbiAg2YXYrdi32KfYqtin2YTYrdin2YHZhNin2Ko6ICcvbS8wMWp3XzEnLFxyXG4gINin2YTYo9mC2YXYp9i52KfZhNmF2LHZiNix2YrYqTogJy9tLzAzc3k3dicsXHJcbiAg2LnYr9in2K/Yp9iq2YXZiNin2YLZgdin2YTYs9mK2KfYsdin2Ko6ICcvbS8wMTVxYnAnLFxyXG4gINiv2LHYrDogJy9tLzAxbHluaCcsXHJcbiAg2YXYr9in2K7ZhjogJy9tLzAxamtfNCcsXHJcbiAg2KfZhNis2LHYp9ix2KfYqjogJy9tLzAxM3hsbScsXHJcblxyXG4gINi12YbYp9io2YrYsdil2LfZgdin2KHYrdix2KfYptmCOiAnL20vMDFwbnMwJyxcclxuICDYpdi02KfYsdin2KrZhdix2YjYsTogJy9tLzAxNXFmZicsXHJcbiAg2K3Yp9mB2YTYqTogJy9tLzAxYmp2JyxcclxuICDYr9ix2ZHYp9is2Kc6ICcvbS8wMTk5ZycsXHJcbiAg2K/YsdmR2KfYrNin2Ko6ICcvbS8wMTVrcicsXHJcbiAg2LPZitin2LHYp9iq2KPYrNix2Kk6ICcvbS8wcGc1MicsXHJcblxyXG4gINis2LPZiNixOiAnL20vMDE1a3InLFxyXG4gINiv2Y7YsdmO2Kw6ICcvbS8wMWx5bmgnLFxyXG4gINmF2K/Yp9iu2ZDZhjogJy9tLzAxamtfNCcsXHJcbiAg2K/Ysdin2KzYp9iq2YfZiNin2KbZitipOiAnL20vMDE5OWcnLFxyXG4gINmF2YXYsdmR2KfYqtmE2YTZhdi02KfYqTogJy9tLzAxNHhjcycsXHJcbiAg2YXYrdio2LPYpdi32YHYp9ih2K3YsdmK2YI6ICcvbS8wMXBuczAnLFxyXG4gINiz2YrYp9ix2KnYo9is2LHYqTogJy9tLzBwZzUyJyxcclxuICDZgtmI2KfYsdioOiAnL20vMDE5amQnLFxyXG4gINis2KjYp9mE2KPZiNiq2YTYp9mEOiAnL20vMDlkX3InLFxyXG4gINis2LHYp9ix2KfYqjogJy9tLzAxM3hsbScsXHJcbiAg2KPYtNis2KfYsdmG2K7ZitmEOiAnL20vMGNkbDEnLFxyXG4gINmF2YbYp9i32YLYudio2YjYsdmF2LTYp9ipOiAnL20vMDE0eGNzJyxcclxuICDYrdin2YHZhNin2Ko6ICcvbS8wMWJqdicsXHJcbiAg2K/YsdmR2KfYrNin2KrYqNiu2KfYsdmK2Kk6ICcvbS8wNF9zdicsXHJcbiAg2KzYsdmR2KfYsdin2Ko6ICcvbS8wMTN4bG0nLFxyXG5cclxuICAvLyDljbDlnLDor61cclxuICDgpKrgpLngpL7gpKHgpLzgpK/gpL7gpKrgpLngpL7gpKHgpLzgpL/gpK/gpL7gpIE6ICcvbS8wOWRfcicsXHJcbiAg4KS44KWN4KSf4KWJ4KSq4KS44KS+4KSH4KSo4KWN4KS4OiAnL20vMDJwdjE5JyxcclxuICDgpLjgpKHgpLzgpJXgpJXgpYfgpLjgpILgpJXgpYfgpKQ6ICcvbS8wMW1xZHQnLFxyXG4gIOCkquCljOCkp+Cli+CkgjogJy9tLzA1czJzJyxcclxuICDgpKrgpYfgpKHgpLw6ICcvbS8wN2o3cicsXHJcbiAg4KSY4KS+4KS4OiAnL20vMDh0OWNfJyxcclxuICDgpJ3gpL7gpKHgpLzgpL/gpK/gpL7gpII6ICcvbS8wZ3FidCcsXHJcbiAg4KSV4KWI4KSV4KWN4KSf4KS4OiAnL20vMDI1X3YnLFxyXG4gIOCkluCknOClguCksOCkleClh+CkquClh+CkoeCkvDogJy9tLzBjZGwxJyxcclxuICDgpKrgpY3gpLDgpJXgpYPgpKTgpL86ICcvbS8wNWgwbicsXHJcbiAg4KSd4KSw4KSo4KWHOiAnL20vMGoya3gnLFxyXG4gIOCkquCkueCkvuCkoeCkvOCli+CkgjogJy9tLzA5ZF9yJyxcclxuICDgpLngpL/gpLLgpY3gpLg6ICcvbS8wOWRfcicsXHJcbiAg4KSc4KSy4KSo4KS/4KSV4KS+4KSv4KWL4KSCOiAnL20vMDNrdG0xJyxcclxuICDgpKjgpKbgpL/gpK/gpYvgpII6ICcvbS8wNmNucCcsXHJcbiAg4KS44KSu4KWB4KSm4KWN4KSw4KSk4KSf4KWL4KSCOiAnL20vMGIzeXInLFxyXG4gIOCksOCkteCkvzogJy9tLzA2bV9wJyxcclxuICDgpJrgpILgpKbgpY3gpLDgpK7gpL46ICcvbS8wNHd2XycsXHJcbiAg4KSG4KSV4KS+4KS2OiAnL20vMDFicXZwJyxcclxuICDgpLXgpL7gpLngpKjgpYvgpII6ICcvbS8wazRqJyxcclxuICDgpJXgpL7gpLDgpYvgpII6ICcvbS8wazRqJyxcclxuICDgpLjgpL7gpIfgpJXgpL/gpLLgpYfgpII6ICcvbS8wMTk5ZycsXHJcbiAg4KSu4KWL4KSf4KSw4KS44KS+4KSH4KSV4KS/4KSy4KWH4KSCOiAnL20vMDRfc3YnLFxyXG4gIOCkouCli+CkqOClh+CkteCkvuCksuClh+Ckn+CljeCksOCkleCli+CkgjogJy9tLzBjdnEzJyxcclxuICDgpLXgpL7gpKPgpL/gpJzgpY3gpK/gpL/gpJXgpJ/gpY3gpLDgpJU6ICcvbS8wZmt3amcnLFxyXG4gIOCkqOCljOCkleCkvuCkk+CkgjogJy9tLzAxOWpkJyxcclxuICBsaW1vdXNpbmVzOiAnL20vMDFsY3c0JyxcclxuICDgpJ/gpYjgpJXgpY3gpLjgpYA6ICcvbS8wcGc1MicsXHJcbiAg4KS44KWN4KSV4KWC4KSy4KSs4KS4OiAnL20vMDJ5dmhqJyxcclxuICDgpKzgpLg6ICcvbS8wMWJqdicsXHJcbiAg4KSo4KS/4KSw4KWN4KSu4KS+4KSj4KS14KS+4KS54KSoOiAnL20vMDJneDE3JyxcclxuICDgpK7gpYLgpLDgpY3gpKTgpL/gpK/gpYvgpII6ICcvbS8wMTNfMWMnLFxyXG4gIOCkq+CkteCljeCkteCkvuCksOClhzogJy9tLzBoOGxoa2cnLFxyXG4gIOCkquClgeCksjogJy9tLzAxNWtyJyxcclxuICDgpJjgpL7gpJ86ICcvbS8wMXBocTQnLFxyXG4gIOCkl+Ckl+CkqOCkmuClgeCkguCkrOClgOCkh+CkruCkvuCksOCkpDogJy9tLzA3OWNsJyxcclxuICDgpLjgpY3gpKTgpILgpK3gpK/gpL7gpLjgpY3gpKTgpILgpK06ICcvbS8wMV9tNycsXHJcbiAg4KSw4KSC4KSX4KWA4KSo4KSV4KS+4KSC4KSaOiAnL20vMDExeTIzJyxcclxuICDgpK7gpJXgpL7gpKg6ICcvbS8wM2ptNScsXHJcbiAg4KSF4KSq4KS+4KSw4KWN4KSf4KSu4KWH4KSC4KSf4KSH4KSu4KS+4KSw4KSkOiAnL20vMDFuYmx0JyxcclxuICDgpLLgpL7gpIfgpJ/gpLngpL7gpIngpLg6ICcvbS8wNGg3aCcsXHJcbiAg4KSw4KWH4KSy4KS14KWH4KS44KWN4KSf4KWH4KS24KSoOiAnL20vMHB5MjcnLFxyXG4gIOCkj+CkleCkm+CkquCljeCkquCksDogJy9tLzAxbjZmZCcsXHJcbiAg4KSF4KSX4KWN4KSo4KS/4KS54KS+4KSH4KSh4KWN4KSw4KWH4KSC4KSfOiAnL20vMDFwbnMwJyxcclxuICDgpKzgpL/gpLLgpKzgpYvgpLDgpY3gpKE6ICcvbS8wMWtuamInLFxyXG4gIOCkuOCkoeCkvOCkleClh+CkgjogJy9tLzA2Z2ZqJyxcclxuICDgpJXgpY3gpLDgpYngpLjgpLXgpYngpJU6ICcvbS8wMTR4Y3MnLFxyXG4gIOCkr+CkvuCkpOCkvuCkr+CkvuCkpOCkrOCkpOCljeCkpOCkv+Ckr+CkvjogJy9tLzAxNXFmZicsXHJcbiAg4KSX4KWI4KSw4KWH4KSc4KSV4KWH4KSm4KSw4KS14KS+4KSc4KWHOiAnL20vMDhsOTQxJyxcclxuICDgpKzgpLjgpLDgpYLgpJXgpKjgpYfgpJXgpYDgpJzgpJfgpLk6ICcvbS8wMWp3XzEnLFxyXG4gIOCkn+CljeCksOCliOCkq+Ckv+CkleCkleCli+CkqOCkuDogJy9tLzAzc3k3dicsXHJcbiAg4KSq4KS+4KSw4KWN4KSV4KS/4KSC4KSX4KSu4KWA4KSf4KSwOiAnL20vMDE1cWJwJyxcclxuICDgpLjgpYDgpKLgpLzgpL/gpK/gpL7gpII6ICcvbS8wMWx5bmgnLFxyXG4gIOCkmuCkv+CkruCkqOCkv+Ckr+CkvuCkgjogJy9tLzAxamtfNCcsXHJcbiAg4KSf4KWN4KSw4KWI4KSV4KWN4KSf4KSwOiAnL20vMDEzeGxtJyxcclxuXHJcbiAg4KSF4KSX4KWN4KSo4KS/4KS24KS+4KSu4KSV4KS54KS+4KSI4KSh4KWN4KSw4KWH4KSC4KSfOiAnL20vMDFwbnMwJyxcclxuICDgpKrgpYjgpKbgpLLgpKrgpL7gpLDgpKrgpKU6ICcvbS8wMTR4Y3MnLFxyXG4gIOCkn+CljeCksOCliOCkq+CkvOCkv+CkleCksuCkvuCkh+CknzogJy9tLzAxNHhjcycsXHJcbiAg4KSq4KWB4KSy4KWL4KSCOiAnL20vMDE1a3InLFxyXG4gIOCkuOClgOClneCkv+Ckr+Cli+CkgjogJy9tLzAxbHluaCcsXHJcbiAg4KSq4KS54KS+4KSh4KS84KSv4KS+4KSq4KS54KS+4KSh4KS84KWAOiAnL20vMDlkX3InLFxyXG4gIOCkteCkvuCkueCkqDogJy9tLzBrNGonLFxyXG4gIOCkruCli+Ckn+CksOCkuOCkvuCkh+CkleCksjogJy9tLzA0X3N2JyxcclxuICDgpLjgpL7gpIfgpJXgpLI6ICcvbS8wMTk5ZycsXHJcbiAg4KSa4KS/4KSu4KSo4KWAOiAnL20vMDFqa180JyxcclxuICDgpLjgpL7gpIfgpJXgpLLgpYvgpII6ICcvbS8wMTk5ZycsXHJcblxyXG4gIC8vIOiNt+WFsOivrVxyXG4gIGJlcmdlbm9maGV1dmVsczogJy9tLzA5ZF9yJyxcclxuICBzdG9wdGVrZW5zOiAnL20vMDJwdjE5JyxcclxuICB2ZXJrZWVyc2JvcmRlbjogJy9tLzAxbXFkdCcsXHJcbiAgcGxhbnRlbjogJy9tLzA1czJzJyxcclxuICBib21lbjogJy9tLzA3ajdyJyxcclxuICBncmFzOiAnL20vMDh0OWNfJyxcclxuICBzdHJ1aWtlbjogJy9tLzBncWJ0JyxcclxuICBjYWN0dXM6ICcvbS8wMjVfdicsXHJcbiAgcGFsbWJvbWVuOiAnL20vMGNkbDEnLFxyXG4gIG5hdHV1cjogJy9tLzA1aDBuJyxcclxuICB3YXRlcnZhbGxlbjogJy9tLzBqMmt4JyxcclxuICBiZXJnZW46ICcvbS8wOWRfcicsXHJcbiAgaGV1dmVsczogJy9tLzA5ZF9yJyxcclxuICB3YXRlcmxpY2hhbWVuOiAnL20vMDNrdG0xJyxcclxuICByaXZpZXJlbjogJy9tLzA2Y25wJyxcclxuICBzdHJhbmRlbjogJy9tLzBiM3lyJyxcclxuICB6b246ICcvbS8wNm1fcCcsXHJcbiAgTWFhbjogJy9tLzA0d3ZfJyxcclxuICBsdWNodDogJy9tLzAxYnF2cCcsXHJcbiAgdm9lcnR1aWdlbjogJy9tLzBrNGonLFxyXG4gIFwiYXV0bydzXCI6ICcvbS8wazRqJyxcclxuICBmaWV0c2VuOiAnL20vMDE5OWcnLFxyXG4gIG1vdG9yZmlldHNlbjogJy9tLzA0X3N2JyxcclxuICAncGljay11cHRydWNrcyc6ICcvbS8wY3ZxMycsXHJcbiAgY29tbWVyY2nDq2xldnJhY2h0d2FnZW5zOiAnL20vMGZrd2pnJyxcclxuICBib3RlbjogJy9tLzAxOWpkJyxcclxuICBsaW1vdXNpbmVzOiAnL20vMDFsY3c0JyxcclxuICBcInRheGknc1wiOiAnL20vMHBnNTInLFxyXG4gIHNjaG9vbGJ1czogJy9tLzAyeXZoaicsXHJcbiAgYnVzOiAnL20vMDFianYnLFxyXG4gIGJvdXd2b2VydHVpZzogJy9tLzAyZ3gxNycsXHJcbiAgc3RhbmRiZWVsZGVuOiAnL20vMDEzXzFjJyxcclxuICBmb250ZWluZW46ICcvbS8waDhsaGtnJyxcclxuICBicnVnOiAnL20vMDE1a3InLFxyXG4gIHBpZXI6ICcvbS8wMXBocTQnLFxyXG4gIHdvbGtlbmtyYWJiZXI6ICcvbS8wNzljbCcsXHJcbiAgcGlqbGVyc29ma29sb21tZW46ICcvbS8wMV9tNycsXHJcbiAgJ2dsYXMtaW4tbG9vZCc6ICcvbS8wMTF5MjMnLFxyXG4gIGh1aXM6ICcvbS8wM2ptNScsXHJcbiAgZWVuYXBwYXJ0ZW1lbnRzZ2Vib3V3OiAnL20vMDFuYmx0JyxcclxuICB2dXVydG9yZW46ICcvbS8wNGg3aCcsXHJcbiAgdHJlaW5zdGF0aW9uOiAnL20vMHB5MjcnLFxyXG4gIGluZGVhc2dlbGVnZDogJy9tLzAxbjZmZCcsXHJcbiAgYnJhbmRrcmFhbjogJy9tLzAxcG5zMCcsXHJcbiAgcHJpa2JvcmQ6ICcvbS8wMWtuamInLFxyXG4gIHdlZ2VuOiAnL20vMDZnZmonLFxyXG4gIHplYnJhcGFkZW46ICcvbS8wMTR4Y3MnLFxyXG4gIHZlcmtlZXJzbGljaHRlbjogJy9tLzAxNXFmZicsXHJcbiAgZ2FyYWdlZGV1cmVuOiAnL20vMDhsOTQxJyxcclxuICBidXNzdG9wdDogJy9tLzAxandfMScsXHJcbiAgdmVya2VlcnNrZWdlbHM6ICcvbS8wM3N5N3YnLFxyXG4gIHBhcmtlZXJtZXRlcnM6ICcvbS8wMTVxYnAnLFxyXG4gIHRyYXA6ICcvbS8wMWx5bmgnLFxyXG4gIHNjaG9vcnN0ZW5lbjogJy9tLzAxamtfNCcsXHJcbiAgdHJhY3RvcmVuOiAnL20vMDEzeGxtJyxcclxuXHJcbiAgZWVuYnJhbmRrcmFhbjogJy9tLzAxcG5zMCcsXHJcbiAgdHJhcHBlbjogJy9tLzAxbHluaCcsXHJcbiAgZWVuYnJhbmRrcmFhbjogJy9tLzAxcG5zMCcsXHJcbiAgb3ZlcnN0ZWVrcGxhYXRzZW46ICcvbS8wMTR4Y3MnLFxyXG4gIGJ1c3NlbjogJy9tLzAxYmp2JyxcclxuICBidXNzZW46ICcvbS8wMWJqdicsXHJcbiAgYnJ1Z2dlbjogJy9tLzAxNWtyJyxcclxuXHJcbiAgLy8g5Y2w5bC86K+tXHJcbiAgZ3VudW5nYXRhdWJ1a2l0OiAnL20vMDlkX3InLFxyXG4gIHRhbmRhYmVyaGVudGk6ICcvbS8wMnB2MTknLFxyXG4gIHJhbWJ1amFsYW46ICcvbS8wMW1xZHQnLFxyXG4gIHRhbmFtYW46ICcvbS8wNXMycycsXHJcbiAgcG9ob246ICcvbS8wN2o3cicsXHJcbiAgcnVtcHV0OiAnL20vMDh0OWNfJyxcclxuICBzZW1ha2JlbHVrYXI6ICcvbS8wZ3FidCcsXHJcbiAga2FrdHVzOiAnL20vMDI1X3YnLFxyXG4gICdwb2hvbi1wb2hvbnBhbGVtJzogJy9tLzBjZGwxJyxcclxuICBhbGFtOiAnL20vMDVoMG4nLFxyXG4gIGFpcnRlcmp1bjogJy9tLzBqMmt4JyxcclxuICBwZWd1bnVuZ2FuOiAnL20vMDlkX3InLFxyXG4gIGJ1a2l0OiAnL20vMDlkX3InLFxyXG4gIGJhZGFuYWlyOiAnL20vMDNrdG0xJyxcclxuICBzdW5nYWk6ICcvbS8wNmNucCcsXHJcbiAgcGFudGFpOiAnL20vMGIzeXInLFxyXG4gIG1hdGFoYXJpOiAnL20vMDZtX3AnLFxyXG4gIEJ1bGFuOiAnL20vMDR3dl8nLFxyXG4gIGxhbmdpdDogJy9tLzAxYnF2cCcsXHJcbiAga2VuZGFyYWFuOiAnL20vMGs0aicsXHJcbiAgbW9iaWw6ICcvbS8wazRqJyxcclxuICBzZXBlZGE6ICcvbS8wMTk5ZycsXHJcbiAgc2VwZWRhbW90b3I6ICcvbS8wNF9zdicsXHJcbiAgdHJ1a3BpY2t1cDogJy9tLzBjdnEzJyxcclxuICB0cnVra29tZXJzaWFsOiAnL20vMGZrd2pnJyxcclxuICBwZXJhaHU6ICcvbS8wMTlqZCcsXHJcbiAgbGltdXNpbjogJy9tLzAxbGN3NCcsXHJcbiAgdGFrc2k6ICcvbS8wcGc1MicsXHJcbiAgYnVzc2Vrb2xhaDogJy9tLzAyeXZoaicsXHJcbiAgYmlzOiAnL20vMDFianYnLFxyXG4gIGtlbmRhcmFhbmtvbnN0cnVrc2k6ICcvbS8wMmd4MTcnLFxyXG4gIHBhdHVuZzogJy9tLzAxM18xYycsXHJcbiAgYWlybWFuY3VyOiAnL20vMGg4bGhrZycsXHJcbiAgbWVuamVtYmF0YW5pOiAnL20vMDE1a3InLFxyXG4gIGRlcm1hZ2E6ICcvbS8wMXBocTQnLFxyXG4gIGdlZHVuZ3BlbmNha2FybGFuZ2l0OiAnL20vMDc5Y2wnLFxyXG4gIHBpbGFyYXRhdWtvbG9tOiAnL20vMDFfbTcnLFxyXG4gIGthY2FiZXJ3YXJuYTogJy9tLzAxMXkyMycsXHJcbiAgcnVtYWg6ICcvbS8wM2ptNScsXHJcbiAgc2VidWFoZ2VkdW5nYXBhcnRlbWVuOiAnL20vMDFuYmx0JyxcclxuICBydW1haGNhaGF5YTogJy9tLzA0aDdoJyxcclxuICBTdGFzaXVua2VyZXRhOiAnL20vMHB5MjcnLFxyXG4gIHB1Y2F0OiAnL20vMDFuNmZkJyxcclxuICBwZW1hZGFta2ViYWthcmFuOiAnL20vMDFwbnMwJyxcclxuICBwYXBhbnJla2xhbWU6ICcvbS8wMWtuamInLFxyXG4gIGphbGFuOiAnL20vMDZnZmonLFxyXG4gIHBlbnllYmVyYW5nYW46ICcvbS8wMTR4Y3MnLFxyXG4gIGxhbXB1bGFsdWxpbnRhczogJy9tLzAxNXFmZicsXHJcbiAgcGludHVnYXJhc2k6ICcvbS8wOGw5NDEnLFxyXG4gIGhhbHRlYnVzOiAnL20vMDFqd18xJyxcclxuICBrZXJ1Y3V0bGFsdWxpbnRhczogJy9tLzAzc3k3dicsXHJcbiAgbWV0ZXJhbnBhcmtpcjogJy9tLzAxNXFicCcsXHJcbiAgdGFuZ2dhOiAnL20vMDFseW5oJyxcclxuICBjZXJvYm9uZzogJy9tLzAxamtfNCcsXHJcbiAgdHJha3RvcjogJy9tLzAxM3hsbScsXHJcblxyXG4gIGhpZHJhbmtlYmFrYXJhbjogJy9tLzAxcG5zMCcsXHJcbiAgamVtYmF0YW46ICcvbS8wMTVrcicsXHJcbiAgemVicmFjcm9zczogJy9tLzAxNHhjcycsXHJcbiAgbW90b3I6ICcvbS8wNF9zdicsXHJcbiAgY2Vyb2Jvbmdhc2FwOiAnL20vMDFqa180JyxcclxuICBwb2hvbnBhbGVtOiAnL20vMGNkbDEnLFxyXG5cclxuICAvLyDokaHokITniZnor61cclxuICBtb250YW5oYXNvdWNvbGluYXM6ICcvbS8wOWRfcicsXHJcbiAgc2luYWlzZGVwYXJhZGE6ICcvbS8wMnB2MTknLFxyXG4gIFNpbmFpc2RldHJhbnNpdG86ICcvbS8wMW1xZHQnLFxyXG4gIHBsYW50YXM6ICcvbS8wNXMycycsXHJcbiAgw6Fydm9yZXM6ICcvbS8wN2o3cicsXHJcbiAgUmVsdmE6ICcvbS8wOHQ5Y18nLFxyXG4gIGFyYnVzdG9zOiAnL20vMGdxYnQnLFxyXG4gIGNhY3RvOiAnL20vMDI1X3YnLFxyXG4gIFBhbG1laXJhczogJy9tLzBjZGwxJyxcclxuICBuYXR1cmV6YTogJy9tLzA1aDBuJyxcclxuICBjYWNob2VpcmFzOiAnL20vMGoya3gnLFxyXG4gIG1vbnRhbmhhczogJy9tLzA5ZF9yJyxcclxuICBDb2xpbmFzOiAnL20vMDlkX3InLFxyXG4gIGNvcnBvc2Rlw6FndWE6ICcvbS8wM2t0bTEnLFxyXG4gIHJpb3M6ICcvbS8wNmNucCcsXHJcbiAgcHJhaWFzOiAnL20vMGIzeXInLFxyXG4gIHNvbDogJy9tLzA2bV9wJyxcclxuICBMdWE6ICcvbS8wNHd2XycsXHJcbiAgY8OpdTogJy9tLzAxYnF2cCcsXHJcbiAgdmXDrWN1bG9zOiAnL20vMGs0aicsXHJcbiAgY2Fycm9zOiAnL20vMGs0aicsXHJcbiAgYmljaWNsZXRhczogJy9tLzAxOTlnJyxcclxuICBtb3RvY2ljbGV0YXM6ICcvbS8wNF9zdicsXHJcbiAgQ2FtaW5ow7VlczogJy9tLzBjdnEzJyxcclxuICBjYW1pbmjDtWVzY29tZXJjaWFpczogJy9tLzBma3dqZycsXHJcbiAgYmFyY29zOiAnL20vMDE5amQnLFxyXG4gIGxpbXVzaW5lczogJy9tLzAxbGN3NCcsXHJcbiAgVMOheGlzOiAnL20vMHBnNTInLFxyXG4gIMO0bmlidXNlc2NvbGFyOiAnL20vMDJ5dmhqJyxcclxuICDDtG5pYnVzOiAnL20vMDFianYnLFxyXG4gIHZlw61jdWxvZGVjb25zdHJ1w6fDo286ICcvbS8wMmd4MTcnLFxyXG4gIGVzdMOhdHVhczogJy9tLzAxM18xYycsXHJcbiAgZm9udGVzOiAnL20vMGg4bGhrZycsXHJcbiAgUG9udGU6ICcvbS8wMTVrcicsXHJcbiAgY2FpczogJy9tLzAxcGhxNCcsXHJcbiAgJ2FycmFuaGEtY8OpdSc6ICcvbS8wNzljbCcsXHJcbiAgcGlsYXJlc291Y29sdW5hczogJy9tLzAxX203JyxcclxuICB2aXRyYWlzOiAnL20vMDExeTIzJyxcclxuICBsYXI6ICcvbS8wM2ptNScsXHJcbiAgdW1wcsOpZGlvZGVhcGFydGFtZW50b3M6ICcvbS8wMW5ibHQnLFxyXG4gIGNhc2FkZWx1ejogJy9tLzA0aDdoJyxcclxuICBlc3Rhw6fDo29kZXRyZW06ICcvbS8wcHkyNycsXHJcbiAgY2luemE6ICcvbS8wMW42ZmQnLFxyXG4gIGhpZHJhbnRlOiAnL20vMDFwbnMwJyxcclxuICBxdWFkcm9kZWF2aXNvczogJy9tLzAxa25qYicsXHJcbiAgZXN0cmFkYXM6ICcvbS8wNmdmaicsXHJcbiAgZmFpeGFzZGVwZWRlc3RyZXM6ICcvbS8wMTR4Y3MnLFxyXG4gIGx1emVzZGV0csOibnNpdG86ICcvbS8wMTVxZmYnLFxyXG4gIHBvcnRhc2RlZ2FyYWdlbTogJy9tLzA4bDk0MScsXHJcbiAgcG9udG9kZcO0bmlidXM6ICcvbS8wMWp3XzEnLFxyXG4gIENvbmVzZGV0csOhZmVnbzogJy9tLzAzc3k3dicsXHJcbiAgcGFycXXDrW1ldHJvczogJy9tLzAxNXFicCcsXHJcbiAgZXNjYWRhcmlhOiAnL20vMDFseW5oJyxcclxuICBjaGFtaW7DqXM6ICcvbS8wMWprXzQnLFxyXG4gIHRyYXRvcmVzOiAnL20vMDEzeGxtJyxcclxuXHJcbiAgZXNjYWRhczogJy9tLzAxbHluaCcsXHJcbiAgZmFpeGFzZGVwZWRlc3RyZTogJy9tLzAxNHhjcycsXHJcbiAgcGFsbWVpcmFzOiAnL20vMGNkbDEnLFxyXG4gIHVtaGlkcmFudGU6ICcvbS8wMXBuczAnLFxyXG4gIHBvbnRlczogJy9tLzAxNWtyJyxcclxuICB0w6F4aXM6ICcvbS8wcGc1MicsXHJcbiAgaGlkcmFudGVzOiAnL20vMDFwbnMwJyxcclxuICBoaWRyYW50ZXM6ICcvbS8wMXBuczAnLFxyXG5cclxuICAvLyDotorljZfor61cclxuICBuw7ppaG/hurdjxJHhu5NpOiAnL20vMDlkX3InLFxyXG4gIMSRaeG7g21k4burbmc6ICcvbS8wMnB2MTknLFxyXG4gIMSRxrDhu51uZ3Bo4buROiAnL20vMDFtcWR0JyxcclxuICBjw6J5OiAnL20vMDdqN3InLFxyXG4gIGLDo2lj4buPOiAnL20vMDh0OWNfJyxcclxuICBjw6J5YuG7pWk6ICcvbS8wZ3FidCcsXHJcbiAgY8OieXjGsMahbmdy4buTbmc6ICcvbS8wMjVfdicsXHJcbiAgY8OieWPhu406ICcvbS8wY2RsMScsXHJcbiAgVGhpw6pubmhpw6puOiAnL20vMDVoMG4nLFxyXG4gIHRow6Fjbsaw4bubYzogJy9tLzBqMmt4JyxcclxuICBuw7ppbm9uOiAnL20vMDlkX3InLFxyXG4gIMSR4buTaW7Dumk6ICcvbS8wOWRfcicsXHJcbiAgbmd14buTbm7GsOG7m2M6ICcvbS8wM2t0bTEnLFxyXG4gIHPDtG5nOiAnL20vMDZjbnAnLFxyXG4gIGLDo2liaeG7g246ICcvbS8wYjN5cicsXHJcbiAgbeG6t3R0cuG7nWk6ICcvbS8wNm1fcCcsXHJcbiAgTeG6t3R0csSDbmc6ICcvbS8wNHd2XycsXHJcbiAgYuG6p3V0cuG7nWk6ICcvbS8wMWJxdnAnLFxyXG4gIHhlY+G7mTogJy9tLzBrNGonLFxyXG4gIMO0dMO0OiAnL20vMGs0aicsXHJcbiAgeGXEkeG6oXA6ICcvbS8wMTk5ZycsXHJcbiAgeGVtw6F5OiAnL20vMDRfc3YnLFxyXG4gIHhlYsOhbnThuqNpOiAnL20vMGN2cTMnLFxyXG4gIHhldOG6o2l0aMawxqFuZ23huqFpOiAnL20vMGZrd2pnJyxcclxuICB0aHV54buBbjogJy9tLzAxOWpkJyxcclxuICB4ZWxpbW91c2luZTogJy9tLzAxbGN3NCcsXHJcbiAgdGF4aTogJy9tLzBwZzUyJyxcclxuICB4ZWJ1w710Y+G7p2F0csaw4budbmc6ICcvbS8wMnl2aGonLFxyXG4gIHhlYnXDvXQ6ICcvbS8wMWJqdicsXHJcbiAgeGV4w6J5ZOG7sW5nOiAnL20vMDJneDE3JyxcclxuICBuaOG7r25nYuG7qWN0xrDhu6NuZzogJy9tLzAxM18xYycsXHJcbiAgxJHDoGlwaHVubsaw4bubYzogJy9tLzBoOGxoa2cnLFxyXG4gIGPhuqd1OiAnL20vMDE1a3InLFxyXG4gIMSRw6o6ICcvbS8wMXBocTQnLFxyXG4gIHTDsmFuaMOgY2jhu41jdHLhu51pOiAnL20vMDc5Y2wnLFxyXG4gIGPhu5l0dHLhu6U6ICcvbS8wMV9tNycsXHJcbiAga8Otbmhtw6B1OiAnL20vMDExeTIzJyxcclxuICBuaMOg4bufOiAnL20vMDNqbTUnLFxyXG4gIHTDsmFuaMOgY2h1bmdjxrA6ICcvbS8wMW5ibHQnLFxyXG4gIG5nw7RpbmjDoMOhbmhzw6FuZzogJy9tLzA0aDdoJyxcclxuICBnYXhlbOG7rWE6ICcvbS8wcHkyNycsXHJcbiAgdHJvdMOgbjogJy9tLzAxbjZmZCcsXHJcbiAgYWZpcmVoeWRyYW50OiAnL20vMDFwbnMwJyxcclxuICBhYmlsbGJvYXJkOiAnL20vMDFrbmpiJyxcclxuICBuaOG7r25nY29uxJHGsOG7nW5nOiAnL20vMDZnZmonLFxyXG4gIGLEg25ncXVhxJHGsOG7nW5nOiAnL20vMDE0eGNzJyxcclxuICDEkcOobmdpYW90aMO0bmc6ICcvbS8wMTVxZmYnLFxyXG4gIG5ow6DEkeG7g3hlOiAnL20vMDhsOTQxJyxcclxuICB0cuG6oW1k4burbmd4ZWJ1w710OiAnL20vMDFqd18xJyxcclxuICBnaWFvdGjDtG5nOiAnL20vMDNzeTd2JyxcclxuICDEkeG7k25naOG7k8SR4buXeGU6ICcvbS8wMTVxYnAnLFxyXG4gIGPhuqd1dGhhbmc6ICcvbS8wMWx5bmgnLFxyXG4gIOG7kW5na2jDs2k6ICcvbS8wMWprXzQnLFxyXG4gIG3DoXlrw6lvOiAnL20vMDEzeGxtJyxcclxuXHJcbiAgduG6oWNocXVhxJHGsOG7nW5nOiAnL20vMDE0eGNzJyxcclxuICB4ZWjGoWk6ICcvbS8wazRqJyxcclxuICB0cuG7pWPhuqVwbsaw4bubY2No4buvYWNow6F5OiAnL20vMDFwbnMwJyxcclxuICB2w7JpbOG6pXluxrDhu5tjY2jhu69hY2jDoXk6ICcvbS8wMXBuczAnLFxyXG4gIHhlZ+G6r25tw6F5OiAnL20vMDRfc3YnLFxyXG5cclxuICAvLyDoj7Llvovlrr7or61cclxuICBidW5kb2tvYnVyb2w6ICcvbS8wOWRfcicsXHJcbiAgc3RvcHNpZ25zOiAnL20vMDJwdjE5JyxcclxuICBUYW5kYW5nbWdha2FseWU6ICcvbS8wMW1xZHQnLFxyXG4gIGhhbGFtYW46ICcvbS8wNXMycycsXHJcbiAgbWdhcHVubzogJy9tLzA3ajdyJyxcclxuICBkYW1vOiAnL20vMDh0OWNfJyxcclxuICBtZ2FwYWx1bXBvbmc6ICcvbS8wZ3FidCcsXHJcbiAgY2FjdHVzOiAnL20vMDI1X3YnLFxyXG4gIG1nYXB1bm9uZ3BhbG1hOiAnL20vMGNkbDEnLFxyXG4gIGthbGlrYXNhbjogJy9tLzA1aDBuJyxcclxuICB0YWxvbjogJy9tLzBqMmt4JyxcclxuICBtZ2FidW5kb2s6ICcvbS8wOWRfcicsXHJcbiAgbWdhYnVyb2w6ICcvbS8wOWRfcicsXHJcbiAgYW55b25ndHViaWc6ICcvbS8wM2t0bTEnLFxyXG4gIG1nYWlsb2c6ICcvbS8wNmNucCcsXHJcbiAgbWdhYmVhY2g6ICcvbS8wYjN5cicsXHJcbiAgQXJhdzogJy9tLzA2bV9wJyxcclxuICBCdXdhbjogJy9tLzA0d3ZfJyxcclxuICBsYW5naXQ6ICcvbS8wMWJxdnAnLFxyXG4gIG1nYXNhc2FreWFuOiAnL20vMGs0aicsXHJcbiAgbWdhYmlzaWtsZXRhOiAnL20vMDE5OWcnLFxyXG4gIG1nYW1vdG9yc2lrbG86ICcvbS8wNF9zdicsXHJcbiAgbWdhcGlja3VwdHJ1Y2s6ICcvbS8wY3ZxMycsXHJcbiAgbWdha29tZXJzeWFsbmF0cmFrOiAnL20vMGZrd2pnJyxcclxuICBtZ2FiYW5na2E6ICcvbS8wMTlqZCcsXHJcbiAgbWdhbGltb3VzaW5lOiAnL20vMDFsY3c0JyxcclxuICBtZ2F0YXhpOiAnL20vMHBnNTInLFxyXG4gIGJ1c25nZXNrd2VsYWhhbjogJy9tLzAyeXZoaicsXHJcbiAgYnVzOiAnL20vMDFianYnLFxyXG4gICdzYXNha3lhbmdwYW5nLWtvbnN0cnVrc3lvbic6ICcvbS8wMmd4MTcnLFxyXG4gIG1nYWVzdGF0d2E6ICcvbS8wMTNfMWMnLFxyXG4gIG1nYWZvdW50YWluOiAnL20vMGg4bGhrZycsXHJcbiAgdHVsYXk6ICcvbS8wMTVrcicsXHJcbiAgcGllcjogJy9tLzAxcGhxNCcsXHJcbiAgbmFwYWthdGFhc25hZ3VzYWxpOiAnL20vMDc5Y2wnLFxyXG4gIG1nYWhhbGlnaW9oYWxpZ2k6ICcvbS8wMV9tNycsXHJcbiAgbWluYW50c2FoYW5nc2FsYW1pbjogJy9tLzAxMXkyMycsXHJcbiAgYmFoYXk6ICcvbS8wM2ptNScsXHJcbiAgZ3VzYWxpbmdpc2FuZ2FwYXJ0bWVudDogJy9tLzAxbmJsdCcsXHJcbiAgaWxhd25hYmFoYXk6ICcvbS8wNGg3aCcsXHJcbiAgaXN0YXN5b25uZ3RyZW46ICcvbS8wcHkyNycsXHJcbiAgYWJvOiAnL20vMDFuNmZkJyxcclxuICBhZmlyZWh5ZHJhbnQ6ICcvbS8wMXBuczAnLFxyXG4gIGFiaWxsYm9hcmQ6ICcvbS8wMWtuamInLFxyXG4gIG1nYWthbHNhZGE6ICcvbS8wNmdmaicsXHJcbiAgbWdhdGF3aXJhbjogJy9tLzAxNHhjcycsXHJcbiAgaWxhd3RyYXBpa286ICcvbS8wMTVxZmYnLFxyXG4gIG1nYWdhcmFnZWRkb29yOiAnL20vMDhsOTQxJyxcclxuICBoaW50dWFubmdidXM6ICcvbS8wMWp3XzEnLFxyXG4gIG1nYXRyYWZmaWNjb25lOiAnL20vMDNzeTd2JyxcclxuICBtZXRyb25ncGFyYWRhaGFuOiAnL20vMDE1cWJwJyxcclxuICBoYWdkYW46ICcvbS8wMWx5bmgnLFxyXG4gIG1nYXRzaW1lbmVhOiAnL20vMDFqa180JyxcclxuICBtZ2F0cmFrdG9yYTogJy9tLzAxM3hsbScsXHJcblxyXG4gIG1nYWNyb3Nzd2FsazogJy9tLzAxNHhjcycsXHJcbiAgJ21nYWlsYXctdHJhcGlrbyc6ICcvbS8wMTVxZmYnLFxyXG4gIGZpcmVoeWRyYW50OiAnL20vMDFwbnMwJyxcclxuICBtZ2Frb3RzZTogJy9tLzBrNGonLFxyXG4gIG1nYWNoaW1uZXk6ICcvbS8wMWprXzQnLFxyXG4gIG1nYXBhbG10cmVlOiAnL20vMGNkbDEnLFxyXG4gIG1nYWhhZ2RhbjogJy9tLzAxbHluaCcsXHJcbiAgbWdhYnVzOiAnL20vMDFianYnLFxyXG4gIG1nYWZpcmVoeWRyYW50OiAnL20vMDFwbnMwJyxcclxuICBtZ2F0dWxheTogJy9tLzAxNWtyJyxcclxuXHJcbiAgLy8g6ICB5oyd6K+tXHJcbiAg4Lqe4Lq54LuA4LqC4Lq74Lqy4Lqr4Lq84Lq34LuA4LqZ4Lq14LqZ4Lqe4Lq5OiAnL20vMDlkX3InLFxyXG4gIOC6m+C7ieC6suC6jeC6ouC6uOC6lDogJy9tLzAycHYxOScsXHJcbiAg4Lqb4LuJ4Lqy4LqN4LqW4Lqw4Luc4Lq74LqZOiAnL20vMDFtcWR0JyxcclxuICDgup7gurfgupQ6ICcvbS8wNXMycycsXHJcbiAg4LqV4Lq74LuJ4LqZ4LuE4Lqh4LuJOiAnL20vMDdqN3InLFxyXG4gIOC6q+C6jeC7ieC6sjogJy9tLzA4dDljXycsXHJcbiAg4LuE4Lqh4LuJ4Lqe4Lq44LuI4LqhOiAnL20vMGdxYnQnLFxyXG4gIOC6geC6sOC6l+C6veC6oTogJy9tLzAyNV92JyxcclxuICAn4LuE4Lqh4LuJXFx1MjAwYuC6ouC6t+C6mVxcdTIwMGLgupXgurvgu4nguplcXHUyMDBi4Lqb4Lqy4LqhJzogJy9tLzBjZGwxJyxcclxuICDgupfgu43gurLguqHgurDguorgurLgupQ6ICcvbS8wNWgwbicsXHJcbiAg4LqZ4LuJ4Lqz4LqV4Lq74LqB4LqV4Lqy4LqUOiAnL20vMGoya3gnLFxyXG4gIOC6nuC6ueC7gOC6guC6u+C6sjogJy9tLzA5ZF9yJyxcclxuICAn4LuA4LqZ4Lq14LqZXFx1MjAwYuC6nuC6uSc6ICcvbS8wOWRfcicsXHJcbiAg4Lqu4LuI4Lqy4LqH4LqB4Lqy4LqN4LqC4Lqt4LqH4LqZ4LuJ4LuN4LqyOiAnL20vMDNrdG0xJyxcclxuICDgu4HguqHgu4jgupngu4ngurM6ICcvbS8wNmNucCcsXHJcbiAg4Lqr4Lqy4LqU4LqK4Lqy4LqNOiAnL20vMGIzeXInLFxyXG4gIOC6leC6suC7gOC6p+C6seC6mTogJy9tLzA2bV9wJyxcclxuICDgupTguqfguofguojgurHgupk6ICcvbS8wNHd2XycsXHJcbiAg4LqX4Lqt4LqH4Lqf4LuJ4LqyOiAnL20vMDFicXZwJyxcclxuICDgup7gurLguqvgurDgupngurA6ICcvbS8wazRqJyxcclxuICDguqXgurvgupQ6ICcvbS8wazRqJyxcclxuICDguqXgurvgupTgupbgurXgupo6ICcvbS8wMTk5ZycsXHJcbiAg4Lql4Lq74LqU4LqI4Lqx4LqBOiAnL20vMDRfc3YnLFxyXG4gIOC6peC6u+C6lOC6geC6sOC6muC6sDogJy9tLzBjdnEzJyxcclxuICDguqXgurvgupTguprgurHgupngupfgurjguoHguoHgurLgupnguoTgu4ngurI6ICcvbS8wZmt3amcnLFxyXG4gIOC7gOC6ruC6t+C6rTogJy9tLzAxOWpkJyxcclxuICDguqXgurvgupTguqXgurXguqHgurnguorgurXgupk6ICcvbS8wMWxjdzQnLFxyXG4gIOC7geC6l+C6seC6geC6iuC6tTogJy9tLzBwZzUyJyxcclxuICAn4Lql4Lq74LqUXFx1MjAwYuC7gOC6oVxcdTIwMGLgu4Lguq7guodcXHUyMDBi4Lqu4Lq94LqZJzogJy9tLzAyeXZoaicsXHJcbiAg4Lql4Lq74LqU4LuA4LqhOiAnL20vMDFianYnLFxyXG4gIOC6nuC6suC6q+C6sOC6meC6sOC6geC7jeC7iOC6quC7ieC6suC6hzogJy9tLzAyZ3gxNycsXHJcbiAg4Lqu4Lq54Lqa4Lqb4Lqx4LuJ4LqZOiAnL20vMDEzXzFjJyxcclxuICDgupngu4ngurPgup7gurg6ICcvbS8waDhsaGtnJyxcclxuICDguoLgurvguqc6ICcvbS8wMTVrcicsXHJcbiAg4LqX4LuI4Lqy4LuA4Lqu4Lq34LqtOiAnL20vMDFwaHE0JyxcclxuICDgupXgurbguoHguqrgurnguoc6ICcvbS8wNzljbCcsXHJcbiAg4LqW4Lqx4LqZ4LuA4Lqq4Lq74LqyOiAnL20vMDFfbTcnLFxyXG4gIOC7geC6geC7ieC6p+C6quC6tTogJy9tLzAxMXkyMycsXHJcbiAg4LuA4Lqu4Lq34Lqt4LqZOiAnL20vMDNqbTUnLFxyXG4gIOC6leC6tuC6geC6reC6suC6nuC6suC6lOC7gOC6oeC6seC6mTogJy9tLzAxbmJsdCcsXHJcbiAg4LuA4Lqu4Lq34Lqt4LqZ4LuB4Lqq4LqH4Lqq4Lqw4Lqr4Lqn4LuI4Lqy4LqHOiAnL20vMDRoN2gnLFxyXG4gIOC6quC6sOC6luC6suC6meC6teC6peC6u+C6lOC7hOC6nzogJy9tLzBweTI3JyxcclxuICDguoLgurXgu4ngu4Dgupfgurvgu4jgurI6ICcvbS8wMW42ZmQnLFxyXG4gIOC6meC7jeC7ieC6suC6lOC6seC6muC7gOC6nuC6teC6hzogJy9tLzAxcG5zMCcsXHJcbiAg4Lqb4LuJ4Lqy4LqN4LuC4LqE4Lqq4Lqw4LqZ4LqyOiAnL20vMDFrbmpiJyxcclxuICDgupbgurDgu5zgurvgupnguqvgurvgupngupfgurLguoc6ICcvbS8wNmdmaicsXHJcbiAg4LqX4Lqy4LqH4LqC4LuJ4Lqy4LqhOiAnL20vMDE0eGNzJyxcclxuICAn4LuE4LqfXFx1MjAwYuC6reC7jeC6slxcdTIwMGLgupngurLgupQnOiAnL20vMDE1cWZmJyxcclxuICBnYXJhZ2Vkb29yczogJy9tLzA4bDk0MScsXHJcbiAg4Lqb4LuJ4Lqy4LqN4Lql4Lq74LqU4LuA4LqhOiAnL20vMDFqd18xJyxcclxuICDgu4LguoTgupnguoHgurLgupnguojgurDguqXgurLguojguq3gupk6ICcvbS8wM3N5N3YnLFxyXG4gIOC7geC6oeC6seC6lOC6muC7iOC6reC6meC6iOC6reC6lOC6peC6u+C6lDogJy9tLzAxNXFicCcsXHJcbiAg4LqC4Lqx4LuJ4LqZ4LuE4LqUOiAnL20vMDFseW5oJyxcclxuICDgupfgu43gu4jgu4Tgup86ICcvbS8wMWprXzQnLFxyXG4gIOC6peC6u+C6lOC7hOC6luC6meC6sjogJy9tLzAxM3hsbScsXHJcblxyXG4gIOC6peC6u+C6lOC7g+C6q+C6jeC7iDogJy9tLzBrNGonLFxyXG4gIOC6nuC6ueC6q+C6vOC6t+C6nOC6sjogJy9tLzA5ZF9yJyxcclxuICDguqXgurvgupTgu4Pguqvguo3gu4g6ICcvbS8wazRqJyxcclxuICDgu4Tgup/guojgurDguqXgurLguojguq3gupk6ICcvbS8wMTVxZmYnLFxyXG4gIOC6muC7iOC6reC6meC6guC7ieC6suC6oeC6l+C6suC6hzogJy9tLzAxNHhjcycsXHJcbiAgJ+C6q+C6u+C6p+KAi+C6quC6teC6lOKAi+C6meC7ieC6s+KAi+C6lOC6seC6muKAi+C7gOC6nuC6teC6hyc6ICcvbS8wMXBuczAnLFxyXG4gIOC6l+C6suC6h+C6oeC7ieC6suC6peC6suC6jTogJy9tLzAxNHhjcycsXHJcbiAg4LqV4Lq74LuJ4LqZ4Lqb4Lqy4LqhOiAnL20vMGNkbDEnLFxyXG4gIOC6m+C7iOC6reC6h+C6hOC6p+C6seC6meC7hOC6nzogJy9tLzAxamtfNCcsXHJcbiAg4Lql4Lq74LqU4LuB4LqX4Lqj4Lqx4LqB4LuA4LqV4Lq1OiAnL20vMDEzeGxtJyxcclxuICDguqvgurvguqfgupTgurHguprgu4Dgup7gurXguoc6ICcvbS8wMXBuczAnLFxyXG4gIOC6q+C6u+C6p+C6lOC6seC6muC7gOC6nuC6teC6hzogJy9tLzAxcG5zMCcsXHJcblxyXG4gIC8vIOe8heeUuOivrVxyXG4gIOGAkOGAseGArOGAhOGAuuGAmeGAu+GArOGAuOGAnuGAreGAr+GAt+GAmeGAn+GAr+GAkOGAuuGAkOGAseGArOGAhOGAuuGAmeGAu+GArOGAuDogJy9tLzA5ZF9yJyxcclxuICDhgJnhgL7hgJDhgLrhgJDhgK3hgK/hgIThgLrhgJnhgLvhgKzhgLg6ICcvbS8wMnB2MTknLFxyXG4gIOGAnOGAmeGAuuGAuOGAhuGAreGAr+GAhOGAuuGAuOGAmOGAr+GAkOGAuuGAmeGAu+GArOGAuDogJy9tLzAxbXFkdCcsXHJcbiAg4YCh4YCV4YCE4YC64YCZ4YC74YCs4YC4OiAnL20vMDVzMnMnLFxyXG4gIOGAnuGAheGAuuGAleGAhOGAuuGAmeGAu+GArOGAuDogJy9tLzA3ajdyJyxcclxuICDhgJnhgLzhgIDhgLo6ICcvbS8wOHQ5Y18nLFxyXG4gIOGAleGAseGAq+GAgOGAuuGAleGAhOGAuuGAmeGAu+GArOGAuDogJy9tLzBncWJ0JyxcclxuICDhgJvhgL7hgKzhgLjhgIXhgLHhgKzhgIThgLrhgLg6ICcvbS8wMjVfdicsXHJcbiAg4YCR4YCU4YC64YC44YCV4YCE4YC64YCZ4YC74YCs4YC4OiAnL20vMGNkbDEnLFxyXG4gIOGAnuGAmOGArOGAnTogJy9tLzA1aDBuJyxcclxuICDhgJvhgLHhgJDhgLbhgIHhgL3hgJThgLrhgJnhgLvhgKzhgLg6ICcvbS8wajJreCcsXHJcbiAg4YCQ4YCx4YCs4YCE4YC64YCZ4YC74YCs4YC4OiAnL20vMDlkX3InLFxyXG4gIOGAkOGAseGArOGAhOGAuuGAkOGAveGAsTogJy9tLzA5ZF9yJyxcclxuICDhgJvhgLHhgJDhgL3hgIThgLrhgLg6ICcvbS8wM2t0bTEnLFxyXG4gIOGAmeGAvOGAheGAuuGAmeGAu+GArOGAuDogJy9tLzA2Y25wJyxcclxuICDhgIDhgJnhgLrhgLjhgIHhgLzhgLHhgJnhgLvhgKzhgLg6ICcvbS8wYjN5cicsXHJcbiAg4YCU4YCx4YCZ4YCE4YC64YC4OiAnL20vMDZtX3AnLFxyXG4gIOGAmeGAveGAlOGAuuGAuDogJy9tLzA0d3ZfJyxcclxuICDhgIDhgLHhgKzhgIThgLrhgLjhgIDhgIThgLo6ICcvbS8wMWJxdnAnLFxyXG4gIOGAmuGArOGAieGAuuGAmeGAu+GArOGAuDogJy9tLzBrNGonLFxyXG4gIOGAgOGArOGAuOGAmeGAu+GArOGAuDogJy9tLzBrNGonLFxyXG4gIOGAheGAgOGAuuGAmOGAruGAuDogJy9tLzAxOTlnJyxcclxuICDhgIbhgK3hgK/hgIThgLrhgIDhgJrhgLrhgJnhgLvhgKzhgLg6ICcvbS8wNF9zdicsXHJcbiAg4YCV4YCF4YC64YCA4YCV4YC64YCA4YCs4YC44YCZ4YC74YCs4YC4OiAnL20vMGN2cTMnLFxyXG4gIOGAgOGAr+GAlOGAuuGAkOGAhOGAuuGAgOGArOGAuOGAmeGAu+GArOGAuDogJy9tLzBma3dqZycsXHJcbiAg4YCc4YC+4YCx4YCZ4YC74YCs4YC4OiAnL20vMDE5amQnLFxyXG4gIOGAh+GAreGAmeGAuuGAgeGAtuGAgOGArOGAuOGAmeGAu+GArOGAuDogJy9tLzAxbGN3NCcsXHJcbiAg4YCh4YCE4YC+4YCs4YC44YCa4YCs4YCJ4YC64YCZ4YC74YCs4YC4OiAnL20vMHBnNTInLFxyXG4gIOGAgOGAu+GAseGArOGAhOGAuuGAuOGAgOGArOGAuDogJy9tLzAyeXZoaicsXHJcbiAg4YCY4YCQ4YC64YCF4YC64YCA4YCs4YC4OiAnL20vMDFianYnLFxyXG4gIOGAhuGAseGArOGAgOGAuuGAnOGAr+GAleGAuuGAm+GAseGAuOGAmuGArOGAieGAujogJy9tLzAyZ3gxNycsXHJcbiAg4YCb4YCv4YCV4YC64YCV4YC94YCs4YC44YCQ4YCx4YCs4YC64YCZ4YC74YCs4YC4OiAnL20vMDEzXzFjJyxcclxuICDhgIXhgJnhgLrhgLjhgJvhgLE6ICcvbS8waDhsaGtnJyxcclxuICDhgJDhgLbhgJDhgKzhgLg6ICcvbS8wMTVrcicsXHJcbiAg4YCG4YCt4YCV4YC64YCB4YC2OiAnL20vMDFwaHE0JyxcclxuICDhgJnhgK3hgK/hgLjhgJnhgLvhgL7hgLHhgKzhgLrhgJDhgK3hgK/hgIDhgLo6ICcvbS8wNzljbCcsXHJcbiAg4YCQ4YCt4YCv4YCE4YC64YCZ4YC74YCs4YC4OiAnL20vMDFfbTcnLFxyXG4gIOGAm+GAseGArOGAhOGAuuGAheGAr+GAtuGAmeGAvuGAlOGAujogJy9tLzAxMXkyMycsXHJcbiAg4YCh4YCt4YCZ4YC6OiAnL20vMDNqbTUnLFxyXG4gIOGAkOGAreGAr+GAgOGAuuGAgeGAlOGAuuGAuOGAoeGAhuGAseGArOGAgOGAuuGAoeGApjogJy9tLzAxbmJsdCcsXHJcbiAg4YCZ4YCu4YC44YCh4YCt4YCZ4YC6OiAnL20vMDRoN2gnLFxyXG4gIOGAmOGAsOGAkOGArOGAm+GAr+GAtjogJy9tLzBweTI3JyxcclxuICDhgJXhgLzhgKw6ICcvbS8wMW42ZmQnLFxyXG4gIOGAmeGAruGAuOGAnuGAkOGAuuGAhuGAseGAuOGAmOGAsOGAuDogJy9tLzAxcG5zMCcsXHJcbiAg4YCA4YC84YCx4YCs4YC64YCE4YC84YCs4YCY4YCv4YCQ4YC6OiAnL20vMDFrbmpiJyxcclxuICDhgJzhgJnhgLrhgLjhgJnhgLvhgKzhgLg6ICcvbS8wNmdmaicsXHJcbiAg4YCc4YCw4YCA4YCw4YC44YCZ4YC74YCJ4YC64YC44YCA4YC84YCs4YC44YCZ4YC74YCs4YC4OiAnL20vMDE0eGNzJyxcclxuICDhgJnhgK7hgLjhgJXhgL3hgK3hgK/hgIThgLfhgLo6ICcvbS8wMTVxZmYnLFxyXG4gIOGAgOGArOGAuOGAguGAreGAr+GAkuGAseGAq+GAhOGAuuGAmeGAu+GArOGAuDogJy9tLzA4bDk0MScsXHJcbiAg4YCY4YCQ4YC64YCF4YC64YCA4YCs4YC44YCZ4YC+4YCQ4YC64YCQ4YCt4YCv4YCE4YC64YCZ4YC74YCs4YC4OiAnL20vMDFqd18xJyxcclxuICB0cmFmZmljY29uZXM6ICcvbS8wM3N5N3YnLFxyXG4gIOGAgOGArOGAuOGAleGAq+GAgOGAhOGAuuGAmeGAruGAkOGArDogJy9tLzAxNXFicCcsXHJcbiAg4YCc4YC+4YCx4YCA4YCs4YC4OiAnL20vMDFseW5oJyxcclxuICDhgJnhgK7hgLjhgIHhgK3hgK/hgLjhgIHhgLHhgKvhgIThgLrhgLjhgJDhgK3hgK/hgIThgLrhgJnhgLvhgKzhgLg6ICcvbS8wMWprXzQnLFxyXG4gIOGAkeGAveGAlOGAuuGAheGAgOGAuuGAmeGAu+GArOGAuDogJy9tLzAxM3hsbScsXHJcblxyXG4gIGZpcmVoeWRyYW50czogJy9tLzAxcG5zMCcsXHJcbiAgYnVzZXM6ICcvbS8wMWJqdicsXHJcbiAgdMOgdXRodXnhu4FuOiAnL20vMDE5amQnLFxyXG5cclxuICAvLyDpqazmnaXor61cclxuICBndW51bmdhdGF1YnVraXQ6ICcvbS8wOWRfcicsXHJcbiAgdGFuZGFiZXJoZW50aTogJy9tLzAycHYxOScsXHJcbiAgdGFuZGFqYWxhbjogJy9tLzAxbXFkdCcsXHJcbiAgdHVtYnVoYW46ICcvbS8wNXMycycsXHJcbiAgcG9rb2s6ICcvbS8wN2o3cicsXHJcbiAgcnVtcHV0OiAnL20vMDh0OWNfJyxcclxuICBwb2tva3JlbmVrOiAnL20vMGdxYnQnLFxyXG4gIGtha3R1czogJy9tLzAyNV92JyxcclxuICBwb2tva3BhbG1hOiAnL20vMGNkbDEnLFxyXG4gIGFsYW1zZW11bGFqYWRpOiAnL20vMDVoMG4nLFxyXG4gIGFpcnRlcmp1bjogJy9tLzBqMmt4JyxcclxuICBwZXJndW51bmdhbjogJy9tLzA5ZF9yJyxcclxuICBidWtpdGJ1a2F1OiAnL20vMDlkX3InLFxyXG4gIGJhZGFuYWlyOiAnL20vMDNrdG0xJyxcclxuICAnc3VuZ2FpLXN1bmdhaSc6ICcvbS8wNmNucCcsXHJcbiAgcGFudGFpOiAnL20vMGIzeXInLFxyXG4gIG1hdGFoYXJpOiAnL20vMDZtX3AnLFxyXG4gIEJ1bGFuOiAnL20vMDR3dl8nLFxyXG4gIGxhbmdpdDogJy9tLzAxYnF2cCcsXHJcbiAga2VuZGVyYWFuOiAnL20vMGs0aicsXHJcbiAga2VyZXRhOiAnL20vMGs0aicsXHJcbiAgYmFzaWthbDogJy9tLzAxOTlnJyxcclxuICBtb3Rvc2lrYWw6ICcvbS8wNF9zdicsXHJcbiAgdHJha3Bpa2FwOiAnL20vMGN2cTMnLFxyXG4gIHRyYWtrb21lcnNpYWw6ICcvbS8wZmt3amcnLFxyXG4gIGJvdDogJy9tLzAxOWpkJyxcclxuICBsaW1vc2luOiAnL20vMDFsY3c0JyxcclxuICB0ZWtzaTogJy9tLzBwZzUyJyxcclxuICBiYXNzZWtvbGFoOiAnL20vMDJ5dmhqJyxcclxuICBiYXM6ICcvbS8wMWJqdicsXHJcbiAga2VuZGVyYWFucGVtYmluYWFuOiAnL20vMDJneDE3JyxcclxuICAncGF0dW5nLXBhdHVuZyc6ICcvbS8wMTNfMWMnLFxyXG4gIGFpcnBhbmN1dDogJy9tLzBoOGxoa2cnLFxyXG4gIGphbWJhdGFuOiAnL20vMDE1a3InLFxyXG4gIGpldGk6ICcvbS8wMXBocTQnLFxyXG4gIGJhbmd1bmFucGVuY2FrYXJsYW5naXQ6ICcvbS8wNzljbCcsXHJcbiAgdGlhbmdhdGF1dGlhbmc6ICcvbS8wMV9tNycsXHJcbiAga2FjYWJlcndhcm5hOiAnL20vMDExeTIzJyxcclxuICBydW1haDogJy9tLzAzam01JyxcclxuICBiYW5ndW5hbmFuYXBhcnRtZW46ICcvbS8wMW5ibHQnLFxyXG4gIHJ1bWFoY2FoYXlhOiAnL20vMDRoN2gnLFxyXG4gIHN0ZXNlbktlcmV0YXBpOiAnL20vMHB5MjcnLFxyXG4gIGFidTogJy9tLzAxbjZmZCcsXHJcbiAgYWZpcmVoeWRyYW50OiAnL20vMDFwbnMwJyxcclxuICBwYXBhbmlrbGFuOiAnL20vMDFrbmpiJyxcclxuICBqYWxhbnJheWE6ICcvbS8wNmdmaicsXHJcbiAgbGludGFzYW5wZWphbGFua2FraTogJy9tLzAxNHhjcycsXHJcbiAgbGFtcHVpc3lhcmF0OiAnL20vMDE1cWZmJyxcclxuICBwaW50dWdhcmFnZWQ6ICcvbS8wOGw5NDEnLFxyXG4gIHBlcmhlbnRpYW5iYXM6ICcvbS8wMWp3XzEnLFxyXG4gIEtvbnRyYWZpazogJy9tLzAzc3k3dicsXHJcbiAgbWV0ZXJ0ZW1wYXRsZXRha2tlcmV0YTogJy9tLzAxNXFicCcsXHJcbiAgdGFuZ2dhOiAnL20vMDFseW5oJyxcclxuICBjZXJvYm9uZ2FzYXA6ICcvbS8wMWprXzQnLFxyXG4gIHRyYWt0b3I6ICcvbS8wMTN4bG0nLFxyXG5cclxuICBwaWxpYm9tYmE6ICcvbS8wMXBuczAnLFxyXG4gIHNlcm9tYm9uZ2FzYXA6ICcvbS8wMWprXzQnLFxyXG5cclxuICBzdG9wc2lnbnM6ICcvbS8wMnB2MTknLFxyXG4gIHN0cmVldHNpZ25zOiAnL20vMDFtcWR0JyxcclxuICBwbGFudHM6ICcvbS8wNXMycycsXHJcbiAgdHJlZXM6ICcvbS8wN2o3cicsXHJcbiAgZ3Jhc3M6ICcvbS8wOHQ5Y18nLFxyXG4gIHNocnViczogJy9tLzBncWJ0JyxcclxuICBjYWN0dXM6ICcvbS8wMjVfdicsXHJcbiAgcGFsbXRyZWVzOiAnL20vMGNkbDEnLFxyXG4gIG5hdHVyZTogJy9tLzA1aDBuJyxcclxuICB3YXRlcmZhbGxzOiAnL20vMGoya3gnLFxyXG4gIG1vdW50YWluc29yaGlsbHM6ICcvbS8wOWRfcicsXHJcbiAgYm9kaWVzb2Z3YXRlcjogJy9tLzAza3RtMScsXHJcbiAgcml2ZXJzOiAnL20vMDZjbnAnLFxyXG4gIGJlYWNoZXM6ICcvbS8wYjN5cicsXHJcbiAgdGhlU3VuOiAnL20vMDZtX3AnLFxyXG4gIHRoZU1vb246ICcvbS8wNHd2XycsXHJcbiAgdGhlc2t5OiAnL20vMDFicXZwJyxcclxuICB2ZWhpY2xlczogJy9tLzBrNGonLFxyXG4gIGNhcnM6ICcvbS8wazRqJyxcclxuICBiaWN5Y2xlczogJy9tLzAxOTlnJyxcclxuICBtb3RvcmN5Y2xlczogJy9tLzA0X3N2JyxcclxuICBwaWNrdXB0cnVja3M6ICcvbS8wY3ZxMycsXHJcbiAgY29tbWVyY2lhbHRydWNrczogJy9tLzBma3dqZycsXHJcbiAgYm9hdHM6ICcvbS8wMTlqZCcsXHJcbiAgbGltb3VzaW5lczogJy9tLzAxbGN3NCcsXHJcbiAgdGF4aXM6ICcvbS8wcGc1MicsXHJcbiAgc2Nob29sYnVzOiAnL20vMDJ5dmhqJyxcclxuICBidXM6ICcvbS8wMWJqdicsXHJcbiAgY29uc3RydWN0aW9udmVoaWNsZTogJy9tLzAyZ3gxNycsXHJcbiAgc3RhdHVlczogJy9tLzAxM18xYycsXHJcbiAgZm91bnRhaW5zOiAnL20vMGg4bGhrZycsXHJcbiAgYnJpZGdlczogJy9tLzAxNWtyJyxcclxuICBwaWVyOiAnL20vMDFwaHE0JyxcclxuICBza3lzY3JhcGVyOiAnL20vMDc5Y2wnLFxyXG4gIHBpbGxhcnNvcmNvbHVtbnM6ICcvbS8wMV9tNycsXHJcbiAgc3RhaW5lZGdsYXNzOiAnL20vMDExeTIzJyxcclxuICBhaG91c2U6ICcvbS8wM2ptNScsXHJcbiAgYW5hcGFydG1lbnRidWlsZGluZzogJy9tLzAxbmJsdCcsXHJcbiAgYWxpZ2h0aG91c2U6ICcvbS8wNGg3aCcsXHJcbiAgYXRyYWluc3RhdGlvbjogJy9tLzBweTI3JyxcclxuICBhc2hlZDogJy9tLzAxbjZmZCcsXHJcbiAgYWZpcmVoeWRyYW50OiAnL20vMDFwbnMwJyxcclxuICBhYmlsbGJvYXJkOiAnL20vMDFrbmpiJyxcclxuICByb2FkczogJy9tLzA2Z2ZqJyxcclxuICBjcm9zc3dhbGtzOiAnL20vMDE0eGNzJyxcclxuICB0cmFmZmljbGlnaHRzOiAnL20vMDE1cWZmJyxcclxuICBnYXJhZ2Vkb29yczogJy9tLzA4bDk0MScsXHJcbiAgYnVzc3RvcHM6ICcvbS8wMWp3XzEnLFxyXG4gIHRyYWZmaWNjb25lczogJy9tLzAzc3k3dicsXHJcbiAgcGFya2luZ21ldGVyczogJy9tLzAxNXFicCcsXHJcbiAgc3RhaXJzOiAnL20vMDFseW5oJyxcclxuICBjaGltbmV5czogJy9tLzAxamtfNCcsXHJcbiAgdHJhY3RvcnM6ICcvbS8wMTN4bG0nLFxyXG5cclxuICDot6/moIc6ICcvbS8wMW1xZHQnLFxyXG4gIOiKsTogJy9tLzBjOXBoNScsXHJcbiAg5qCR5pyoOiAnL20vMDdqN3InLFxyXG5cclxuICDmo5XmpojmoJE6ICcvbS8wY2RsMScsXHJcblxyXG4gIOeAkeW4gzogJy9tLzBqMmt4JyxcclxuICDlsbE6ICcvbS8wOWRfcicsXHJcbiAg5rC05Z+fOiAnL20vMDNrdG0xJyxcclxuICDmsrPmtYE6ICcvbS8wNmNucCcsXHJcbiAg5rW35rupOiAnL20vMGIzeXInLFxyXG4gIOWkqumYszogJy9tLzA2bV9wJyxcclxuICDmnIjkuq46ICcvbS8wNHd2XycsXHJcbiAg5aSp56m6OiAnL20vMDFicXZwJyxcclxuICDkuqTpgJrlt6Xlhbc6ICcvbS8wazRqJyxcclxuICAvLyBcIuS6pOmAmuW3peWFt1wiOiBcIi9tLzA3eXY5XCIsXHJcbiAg5bCP6L2/6L2mOiAnL20vMGs0aicsXHJcbiAg5py65Yqo6L2mOiAnL20vMGs0aicsXHJcbiAg6Ieq6KGM6L2mOiAnL20vMDE5OWcnLFxyXG4gIOaRqeaJmOi9pjogJy9tLzA0X3N2JyxcclxuICDnmq7ljaHovaY6ICcvbS8wY3ZxMycsXHJcbiAg5ZWG55So5Y2h6L2mOiAnL20vMGZrd2pnJyxcclxuICDoiLk6ICcvbS8wMTlqZCcsXHJcbiAg6LGq5Y2O6L2/6L2mOiAnL20vMDFsY3c0JyxcclxuICDlh7rnp5/ovaY6ICcvbS8wcGc1MicsXHJcbiAg5qCh6L2mOiAnL20vMDJ5dmhqJyxcclxuICDlhazkuqTovaY6ICcvbS8wMWJqdicsXHJcbiAg54Gr6L2mOiAnL20vMDdqZHInLFxyXG4gIOaWveW3pei9pui+hjogJy9tLzAyZ3gxNycsXHJcbiAg6ZuV5YOPOiAnL20vMDEzXzFjJyxcclxuICDllrfms4k6ICcvbS8waDhsaGtnJyxcclxuICDmoaU6ICcvbS8wMTVrcicsXHJcbiAg56CB5aS0OiAnL20vMDFwaHE0JyxcclxuICDmkanlpKnlpKfmpbw6ICcvbS8wNzljbCcsXHJcbiAg5p+x5a2QOiAnL20vMDFfbTcnLFxyXG4gIOW9qeiJsueOu+eSgzogJy9tLzAxMXkyMycsXHJcbiAg5oi/5bGLOiAnL20vMDNqbTUnLFxyXG4gIOWFrOWvk+alvDogJy9tLzAxbmJsdCcsXHJcbiAg54Gv5aGUOiAnL20vMDRoN2gnLFxyXG4gIOeBq+i9puermTogJy9tLzBweTI3JyxcclxuICDpga7mo5o6ICcvbS8wMW42ZmQnLFxyXG4gIOa2iOmYsuagkzogJy9tLzAxcG5zMCcsXHJcbiAg5raI54Gr5qCTOiAnL20vMDFwbnMwJyxcclxuICDlub/lkYrniYw6ICcvbS8wMWtuamInLFxyXG4gIOmBk+i3rzogJy9tLzA2Z2ZqJyxcclxuICDkurrooYzmqKrpgZM6ICcvbS8wMTR4Y3MnLFxyXG4gIOi/h+ihl+S6uuihjOmBkzogJy9tLzAxNHhjcycsXHJcbiAg57qi57u/54GvOiAnL20vMDE1cWZmJyxcclxuICDovablupPpl6g6ICcvbS8wOGw5NDEnLFxyXG4gIOWFrOS6pOermTogJy9tLzAxandfMScsXHJcbiAg6ZSl5b2i5Lqk6YCa6Lev5qCHOiAnL20vMDNzeTd2JyxcclxuICDlgZzovaborqHml7blmag6ICcvbS8wMTVxYnAnLFxyXG4gIOWBnOi9puiuoeS7t+ihqDogJy9tLzAxNXFicCcsXHJcbiAg5qW85qKvOiAnL20vMDFseW5oJyxcclxuICDng5/lm7E6ICcvbS8wMWprXzQnLFxyXG4gIOaLluaLieacujogJy9tLzAxM3hsbScsXHJcblxyXG4gIOWBnOi9puagh+W/lzogJy9tLzAycHYxOScsXHJcbiAg6Lev54mMOiAnL20vMDFtcWR0JyxcclxuICDmpI3niak6ICcvbS8wNXMycycsXHJcbiAg5qCROiAnL20vMDdqN3InLFxyXG4gIOiNiTogJy9tLzA4dDljXycsXHJcbiAg5qOV5qaI5qCROiAnL20vMGNkbDEnLFxyXG4gIOiHqueEtjogJy9tLzA1aDBuJyxcclxuICDkuJjpmbU6ICcvbS8wOWRfcicsXHJcbiAg5rC05L2TOiAnL20vMDNrdG0xJyxcclxuICDmtbfmu6k6ICcvbS8wYjN5cicsXHJcbiAg5aSp56m6OiAnL20vMDFicXZwJyxcclxuICDovabovoY6ICcvbS8wazRqJyxcclxuICDmsb3ovaY6ICcvbS8wazRqJyxcclxuICDmkanmiZjovaY6ICcvbS8wNF9zdicsXHJcbiAg5ZWG5Lia5Y2h6L2mOiAnL20vMGZrd2pnJyxcclxuICDosarljY7ovb/ovaY6ICcvbS8wMWxjdzQnLFxyXG4gIOWFrOWFseaxvei9pjogJy9tLzAxYmp2JyxcclxuICDlu7rnrZHovabovoY6ICcvbS8wMmd4MTcnLFxyXG4gIOmbleWDjzogJy9tLzAxM18xYycsXHJcbiAg5pSv5p+x5p+xOiAnL20vMDFfbTcnLFxyXG4gIOW9qeiJsueOu+eSgzogJy9tLzAxMXkyMycsXHJcbiAg5oi/5a2QOiAnL20vMDNqbTUnLFxyXG4gIOeBsOeDrDogJy9tLzAxbjZmZCcsXHJcbiAg5raI54Gr5qCTOiAnL20vMDFwbnMwJyxcclxuICDpgZPot686ICcvbS8wNmdmaicsXHJcbiAg5Lq66KGM5qiq6YGTOiAnL20vMDE0eGNzJyxcclxuICDkuqTpgJrnga86ICcvbS8wMTVxZmYnLFxyXG4gIOi9puW6k+mXqDogJy9tLzA4bDk0MScsXHJcbiAg5be05aOr56uZOiAnL20vMDFqd18xJyxcclxuICDkuqTpgJrplKU6ICcvbS8wM3N5N3YnLFxyXG4gIOWBnOi9puWSquihqDogJy9tLzAxNXFicCcsXHJcbiAg5qW85qKvOiAnL20vMDFseW5oJyxcclxuICDng5/lm7E6ICcvbS8wMWprXzQnLFxyXG5cclxuICDtmqHri6jrs7Trj4Q6ICcvbS8wMTR4Y3MnLFxyXG4gIOyekOuPmeywqDogJy9tLzBrNGonLFxyXG4gIOyekOyghOqxsDogJy9tLzAxOTlnJyxcclxuICDrsoTsiqQ6ICcvbS8wMWJqdicsXHJcbiAg7Iug7Zi465OxOiAnL20vMDE1cWZmJyxcclxuICDqs4Tri6g6ICcvbS8wMWx5bmgnLFxyXG4gIOyGjO2ZlOyghDogJy9tLzAxcG5zMCcsXHJcbiAg6rW065qdOiAnL20vMDFqa180JyxcclxuICDsmKTthqDrsJTsnbQ6ICcvbS8wNF9zdicsXHJcbiAg7LCo65+JOiAnL20vMGs0aicsXHJcbiAg6rWQ6rCBOiAnL20vMDFwaHE0J1xyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3Byb21pc2UgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9wcm9taXNlXCIpO1xuXG52YXIgX3Byb21pc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvbWlzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnZW4gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgX3Byb21pc2UyLmRlZmF1bHQoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZnVuY3Rpb24gc3RlcChrZXksIGFyZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfcHJvbWlzZTIuZGVmYXVsdC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgc3RlcChcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHN0ZXAoXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGVwKFwibmV4dFwiKTtcbiAgICB9KTtcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYykge1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcucHJvbWlzZS5maW5hbGx5Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5wcm9taXNlLnRyeScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuUHJvbWlzZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTInIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciBJU19XUkFQID0gdHlwZSAmICRleHBvcnQuVztcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGtleSwgb3duLCBvdXQ7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG93biAmJiBoYXMoZXhwb3J0cywga2V5KSkgY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbiAoQykge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEMpIHtcbiAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDKCk7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmIChJU19QUk9UTykge1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmICh0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKSBoaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIGFyZ3MsIHRoYXQpIHtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZG9uZSwgdmFsdWUpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmUgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgU2FmYXJpIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMzOVxuICB9IGVsc2UgaWYgKE9ic2VydmVyICYmICEoZ2xvYmFsLm5hdmlnYXRvciAmJiBnbG9iYWwubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSB7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZiAoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpIHtcbiAgICAvLyBQcm9taXNlLnJlc29sdmUgd2l0aG91dCBhbiBhcmd1bWVudCB0aHJvd3MgYW4gZXJyb3IgaW4gTEcgV2ViT1MgMlxuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBpZiAoc2FmZSAmJiB0YXJnZXRba2V5XSkgdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIwIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL19odG1sJyk7XG52YXIgY2VsID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBzZXRUYXNrID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbnZhciBjbGVhclRhc2sgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XG52YXIgTWVzc2FnZUNoYW5uZWwgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWw7XG52YXIgRGlzcGF0Y2ggPSBnbG9iYWwuRGlzcGF0Y2g7XG52YXIgY291bnRlciA9IDA7XG52YXIgcXVldWUgPSB7fTtcbnZhciBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbnZhciBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpZCA9ICt0aGlzO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIGlmIChxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmICghc2V0VGFzayB8fCAhY2xlYXJUYXNrKSB7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBpID0gMTtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKSB7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmIChyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcycpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIFNwaGVyZSAoSlMgZ2FtZSBlbmdpbmUpIERpc3BhdGNoIEFQSVxuICB9IGVsc2UgaWYgKERpc3BhdGNoICYmIERpc3BhdGNoLm5vdykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBEaXNwYXRjaC5ub3coY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZiAoTWVzc2FnZUNoYW5uZWwpIHtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgcG9ydCA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZiAoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0JykpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbmF2aWdhdG9yID0gZ2xvYmFsLm5hdmlnYXRvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJztcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7IGRlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mIH0pO1xuIiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4vX3VzZXItYWdlbnQnKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52OCB8fCAnJztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2VcbiAgICAgIC8vIHY4IDYuNiAoTm9kZSAxMCBhbmQgQ2hyb21lIDY2KSBoYXZlIGEgYnVnIHdpdGggcmVzb2x2aW5nIGN1c3RvbSB0aGVuYWJsZXNcbiAgICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTgzMDU2NVxuICAgICAgLy8gd2UgY2FuJ3QgZGV0ZWN0IGl0IHN5bmNocm9ub3VzbHksIHNvIGp1c3QgY2hlY2sgdmVyc2lvbnNcbiAgICAgICYmIHY4LmluZGV4T2YoJzYuNicpICE9PSAwXG4gICAgICAmJiB1c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lLzY2JykgPT09IC0xO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24gKHByb21pc2UsIGlzUmVqZWN0KSB7XG4gIGlmIChwcm9taXNlLl9uKSByZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIG9rID0gcHJvbWlzZS5fcyA9PSAxO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuLCBleGl0ZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChwcm9taXNlLl9oID09IDIpIG9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYW5kbGVyID09PSB0cnVlKSByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7IC8vIG1heSB0aHJvd1xuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgICBleGl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKSB7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhZXhpdGVkKSBkb21haW4uZXhpdCgpO1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkgcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYgKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKSBvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIHVuaGFuZGxlZCA9IGlzVW5oYW5kbGVkKHByb21pc2UpO1xuICAgIHZhciByZXN1bHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYgKHVuaGFuZGxlZCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKSB7XG4gICAgICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZiAodW5oYW5kbGVkICYmIHJlc3VsdC5lKSB0aHJvdyByZXN1bHQudjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UuX2ggIT09IDEgJiYgKHByb21pc2UuX2EgfHwgcHJvbWlzZS5fYykubGVuZ3RoID09PSAwO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKSB7XG4gICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92IH0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmICghcHJvbWlzZS5fYSkgcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIHZhciB0aGVuO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZiAodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgICRyZWplY3QuY2FsbCh7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmICghVVNFX05BVElWRSkge1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fYSkgdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9zKSBub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG4gIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmYgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgcmV0dXJuIEMgPT09ICRQcm9taXNlIHx8IEMgPT09IFdyYXBwZXJcbiAgICAgID8gbmV3IE93blByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICA6IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBQcm9taXNlOiAkUHJvbWlzZSB9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocikge1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcyk7XG4gICAgdmFyICQkcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKExJQlJBUlkgJiYgdGhpcyA9PT0gV3JhcHBlciA/ICRQcm9taXNlIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikge1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciAkaW5kZXggPSBpbmRleCsrO1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtZmluYWxseVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1Byb21pc2UnLCB7ICdmaW5hbGx5JzogZnVuY3Rpb24gKG9uRmluYWxseSkge1xuICB2YXIgQyA9IHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBjb3JlLlByb21pc2UgfHwgZ2xvYmFsLlByb21pc2UpO1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBvbkZpbmFsbHkgPT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBpc0Z1bmN0aW9uID8gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShDLCBvbkZpbmFsbHkoKSkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9KTtcbiAgICB9IDogb25GaW5hbGx5LFxuICAgIGlzRnVuY3Rpb24gPyBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKEMsIG9uRmluYWxseSgpKS50aGVuKGZ1bmN0aW9uICgpIHsgdGhyb3cgZTsgfSk7XG4gICAgfSA6IG9uRmluYWxseVxuICApO1xufSB9KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtdHJ5XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUHJvbWlzZScsIHsgJ3RyeSc6IGZ1bmN0aW9uIChjYWxsYmFja2ZuKSB7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYodGhpcyk7XG4gIHZhciByZXN1bHQgPSBwZXJmb3JtKGNhbGxiYWNrZm4pO1xuICAocmVzdWx0LmUgPyBwcm9taXNlQ2FwYWJpbGl0eS5yZWplY3QgOiBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlKShyZXN1bHQudik7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufSB9KTtcbiIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbnZhciBET01JdGVyYWJsZXMgPSAoJ0NTU1J1bGVMaXN0LENTU1N0eWxlRGVjbGFyYXRpb24sQ1NTVmFsdWVMaXN0LENsaWVudFJlY3RMaXN0LERPTVJlY3RMaXN0LERPTVN0cmluZ0xpc3QsJyArXG4gICdET01Ub2tlbkxpc3QsRGF0YVRyYW5zZmVySXRlbUxpc3QsRmlsZUxpc3QsSFRNTEFsbENvbGxlY3Rpb24sSFRNTENvbGxlY3Rpb24sSFRNTEZvcm1FbGVtZW50LEhUTUxTZWxlY3RFbGVtZW50LCcgK1xuICAnTWVkaWFMaXN0LE1pbWVUeXBlQXJyYXksTmFtZWROb2RlTWFwLE5vZGVMaXN0LFBhaW50UmVxdWVzdExpc3QsUGx1Z2luLFBsdWdpbkFycmF5LFNWR0xlbmd0aExpc3QsU1ZHTnVtYmVyTGlzdCwnICtcbiAgJ1NWR1BhdGhTZWdMaXN0LFNWR1BvaW50TGlzdCxTVkdTdHJpbmdMaXN0LFNWR1RyYW5zZm9ybUxpc3QsU291cmNlQnVmZmVyTGlzdCxTdHlsZVNoZWV0TGlzdCxUZXh0VHJhY2tDdWVMaXN0LCcgK1xuICAnVGV4dFRyYWNrTGlzdCxUb3VjaExpc3QnKS5zcGxpdCgnLCcpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IERPTUl0ZXJhYmxlcy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IERPTUl0ZXJhYmxlc1tpXTtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV07XG4gIHZhciBwcm90byA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10pIGhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8vIFVzZSBgZ2V0T3duUHJvcGVydHlOYW1lc2AgYmVjYXVzZSBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgY2FsbGluZ1xuLy8gYGhhc093blByb3BlcnR5YCBvbiB0aGUgZ2xvYmFsIGBzZWxmYCBvYmplY3QgaW4gYSB3b3JrZXIuIFNlZSAjMTgzLlxudmFyIGhhZFJ1bnRpbWUgPSBnLnJlZ2VuZXJhdG9yUnVudGltZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnKS5pbmRleE9mKFwicmVnZW5lcmF0b3JSdW50aW1lXCIpID49IDA7XG5cbi8vIFNhdmUgdGhlIG9sZCByZWdlbmVyYXRvclJ1bnRpbWUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZXN0b3JlZCBsYXRlci5cbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcblxuLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcblxuaWYgKGhhZFJ1bnRpbWUpIHtcbiAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcnVudGltZS5cbiAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBvbGRSdW50aW1lO1xufSBlbHNlIHtcbiAgLy8gUmVtb3ZlIHRoZSBnbG9iYWwgcHJvcGVydHkgYWRkZWQgYnkgcnVudGltZS5qcy5cbiAgdHJ5IHtcbiAgICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIH0gY2F0Y2goZSkge1xuICAgIGcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG4gICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3RcbiAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG4gICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcbiAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcbiAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gSW4gc2xvcHB5IG1vZGUsIHVuYm91bmQgYHRoaXNgIHJlZmVycyB0byB0aGUgZ2xvYmFsIG9iamVjdCwgZmFsbGJhY2sgdG9cbiAgLy8gRnVuY3Rpb24gY29uc3RydWN0b3IgaWYgd2UncmUgaW4gZ2xvYmFsIHN0cmljdCBtb2RlLiBUaGF0IGlzIHNhZGx5IGEgZm9ybVxuICAvLyBvZiBpbmRpcmVjdCBldmFsIHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5LlxuICAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzIH0pKCkgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpXG4pO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlxyXG5pbXBvcnQge1xyXG4gIGdldEJhbGFuY2UsXHJcbiAgd2FpdERvLFxyXG4gIHdhaXRmb3JiYWNrZ3JvdW5kLFxyXG4gIGltYWdlcmVhZHksXHJcbiAgd2FpdEZvcixcclxuICBub3RuZWVkY29udGludWUsXHJcbiAgZGVsYXksXHJcbiAgZGl2MmJhc2U2NCxcclxuICBnZXRjb25maWcsXHJcbiAgcG9zdCxcclxuICBnZXQsXHJcbiAgY2FwdGNoYUNsYXNzaWZpY2F0aW9uLFxyXG4gIG1lc3NhZ2UsXHJcbiAgbWVzc2FnZUhpZGUsXHJcbiAgZ2V0UGFyZW50VXJsLFxyXG4gIGdldENsaWNrVGltZSxcclxuICBnZXRJc0JsYWNrV2hpdGVQYXNzXHJcbn0gZnJvbSAnLi4vY29tbW9uJ1xyXG5pbXBvcnQgeyBqc29uYWxsIH0gZnJvbSAnLi4vanNvbmFsbCdcclxuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJ1xyXG5jb25zdCBnZXRXb3JkcyA9IChrZXkpID0+IGJyb3dzZXIuaTE4bi5nZXRNZXNzYWdlKGtleSlcclxuaWYgKCFjb25maWcuZGV2ZWxvcCkgd2luZG93LmNvbnNvbGUubG9nID0gZnVuY3Rpb24gKCkgeyB9Oy8vIOa4hemZpOiwg+ivleS7o+eggVxyXG4oYXN5bmMgKCkgPT4ge1xyXG4gIGlmICh3aW5kb3cuaW5qZWN0ID09PSB0cnVlKSB7IC8vIOWmguaenOW3sue7j+azqOWFpei/h+S6huWwseS4jeWGjeazqOWFpVxyXG4gICAgcmV0dXJuXHJcbiAgfSBlbHNlIHtcclxuICAgIHdpbmRvdy5pbmplY3QgPSB0cnVlXHJcbiAgfVxyXG4gIGNvbnN0IGNvbmZpZyA9IGF3YWl0IGdldGNvbmZpZygpXHJcbiAgY29uc3QgaXNCbGFja1doaXRlUGFzcyA9IGF3YWl0IGdldElzQmxhY2tXaGl0ZVBhc3MoY29uZmlnKVxyXG4gIGlmICghaXNCbGFja1doaXRlUGFzcykgcmV0dXJuXHJcbiAgbGV0IHRpbWVzID0gY29uZmlnLnRpbWVzXHJcbiAgLy8gY29uc29sZS5sb2coY29uZmlnKVxyXG4gIGlmICghY29uZmlnLmF1dG9ydW4pIHJldHVyblxyXG5cclxuICBsZXQgZG9jdW1lbnRPYmogPSBhd2FpdCBjYXB0Y2hhQ2xhc3NpZmljYXRpb24oKSAvLyDpobXpnaLnsbvlnovlr7nosaFcclxuICAvLyBtZXNzYWdlKHsgdGV4dDogJ+iHquWKqOivhuWIq+W3sue7j+WQr+WKqCcsIGNvbG9yOiAnZ3JlZW4nIH0pXHJcbiAgaWYgKCFjb25maWcuY2xpZW50S2V5KSB7XHJcbiAgICBjb25zb2xlLmxvZygn6K+35YWI6YWN572uY2xpZW50S2V5JylcclxuICAgIC8vIGFsZXJ0KCdQbGVhc2UgZW50ZXIgYSBjbGllbnQga2V5JylcclxuICAgIG1lc3NhZ2UoeyB0ZXh0OiBnZXRXb3JkcygnY29udGVudF9tZXNzYWdlXzAnKSwgY29sb3I6ICdyZWQnIH0pXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIC8vIGNvbnNvbGUubG9nKGRvY3VtZW50LmxvY2F0aW9uKVxyXG5cclxuICBpZiAoIWRvY3VtZW50T2JqIHx8ICFjb25maWdbZG9jdW1lbnRPYmpbJ3RpdGxlJ11dKSB7XHJcbiAgICAvLyBtZXNzYWdlSGlkZSgpXHJcblxyXG4gICAgLy8gdmFyIGlmcmFtZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpZnJhbWUnKVxyXG4gICAgLy8gaWZyYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChpZnJhbWUpIHtcclxuICAgIC8vIOehruWumuaYr2hjYXB0Y2hh5qih5byPXHJcbiAgICAvLyBpZiAoaWZyYW1lLnNyYy5pbmRleE9mKCdoY2FwdGNoYS5jb20nKSA+IC0xKSB7XHJcblxyXG4gICAgLy8gICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIC8vICAgICBpZihldmVudC5kYXRhPT0nc3RhcnQnKXtcclxuXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICB9KVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIH0pXHJcblxyXG5cclxuICAgIC8vIHJlY2FwdGNoYeeahGludmlzaWJsZeaooeW8j1xyXG4gICAgYXdhaXQgd2FpdEZvcignaWZyYW1lW3NyYyo9XCJiZnJhbWVcIl0nKVxyXG4gICAgdmFyIGYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpZnJhbWVbc3JjKj1cImJmcmFtZVwiXScpXHJcbiAgICBpZiAoZikge1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5kYXRhID09ICdyZWFkeScpIHtcclxuXHJcbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICBhd2FpdCBkZWxheSh0aW1lcyAqIDEwKVxyXG4gICAgICAgICAgICBpZiAoIWYucGFyZW50RWxlbWVudCB8fCAhZi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaXNIaWRkZW4gPSBmLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID09ICdoaWRkZW4nXHJcbiAgICAgICAgICAgIGlmICghaXNIaWRkZW4pIHtcclxuICAgICAgICAgICAgICBmLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoJ0RvT2NyJywgJyonKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCBkZWxheSgyMDAwKSAvLyDnrYnlvoUx56eSXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG4gIG1lc3NhZ2UoeyB0ZXh0OiBnZXRXb3JkcygnY29udGVudF9tZXNzYWdlXzInKSwgY29sb3I6ICdncmVlbicgfSlcclxuICBjb25zb2xlLmxvZygnZG9jdW1lbnRPYmonLCBkb2N1bWVudE9ialsndGl0bGUnXSlcclxuICAvLyDmmL7npLroh6rliqjor4bliKvlt7Lnu4/lkK/liqhcclxuXHJcbiAgLy8gcmVDYXB0aGNh55qE54K55Ye75Yu+6YCJ6YC76L6R5Zyo5YW25LuW5Zyw5pa5XHJcbiAgLy8gaWYgKHdpbmRvdy5zZWxmLmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcL3JlY2FwdGNoYVxcLyguKj8pXFwvYW5jaG9yXFw/LykgPT0gbnVsbCkge1xyXG4gIC8vIC8vIOeCueWHu+aIkeaYr+S6uuexu1xyXG4gIC8vIC8vIDIwMjIwMzAxICDnrYnlvoXmmL7npLrlkI7miY3ngrnlh7tcclxuICAvLyAgIHdoaWxlICh2aXN1YWxWaWV3cG9ydC53aWR0aCA9PT0gMCkge1xyXG4gIC8vICAgICBhd2FpdCBkZWxheSh0aW1lcyAqIDEwKSAvLyDnrYnlvoUx56eSXHJcbiAgLy8gICB9XHJcbiAgLy8gICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gnKSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gnKS5jbGljaygpXHJcbiAgLy8gICBkb2N1bWVudC5ib2R5LmNsaWNrKClcclxuICAvLyB9XHJcblxyXG4gIC8vIHZhciBmID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaWZyYW1lW3NyYyo9XCJiZnJhbWVcIl0nKVxyXG5cclxuXHJcblxyXG4gIC8vIOagueaNruS4jeWQjOeahOmhtemdouexu+Wei++8jOi/m+ihjOS4jeWQjOeahOaTjeS9nFxyXG4gIHN3aXRjaCAoZG9jdW1lbnRPYmpbJ3RpdGxlJ10pIHtcclxuICAgIGNhc2UgJ2ltYWdlY2xhc3NpZmljYXRpb24nOlxyXG4gICAgICBpZiAoIWNvbmZpZy5yZWNhcHRjaGFDb25maWcuaXNVc2VOZXdTY3JpcHQgJiYgY29uZmlnLnJlY2FwdGNoYUNvbmZpZy5pc09wZW4pIHtcclxuICAgICAgICBhd2FpdCBpbWFnZWNsYXNzaWZpY2F0aW9uX3Y0KGNvbmZpZylcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnaW1hZ2V0b3RleHQnOlxyXG4gICAgICBhd2FpdCBpbWFnZXRvdGV4dChjb25maWcpXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdyYWluYm93JzpcclxuICAgICAgbWVzc2FnZUhpZGUoKVxyXG4gICAgICBhd2FpdCByYWluYm93KClcclxuICAgICAgYnJlYWtcclxuICB9XHJcblxyXG4gIC8vIG1lc3NhZ2UoeyB0ZXh0OiAn6Ieq5Yqo6K+G5Yir5bey57uP5a6M5oiQJywgY29sb3I6ICdncmVlbicgfSlcclxufSkoKVxyXG5cclxuLy8g5b2p6Jm554K55Ye75rWB56iLXHJcbmFzeW5jIGZ1bmN0aW9uIHJhaW5ib3coKSB7XHJcbiAgbGV0IHsgdGltZXMgfSA9IGF3YWl0IGdldGNvbmZpZygpXHJcbiAgbGV0IGNocm9tZSA9IHdpbmRvdy5jaHJvbWVcclxuICBjb25zb2xlLmxvZyhsb2NhdGlvbi5ocmVmLCAnbG9jYXRpb24uaHJlZicpXHJcbiAgLy8gYXdhaXQgZGVsYXkoMzAwMClcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgLy8gYXdhaXQgZGVsYXkoMTAwMClcclxuICAgIC8vIGNvbnNvbGUubG9nKCfnrYnlvoUx56eSJylcclxuICAgIGF3YWl0IHdhaXRGb3IoJ3N0cm9uZycpXHJcblxyXG4gICAgaWYgKFxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdHJvbmcnKSAmJlxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5xdWV1ZS1lcnJvcicpLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJ1xyXG4gICAgKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCfmib7liLDkuobmjInpkq4nKVxyXG4gICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgeyBhY3Rpb246ICdnZXR0YWJzJyB9LFxyXG4gICAgICAgIGFzeW5jIGZ1bmN0aW9uICh0YWJzKSB7XHJcbiAgICAgICAgICBsZXQgdG90YWx0YWJzID0gdGFicy5sZW5ndGhcclxuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0cm9uZycpLmNsaWNrKClcclxuICAgICAgICAgIGF3YWl0IGRlbGF5KDIwICogdGltZXMpXHJcbiAgICAgICAgICBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHsgYWN0aW9uOiAnZ2V0dGFicycgfSxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKHRhYnMpIHtcclxuICAgICAgICAgICAgICBpZiAodG90YWx0YWJzID09PSB0YWJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eCueWHu+Wksei0pScpXHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+eCueWHu+aIkOWKnycpXHJcbiAgICAgICAgICAgICAgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHsgYWN0aW9uOiAncmVtb3ZldGFiJyB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcblxyXG4gICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcblxyXG4vLyDoi7HmlofmlbDlrZfovazmlofmnKzmtYHnqItcclxuYXN5bmMgZnVuY3Rpb24gaW1hZ2V0b3RleHQoY29uZmlnKSB7XHJcbiAgbGV0IHsgdGltZXMgfSA9IGF3YWl0IGdldGNvbmZpZygpXHJcbiAgdmFyIEltYWdlQ2FjaGUgPSBbXVxyXG5cclxuICAvLyBhd2FpdCBkZWxheSgyMDAwKVxyXG4gIGNvbnNvbGUubG9nKCfoi7HmlofmlbDlrZfovazmlofmnKwnKVxyXG5cclxuICAvLyDnm5HlkKzpobXpnaLlj5jliqhcclxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01TdWJ0cmVlTW9kaWZpZWQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZS50YXJnZXQpXHJcblxyXG4gICAgaWYgKGUudGFyZ2V0ID09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjaGFsbGVuZ2UtY29udGFpbmVyJykpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJlLnRhcmdldFwiLCBlLnRhcmdldClcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJ2aXN1YWxWaWV3cG9ydC53aWR0aFwiLCB2aXN1YWxWaWV3cG9ydC53aWR0aClcclxuICAgICAgRG9PY3IoKVxyXG4gICAgfVxyXG5cclxuICB9KVxyXG5cclxuICBEb09jcigpXHJcblxyXG5cclxuICBhc3luYyBmdW5jdGlvbiBEb09jcigpIHtcclxuICAgIC8vIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc29sdXRpb24nKSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc29sdXRpb24nKS52YWx1ZSkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZygn5Yi35paw6aG16Z2iJylcclxuICAgIC8vICAgbG9jYXRpb24ucmVsb2FkKClcclxuICAgIC8vIH1cclxuICAgIGNvbnNvbGUubG9nKCfnrYnlvoXliqDovb3lm77niYcnKVxyXG4gICAgLy8gYXdhaXQgd2FpdEZvcignI2NoYWxsZW5nZS1jb250YWluZXIgPiBkaXYgPiBmaWVsZHNldCA+IGRpdi5ib3RkZXRlY3QtbGFiZWwgPiBpbWcnKVxyXG4gICAgd2hpbGUgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhbGxlbmdlLWNvbnRhaW5lciA+IGRpdiA+IGZpZWxkc2V0ID4gZGl2LmJvdGRldGVjdC1sYWJlbCA+IGltZycpKSB7XHJcbiAgICAgIGF3YWl0IGRlbGF5KDEwICogdGltZXMpXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygn6I635Y+W5Yiw5Zu+54mHJylcclxuICAgIGxldCBpbWdzcmMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2hhbGxlbmdlLWNvbnRhaW5lciA+IGRpdiA+IGZpZWxkc2V0ID4gZGl2LmJvdGRldGVjdC1sYWJlbCA+IGltZycpLnNyY1xyXG4gICAgY29uc29sZS5sb2coJ+WbvueJh+WcsOWdgCcsIGltZ3NyYylcclxuXHJcbiAgICAvLyDph43lpI3or4bliKvpqozor4FcclxuICAgIGlmIChJbWFnZUNhY2hlW2ltZ3NyY10pIHtcclxuICAgICAgY29uc29sZS5sb2coJ29jcjog5Zu+54mH5bey57uP6K+G5Yir6L+HJylcclxuICAgICAgcmV0dXJuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBJbWFnZUNhY2hlW2ltZ3NyY10gPSAxXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxldCBiYXNlNjRpbWcgPSBhd2FpdCBkaXYyYmFzZTY0KGltZ3NyYywgMjUwLCA1MClcclxuICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAnY2xpZW50S2V5JzogY29uZmlnLmNsaWVudEtleSxcclxuICAgICAgJ3Rhc2snOiB7XHJcbiAgICAgICAgJ3R5cGUnOiAnSW1hZ2VUb1RleHRUYXNrVGVzdCcsXHJcbiAgICAgICAgJ2JvZHknOiBiYXNlNjRpbWdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IHJlcyA9IGF3YWl0IHBvc3QobmV3IFVSTCgnY3JlYXRlVGFzaycsIGNvbmZpZy5ob3N0KS5ocmVmLCBkYXRhKVxyXG4gICAgaWYgKHJlcy5lcnJvckRlc2NyaXB0aW9uKSB7IC8vIOWHuumUmeaXtuaYvuekuuWHuumUmeS/oeaBr+eEtuWQjui3s+i/h1xyXG4gICAgICBjb25zb2xlLmxvZygn5Ye66ZSZOicsIHJlcy5lcnJvckRlc2NyaXB0aW9uKVxyXG4gICAgICBtZXNzYWdlKHsgdGV4dDogcmVzLmVycm9yRGVzY3JpcHRpb24sIGNvbG9yOiAncmVkJyB9KVxyXG4gICAgICBpZiAobm90bmVlZGNvbnRpbnVlKHJlcy5lcnJvckNvZGUpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ+S4jemcgOimgee7p+e7rSznqIvluo/pgIDlh7onKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9IC8vIOWmguaenOS4jemcgOimgee7p+e7reWImemAgOWHulxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2cocmVzKVxyXG4gICAgaWYgKHJlcy5zb2x1dGlvbiAmJiByZXMuc29sdXRpb24udGV4dCkge1xyXG4gICAgICBhd2FpdCBkZWxheSgxMCAqIHRpbWVzKVxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc29sdXRpb24nKS52YWx1ZSA9IHJlcy5zb2x1dGlvbi50ZXh0XHJcbiAgICAgIGF3YWl0IGRlbGF5KDEwICogdGltZXMpXHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib3RkZXRlY3QtYnV0dG9uJykgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvdGRldGVjdC1idXR0b24nKS5jbGljaygpXHJcbiAgICAgIGNvbnNvbGUubG9nKCfngrnlh7vmj5DkuqTmjInpkq4nKVxyXG4gICAgfVxyXG4gICAgLy8gYXdhaXQgZGVsYXkoNzAgKiB0aW1lcylcclxuICAgIHJldHVyblxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIOWbvuWDj+ivhuWIq+WIhuexu+esrOWbm+eJiFxyXG5hc3luYyBmdW5jdGlvbiBpbWFnZWNsYXNzaWZpY2F0aW9uX3Y0KGNvbmZpZykge1xyXG5cclxuICBsZXQgeyB0aW1lcywgaXNBdXRvQ2xpY2tDaGVja0JveCwgY2hlY2tCb3hDbGlja0RlbGF5VGltZSwgaXNBdXRvU3VibWl0IH0gPSBhd2FpdCBnZXRjb25maWcoKVxyXG4gIHZhciBpbWcxMSA9IFtdXHJcbiAgbGV0IGltZzExU2NvcmUgPSB7fVxyXG4gIHZhciB0aW1laWQgPSAwXHJcbiAgdmFyIHdhdGNoU2VydmljZSA9IDBcclxuICB2YXIgc3R1Y2tDb3VudCA9IDBcclxuICB2YXIgc3R1Y2tSZWZyZXNoVGltZXMgPSA1XHJcbiAgdmFyIEltYWdlQ2FjaGUgPSBbXVxyXG4gIGxldCBpc1ZlcmlmeUVuZCA9IGZhbHNlXHJcblxyXG4gIC8vIOehruWumuaYr+S5neWuq+agvOmhtemdolxyXG4gIGNvbnN0IGlzQnJhbWVQYWdlID0gd2luZG93LnNlbGYubG9jYXRpb24uaHJlZi5tYXRjaCgvXFwvcmVjYXB0Y2hhXFwvKC4qPylcXC9iZnJhbWVcXD8vKSAhPSBudWxsXHJcblxyXG4gIC8vIOehruWumuaYr+WLvumAieahhumhtVxyXG4gIGNvbnN0IGlzQW5jaG9yUGFnZSA9IHdpbmRvdy5zZWxmLmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcL3JlY2FwdGNoYVxcLyguKj8pXFwvYW5jaG9yXFw/LykgIT0gbnVsbFxyXG5cclxuICAvLyDliLfmlrBcclxuICBjb25zdCByZWZyZXNoID0gKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJjLWJ1dHRvbi1yZWxvYWQnKSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmMtYnV0dG9uLXJlbG9hZCcpLmNsaWNrKClcclxuICAvLyDojrflj5bpl67pophcclxuICBjb25zdCBnZXRxdWVzdGlvbiA9ICgpID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0cm9uZycpLmlubmVyVGV4dC5yZXBsYWNlKC9cXHMvZywgJycpXHJcbiAgLy8g5o+Q5LqkXHJcbiAgZnVuY3Rpb24gY2xpY2t0aW1lKCkge1xyXG4gICAgLy8g5aaC5p6c5pyJ55m95bGP77yM5YiZ562J5b6FM+enkuWQjuWGjeivlVxyXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RkLnJjLWltYWdlc2VsZWN0LWR5bmFtaWMtc2VsZWN0ZWQnKSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnZmluZCBzZWxlY3RlZCBpbWFnZScpXHJcbiAgICAgIC8vIGF3YWl0IGRlbGF5KDMwMDApXHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1laWQpXHJcbiAgICAgIHRpbWVpZCA9IHNldFRpbWVvdXQoY2xpY2t0aW1lLCAxMDAwKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW1nMTEubGVuZ3RoID09IDApIHtcclxuXHJcbiAgICAgIGlmIChpc0F1dG9TdWJtaXQpIHsgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlY2FwdGNoYS12ZXJpZnktYnV0dG9uJykuY2xpY2soKSB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDoh6rliqjmiZPli77lvIDlp4vor4bliKtcclxuICBpZiAoaXNBbmNob3JQYWdlKSB7XHJcbiAgICBpZiAoIWlzQXV0b0NsaWNrQ2hlY2tCb3gpIHJldHVyblxyXG4gICAgLy8g6Ieq5Yqo5Yu+6YCJ6K+G5Yir5qGGXHJcbiAgICBmdW5jdGlvbiB3YXRjaENoZWNrYm94KCkge1xyXG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlY2FwdGNoYS1hbmNob3InKSkge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVjYXB0Y2hhLWFuY2hvcicpLmdldEF0dHJpYnV0ZSgnYXJpYS1jaGVja2VkJykgPT0gJ2ZhbHNlJyAmJlxyXG4gICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgICAnI3JlY2FwdGNoYS1hbmNob3IgPiBkaXYucmVjYXB0Y2hhLWNoZWNrYm94LWJvcmRlcicpKS5nZXRQcm9wZXJ0eVZhbHVlKCdib3JkZXInKSA9PVxyXG4gICAgICAgICAgJy4xMjVyZW0gc29saWQgcmdiKDI1NSwgMCwgMCknICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgICAgICcjcmMtYW5jaG9yLWNvbnRhaW5lciA+IGRpdi5yYy1hbmNob3ItZXJyb3ItbXNnLWNvbnRhaW5lcicpLnN0eWxlLmRpc3BsYXkgPT0gJ25vbmUnXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JlY2FwdGNoYS1hbmNob3InKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY2hlY2tlZCcpID09ICdmYWxzZScpIHtcclxuICAgICAgICAgICAgaXNWZXJpZnlFbmQgPSBmYWxzZVxyXG4gICAgICAgICAgICBnZXRJc0VuZCgpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVjYXB0Y2hhLWFuY2hvcicpLmNsaWNrKClcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZSh7IHRleHQ6IGdldFdvcmRzKCdjb250ZW50X21lc3NhZ2VfMTEnKSwgY29sb3I6ICdncmVlbicgfSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWlzVmVyaWZ5RW5kKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IHR5cGU6IFwieWVzQ2FwdGNoYUVuZFN1Y2Nlc3NcIiB9LCBcIipcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpc1ZlcmlmeUVuZCA9IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAod2F0Y2hTZXJ2aWNlKSByZXR1cm5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB3YXRjaFNlcnZpY2UgPSBzZXRJbnRlcnZhbCh3YXRjaENoZWNrYm94LCAyMDAwKVxyXG4gICAgfSwgTnVtYmVyKGNoZWNrQm94Q2xpY2tEZWxheVRpbWUpKTtcclxuICB9XHJcblxyXG4gIC8vIOmqjOivgeeggeWbvueJh+ahhlxyXG4gIGNvbnN0IHJlVGFyZ2V0ID0gKCkgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JjLWltYWdlc2VsZWN0LXRhcmdldCcpXHJcbiAgLy8g6aqM6K+B56CB5Zu+54mH5a+56LGh77yaIOi/lOWbnuS5neW8oOWbvlxyXG4gIGNvbnN0IHJjSW1hZ2VzZWxlY3RUYXJnZXQgPSAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYucmMtaW1hZ2UtdGlsZS13cmFwcGVyID4gaW1nJylcclxuICAvLyDmj5DnpLrvvJror7fpgInmi6nmiYDmnInnm7jnrKbnmoTlm77niYfjgIJcclxuICBjb25zdCBlcnJvclNlbGVjdE1vcmUgPSAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYucmMtaW1hZ2VzZWxlY3QtZXJyb3Itc2VsZWN0LW1vcmUnKVxyXG4gIC8vIOaPkOekuu+8muWPpuWklu+8jOaCqOi/mOmcgOafpeeci+aWsOaYvuekuueahOWbvueJh+OAglxyXG4gIGNvbnN0IGVycm9yRHluYW1pY01vcmUgPSAoKSA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYucmMtaW1hZ2VzZWxlY3QtZXJyb3ItZHluYW1pYy1tb3JlJylcclxuICAvLyDpnIDopoHpgInmi6nmm7TlpJpcclxuICBjb25zdCBuZWVkTW9yZSA9ICgpID0+IGVycm9yU2VsZWN0TW9yZSgpICYmIGVycm9yU2VsZWN0TW9yZSgpLnN0eWxlLmRpc3BsYXkgIT0gJ25vbmUnIHx8IGVycm9yRHluYW1pY01vcmUoKSAmJiBlcnJvckR5bmFtaWNNb3JlKCkuc3R5bGUuZGlzcGxheSAhPSAnbm9uZSdcclxuXHJcbiAgLy8g5LiA5Liq5b6q546v5qOA5rWL5pa55rOV77yM6Ziy5q2i5Y2h5L2P5LiN5YqoXHJcbiAgZnVuY3Rpb24gQ2hlY2tmb3JTdHVjaygpIHtcclxuICAgIGlmIChuZWVkTW9yZSgpKSB7XHJcbiAgICAgIHN0dWNrQ291bnQgPSBzdHVja0NvdW50ICsgMVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ0NoZWNrZm9yU3R1Y2s6IGNsZWFyIScpXHJcbiAgICAgIHN0dWNrQ291bnQgPSAwXHJcbiAgICB9XHJcbiAgICBpZiAoc3R1Y2tDb3VudCA+PSBzdHVja1JlZnJlc2hUaW1lcykge1xyXG4gICAgICBjb25zb2xlLmxvZygnQ2hlY2tmb3JTdHVjazogNiB0aW1lcyBmb3IgcmVmcmVzaCgpJylcclxuICAgICAgcmVmcmVzaCgpXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8g5Zu+54mH6L2sQkFTRTY0XHJcbiAgZnVuY3Rpb24gSW1hZ2VUb0Jhc2U2NChpbWcpIHtcclxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKVxyXG4gICAgdmFyIHdpZHRoeCA9IGltZy5uYXR1cmFsV2lkdGhcclxuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoeFxyXG4gICAgY2FudmFzLmhlaWdodCA9IHdpZHRoeFxyXG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgd2lkdGh4LCB3aWR0aHgpXHJcbiAgICB2YXIgZGF0YVVSTCA9IGNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL2pwZWcnKVxyXG4gICAgdmFyIGJhc2UgPSBkYXRhVVJMLnJlcGxhY2UoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsJywgJycpXHJcbiAgICBpZiAoYmFzZSA9PSAnZGF0YTosJykgeyByZXR1cm4gfVxyXG4gICAgcmV0dXJuIGJhc2VcclxuICB9O1xyXG5cclxuICAvLyDojrflj5blr7nosaHnmoTkvY3nva5cclxuICBmdW5jdGlvbiBnZXRpbmRleChvYmosIG9iamFsbCkge1xyXG4gICAgdmFyIG9iamFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob2JqYWxsKVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmphbGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKG9iaiA9PSBvYmphbGxbaV0pIHtcclxuICAgICAgICByZXR1cm4gaVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTFcclxuICB9O1xyXG5cclxuICAvLyDlr7nlm77niYfov5vooYzor4bliKtcclxuICBjb25zdCBEb09jciA9IGFzeW5jIGZ1bmN0aW9uIChpbWFnZSwgaW5kZXgpIHtcclxuICAgIGNvbnN0IGlzRW5kID0gYXdhaXQgZ2V0SXNFbmQoKVxyXG4gICAgaWYgKGlzRW5kKSB7XHJcbiAgICAgIG1lc3NhZ2UoeyB0ZXh0OiBnZXRXb3JkcygnY29udGVudF9tZXNzYWdlXzExJyksIGNvbG9yOiAnZ3JlZW4nIH0pXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgLy8g5peg5Zyw5Z2A6L+U5ZueXHJcbiAgICBpZiAoIWltYWdlIHx8ICFpbWFnZS5zcmMpIHtcclxuICAgICAgY29uc29sZS5sb2coJ29jcjogaW1nYWUgc3JjIG5vdCBmb3VuZCcpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWbvuWDj+ivhuWIq+WPguaVsFxyXG4gICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICdjbGllbnRLZXknOiBjb25maWcuY2xpZW50S2V5LCBjYWxsdXJsOiBnZXRQYXJlbnRVcmwoKSxcclxuICAgICAgJ3Rhc2snOiB7ICd0eXBlJzogJ1JlQ2FwdGNoYVYyQ2xhc3NpZmljYXRpb24nLCAnaW1hZ2UnOiBudWxsLCAncXVlc3Rpb24nOiBudWxsIH1cclxuICAgIH1cclxuICAgIC8vIOi9rOaNouWbvueJh1xyXG4gICAgZGF0YS50YXNrLmltYWdlID0gSW1hZ2VUb0Jhc2U2NChpbWFnZSlcclxuICAgIGlmICghZGF0YS50YXNrLmltYWdlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdvY3I6IGVycm9yOiBpbWFnZSBpcyBudWxsIHJldHJ5Li4uJylcclxuICAgICAgc3R1Y2tDb3VudCA9IDBcclxuICAgICAgLy8gY2xlYXJUaW1lb3V0KHRpbWVpZCk7XHJcbiAgICAgIGF3YWl0IGRlbGF5KDIwICogdGltZXMpXHJcbiAgICAgIGRhdGEudGFzay5pbWFnZSA9IEltYWdlVG9CYXNlNjQoaW1hZ2UpXHJcbiAgICAgIGlmICghZGF0YS50YXNrLmltYWdlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ29jcjogZXJyb3I6IGltYWdlIG5vdCBmb3VuZCcpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDph43lpI3or4bliKvpqozor4FcclxuICAgIGlmIChJbWFnZUNhY2hlW2ltYWdlLnNyY10pIHtcclxuICAgICAgY29uc29sZS5sb2coJ29jcjogZXhpc3QnKVxyXG4gICAgICByZXR1cm5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEltYWdlQ2FjaGVbaW1hZ2Uuc3JjXSA9IDFcclxuICAgIH1cclxuXHJcbiAgICAvLyDojrflj5blvZPliY3pl67pophcclxuICAgIGxldCBxdWVzdGlvbnN0ciA9IGdldHF1ZXN0aW9uKClcclxuICAgIGRhdGEudGFzay5xdWVzdGlvbiA9IGpzb25hbGxbcXVlc3Rpb25zdHJdIHx8IHF1ZXN0aW9uc3RyXHJcbiAgICBpZiAoIWRhdGEudGFzay5xdWVzdGlvbikge1xyXG4gICAgICBjb25zb2xlLmxvZygnb2NyOiBlcnJvcjogcXVlc3Rpb24gbm90IGZvdW5kJylcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICAvLyDlpoLmnpzmmK8zM+aIljQ05Zu+54mH77yM5riF56m65bCP5Zu+5ZKM5o+Q5Lqk5oyJ6ZKu5Lu75YqhXHJcbiAgICBpZiAoIWluZGV4KSB7XHJcbiAgICAgIGltZzExID0gW10sIGNsZWFyVGltZW91dCh0aW1laWQpXHJcbiAgICB9XHJcbiAgICAvLyDmj5DkuqTlkI7nq6/or4bliKtcclxuICAgIGNvbnNvbGUubG9nKCdvY3I6IGluZGV4OicsIGluZGV4IHx8IC0xKVxyXG4gICAgbGV0IHJlc1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgeyByZWNhcHRjaGFWZXJpZnlGYWlsRGVsYXkgPSAxMDAwLCByZWNhcHRjaGFWZXJpZnlUcnkgPSAxIH0gPSBjb25maWcubmV0d29yayB8fCB7fVxyXG4gICAgICByZXMgPSBhd2FpdCBwb3N0KG5ldyBVUkwoJ2NyZWF0ZVRhc2snLCBjb25maWcuaG9zdCkuaHJlZiwgZGF0YSwgcmVjYXB0Y2hhVmVyaWZ5RmFpbERlbGF5LCByZWNhcHRjaGFWZXJpZnlUcnkpXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG1lc3NhZ2UoeyB0ZXh0OiBnZXRXb3JkcygnY29udGVudF9tZXNzYWdlXzknKSwgY29sb3I6ICdyZWQnIH0pXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coJ29jcjogcmVzcG9uc2U6JywgcmVzKVxyXG5cclxuICAgIC8vIOWkhOeQhuivhuWIq+e7k+aenDog5Ye66ZSZXHJcbiAgICBpZiAocmVzLmVycm9yRGVzY3JpcHRpb24pIHtcclxuICAgICAgY29uc29sZS5sb2coJ29jcjogZXJyb3JEZXNjcmlwdGlvbjonLCByZXMuZXJyb3JEZXNjcmlwdGlvbilcclxuICAgICAgbWVzc2FnZSh7IHRleHQ6IHJlcy5lcnJvckRlc2NyaXB0aW9uLCBjb2xvcjogJ2dyZWVuJyB9KVxyXG4gICAgICBpZiAobm90bmVlZGNvbnRpbnVlKHJlcy5lcnJvckNvZGUpKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ29jcjogZXhpdC4nKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIOeCueWIt+aWsOaMiemSrlxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdvY3I6IHJlZnJlc2guJylcclxuICAgICAgICBhd2FpdCBkZWxheSgyMCAqIHRpbWVzKVxyXG4gICAgICAgIHJlZnJlc2goKVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDngrnlh7vlm77niYflr7nosaFcclxuICAgIGlmIChyZXMuc29sdXRpb24pIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJ29jcjogZ290byBjbGlja3MuJylcclxuICAgICAgcmV0dXJuIGF3YWl0IENsaWNrcyhpbWFnZSwgcmVzLnNvbHV0aW9uLCBpbmRleClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIOeCueWHu+WbvueJh+WvueixoVxyXG4gIGNvbnN0IENsaWNrcyA9IGFzeW5jIGZ1bmN0aW9uIChpbWFnZSwgc29sdXRpb24sIGluZGV4KSB7XHJcblxyXG4gICAgbGV0IGRlbGF5VGltZSA9IHRpbWVzXHJcbiAgICBpZiAoLzQ0Ly50ZXN0KGltYWdlLmNsYXNzTmFtZSkpIHtcclxuICAgICAgY29uc29sZS5sb2coJzQ0ISEhISEhISEhISEhISEhISEhISEhISEhISEhJylcclxuICAgICAgZGVsYXlUaW1lID0gdGltZXMgLyAyXHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygnY2xpY2s6IGluZGV4OiAnICsgaW5kZXgpXHJcbiAgICAvLyDlop7liqDlu7bml7bvvIzpmLLmraLooqvor4bliKvkuLrmnLrlmajkurpcclxuICAgIGF3YWl0IGRlbGF5KGdldENsaWNrVGltZShOdW1iZXIoZGVsYXlUaW1lKSkpXHJcbiAgICAvLyBjb25zb2xlLmxvZygnY2xpY2s6IHdpZHRoOiAnICsgaW1hZ2UubmF0dXJhbFdpZHRoKVxyXG4gICAgLy8gY29uc29sZS5sb2coJ2NsaWNrOiBvYmplY3RzOiAnICsgSlNPTi5zdHJpbmdpZnkoc29sdXRpb24pKVxyXG5cclxuICAgIC8vIOWkhOeQhjF4MeWbvueJh+eahOeCueWHu1xyXG4gICAgaWYgKGluZGV4ICYmIHNvbHV0aW9uLmhhc09iamVjdCkge1xyXG4gICAgICAvLyDngrnlh7vlsI/lm75cclxuICAgICAgY29uc29sZS5sb2coJ2NsaWNrOiAxeDE6ICcgKyBpbmRleClcclxuICAgICAgYXdhaXQgZGVsYXkoZ2V0Q2xpY2tUaW1lKE51bWJlcihkZWxheVRpbWUpKSlcclxuICAgICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNyYy1pbWFnZXNlbGVjdC10YXJnZXQgPiB0YWJsZSA+IHRib2R5ID4gdHI+IHRkPmRpdj5kaXY+aW1nJylbaW5kZXhdICYmXHJcbiAgICAgICAgaW1hZ2Uuc3JjID09IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNyYy1pbWFnZXNlbGVjdC10YXJnZXQgPiB0YWJsZSA+IHRib2R5ID4gdHI+IHRkPmRpdj5kaXY+aW1nJylbaW5kZXhdXHJcbiAgICAgICAgICAuc3JjKSB7IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNyYy1pbWFnZXNlbGVjdC10YXJnZXQgPiB0YWJsZSA+IHRib2R5ID4gdHI+IHRkJylbaW5kZXhdLmNsaWNrKCkgfVxyXG4gICAgICByZXR1cm5cclxuICAgIH0gZWxzZSBpZiAoaW5kZXggJiYgIXNvbHV0aW9uLmhhc09iamVjdCkge1xyXG4gICAgICAvLyDkuI3ngrnlh7vov5Tlm55cclxuICAgICAgZGVsZXRlIGltZzExWydfJyArIGluZGV4XVxyXG4gICAgICAvLyDorrDlvZXliIblgLxcclxuICAgICAgLy8gY29uc29sZS5sb2coJ2NsaWNrOiBzY29yZTogJyArIHNvbHV0aW9uLmNvbmZpZGVuY2UpXHJcbiAgICAgIC8vIGltZzExU2NvcmVbJ18nICsgaW5kZXhdID0gc29sdXRpb24uY29uZmlkZW5jZVxyXG4gICAgICAvLyBjb25zb2xlLmxvZygnY2xpY2s6IGltZzExU2NvcmU6ICcgKyBKU09OLnN0cmluZ2lmeShpbWcxMVNjb3JlKSlcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVpZClcclxuICAgICAgdGltZWlkID0gc2V0VGltZW91dChjbGlja3RpbWUsIDMwICogdGltZXMpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfSBlbHNlIGlmIChpbWFnZS5uYXR1cmFsV2lkdGggPT0gMTAwICYmICFpbmRleCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnY2xpY2s6IG5vIGluZGV4IHJldHVybicpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWIl+WHuuaJgOacieWbvueJh1xyXG4gICAgbGV0IHJlc3VsdGxpc3QgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNyYy1pbWFnZXNlbGVjdC10YXJnZXQgPiB0YWJsZSA+IHRib2R5ID4gdHI+IHRkJykpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvbHV0aW9uLm9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgYXdhaXQgZGVsYXkoZ2V0Q2xpY2tUaW1lKE51bWJlcihkZWxheVRpbWUpKSlcclxuICAgICAgY29uc29sZS5sb2coJ2NsaWNrOiBvamJlY3RzOiAnICsgKHNvbHV0aW9uLm9iamVjdHNbaV0gKyAxKSlcclxuICAgICAgcmVzdWx0bGlzdFtzb2x1dGlvbi5vYmplY3RzW2ldXS5jbGljaygpXHJcbiAgICB9XHJcblxyXG4gICAgLy8gNDUwIOeahOWbvueJh+eri+WNs+ehruiupFxyXG4gICAgaWYgKGltYWdlLm5hdHVyYWxXaWR0aCA9PSA0NTApIHtcclxuICAgICAgYXdhaXQgZGVsYXkoMTAgKiB0aW1lcylcclxuICAgICAgLy/ov5nph4xcclxuICAgICAgaWYgKGlzQXV0b1N1Ym1pdCkgeyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVjYXB0Y2hhLXZlcmlmeS1idXR0b24nKS5jbGljaygpIH1cclxuICAgICAgLy8gMzAwIOeahOWbvueJh+mcgOimgeW7tui/nzPnp5LlkI7mo4Dmn6UxeDHlm77niYdcclxuICAgIH0gZWxzZSBpZiAoaW1hZ2UubmF0dXJhbFdpZHRoID09IDMwMCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZWlkKVxyXG4gICAgICB0aW1laWQgPSBzZXRUaW1lb3V0KGNsaWNrdGltZSwgMzAwMClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRvbU1vZGlmeUNiKGUpIHtcclxuICAgIC8vIOWPjemmiOWPmOWKqOeahERPTVxyXG4gICAgLy8gY29uc29sZS5sb2coXCJlLnRhcmdldDpcIik7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldCk7XHJcblxyXG4gICAgLy8g5a+5RE9N5re75Yqg55uR5ZCs5LqL5Lu2OiDlpoLmnpzlm77niYflj5HnlJ/lj5jljJZcclxuICAgIGlmIChlLnRhcmdldCA9PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmMtaW1hZ2VzZWxlY3QtdGFyZ2V0JylcclxuICAgICAgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JjLWltYWdlc2VsZWN0LXRhcmdldCA+IHRhYmxlID4gdGJvZHkgPiB0cj4gdGQ+ZGl2PmRpdj5pbWcnKSkge1xyXG4gICAgICAvLyDnu5Hlrprmr4/kuIDlvKDlm77niYfnmoTliqDovb3kuovku7bvvIzlvZPliqDovb3lsLHmiafooYxPQ1JcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LnJjLWltYWdlLXRpbGUtd3JhcHBlciA+IGltZycpLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDlvZPlm77niYfliqDovb3ml7bvvIzlr7nlm77niYfov5vooYzor4bliKtcclxuICAgICAgICBEb09jcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYucmMtaW1hZ2UtdGlsZS13cmFwcGVyID4gaW1nJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHZhciBsc3VybCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIC8vICAgJyNyYy1pbWFnZXNlbGVjdC10YXJnZXQgPiB0YWJsZSA+IHRib2R5ID4gdHI+IHRkPmRpdj5kaXY+aW1nJykuc3JjO1xyXG4gICAgICAvLyBpZiAoSW1hZ2VDYWNoZS5pbmRleE9mKGxzdXJsKSA9PSAtMSl7XHJcbiAgICAgIC8vIOebtOaOpeaJp+ihjE9DUu+8muS4jeaYjueZveS4uuS7gOS5iOimgei/meS5iOWGmVxyXG4gICAgICBEb09jcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmMtaW1hZ2VzZWxlY3QtdGFyZ2V0ID4gdGFibGUgPiB0Ym9keSA+IHRyPiB0ZD5kaXY+ZGl2PmltZycpKVxyXG4gICAgICAvLyB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgaW1hZ2UgPSBlLnRhcmdldC5xdWVyeVNlbGVjdG9yKCcgZGl2ID4gZGl2LnJjLWltYWdlLXRpbGUtd3JhcHBlciA+IGltZycpXHJcbiAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgIC8vIOiOt+WPluWPkeeUn+WPmOWMlueahOS9jee9rlxyXG4gICAgICAgIHZhciBpbmRleCA9IGdldGluZGV4KGltYWdlLCAnI3JjLWltYWdlc2VsZWN0LXRhcmdldCA+IHRhYmxlID4gdGJvZHkgPiB0cj4gdGQ+IGRpdiA+IGRpdi5yYy1pbWFnZS10aWxlLXdyYXBwZXIgPiBpbWcnKVxyXG4gICAgICAgIHZhciBpbWFnZWNvZGUgPSBpbWFnZS5jbGFzc05hbWUuc3Vic3RyaW5nKGltYWdlLmNsYXNzTmFtZS5sZW5ndGggLSAyKVxyXG4gICAgICAgIGlmIChpbWFnZWNvZGUgKiAxID09IDExKSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZWlkKVxyXG4gICAgICAgICAgaW1nMTFbJ18nICsgaW5kZXhdID0gJ3knXHJcbiAgICAgICAgICAvLyDlm77lg4/or4bliKtcclxuICAgICAgICAgIERvT2NyKGltYWdlLCBpbmRleClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIOS5neWuq+agvOmhtemdoui/m+ihjOeCueWHu1xyXG4gIGlmIChpc0JyYW1lUGFnZSkge1xyXG4gICAgLy8g5q+P56eS5qOA5rWL5LiA5qyh5piv5ZCm5pyq6K+G5Yir77yMNuasoeS7peS4iuiHquWKqOWIt+aWsO+8jOmYsuatouWNoeS9j+S4jeWKqFxyXG4gICAgc2V0SW50ZXJ2YWwoQ2hlY2tmb3JTdHVjaywgMTAwMClcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTVN1YnRyZWVNb2RpZmllZCcsIGRvbU1vZGlmeUNiKVxyXG4gIH1cclxuXHJcbiAgLy8g5re75Yqg5LiA5Liq5LqL5Lu255uR5ZCsXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5kYXRhID09ICdkb1NvbWV0aGluZycpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2RvU29tZXRoaW5nJylcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhID09PSAnRG9PY3InKSB7XHJcbiAgICAgIERvT2NyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYy1pbWFnZXNlbGVjdC10YXJnZXQgPiB0YWJsZSA+IHRib2R5ID4gdHI+IHRkPmRpdj5kaXY+aW1nJykpXHJcbiAgICB9XHJcbiAgfSlcclxuICAvLyDlj5HpgIHmtojmga/nu5nniLbnqpflj6NcclxuICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKCdyZWFkeScsICcqJylcclxufVxyXG5cclxuLy8gaWZyYW1lIOmAu+i+kVxyXG5hc3luYyBmdW5jdGlvbiBnZXRJc0VuZCgpIHtcclxuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgIGNvbnN0IGNiID0gZXZlbnQgPT4ge1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IGV2ZW50XHJcbiAgICAgIGlmIChkYXRhLnR5cGUgPT09IFwiaXNZZXNDYXB0Y2hhRW5kXCIpIHtcclxuICAgICAgICByZXNvbHZlKGRhdGEuaXNFbmQpXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICByZXNvbHZlKGZhbHNlKVxyXG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpXHJcbiAgICB9LCAzMDApXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgY2IpXHJcbiAgfSlcclxuICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogXCJpc1llc0NhcHRjaGFFbmRcIiB9LCBcIipcIilcclxuICByZXR1cm4gcHJvbWlzZVxyXG59XHJcblxyXG4iXSwibmFtZXMiOlsidGVzdG5ldHdvcmsiLCJwb3N0IiwiZ2V0IiwiZ2V0QmFsYW5jZSIsImdldGNvbmZpZyIsInNldGNvbmZpZyIsImdldFBhcmVudFVybCIsImNocm9tZSIsIndpbmRvdyIsIm1lc3NhZ2UiLCJ0ZXh0IiwiY29sb3IiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY3JlYXRlRWxlbWVudCIsImlkIiwic3R5bGUiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ6SW5kZXgiLCJpbm5lclRleHQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjbGFzc05hbWUiLCJkaXNwbGF5IiwibWVzc2FnZUhpZGUiLCJjYXB0Y2hhQ2xhc3NpZmljYXRpb24iLCJ0aW1lcyIsImRlbGF5IiwicmVzdWx0IiwidHlwZWxpc3QiLCJ0aXRsZSIsInVybF9rZXl3b3JkIiwiZGl2IiwiaW1hZ2VkaXYiLCJpIiwibGVuZ3RoIiwibG9jYXRpb24iLCJocmVmIiwiaW5kZXhPZiIsInF1ZXJ5U2VsZWN0b3IiLCJ1cmwiLCJyZXNvbHZlIiwicmVqZWN0Iiwic2VsZiIsImJyb3dzZXIiLCJydW50aW1lIiwic2VuZE1lc3NhZ2UiLCJhY3Rpb24iLCJyZXNwb25zZSIsImRhdGEiLCJ0cmllcyIsImhvc3QiLCJjbGllbnRLZXkiLCJVUkwiLCJzIiwic2V0VGltZW91dCIsImNvbmZpZyIsImRpdjJiYXNlNjQiLCJzcmMiLCJ3aWR0aCIsImhlaWdodCIsImltZyIsIkltYWdlIiwic2V0QXR0cmlidXRlIiwiY2FudmFzIiwiY29udGV4dCIsImdldENvbnRleHQiLCJvbmxvYWQiLCJkcmF3SW1hZ2UiLCJiYXNlNjQiLCJ0b0RhdGFVUkwiLCJvdXQiLCJyZXBsYWNlIiwicGFyZW50IiwiZSIsInJlZmVycmVyIiwibm90bmVlZGNvbnRpbnVlIiwiZXJyb3JzdHIiLCJpbmNsdWRlcyIsIndhaXRGb3IiLCJkaXZzdHIiLCJvdXR0aW1lIiwidGltZXIiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJpbWFnZXJlYWR5IiwiaW1nc3JjIiwid2FpdGZvcmJhY2tncm91bmQiLCJiYWNrZ3JvdW5kIiwid2FpdGZvcmJhY2tncm91bmRXaXRoVGltZW91dCIsInRpbWVvdXRUaW1lciIsImNsZWFyVGltZW91dCIsIndhaXREbyIsImZ1bmMiLCJjb25zb2xlIiwibG9nIiwiZ2V0TG9jYWxWZXJzaW9uIiwidmVyIiwiZ2V0Q2xpY2tUaW1lIiwiY29uZmlnVGltZSIsInJhdGUiLCJ0aW1lRmxvYXRMaW1pdCIsInRpbWVGbG9hdCIsIk1hdGgiLCJyYW5kb20iLCJjZWlsIiwiZ2V0SXNCbGFja1doaXRlUGFzcyIsImlzSW5VcmxMaXN0IiwidXJsTGlzdCIsImluZGV4IiwiZmluZEluZGV4IiwicGF0dGVybiIsImp1ZGdlQmxhY2tXaGl0ZSIsImlzT3BlbkJsYWNrTGlzdCIsImJsYWNrTGlzdENvbmZpZyIsImlzT3BlbiIsImlzT3BlbldoaXRlTGlzdCIsIndoaXRlTGlzdENvbmZpZyIsIndoaXRlUmVzdWx0IiwiYmxhY2tMaXN0UmVzdWx0IiwicXVlcnlDdXJyZW50VXJsIiwiY3VycmVudFRhYlVybCIsImJsYWNrV2hpdGVSZXN1bHQiLCJsb2NhbFZlcnNpb24iLCJsb2NhbFN0b3JhZ2UiLCJ2ZXJzaW9uIiwiZGV2ZWxvcCIsImhjYXB0Y2hhSXRlbWxpc3QiLCJqc29uYWxsIiwi0LPQvtGA0YvQsNCx0L7Qv9Cw0LPQvtGA0LrRliIsItC30L3QsNC60ZbQv9GA0YvQv9GL0L3QutGDIiwi0LLRg9C70ZbRh9C90YvRj9C30L3QsNC60ZYiLCLRgNCw0YHQu9GW0L3RiyIsItC00YDRjdCy0YsiLCLRgtGA0LDQstCwIiwi0YXQvNGL0LfQvdGP0LrQvtGeIiwi0LrQsNC60YLRg9GBIiwi0L/QsNC70YzQvNGLIiwi0L/RgNGL0YDQvtC00YsiLCLQstCw0LTQsNGB0L/QsNC00YsiLCLQs9C+0YDRiyIsItC/0LDQs9C+0YDQutGWIiwi0LLQsNC00LDRkdC80YsiLCLRgNGN0LrRliIsItC/0LvRj9C20YsiLCLQodC+0L3RhtCwIiwi0JzQtdGB0Y/RhiIsItC90LXQsdCwIiwi0YLRgNCw0L3RgdC/0LDRgNGC0L3Ri9GF0YHRgNC+0LTQutCw0Z4iLCLQvNCw0YjRi9C90YsiLCLQstC10LvQsNGB0ZbQv9C10LTRiyIsItC80LDRgtCw0YbRi9C60LvRiyIsItC/0ZbQutCw0L/RiyIsItC60LDQvNC10YDRhtGL0LnQvdGL0Y/Qs9GA0YPQt9Cw0LLRltC60ZYiLCLQu9C+0LTQutGWIiwi0LvRltC80YPQt9GW0L3RiyIsItGC0LDQutGB0ZYiLCLRiNC60L7Qu9GM0L3Ri9Cw0Z7RgtC+0LHRg9GBIiwi0LDRntGC0L7QsdGD0YEiLCLQsdGD0LTQsNGe0L3RltGH0LDRj9C80LDRiNGL0L3QsCIsItGB0YLQsNGC0YPRliIsItGE0LDQvdGC0LDQvdGLIiwi0LzQvtGB0YIiLCLQv9GA0YvRgdGC0LDQvdGMIiwi0YXQvNCw0YDQsNGH0L7RgSIsItGB0LvRg9C/0YvQsNCx0L7QutCw0LvQvtC90YsiLCLQstGW0YLRgNCw0LbRiyIsItC00L7QvCIsItC20YvQu9GL0LTQvtC8Iiwi0YHQstC10YLQu9Cw0LLRi9C00L7QvCIsItGH0YvQs9GD0L3QsNGH0L3QsNGP0YHRgtCw0L3RhtGL0Y8iLCLQv9C+0L/QtdC70LDQvCIsItCy0L7Qs9C90LXQs9Cw0LTRgNCw0L3RgiIsItGA0Y3QutC70LDQvNC90YvRiNGH0YvRgiIsItC00LDRgNC+0LPRliIsItC/0LXRiNCw0YXQvtC00L3Ri9GP0L/QtdGA0LDRhdC+0LTRiyIsItGB0LLRj9GC0LvQsNGE0L7RgCIsItCz0LDRgNCw0LbQvdGL0Y/QtNC30LLQtdGA0YsiLCLQsNGe0YLQvtCx0YPRgdC90YvRj9C/0YDRi9C/0YvQvdC60ZYiLCLRgtGA0LDRhNGW0LrRgyIsItC/0LDRgNC60L7QvNCw0YLQsNGA0YsiLCLQu9C10YHQstGW0YbRiyIsItC60L7QvNGW0L3RiyIsItGC0YDQsNC60YLQsNGA0YsiLCLguKDguLnguYDguILguLLguKvguKPguLfguK3guYDguJnguLTguJnguYDguILguLIiLCLguJvguYnguLLguKLguKvguKLguLjguJQiLCLguJvguYnguLLguKLguJbguJnguJkiLCLguJ7guLfguIoiLCLguJXguYnguJnguYTguKHguYkiLCLguKvguI3guYnguLIiLCLguJ7guLjguYjguKHguYTguKHguYkiLCLguIHguKPguLDguJrguK3guIfguYDguJ7guIrguKMiLCLguJXguYnguJnguJvguLLguKXguYzguKEiLCLguJjguKPguKPguKHguIrguLLguJXguLQiLCLguJnguYnguLPguJXguIEiLCLguKDguLnguYDguILguLIiLCLguYDguJnguLTguJnguYDguILguLIiLCLguYHguKvguKXguYjguIfguJnguYnguLMiLCLguYHguKHguYjguJnguYnguLMiLCLguIrguLLguKLguKvguLLguJQiLCLguJTguKfguIfguK3guLLguJfguLTguJXguKLguYwiLCLguJTguKfguIfguIjguLHguJnguJfguKPguYwiLCLguJfguYnguK3guIfguJ/guYnguLIiLCLguKLguLLguJnguJ7guLLguKvguJnguLAiLCLguKPguJYiLCLguIjguLHguIHguKPguKLguLLguJkiLCLguKPguJbguIjguLHguIHguKPguKLguLLguJnguKLguJnguJXguYwiLCLguKPguJbguJvguLTguITguK3guLHguJ4iLCLguKPguJbguJrguKPguKPguJfguLjguIHguYDguIrguLTguIfguJ7guLLguJPguLTguIrguKLguYwiLCLguYDguKPguLfguK0iLCLguKPguJbguKXguLXguKHguLnguIvguLXguJkiLCLguYHguJfguYfguIHguIvguLXguYgiLCLguKPguJbguYLguKPguIfguYDguKPguLXguKLguJkiLCLguKPguKrguJrguLHguKoiLCLguKPguJbguIHguYjguK3guKrguKPguYnguLLguIciLCLguKPguLnguJvguJvguLHguYnguJkiLCLguJnguYnguLPguJ7guLgiLCLguKrguLDguJ7guLLguJkiLCLguJfguYjguLLguYDguKPguLfguK0iLCLguJXguLbguIHguKPguLDguJ/guYnguLIiLCLguYDguKrguLLguYDguKrguLIiLCLguIHguKPguLDguIjguIHguKrguLUiLCLguJrguYnguLLguJkiLCLguJXguLbguIHguK3guJ7guLLguKPguYzguJXguYDguKHguJnguJfguYwiLCLguJvguKPguLDguKDguLLguITguLLguKMiLCLguKrguJbguLLguJnguLXguKPguJbguYTguJ8iLCLguYDguJbguYnguLLguJbguYjguLLguJkiLCLguJTguLHguJrguYDguJ7guKXguLTguIciLCLguJvguYnguLLguKLguJrguLTguKXguJrguK3guKPguYzguJQiLCLguJbguJnguJkiLCLguJfguLLguIfguKHguYnguLLguKXguLLguKIiLCLguYTguJ/guIjguKPguLLguIjguKMiLCLguJvguKPguLDguJXguLnguYLguKPguIfguKPguJYiLCLguJvguYnguLLguKLguKPguJbguYDguKHguKXguYwiLCLguIHguKPguKfguKLguIjguKPguLLguIjguKMiLCLguYDguKHguJXguKPguJfguLXguYjguIjguK3guJTguKPguJYiLCLguJrguLHguJnguYTguJQiLCLguJvguKXguYjguK3guIfguYTguJ8iLCLguKPguJbguYHguJfguKPguIHguYDguJXguK3guKPguYwiLCLguKPguJbguJrguLHguKoiLCLguKPguJbguIjguLHguIHguKPguKLguLLguJkiLCLguKvguLHguKfguIHguYrguK3guIHguJnguYnguLPguJTguLHguJrguYDguJ7guKXguLTguIciLCLguKPguJbguKLguJnguJXguYwiLCJkYcSfbGFydmV5YXRlcGVsZXIiLCJzb2tha2nFn2FyZXRsZXJpIiwiYml0a2lsZXIiLCJhxJ9hw6dsYXIiLCLDh2ltZW4iLCLDp2FsxLFsYXIiLCJrYWt0w7xzIiwiUGFsbWl5ZWHEn2HDp2xhcsSxIiwiRG/En2EiLCLFn2VsYWxlbGVyIiwiZGHEn2xhciIsInRlcGVsZXIiLCJzdXl1bmJlZGVubGVyaSIsIm5laGlybGVyIiwiU2FoaWxsZXIiLCJHw7xuZcWfIiwiQXkiLCJnw7ZrecO8esO8IiwiQXJhw6dsYXIiLCJhcmFiYWxhciIsImJpc2lrbGV0bGVyIiwibW90b3Npa2xldGxlciIsImthbXlvbmV0bGVyIiwidGljYXJpa2FteW9ubGFyIiwidGVrbmVsZXIiLCJsaW11emlubGVyIiwidGFrc2lsZXIiLCJva3Vsb3RvYsO8c8O8Iiwib3RvYsO8cyIsImluxZ9hYXRhcmFjxLEiLCJoZXlrZWxsZXIiLCLDp2XFn21lbGVyIiwia8O2cHLDvCIsImlza2VsZSIsImfDtmtkZWxlbiIsInPDvHR1bnPDvHR1bmxhcsSxIiwidml0cmF5IiwiZXYiLCJhcGFydG1hbmJpbmFzxLEiLCJoYWZpZmV2IiwidHJlbmlzdGFzeW9udSIsImvDvGwiLCJ5YW5nxLFubXVzbHXEn3UiLCJyZWtsYW1wYW5vc3UiLCJ5b2xsYXIiLCJ5YXlhZ2XDp2l0bGVyaSIsInRyYWZpa8SxxZ/EsWtsYXLEsSIsImdhcmFqa2FwxLFsYXLEsSIsIm90b2LDvHNkdXJha2xhcsSxIiwidHJhZmlrS29uaWxlcmkiLCJQYXJrc2F5YWPEsSIsIm1lcmRpdmVubGVyIiwiYmFjYWxhciIsInRyYWt0w7ZybGVyIiwiWWFuZ8Sxbm11c2x1xJ91IiwiVHJha3TDtnIiLCJUcmFmaWtsYW1iYXPEsSIsIk1vdG9zaWtsZXRpbiIsIkJhY2EiLCJNZXJkaXZlbiIsIkRhxJ92ZXlhdGVwZSIsIlBhbG1peWVhxJ9hY8SxIiwiWWF5YWdlw6dpZGkiLCJLw7ZwcsO8IiwiVGFrc2kiLCJUZWtuZSIsIk90b2LDvHMiLCJCaXNpa2xldCIsIk1vdG9zaWtsZXQiLCJUYcWfxLF0IiwiQXJhYmEiLCLjgrnjg4jjg4Pjg5fjgrXjgqTjg7MiLCLpgZPot6/mqJnorZgiLCLmpI3niakiLCLmnKgiLCLojYkiLCLkvY7mnKgiLCLjgqvjgq/jgr/jgrkiLCLjg6Tjgrfjga7mnKgiLCLoh6rnhLYiLCLmu50iLCLlsbEiLCLkuJgiLCLmsLTln58iLCLmsrPlt50iLCLjg5Pjg7zjg4EiLCLlpKrpmb0iLCLmnIgiLCLnqboiLCLou4rkuKEiLCLoh6rli5Xou4oiLCLou4oiLCLoh6rou6Lou4oiLCLjgqrjg7zjg4jjg5DjgqQiLCLjg5Tjg4Pjgq/jgqLjg4Pjg5fjg4jjg6njg4Pjgq8iLCLjgrPjg57jg7zjgrfjg6Pjg6vjg4jjg6njg4Pjgq8iLCLjg5zjg7zjg4giLCLjg6rjg6Djgrjjg7MiLCLjgr/jgq/jgrfjg7wiLCLjgrnjgq/jg7zjg6vjg5DjgrkiLCLjg5DjgrkiLCLlu7roqK3ou4rkuKEiLCLlvavlg48iLCLlmbTmsLQiLCLmqYsiLCLmqYvohJoiLCLotoXpq5jlsaTjg5Pjg6siLCLmn7Hjgb7jgZ/jga/mn7EiLCLjgrnjg4bjg7Pjg4njgrDjg6njgrkiLCLlrrYiLCLjgqLjg4rjg5Hjg7zjg4jjg6Hjg7Pjg4jjg5Pjg6siLCLnga/lj7AiLCLjgafjgpPjgZfjgoPjga7jgorjgbAiLCLlsI/lsYsiLCLmtojngavliaQiLCLjgqLjg5Pjg6vjg5zjg7zjg4kiLCLpgZPot68iLCLmqKrmlq3mranpgZMiLCLkv6Hlj7fmqZ8iLCLkuqTpgJrnga8iLCLjgqzjg6zjg7zjgrjjg4njgqIiLCLjg5DjgrnlgZwiLCLjg4jjg6njg5XjgqPjg4Pjgq/jgrPjg7zjg7MiLCLjg5Hjg7zjgq3jg7PjgrDjg6Hjg7zjgr/jg7wiLCLpmo7mrrUiLCLnhZnnqoEiLCLjg4jjg6njgq/jgr/jg7wiLCLlsbHjgoTkuJgiLCLlgZzou4rmqJnoqowiLCLot6/niYwiLCLmqLnmnKgiLCLngYzmnKgiLCLku5nkurrmjowiLCLmo5Xmq5rmqLkiLCLngJHluIMiLCLpq5jlsbHmiJblsbHkuJgiLCLkuJjpmbUiLCLmsLTpq5QiLCLmsrPmtYEiLCLmtbfngZgiLCLmnIjkuq4iLCLlpKnnqboiLCLou4rovJsiLCLmsb3ou4oiLCLohbPouI/ou4oiLCLoh6rooYzou4oiLCLmqZ/ou4oiLCLmkanmiZjou4oiLCLnmq7ljaHou4oiLCLllYbnlKjljaHou4oiLCLoiLkiLCLosaroj6/ovY7ou4oiLCLlh7rnp5/ou4oiLCLmoKHou4oiLCLlhazou4oiLCLlhazlhbHmsb3ou4oiLCLmlr3lt6Xou4rovJsiLCLpm5Xlg48iLCLlmbTms4kiLCLmqYvmooEiLCLnorzpoK0iLCLmkanlpKnlpKfmqJMiLCLmn7HlrZDmiJbmn7HlrZAiLCLlvanoibLnjrvnkoMiLCLmiL/lrZAiLCLlhazlr5PmqJMiLCLnh4jloZQiLCLngavou4rnq5kiLCLkuIDmo5oiLCLmtojpmLLmoJMiLCLlu6PlkYrniYwiLCLooYzkurrnqb/otorpgZMiLCLkurrooYzmqavpgZMiLCLntIXntqDnh4giLCLou4rluqvploAiLCLlt7Tlo6vnq5kiLCLkuqTpgJrpjJAiLCLlgZzou4rloLToqIjlg7nooagiLCLmqJPmoq8iLCLnhZnlm6oiLCLmi5bmi4nmqZ8iLCLpm7vllq7ou4oiLCLllq7ou4oiLCLlt7Tlo6siLCLljYHlrZfot6/lj6MiLCLkuqTpgJrnh4giLCLmlpHppqznt5oiLCLoqIjnqIvou4oiLCLnmoTlo6siLCLoiLnpmrsiLCLlsbHls7DmiJblsbEiLCLmqYvmqJEiLCLRgNCw0YHRgtC10L3QuNGPIiwi0LTQtdGA0LXQstGM0Y8iLCLQutGD0YHRgtCw0YDQvdC40LrQuCIsItC/0YDQuNGA0L7QtNCwIiwi0LLQvtC00L7Qv9Cw0LTRiyIsItGF0L7Qu9C80YsiLCLQstC+0LTQvtC10LzRiyIsItGA0LXQutC4Iiwi0L/Qu9GP0LbQuCIsItGB0L7Qu9C90YbQtSIsItCb0YPQvdCwIiwi0L3QtdCx0L4iLCLQvNCw0YjQuNC90YsiLCLQstC10LvQvtGB0LjQv9C10LTRiyIsItC80L7RgtC+0YbQuNC60LvRiyIsItC/0LjQutCw0L/RiyIsItC70L7QtNC60LgiLCLQu9C40LzRg9C30LjQvdGLIiwi0KLQsNC60YHQuNGBIiwi0LDQstGC0L7QsdGD0YEiLCLRgdGC0LDRgtGD0LgiLCLRhNC+0L3RgtCw0L3RiyIsItC/0LjRgNGBIiwi0L3QtdCx0L7RgdC60YDQtdCxIiwi0LLQuNGC0YDQsNC2Iiwi0L/QtdC/0LXQu9GM0L3Ri9C5Iiwi0LTQvtGA0L7Qs9C4Iiwi0YHQstC10YLQvtGE0L7RgCIsItC60L7QvdGD0YHRiyIsItC70LXRgdGC0L3QuNGG0LAiLCLQtNGL0LzQvtGF0L7QtNGLIiwi0YLRgNCw0LrRgtC+0YDRiyIsItCw0LLRgtC+0LzQvtCx0LjQu9C4Iiwi0LPQvtGA0YvQuNC70LjRhdC+0LvQvNGLIiwi0YHQstC10YLQvtGE0L7RgNGLIiwi0YLRgNCw0L3RgdC/0L7RgNGC0L3Ri9C10YHRgNC10LTRgdGC0LLQsCIsItC/0LXRiNC10YXQvtC00L3Ri9C10L/QtdGA0LXRhdC+0LTRiyIsItC/0L7QttCw0YDQvdGL0LXQs9C40LTRgNCw0L3RgtGLIiwi0LvQtdGB0YLQvdC40YbRiyIsItCz0LjQtNGA0LDQvdGC0LDQvNC4Iiwi0LDQstGC0L7QsdGD0YHRiyIsItC00YvQvNC+0LLRi9C10YLRgNGD0LHRiyIsItGC0YDQsNC60YLQvtGA0LAiLCLRgtCw0LrRgdC4Iiwi0LzQvtGB0YLQsNC80LgiLCLQs9C+0YDQuNGH0LjQv9Cw0LPQvtGA0LHQuCIsItC30L3QsNC60LjQt9GD0L/QuNC90LrQuCIsItC00L7RgNC+0LbQvdGW0LfQvdCw0LrQuCIsItGA0L7RgdC70LjQvdC4Iiwi0LTQtdGA0LXQstCwIiwi0YfQsNCz0LDRgNC90LjQutC4Iiwi0L/QsNC70YzQvNC+0LLRltC00LXRgNC10LLQsCIsItCy0L7QtNC+0YHQv9Cw0LTQuCIsItCz0L7RgNC4Iiwi0L/QsNCz0L7RgNCx0LgiLCLQstC+0LTQvtC50LzQuCIsItGA0ZbRh9C60LgiLCLQv9C70Y/QttGWIiwi0YHQvtC90YbQtSIsItCc0ZbRgdGP0YbRjCIsInRhYnMiLCJ0b3RhbHRhYnMiLCJjbGljayIsInJhaW5ib3ciLCJJbWFnZUNhY2hlIiwiYmFzZTY0aW1nIiwicmVzIiwiZXJyb3JEZXNjcmlwdGlvbiIsImVycm9yQ29kZSIsInNvbHV0aW9uIiwidmFsdWUiLCJEb09jciIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJpbWFnZXRvdGV4dCIsImNsaWNrdGltZSIsIkNoZWNrZm9yU3R1Y2siLCJJbWFnZVRvQmFzZTY0IiwiZ2V0aW5kZXgiLCJkb21Nb2RpZnlDYiIsImltYWdlIiwiaW1hZ2Vjb2RlIiwic3Vic3RyaW5nIiwidGltZWlkIiwiaW1nMTEiLCJvYmoiLCJvYmphbGwiLCJxdWVyeVNlbGVjdG9yQWxsIiwid2lkdGh4IiwibmF0dXJhbFdpZHRoIiwiY3R4IiwiZGF0YVVSTCIsImJhc2UiLCJuZWVkTW9yZSIsInN0dWNrQ291bnQiLCJzdHVja1JlZnJlc2hUaW1lcyIsInJlZnJlc2giLCJpc0F1dG9TdWJtaXQiLCJpc0F1dG9DbGlja0NoZWNrQm94IiwiY2hlY2tCb3hDbGlja0RlbGF5VGltZSIsImltZzExU2NvcmUiLCJ3YXRjaFNlcnZpY2UiLCJpc1ZlcmlmeUVuZCIsImlzQnJhbWVQYWdlIiwibWF0Y2giLCJpc0FuY2hvclBhZ2UiLCJnZXRxdWVzdGlvbiIsIndhdGNoQ2hlY2tib3giLCJnZXRBdHRyaWJ1dGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInJlbG9hZCIsImdldElzRW5kIiwidGhlbiIsImdldFdvcmRzIiwicG9zdE1lc3NhZ2UiLCJ0eXBlIiwiTnVtYmVyIiwicmVUYXJnZXQiLCJyY0ltYWdlc2VsZWN0VGFyZ2V0IiwiZXJyb3JTZWxlY3RNb3JlIiwiZXJyb3JEeW5hbWljTW9yZSIsImlzRW5kIiwiY2FsbHVybCIsInRhc2siLCJxdWVzdGlvbnN0ciIsInF1ZXN0aW9uIiwibmV0d29yayIsInJlY2FwdGNoYVZlcmlmeUZhaWxEZWxheSIsInJlY2FwdGNoYVZlcmlmeVRyeSIsIkNsaWNrcyIsImRlbGF5VGltZSIsInRlc3QiLCJoYXNPYmplY3QiLCJyZXN1bHRsaXN0Iiwib2JqZWN0cyIsImV2ZW50IiwiaW1hZ2VjbGFzc2lmaWNhdGlvbl92NCIsInByb21pc2UiLCJjYiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJrZXkiLCJpMThuIiwiZ2V0TWVzc2FnZSIsImluamVjdCIsImlzQmxhY2tXaGl0ZVBhc3MiLCJhdXRvcnVuIiwiZG9jdW1lbnRPYmoiLCJmIiwicGFyZW50RWxlbWVudCIsImlzSGlkZGVuIiwidmlzaWJpbGl0eSIsImNvbnRlbnRXaW5kb3ciLCJyZWNhcHRjaGFDb25maWciLCJpc1VzZU5ld1NjcmlwdCJdLCJzb3VyY2VSb290IjoiIn0=