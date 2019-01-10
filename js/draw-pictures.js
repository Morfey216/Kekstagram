'use strict';

(function () {
  var usersPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();
  var userPictureDialog = document.querySelector('.pictures');

  function renderPicture(picture, indexPicture) {
    var newPicture = usersPictureTemplate.cloneNode(true);

    newPicture.querySelector('.picture__img').src = picture.url;
    newPicture.querySelector('.picture__likes').textContent = picture.likes;
    newPicture.querySelector('.picture__comments').textContent = picture.comments.length;
    newPicture.setAttribute('data-picture-position', indexPicture);

    fragment.appendChild(newPicture);
  }

  function drawPictures(picturesKit) {
    picturesKit.forEach(renderPicture);
    userPictureDialog.appendChild(fragment);
  }

  window.drawPictures = drawPictures;

})();
