'use strict';

(function () {
  var COMMENTS_INTERVAL = 5;
  var AVATAR_WIDTH = 35;
  var AVATAR_HEIGHT = 35;

  function preview() {
    var allSmallPictures = document.querySelectorAll('.picture');

    allSmallPictures.forEach(initSmallPictures);

    function initSmallPictures(smallPicture) {
      smallPicture.addEventListener('click', onShowCurrentPicture);

      smallPicture.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, onShowCurrentPicture);
      });

      function onShowCurrentPicture(evt) {
        drawBigPicture(evt.currentTarget.getAttribute('data-picture-position'));
      }
    }
  }

  function drawBigPicture(numberPicture) {
    var userBigPictureDialog = document.querySelector('.big-picture');
    var socialComments = userBigPictureDialog.querySelector('.social__comments');
    var newCommentsLoadButton = userBigPictureDialog.querySelector('.comments-loader');
    var startIndexOfComment = 0;

    renderGeneralInformation();
    clearComments();
    onGetNewComments();
    showBigPicture();


    function renderGeneralInformation() {
      userBigPictureDialog.querySelector('.big-picture__img img').src = window.usersPictures[numberPicture].url;
      userBigPictureDialog.querySelector('.social__caption').textContent = window.usersPictures[numberPicture].description;
      userBigPictureDialog.querySelector('.likes-count').textContent = window.usersPictures[numberPicture].likes;
      userBigPictureDialog.querySelector('.comments-count').textContent = window.usersPictures[numberPicture].comments.length;
    }

    function clearComments() {
      while (socialComments.firstChild) {
        socialComments.removeChild(socialComments.firstChild);
      }
    }

    function onGetNewComments() {
      var commentFragment = document.createDocumentFragment();
      var endIndexOfComment = startIndexOfComment + COMMENTS_INTERVAL;

      if (endIndexOfComment >= window.usersPictures[numberPicture].comments.length) {
        endIndexOfComment = window.usersPictures[numberPicture].comments.length;
        newCommentsLoadButton.classList.add('hidden');
      }

      window.usersPictures[numberPicture].comments.slice(startIndexOfComment, endIndexOfComment).forEach(renderNewComment);
      userBigPictureDialog.querySelector('.social__comment-count').firstChild.textContent = endIndexOfComment + ' из ';
      startIndexOfComment = endIndexOfComment;
      socialComments.appendChild(commentFragment);

      function renderNewComment(commentData) {
        var newComment = document.createElement('li');
        newComment.className = 'social__comment';
        newComment.appendChild(getImg());
        newComment.appendChild(getParagraph());

        commentFragment.appendChild(newComment);

        function getImg() {
          var img = document.createElement('img');
          img.className = 'social__picture';
          img.src = commentData.avatar;
          img.alt = 'Аватар комментатора фотографии';
          img.width = AVATAR_WIDTH;
          img.height = AVATAR_HEIGHT;
          return img;
        }

        function getParagraph() {
          var paragraph = document.createElement('p');
          paragraph.className = 'social__text';
          paragraph.textContent = commentData.message;
          return paragraph;
        }
      }
    }

    function showBigPicture() {
      var bodyBlock = document.querySelector('body');
      var userBigPictureClose = userBigPictureDialog.querySelector('.big-picture__cancel');

      bodyBlock.classList.add('modal-open');
      userBigPictureDialog.classList.remove('hidden');
      document.addEventListener('keydown', onBigPictureEscPress);
      newCommentsLoadButton.addEventListener('click', onGetNewComments);
      userBigPictureClose.addEventListener('click', onCloseBigPicture);

      userBigPictureClose.addEventListener('keydown', function (evt) {
        window.util.isEnterEvent(evt, onCloseBigPicture);
      });

      function onBigPictureEscPress(evt) {
        window.util.isEscEvent(evt, onCloseBigPicture);
      }

      function onCloseBigPicture() {
        newCommentsLoadButton.classList.remove('hidden');
        bodyBlock.classList.remove('modal-open');
        userBigPictureDialog.classList.add('hidden');
        document.removeEventListener('keydown', onBigPictureEscPress);
        newCommentsLoadButton.removeEventListener('click', onGetNewComments);
      }
    }
  }

  window.preview = preview;

})();
