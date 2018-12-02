'use strict';

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

var usersPicture = [];

var getIndex = function (maxIndex, minIndex) {
  return Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
};

var createComment = function (comment) {
  comment.avatar = 'img/avatar-' + [getIndex(MAX_NUMBER_AVATAR + 1, MIN_NUMBER_AVATAR)] + '.svg';
  comment.message = COMMENT_SAMPLES[getIndex(COMMENT_SAMPLES.length, 0)];
  comment.name = NAME_SAMPLES[getIndex(NAME_SAMPLES.length, 0)];

  return comment;
};

var createCommentsKit = function () {
  var commentsKit = [];
  var commentQuantity = getIndex(MAX_COMMENT, MIN_COMMENT);

  for (var index = 0; index <= commentQuantity; index++) {
    commentsKit[index] = createComment({});
  }

  return commentsKit;
};

var createUserPicture = function (picture, n) {
  picture.url = 'photos/' + (n + 1) + '.jpg';
  picture.likes = getIndex(MAX_LIKE + 1, MIN_LIKE);
  picture.comments = createCommentsKit();
  picture.description = DESCRIPTION_SAMPLES[getIndex(DESCRIPTION_SAMPLES.length, 0)];

  return picture;
};

for (var i = 0; i < PICTURES_NUMBER; i++) {
  usersPicture[i] = createUserPicture({}, i);
}

// Создание и отрисовка изображений пользователей

var userPictureDialog = document.querySelector('.pictures');

var usersPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

var renderPicture = function (picture) {
  var pictureElement = usersPictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (var index = 0; index < usersPicture.length; index++) {
  fragment.appendChild(renderPicture(usersPicture[index]));
}

userPictureDialog.appendChild(fragment);

// Комментируем большую фотографию

var userBigPictureDialog = document.querySelector('.big-picture');
var socialComments = userBigPictureDialog.querySelector('.social__comments');

var clearComments = function () {
  while (socialComments.firstChild) {
    socialComments.removeChild(socialComments.firstChild);
  }
};

var renderComment = function (commentData) {
  var newComment = document.createElement('li');
  newComment.className = 'social__comment';
  newComment.innerHTML = '<img class="social__picture" src="' + commentData.avatar + '" alt="Аватар комментатора фотографии" width="35" height="35">' + commentData.message + '<p class="social__text"></p>';

  return newComment;
};

var renderNewComments = function () {
  clearComments();
  var commentFragment = document.createDocumentFragment();
  var commentNumber = 3;

  for (var indexComment = 0; indexComment < commentNumber; indexComment++) {
    commentFragment.appendChild(renderComment(usersPicture[numberPicture].comments[indexComment]));
  }

  socialComments.appendChild(commentFragment);
};

var renderBigPicture = function (numberPicture) {
  userBigPictureDialog.querySelector('.big-picture__img img').src = usersPicture[numberPicture].url;
  userBigPictureDialog.querySelector('.social__caption').textContent = usersPicture[numberPicture].description;
  userBigPictureDialog.querySelector('.likes-count').textContent = usersPicture[numberPicture].likes;
  userBigPictureDialog.querySelector('.comments-count').textContent = usersPicture[numberPicture].comments.length;
  renderNewComments();
};

var numberPicture = 19;
renderBigPicture(numberPicture);
userBigPictureDialog.classList.remove('hidden');

// userBigPictureDialog.querySelector('.social__comment-count').classList.add('visually-hidden');
userBigPictureDialog.querySelector('.comments-loader').classList.add('visually-hidden');
