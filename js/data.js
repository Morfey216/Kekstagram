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

    errorWindow.addEventListener('click', onErrorWindowClick);
    document.addEventListener('keydown', onKeydown);

    function onErrorWindowClick() {
      closeError();
    }

    function onKeydown(evt) {
      window.util.isEscEvent(evt, closeError);
    }

    function closeError() {
      errorWindow.removeEventListener('click', onErrorWindowClick);
      document.removeEventListener('keydown', onKeydown);
      mainBlock.removeChild(errorWindow);
    }
  }

  window.backend.load(onLoad, onError);

})();
