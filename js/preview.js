'use strict';

(function () {
  var COMMENTS_INTERVAL = 5;
  var AVATAR_WIDTH = 35;
  var AVATAR_HEIGHT = 35;

  function preview() {
    var allSmallPictures = document.querySelectorAll('.picture');

    allSmallPictures.forEach(initSmallPictures);

    function initSmallPictures(smallPicture) {
      smallPicture.addEventListener('click', function (evt) {
        showCurrentPicture(evt);
      });

      smallPicture.addEventListener('keydown', function (evt) {
        evt.preventDefault();
        window.util.isEnterEvent(evt, showCurrentPicture);
      });

      function showCurrentPicture(evt) {
        drawBigPicture(evt.currentTarget.getAttribute('data-picture-position'));
      }
    }
  }

  function drawBigPicture(numberPicture) {
    var userBigPictureDialog = document.querySelector('.big-picture');
    var socialComments = userBigPictureDialog.querySelector('.social__comments');
    var commentsLoader = userBigPictureDialog.querySelector('.comments-loader');
    var startIndexOfComment = 0;

    renderGeneralInformation();
    clearComments();
    getNewComments();
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

    function getNewComments() {
      var commentFragment = document.createDocumentFragment();
      var endIndexOfComment = startIndexOfComment + COMMENTS_INTERVAL;

      if (endIndexOfComment >= window.usersPictures[numberPicture].comments.length) {
        endIndexOfComment = window.usersPictures[numberPicture].comments.length;
        commentsLoader.classList.add('hidden');
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
      var closeButton = userBigPictureDialog.querySelector('.big-picture__cancel');

      bodyBlock.classList.add('modal-open');
      userBigPictureDialog.classList.remove('hidden');

      document.addEventListener('keydown', onKeydown);
      closeButton.addEventListener('click', onCloseButtonClick);
      closeButton.addEventListener('keydown', onCloseButtonKeydown);
      commentsLoader.addEventListener('click', onCommentsLoaderClick);

      function onKeydown(evt) {
        window.util.isEscEvent(evt, closeBigPicture);
      }

      function onCloseButtonClick() {
        closeBigPicture();
      }

      function onCloseButtonKeydown(evt) {
        window.util.isEnterEvent(evt, closeBigPicture);
      }

      function onCommentsLoaderClick() {
        getNewComments();
      }

      function closeBigPicture() {
        commentsLoader.classList.remove('hidden');
        bodyBlock.classList.remove('modal-open');
        userBigPictureDialog.classList.add('hidden');

        document.removeEventListener('keydown', onKeydown);
        closeButton.removeEventListener('click', onCloseButtonClick);
        closeButton.removeEventListener('keydown', onCloseButtonKeydown);
        commentsLoader.removeEventListener('click', onCommentsLoaderClick);
      }
    }
  }

  window.preview = preview;

})();
