'use strict';

(function () {
  var mainBlock = document.querySelector('main');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  function onLoad(allPictures) {
    window.usersPictures = allPictures;
    window.drawPictures(window.usersPictures);
    window.form();
    window.preview();
    window.filtrate();
  }

  function onError(errorMessage) {
    var errorWindow = errorMessageTemplate.cloneNode(true);
    var errorButtonsBlock = errorWindow.querySelector('.error__buttons');

    errorWindow.querySelector('.error__title').textContent = errorMessage;
    errorButtonsBlock.removeChild(errorButtonsBlock.querySelector('.error__button:last-child'));
    mainBlock.appendChild(errorWindow);

    errorWindow.addEventListener('click', onCloseError);
    document.addEventListener('keydown', onCloseFromEsc);

    function onCloseFromEsc(evt) {
      window.util.isEscEvent(evt, onCloseError);
    }

    function onCloseError() {
      errorWindow.removeEventListener('click', onCloseError);
      document.removeEventListener('keydown', onCloseFromEsc);
      mainBlock.removeChild(errorWindow);
    }
  }

  window.backend.load(onLoad, onError);

})();
