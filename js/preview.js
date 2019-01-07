'use strict';

(function () {
  var COMMENTS_INTERVAL = 5;

  function preview() {
    var allSmallPictures = document.querySelectorAll('.picture');

    for (var numberSmallPicture = 0; numberSmallPicture < allSmallPictures.length; numberSmallPicture++) {
      allSmallPictures[numberSmallPicture].addEventListener('click', function (evt) {
        drawBigPicture(evt.target.parentElement.getAttribute('data-picture-position'));
      });
    }
  }

  function drawBigPicture(numberPicture) {
    var userBigPictureDialog = document.querySelector('.big-picture');
    var socialComments = userBigPictureDialog.querySelector('.social__comments');
    var newCommentsLoadButton = userBigPictureDialog.querySelector('.comments-loader');
    var startIndexOfComment = 0;

    renderGeneralInformation();
    renderNewComments();
    showBigPicture();


    function renderGeneralInformation() {
      userBigPictureDialog.querySelector('.big-picture__img img').src = window.usersPictures[numberPicture].url;
      userBigPictureDialog.querySelector('.social__caption').textContent = window.usersPictures[numberPicture].description;
      userBigPictureDialog.querySelector('.likes-count').textContent = window.usersPictures[numberPicture].likes;
      userBigPictureDialog.querySelector('.comments-count').textContent = window.usersPictures[numberPicture].comments.length;
    }

    function renderNewComments() {
      var commentFragment = document.createDocumentFragment();
      var endIndexOfComment = startIndexOfComment + COMMENTS_INTERVAL;

      if (endIndexOfComment >= window.usersPictures[numberPicture].comments.length) {
        endIndexOfComment = window.usersPictures[numberPicture].comments.length;
        newCommentsLoadButton.classList.add('hidden');
      }

      clearComments();

      for (var indexComment = startIndexOfComment; indexComment < endIndexOfComment; indexComment++) {
        commentFragment.appendChild(renderNewComment(window.usersPictures[numberPicture].comments[indexComment]));
      }

      userBigPictureDialog.querySelector('.social__comment-count').firstChild.textContent = endIndexOfComment + ' из ';

      startIndexOfComment = endIndexOfComment;
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
      var bodyBlock = document.querySelector('body');
      var userBigPictureClose = userBigPictureDialog.querySelector('.big-picture__cancel');

      bodyBlock.classList.add('modal-open');
      userBigPictureDialog.classList.remove('hidden');
      document.addEventListener('keydown', onBigPictureEscPress);
      newCommentsLoadButton.addEventListener('click', renderNewComments);

      userBigPictureClose.addEventListener('click', function () {
        closeBigPicture();
      });

      userBigPictureClose.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, closeBigPicture);
      });

      function onBigPictureEscPress(evt) {
        window.util.isEscEvent(evt, closeBigPicture);
      }

      function closeBigPicture() {
        newCommentsLoadButton.classList.remove('hidden');
        bodyBlock.classList.remove('modal-open');
        userBigPictureDialog.classList.add('hidden');
        document.removeEventListener('keydown', onBigPictureEscPress);
        newCommentsLoadButton.removeEventListener('click', renderNewComments);
      }
    }
  }

  window.preview = preview;

})();
