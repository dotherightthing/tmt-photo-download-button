/**
 * @file TMT Photo Download Button
 * @author dan@dotherightthing.co.nz
 */

/**
 * jQuery object
 *
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/}
 */

/**
 * @namespace TmtPhotoDownloadButton
 */
var TmtPhotoDownloadButton = (function () {
  'use strict';

  /**
   * @function _addDownloadButton
   * @summary Add a download button.
   * @memberof TmtPhotoDownloadButton
   * @protected
   *
   * @param {external:jQuery} parentNode - Node to append the button to
   * @param {string} imgSrc - Path to image
   */
  var _addDownloadButton = function (parentNode, imgSrc) {
    var downloadLink = document.createElement('a');

    downloadLink.setAttribute('class', 'dtrt-download-button');
    parentNode.appendChild(downloadLink);

    var $button = $('.dtrt-download-button');

    $button.attr({
      href: imgSrc,
      target: '_blank'
    });


    $button.append('<span>Open photo in new tab</span>');

  };

  /**
   * @function _watchForTmtPhotoEnlargement
   * @summary When the photo display modal appears, and a download button.
   * @memberof TmtPhotoDownloadButton
   * @protected
   *
   * @param {external:jQuery} $elements - Elements to watch
   * @todo Fix multiple download buttons being displayed on top of first gallery image
   * @todo Fix broken gallery URL - 
   * https://trackmytour.com/url(%22https:/trackmytour.com/img/standard/889183b3-d1dd-4aeb-a353-670aa5854777/?scale=1%22%29
   */
  var _watchForTmtPhotoEnlargement = function ($elements) {

    // The mutations to observe
    // https://stackoverflow.com/a/40195712/6850747

    // innerHTML
    // var config = { characterData: true, attributes: false, childList: false, subtree: true };

    // textContent
    // var config = { characterData: false, attributes: false, childList: true, subtree: false };

    var config = {
      attributes: true,
      attributesFilter: ['class'],
      characterData: false,
      childList: false,
      subtree: true,
    };

    var callback = function (mutationsList) {

      // wait for the image modal
      // because only this contains the 'standard' (large) size
      // though this appears to be compressed
      // perhaps there is also an original size available somewhere
        
      $.each(mutationsList, function (i) {
        var mutationRecord = mutationsList[i];

        if (mutationRecord.type === 'attributes') {
          var target = mutationRecord.target;
          var tag = target.tagName; // img / mutationRecord.target
          var attr = mutationRecord.attributeName;
          var regx = new RegExp(/https:\/\/trackmytour.com\/img\/standard/);

          // background-image: url("https://trackmytour.com/img/standard/5bf0bbb6-864b-4c75-b7b8-0aa5767a464e/?scale=1"); background-position: center center;

          // background images (gallery)

          // div.v-image__image.v-image__image--contain
          if ((tag === 'DIV') && (attr === 'class')) {

            if (target.classList[0] === 'v-image__image') {

              if (target.style.backgroundImage && target.style.backgroundImage.match(regx)) {
                var parent = mutationRecord.target.parentNode;

                _addDownloadButton(parent, target.style.backgroundImage);
              }
            }
          }

          // inline images

          if ((tag === 'IMG') && (attr === 'src')) {
            if (target.src.match(regx)) {
              var parent = mutationRecord.target.parentNode;

              _addDownloadButton(parent, target.src);
            }
          }
        }
      });
    };

    $elements.each(function () {
      var $element = $(this);

      // The node that will be observed for mutations
      var targetNode = $element.get(0);

      // Create an observer instance with a callback function
      var observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

      // Later, you can stop observing
      // observer.disconnect();
    });
  };

  /**
   * @function init
   * @summary Initialise the app.
   * @memberof TmtPhotoDownloadButton
   * @public
   */
  var init = function () {
    _watchForTmtPhotoEnlargement($('[data-app]'));
  };

  return {
    init: init,
  };
}());

TmtPhotoDownloadButton.init();
