'use strict';

var MIN_LIKE = 15;
var MAX_LIKE = 200;
var MIN_COMMENT = 1;
var MAX_COMMENT = 12;

var commentsSamples = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var descriptionsSamples = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var usersPictures = [];

var getIndex = function (maxIndex, minIndex) {
  return Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
};

var createComments = function () {
  var commentsKit = [];
  var commentQuantity = getIndex(MAX_COMMENT, MIN_COMMENT);

  for (var index = 0; index <= commentQuantity; index++) {
    commentsKit[index] = commentsSamples[getIndex(commentsSamples.length, 0)];
  }

  return commentsKit;
};

for (var i = 0; i < 25; i++) {
  usersPictures[i] = {};
  usersPictures[i].url = 'photos/' + (i + 1) + '.jpg';
  usersPictures[i].likes = getIndex(MAX_LIKE + 1, MIN_LIKE);
  usersPictures[i].comments = createComments();
  usersPictures[i].description = descriptionsSamples[getIndex(descriptionsSamples.length, 0)];
}
