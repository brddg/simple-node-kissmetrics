(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.kissmetrics = {});
})(this, function (exports) {
  'use strict';

  var loaded = false;
  var key = null;
  var injectedDoc = null;
  var context = getGlobalContext();

  /**
   * Set the KISSmetrics API key
   *
   * @param newquay
   */
  function setKey(newquay) {
    key = newquay;
  }

  /**
   * Set the document, only used for passing
   * in a mock for testing.
   *
   * @param newDocument
   */
  function setDocument(newDocument) {
    injectedDoc = newDocument;
  }

  /**
   * Get the document.  Allows us to inject a mock document
   * for testing outside a browser env.
   *
   * @returns {*|HTMLDocument}
   */
  function getDocument() {
    return injectedDoc || document;
  }

  /**
   * KISSmetrics library requires a _kmq and _kmk variable
   * on the window.  This function allows us to test this
   * module outside of a browser environment.
   *
   * @returns {*}
   */
  function getGlobalContext() {
    if (typeof window !== 'undefined') {
      return window;
    }
    if (typeof global !== 'undefined') {
      return global;
    }
    return {};
  }

  /**
   * Load KISSmetrics scripts from their site.
   *
   * @param source
   */
  function loadExternalScript(source) {
    setTimeout(function () {
      var documentObj = getDocument();
      var firstScript = documentObj.getElementsByTagName('script')[0];
      var element = documentObj.createElement('script');
      element.type = 'text/javascript';
      element.async = true;
      element.src = source;
      firstScript.parentNode.insertBefore(element, firstScript);
    }, 1);
  }

  /**
   * Initial load of KISSmetrics
   */
  function setup() {
    if (loaded) {
      return;
    }

    if (!key) {
      console.error('No key set for KISSmetrics, use setKey method to define it.');
      return;
    }

    context._kmq = context._kmq || [];
    context._kmk = context._kmk || key;
    loadExternalScript('//i.kissmetrics.com/i.js');
    loadExternalScript('//scripts.kissmetrics.com/' + key + '.2.js');

    loaded = true;
  }

  /**
   * Track an event in KISSmetrics
   * @param name
   * @param eventProps
   */
  function trackEvent(name, eventProps) {
    setup();
    context._kmq.push(['record', name, eventProps]);
  }

  /**
   * Set a user property in KISSmetrics
   *
   * @param userProps
   */
  function setUserProperties(userProps) {
    setup();
    context._kmq.push(['set', userProps]);
  }

  /**
   * Set an identity in KISSmetrics
   *
   * @param userProps
   */
  function identify(identity) {
    setup();
    context._kmq.push(['identify', identity]);
  }

  /**
   * Clear an identity in KISSmetrics
   */
  function clearIdentity(identity) {
    setup();
    context._kmq.push(['clearIdentity']);
  }

  var index = {
    trackEvent: trackEvent, setKey: setKey, setUserProperties: setUserProperties, setup: setup, identify: identify, clearIdentity: clearIdentity
  };

  exports.setKey = setKey;
  exports.setDocument = setDocument;
  exports.setup = setup;
  exports.trackEvent = trackEvent;
  exports.setUserProperties = setUserProperties;
  exports.identify = identify;
  exports.clearIdentity = clearIdentity;
  exports['default'] = index;
});