'use strict';

(function () {
  function onLoad(allPicture) {
    window.usersPictures = allPicture;
    window.drawPictures(window.usersPictures);
    window.preview();
    window.filtrate();
  }

  function onError(errorMessage) {
    var mainBlock = document.querySelector('main');
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorWindow = errorMessageTemplate.cloneNode(true);
    var errorButtonsBlock = errorWindow.querySelector('.error__buttons');

    errorWindow.querySelector('.error__title').textContent = errorMessage;
    errorButtonsBlock.removeChild(errorButtonsBlock.querySelector('.error__button:last-child'));
    mainBlock.appendChild(errorWindow);

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
      mainBlock.removeChild(errorWindow);
    }
  }

  window.backend.load(onLoad, onError);

})();
