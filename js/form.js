'use strict';

(function () {
  var FILE_TYPE_ERROR_MESSAGE = 'Файл не является изображением';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAX_EFFECT_VALUE = 100;
  var MAX_LONG_HASHTAG = 20;
  var MAX_QUANTITY_HASHTAG = 5;
  var MIN_SCALE_VALUE = 25;
  var MAX_SCALE_VALUE = 100;
  var SCALE_VALUE_STEP = 25;
  var UPPER_Z_INDEX = 10;
  var EFFECTS = {
    chrome: {
      effectName: 'chrome',
      effectFilter: 'grayscale',
      minLevelEffect: 0,
      maxLevelEffect: 1,
      effectDimension: ''
    },
    sepia: {
      effectName: 'sepia',
      effectFilter: 'sepia',
      minLevelEffect: 0,
      maxLevelEffect: 1,
      effectDimension: ''
    },
    marvin: {
      effectName: 'marvin',
      effectFilter: 'invert',
      minLevelEffect: 0,
      maxLevelEffect: 100,
      effectDimension: '%'
    },
    phobos: {
      effectName: 'phobos',
      effectFilter: 'blur',
      minLevelEffect: 0,
      maxLevelEffect: 3,
      effectDimension: 'px'
    },
    heat: {
      effectName: 'heat',
      effectFilter: 'brightness',
      minLevelEffect: 1,
      maxLevelEffect: 3,
      effectDimension: ''
    },
    none: {
      effectName: 'none',
      effectFilter: 'none',
      minLevelEffect: null,
      maxLevelEffect: null,
      effectDimension: ''
    }
  };

  var mainBlock = document.querySelector('main');
  var form = document.querySelector('.img-upload__form');
  var fileChooser = form.querySelector('#upload-file');
  var userImageEditor = form.querySelector('.img-upload__overlay');
  var closeButton = userImageEditor.querySelector('.img-upload__cancel');
  var imagePreviewContainer = userImageEditor.querySelector('.img-upload__preview');
  var imagePreview = userImageEditor.querySelector('.img-upload__preview img');
  var hashtagsInput = userImageEditor.querySelector('.text__hashtags');
  var descriptionInput = userImageEditor.querySelector('.text__description');
  var effectLevel = userImageEditor.querySelector('.effect-level');
  var scaleValueIndicator = userImageEditor.querySelector('.scale__control--value');
  var scaleControlSmaller = userImageEditor.querySelector('.scale__control--smaller');
  var scaleControlBigger = userImageEditor.querySelector('.scale__control--bigger');
  var effectLevelLine = effectLevel.querySelector('.effect-level__line');
  var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
  var effectValue = effectLevelValue.value;
  var choiceEffect = userImageEditor.querySelector('.effects__list');
  var scaleValue = MAX_SCALE_VALUE;
  var currentEffectObj = EFFECTS['none'];

  function openForm() {
    fileChooser.addEventListener('change', onFileChooserChange);
  }

  function onFileChooserChange() {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (fileType) {
      return fileName.endsWith(fileType);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imagePreview.src = reader.result;
        showForm();
      });

      reader.readAsDataURL(file);
    } else {
      onError(FILE_TYPE_ERROR_MESSAGE);
    }
  }

  function showForm() {
    userImageEditor.classList.remove('hidden');
    effectLevel.classList.add('img-filters--inactive');
    setScaleValue(scaleValue);
    setFormListeners();
  }

  function setFormListeners() {
    document.addEventListener('keydown', onKeydown);
    form.addEventListener('submit', onFormSubmit);
    closeButton.addEventListener('click', onCloseButtonClick);
    closeButton.addEventListener('keydown', onCloseButtonKeydown);
    effectLevelPin.addEventListener('mousedown', onLevelPinMouseDown);
    choiceEffect.addEventListener('focus', onEffectFocus, true);
    scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
    hashtagsInput.addEventListener('input', onHashtagsInputChange);
  }

  function closeForm() {
    userImageEditor.classList.add('hidden');
    fileChooser.value = '';
    imagePreview.src = '';
    clearEffect();
    imagePreviewContainer.style.transform = '';
    scaleValue = MAX_SCALE_VALUE;
    hashtagsInput.setCustomValidity('');
    hashtagsInput.style.borderColor = '';
    hashtagsInput.value = '';
    descriptionInput.value = '';
    removeFormListeners();
  }

  function removeFormListeners() {
    document.removeEventListener('keydown', onKeydown);
    form.removeEventListener('submit', onFormSubmit);
    closeButton.removeEventListener('click', onCloseButtonClick);
    closeButton.removeEventListener('keydown', onCloseButtonKeydown);
    effectLevelPin.removeEventListener('mousedown', onLevelPinMouseDown);
    choiceEffect.removeEventListener('focus', onEffectFocus, true);
    scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
    scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
    hashtagsInput.removeEventListener('input', onHashtagsInputChange);
  }

  function onFormSubmit(evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), onLoad, onError);
  }

  function onScaleControlSmallerClick() {
    scaleValue -= SCALE_VALUE_STEP;

    if (scaleValue < MIN_SCALE_VALUE) {
      scaleValue = MIN_SCALE_VALUE;
    }

    setScaleValue(scaleValue);
  }

  function onScaleControlBiggerClick() {
    scaleValue += SCALE_VALUE_STEP;

    if (scaleValue > MAX_SCALE_VALUE) {
      scaleValue = MAX_SCALE_VALUE;
    }

    setScaleValue(scaleValue);
  }

  function onCloseButtonClick() {
    closeForm();
  }

  function onCloseButtonKeydown(evt) {
    window.util.isEnterEvent(evt, closeForm);
  }

  function onKeydown(evt) {
    if (document.activeElement !== hashtagsInput && document.activeElement !== descriptionInput) {
      window.util.isEscEvent(evt, closeForm);
    }
  }

  function setScaleValue(value) {
    scaleValueIndicator.value = value + '%';
    imagePreviewContainer.style.transform = 'scale(' + value / 100 + ')';
  }

  function onLevelPinMouseDown(downEvt) {
    downEvt.preventDefault();

    var effectLevelLineLeftCoordinate = getLeftCoordinate(effectLevelLine);
    var effectRange = currentEffectObj.maxLevelEffect - currentEffectObj.minLevelEffect;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(moveEvt) {
      setEffectOptions(moveEvt);
    }

    function setEffectOptions(effectEvt) {
      var newLeft = effectEvt.clientX - effectLevelLineLeftCoordinate;
      var maxLeft = effectLevelLine.offsetWidth;

      if (newLeft < 0) {
        newLeft = 0;
      }

      if (newLeft > maxLeft) {
        newLeft = maxLeft;
      }

      effectLevelPin.style.left = newLeft + 'px';
      effectLevelDepth.style.width = newLeft + 'px';
      effectValue = newLeft * 100 / maxLeft;
      effectLevelValue.setAttribute('value', effectValue);

      var effectDepth = (effectRange / 100) * effectValue + currentEffectObj.minLevelEffect;

      imagePreview.style.filter = currentEffectObj.effectFilter + '(' + effectDepth + currentEffectObj.effectDimension + ')';
    }

    function onMouseUp(upEvt) {
      setEffectOptions(upEvt);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }

  effectLevelPin.ondragstart = function () {
    return false;
  };

  function getLeftCoordinate(element) {
    var box = element.getBoundingClientRect();
    return box.left + pageXOffset;
  }

  function onEffectFocus(choiceEvt) {
    clearEffect();
    setEffect(choiceEvt.target.value);
  }

  function setEffect(currentEffect) {
    currentEffectObj = EFFECTS[currentEffect] || EFFECTS['none'];

    if (currentEffectObj.effectFilter === 'none') {
      effectLevel.classList.add('img-filters--inactive');
    } else {
      effectLevel.classList.remove('img-filters--inactive');
      imagePreview.classList.add('effects__preview--' + currentEffect);
      effectLevelValue.setAttribute('value', MAX_EFFECT_VALUE);
      effectValue = MAX_EFFECT_VALUE;
      imagePreview.style.filter = currentEffectObj.effectFilter + '(' + currentEffectObj.maxLevelEffect + currentEffectObj.effectDimension + ')';
      effectLevelPin.style.left = effectLevelLine.offsetWidth + 'px';
      effectLevelDepth.style.width = effectLevelLine.offsetWidth + 'px';
    }
  }

  function clearEffect() {
    imagePreview.classList.remove('effects__preview--' + currentEffectObj.effectName);
    imagePreview.style.filter = '';
    effectLevelValue.removeAttribute('value');
    effectLevelPin.style.left = '';
    effectLevelDepth.style.width = '';
  }

  function onHashtagsInputChange() {
    var validationErrors = getValidationErrors(getHashtagsArray());

    hashtagsInput.style.borderColor = validationErrors ? 'red' : '';
    hashtagsInput.setCustomValidity(validationErrors);

  }

  function getHashtagsArray() {
    var hashtags = hashtagsInput.value;

    var hashtagsList = hashtags.split(' ').filter(function (currentElement) {
      return currentElement !== '';
    });

    return hashtagsList;
  }

  function getValidationErrors(hashtags) {
    var errorMessage = '';
    var errors = {
      firstSymbol: false,
      singleSymbol: false,
      separator: false,
      longHashtag: false,
      sameHashtag: false,
      manyHashtag: false
    };

    var errorNameToErrorMessage = {
      firstSymbol: 'Хэш-тег должен начинатся с символа # (решётка)',
      singleSymbol: 'Хеш-тег не может состоять только из одной решётки',
      separator: 'Хеш-теги разделяются пробелами',
      longHashtag: 'Максимальная длина одного хэш-тега ' + MAX_LONG_HASHTAG + ' символов, включая решётку',
      sameHashtag: 'Нельзя использовать одинаковые хэш-теги (с учетом регистра)',
      manyHashtag: 'Нельзя указать больше ' + MAX_QUANTITY_HASHTAG + ' хэш-тегов'
    };

    var validationErrorNames = Object.keys(errors);

    hashtags.forEach(getPersonalHashtagError);

    errors.manyHashtag = errors.manyHashtag || (hashtags.length > MAX_QUANTITY_HASHTAG);
    errors.sameHashtag = errors.sameHashtag || (getEqualHashtags(hashtags).length > 0);

    validationErrorNames.forEach(function (errorName) {
      if (errors[errorName]) {
        errorMessage += errorNameToErrorMessage[errorName] + '. \n';
      }
    });

    function getPersonalHashtagError(hashtag) {
      errors.firstSymbol = errors.firstSymbol || (hashtag[0] !== '#');
      errors.singleSymbol = errors.singleSymbol || ((hashtag.length === 1) && hashtag[0] === '#');
      errors.separator = errors.separator || (hashtag.includes('#', 1));
      errors.longHashtag = errors.longHashtag || (hashtag.length > MAX_LONG_HASHTAG);
    }

    function getEqualHashtags(allHashtags) {
      var equalHashtags = allHashtags.map(function (thisHashtag) {
        return thisHashtag.toUpperCase();
      }).filter(function (hashtagValue, currentIndex, currentHashtags) {
        return currentHashtags.indexOf(hashtagValue, currentIndex) !== currentHashtags.lastIndexOf(hashtagValue) && currentHashtags.indexOf(hashtagValue) === currentIndex;
      });

      return equalHashtags;
    }

    return errorMessage;
  }

  function onLoad() {
    closeForm();
    showSuccess();
  }

  function showSuccess() {
    var successWindow = successMessageTemplate.cloneNode(true);

    mainBlock.appendChild(successWindow);
    successWindow.addEventListener('click', onSuccessWindowClick);
    document.addEventListener('keydown', onSuccessKeydown);

    function onSuccessKeydown(evt) {
      evt.preventDefault();
      window.util.isEscEvent(evt, closeSuccess);
    }

    function onSuccessWindowClick() {
      closeSuccess();
    }

    function closeSuccess() {
      document.removeEventListener('keydown', onSuccessKeydown);
      successWindow.removeEventListener('click', onSuccessWindowClick);
      mainBlock.removeChild(successWindow);
    }
  }

  function onError(errorMessage) {
    var errorWindow = errorMessageTemplate.cloneNode(true);
    var errorButtonsBlock = errorWindow.querySelector('.error__buttons');
    var retryButton = errorButtonsBlock.querySelector('.error__button:first-child');

    if (errorMessage === FILE_TYPE_ERROR_MESSAGE) {
      errorButtonsBlock.removeChild(retryButton);
    } else {
      retryButton.addEventListener('click', onRetryButtonClick);
    }

    errorWindow.querySelector('.error__title').textContent = errorMessage;
    mainBlock.appendChild(errorWindow);
    errorWindow.style.zIndex = UPPER_Z_INDEX;

    errorWindow.addEventListener('click', onErrorWindowClick);
    document.addEventListener('keydown', onErrorKeydown);

    function onErrorKeydown(evt) {
      evt.preventDefault();
      window.util.isEscEvent(evt, closeErrorWindowAndForm);
    }

    function onErrorWindowClick() {
      closeErrorWindowAndForm();
    }

    function onRetryButtonClick() {
      closeError();
    }

    function closeError() {
      errorWindow.removeEventListener('click', onErrorWindowClick);
      retryButton.removeEventListener('click', onRetryButtonClick);
      document.removeEventListener('keydown', onErrorKeydown);
      mainBlock.removeChild(errorWindow);
    }

    function closeErrorWindowAndForm() {
      closeError();
      closeForm();
    }
  }

  window.form = openForm;

})();
