'use strict';

(function () {
  function onLoad(allPicture) {
    window.usersPictures = allPicture;
    window.drawPictures(window.usersPictures);
    window.preview();
    window.filtrate();
  }

  function onError(errorMessage) {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorWindow = errorMessageTemplate.cloneNode(true);
    var errorButtonsBlock = errorWindow.querySelector('.error__buttons');

    errorWindow.querySelector('.error__title').textContent = errorMessage;
    errorButtonsBlock.removeChild(errorButtonsBlock.querySelector('.error__button:last-child'));
    document.querySelector('main').appendChild(errorWindow);

    var errorButton = errorWindow.querySelector('.error__button');

    errorWindow.addEventListener('click', closeError);
    errorButton.addEventListener('click', closeError);
    document.addEventListener('keydown', closeFromEsc);

    function closeFromEsc(evt) {
      window.util.isEscEvent(evt, closeError);
    }

    function closeError() {
      errorWindow.removeEventListener('click', closeError);
      errorButton.removeEventListener('click', closeError);
      document.removeEventListener('keydown', closeFromEsc);
      document.querySelector('main').removeChild(errorWindow);
    }
  }

  window.backend.load(onLoad, onError);

})();
