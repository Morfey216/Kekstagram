'use strict';

var MIN_LIKE = 15;
var MAX_LIKE = 200;
var MIN_COMMENT = 1;
var MAX_COMMENT = 12;
var COMMENTS_INTERVAL = 5;
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

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var usersPicture = getAllPicture();
drawPictures(usersPicture);

function getAllPicture() {
  var allPictures = [];

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    allPictures[i] = createUserPicture(i);
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

  return allPictures;
}

function drawPictures(picturesKit) {
  var usersPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();
  var userPictureDialog = document.querySelector('.pictures');

  for (var index = 0; index < picturesKit.length; index++) {
    fragment.appendChild(renderPicture(picturesKit[index]));
  }

  function renderPicture(picture) {
    var pictureElement = usersPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

    return pictureElement;
  }

  userPictureDialog.appendChild(fragment);
}

// Добавление обработчиков

// Загрузка изображения пользователя

var imageUploadForm = document.querySelector('.img-upload__form');
var nameOfUploadFile = imageUploadForm.querySelector('#upload-file');
var userFileEditor = imageUploadForm.querySelector('.img-upload__overlay');
var userFileEditorClose = userFileEditor.querySelector('.img-upload__cancel');

nameOfUploadFile.addEventListener('change', function () {
  userFileEditor.classList.remove('hidden');

  document.addEventListener('keydown', onFileEditorEscPress);
});

function onFileEditorEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeFileEditor();
  }
}

userFileEditorClose.addEventListener('click', function () {
  closeFileEditor();
});

userFileEditorClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeFileEditor();
  }
});

function closeFileEditor() {
  userFileEditor.classList.add('hidden');
  nameOfUploadFile.value = '';
  document.removeEventListener('keydown', onFileEditorEscPress);
}

// Открываем большую фотографию

// var numberBigPicture = 0;
// drawBigPicture(numberBigPicture);

function drawBigPicture(numberPicture) {
  var userBigPictureDialog = document.querySelector('.big-picture');

  renderGeneralInformation();
  renderNewComments();
  showBigPicture();

  function renderGeneralInformation() {
    userBigPictureDialog.querySelector('.big-picture__img img').src = usersPicture[numberPicture].url;
    userBigPictureDialog.querySelector('.social__caption').textContent = usersPicture[numberPicture].description;
    userBigPictureDialog.querySelector('.likes-count').textContent = usersPicture[numberPicture].likes;
    userBigPictureDialog.querySelector('.comments-count').textContent = usersPicture[numberPicture].comments.length;
  }

  function renderNewComments() {
    var socialComments = userBigPictureDialog.querySelector('.social__comments');
    var commentFragment = document.createDocumentFragment();
    var startIndexOfComment = 0;
    var endIndexOfComment = startIndexOfComment + COMMENTS_INTERVAL;

    if (endIndexOfComment > usersPicture[numberPicture].comments.length) {
      endIndexOfComment = usersPicture[numberPicture].comments.length;
    }

    clearComments();

    for (var indexComment = startIndexOfComment; indexComment < endIndexOfComment; indexComment++) {
      commentFragment.appendChild(renderNewComment(usersPicture[numberPicture].comments[indexComment]));
    }

    socialComments.appendChild(commentFragment);

    function renderNewComment(commentData) {
      var newComment = document.createElement('li');
      newComment.className = 'social__comment';
      newComment.appendChild(getImg());
      newComment.appendChild(getParagraph());

      return newComment;

      function getImg() {
        var img = document.createElement('img');
        img.className = 'social__picture';
        img.src = commentData.avatar;
        img.alt = 'Аватар комментатора фотографии';
        img.width = '35';
        img.height = '35';
        return img;
      }

      function getParagraph() {
        var paragraph = document.createElement('p');
        paragraph.className = 'social__text';
        paragraph.textContent = commentData.message;
        return paragraph;
      }
    }

    function clearComments() {
      while (socialComments.firstChild) {
        socialComments.removeChild(socialComments.firstChild);
      }
    }
  }

  function showBigPicture() {
    userBigPictureDialog.classList.remove('hidden');
    userBigPictureDialog.querySelector('.social__comment-count').classList.add('visually-hidden');
    userBigPictureDialog.querySelector('.comments-loader').classList.add('visually-hidden');
  }
}
