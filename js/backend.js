'use strict';

(function () {
  var LOAD_OK = 200;
  var TIMEOUT_INTERVAL = 10000;

  function load(onLoad, onError) {
    var URL = 'https://js.dump.academy/kekstagram/data';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === LOAD_OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_INTERVAL;

    xhr.open('GET', URL);
    xhr.send();
  }

  function upload(data, onLoad, onError) {
    var URL = 'https://js.dump.academy/kekstagram1';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === LOAD_OK) {
        onLoad();
      } else if (xhr.response) {
        onError(xhr.response[0].errorMessage);
      } else {
        onError('Ошибка: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_INTERVAL;

    xhr.open('POST', URL);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload
  };

})();
