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
    var $parent = $(parentNode);
    var buttonHtml = '';

    buttonHtml += '<a class="dtrt-download-button" href="' + imgSrc + '" target="_blank">';
    buttonHtml += '<span>Open photo in new tab</span>';
    buttonHtml += '</a>';

    if (! $parent.find('.dtrt-download-button').length) {
      $parent.append(buttonHtml);
    }
  };

  /**
   * @function _watchForTmtPhotoEnlargement
   * @summary When the photo display modal appears, and a download button.
   * @memberof TmtPhotoDownloadButton
   * @protected
   *
   * @param {external:jQuery} $elements - Elements to watch
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
          var imgRegx = new RegExp(/https:\/\/trackmytour.com\/img\/standard/);

          // background images (gallery)

          if ((tag === 'DIV') && (attr === 'class')) {

            var classRegx = /v-image__image/;

            if (target.className.match(classRegx)) {

              if (target.style.backgroundImage && target.style.backgroundImage.match(imgRegx)) {
                var parent = target.parentNode;
                var img = target.style.backgroundImage;
                img = img.replace('url("', '');
                img = img.replace('?scale=1")', '');

                _addDownloadButton(parent, img);
              }
            }
          }

          // inline images

          if ((tag === 'IMG') && (attr === 'src')) {
            if (target.src.match(imgRegx)) {
              var parent = mutationRecord.target.parentNode;
              var img = target.src;

              _addDownloadButton(parent, img);
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
