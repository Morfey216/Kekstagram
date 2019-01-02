'use strict';

(function () {

  var filterBlock = document.querySelector('.img-filters');

  filterBlock.classList.remove('img-filters--inactive');

  var filtersButtons = filterBlock.querySelectorAll('.img-filters__button');
  var filterPopular = filterBlock.querySelector('#filter-popular');
  var filterNew = filterBlock.querySelector('#filter-new');
  var filterDiscussed = filterBlock.querySelector('#filter-discussed');

  var filterNotActivated = true;
  var NUMBER_OF_NEW_IMAGES = 10;

  function filtration() {
    if (filterNotActivated) {
      var defaultPicturesKit = window.usersPictures;
      filterNotActivated = false;
    }

    filterPopular.addEventListener('click', function () {
      window.usersPictures = defaultPicturesKit;
      clearActiveFilterButton();
      filterPopular.classList.add('img-filters__button--active');
      drawFilteredPictures();
    });

    filterNew.addEventListener('click', function () {
      window.usersPictures = getNewPictures(defaultPicturesKit.slice());
      clearActiveFilterButton();
      filterNew.classList.add('img-filters__button--active');
      drawFilteredPictures();
    });

    filterDiscussed.addEventListener('click', function () {
      window.usersPictures = getDiscussedPictures(defaultPicturesKit.slice());
      clearActiveFilterButton();
      filterDiscussed.classList.add('img-filters__button--active');
      drawFilteredPictures();
    });
  }

  function drawFilteredPictures() {
    var pictures = document.querySelectorAll('.picture');

    pictures.forEach(function (picture) {
      document.querySelector('.pictures').removeChild(picture);
    });

    window.drawPictures(window.usersPictures);
    window.preview();
  }

  function getNewPictures(allPictures) {
    var indexNewPicture;
    var newPictures = [];

    for (var i = 0; i < NUMBER_OF_NEW_IMAGES; i++) {
      indexNewPicture = window.util.getIndexFromRange(0, allPictures.length);
      newPictures.push(allPictures[indexNewPicture]);
      allPictures.splice(indexNewPicture, 1);
    }

    return newPictures;
  }

  function getDiscussedPictures(allPictures) {
    return allPictures.sort(compareNumberOfComments);
  }

  function compareNumberOfComments(first, second) {
    return second.comments.length - first.comments.length;
  }

  function clearActiveFilterButton() {
    filtersButtons.forEach(function (filterButton) {
      filterButton.classList.remove('img-filters__button--active');
    });
  }

  window.filtration = filtration;

})();
