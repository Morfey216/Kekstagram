'use strict';

(function () {
  var MIN_LIKE = 15;
  var MAX_LIKE = 200;
  var MIN_COMMENT = 1;
  var MAX_COMMENT = 12;

  var MAX_NUMBER_AVATAR = 6;
  var MIN_NUMBER_AVATAR = 1;
  var PICTURES_NUMBER = 25;

  var COMMENT_SAMPLES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var DESCRIPTION_SAMPLES = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var NAME_SAMPLES = [
    'Иван',
    'Себастьян',
    'Мария',
    'Кристоф',
    'Виктор',
    'Юлия',
    'Люпита',
    'Вашингтон'
  ];

  function getAllPictures() {
    var allPictures = [];

    for (var i = 0; i < PICTURES_NUMBER; i++) {
      allPictures[i] = createUserPicture(i);
    }

    return allPictures;
  }

  function createUserPicture(n) {
    return {
      url: 'photos/' + (n + 1) + '.jpg',
      likes: getIndexFromRange(MIN_LIKE, MAX_LIKE + 1),
      comments: createCommentsKit(),
      description: DESCRIPTION_SAMPLES[getIndexFromRange(0, DESCRIPTION_SAMPLES.length)]
    };
  }

  function getIndexFromRange(minIndex, maxIndex) {
    return Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
  }

  function createCommentsKit() {
    var commentsKit = [];
    var commentQuantity = getIndexFromRange(MIN_COMMENT, MAX_COMMENT);

    for (var index = 0; index <= commentQuantity; index++) {
      commentsKit[index] = createComment();
    }

    return commentsKit;
  }

  function createComment() {
    return {
      avatar: 'img/avatar-' + [getIndexFromRange(MIN_NUMBER_AVATAR, MAX_NUMBER_AVATAR + 1)] + '.svg',
      message: COMMENT_SAMPLES[getIndexFromRange(0, COMMENT_SAMPLES.length)],
      name: NAME_SAMPLES[getIndexFromRange(0, NAME_SAMPLES.length)]
    };
  }

  // НОВЫЙ КОД - работа с сервером

  function onLoad(allPicture) {
    window.usersPictures = allPicture;
    window.drawPictures(window.usersPictures);
    window.preview();
  }

  function onError(errorMessage) {
    var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorMessageElement = errorMessageTemplate.cloneNode(true);
    var fragment = document.createDocumentFragment();

    errorMessageElement.querySelector('.error__title').textContent = errorMessage;

    var errorButtonsBlock = errorMessageElement.querySelector('.error__buttons');
    errorButtonsBlock.removeChild(errorButtonsBlock.querySelectorAll('.error__button')[1]);
    fragment.appendChild(errorMessageElement);

    document.querySelector('main').appendChild(fragment);

    var errorWindow = document.querySelector('.error');
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

  // КОНЕЦ НОВОГО КОДА - работа с сервером

  window.usPictures = getAllPictures();
  // window.drawPictures(window.usersPictures);
  // window.preview();

})();
