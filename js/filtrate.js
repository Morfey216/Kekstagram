'use strict';

(function () {
  var NUMBER_OF_NEW_IMAGES = 10;
  var filterBlock = document.querySelector('.img-filters');
  var filterButtons = filterBlock.querySelectorAll('.img-filters__button');
  var filterNotActivated = true;

  function filtrate() {
    if (filterNotActivated) {
      var defaultPicturesKit = window.usersPictures;
      filterNotActivated = false;
    }

    filterBlock.classList.remove('img-filters--inactive');

    filterButtons.forEach(initFilterButton);

    function initFilterButton(filterButton) {
      filterButton.addEventListener('click', onFilterButtonClick);

      function onFilterButtonClick() {
        switch (filterButton.id) {
          case 'filter-popular':
            window.usersPictures = defaultPicturesKit;
            break;
          case 'filter-new':
            window.usersPictures = getNewPictures(defaultPicturesKit.slice());
            break;
          case 'filter-discussed':
            window.usersPictures = getDiscussedPictures(defaultPicturesKit.slice());
            break;
        }
        clearActiveFilterButton();
        filterButton.classList.add('img-filters__button--active');
        window.debounce(drawFilteredPictures);
      }
    }
  }

  function drawFilteredPictures() {
    var picturesBlock = document.querySelector('.pictures');
    var pictures = picturesBlock.querySelectorAll('.picture');

    pictures.forEach(function (picture) {
      picturesBlock.removeChild(picture);
    });

    window.drawPictures(window.usersPictures);
    window.preview();
  }

  function getNewPictures(allPictures) {
    var indexNewPicture;
    var newPictures = [];

    for (var i = 0; i < NUMBER_OF_NEW_IMAGES; i++) {
      indexNewPicture = getIndexFromRange(0, allPictures.length);
      newPictures.push(allPictures.splice(indexNewPicture, 1)[0]);
    }

    return newPictures;
  }

  function getIndexFromRange(minIndex, maxIndex) {
    return Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
  }

  function getDiscussedPictures(allPictures) {
    return allPictures.sort(compareNumberOfComments);
  }

  function compareNumberOfComments(first, second) {
    var result = second.comments.length - first.comments.length;
    if (result === 0) {
      result = second.likes - first.likes;
    }
    return result;
  }

  function clearActiveFilterButton() {
    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove('img-filters__button--active');
    });
  }

  window.filtrate = filtrate;

})();
