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
   * @function _addMutationObserver
   * @summary Detect when an element changes, and run a callback.
   * @memberof TmtPhotoDownloadButton
   * @protected
   *
   * @param {external:jQuery} $elements - Elements to watch
   * @param {string} mutationType - Mutation type (attributes|characterData|childList)
   * @param {string} attribute - Specific attribute name
   * @returns {object} mutationObserver
   */
  var _addMutationObserver = function ($elements, mutationType, attribute) {

    // The mutations to observe
    var config = {
      attributes: (mutationType === 'attributes'),
      attributeOldValue: (mutationType === 'attributes'),
      childList: (mutationType === 'childList'),
      subtree: (mutationType === 'childList'),
    };

    $elements.each(function () {
      var $element = $(this);

      // The node that will be observed for mutations
      var targetNode = $element.get(0);

      // Create an observer instance with a callback function
      var observer = new MutationObserver(function (mutationsList, observer) {
        $.each(mutationsList, function (i) {
          var mutation = mutationsList[i];

          if (mutation.type === mutationType) {
            if ((mutationType === 'attributes') && (typeof attribute !== 'undefined') && (mutation.attributeName === attribute)) {
              // debugger;
            } else {
              // debugger;
            }
          }
        });
      });

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

      // Later, you can stop observing
      // observer.disconnect();
    });
  };

  /**
   * @function appendText
   * @summary Append text to an element
   * @memberof TmtPhotoDownloadButton
   * @public
   *
   * @param {string} elementSelector - CSS element selector
   * @param {string} text - Text to append
   */
  var appendText = function (elementSelector, text) {
    try {
      var $el = $(elementSelector);
      var oldText = $el.text;

      $el.text(oldText + text);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * @function detectPhotoViewerLaunched
   * @summary Detect when a photo is open in the photo viewer modal.
   * @memberof TmtPhotoDownloadButton
   * @public
   *
   * @param {string} elementSelector - CSS element selector
   * @param {string} text - Text to append
   */
  var detectPhotoViewerLaunched = function () {
    _addMutationObserver($('[data-app]'), 'childList');
  };

  return {
    appendText: appendText,
    detectPhotoViewerLaunched: detectPhotoViewerLaunched
  };
}());

// massive timeout to allow vuetify to set up
setTimeout(function () {
  TmtPhotoDownloadButton.detectPhotoViewerLaunched();
  // TmtPhotoDownloadButton.appendText('h1', '!!!');
}, 5000);
