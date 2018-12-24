'use strict';

(function () {
  var usersPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var fragment = document.createDocumentFragment();
  var userPictureDialog = document.querySelector('.pictures');

  function renderPicture(picture, indexPicture) {
    var pictureElement = usersPictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    pictureElement.setAttribute('data-picture-position', indexPicture);

    return pictureElement;
  }

  window.drawPictures = function (picturesKit) {
    for (var index = 0; index < picturesKit.length; index++) {
      fragment.appendChild(renderPicture(picturesKit[index], index));
    }

    userPictureDialog.appendChild(fragment);
  };

})();
