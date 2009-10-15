
// Copyright 2009 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// you may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function(){var bookmarklet = {};
bookmarklet.loadScript = function(id, src, opt_scriptLoadedCheck, opt_onScriptLoad) {
  if(!document.getElementById(id)) {
    var s = document.createElement("script");
    s.id = id;
    s.type = "text/javascript";
    s.src = src;
    bookmarklet.getHead(document).appendChild(s);
    if(opt_scriptLoadedCheck)bookmarklet.waitForScriptLoad(opt_scriptLoadedCheck, opt_onScriptLoad || bookmarklet.nullFunction);
    return true
  }return false
};
bookmarklet.nullFunction = function() {
};
bookmarklet.getHead = function(ownerDocument) {
  var head = ownerDocument.getElementsByTagName("head")[0];
  if(!head)head = ownerDocument.appendChild(ownerDocument.createElement("head"));
  return head
};
bookmarklet.waitForScriptLoad = function(scriptLoadedCheck, onScriptLoad) {
  var setIntervalId = window.setInterval(function() {
    var r = eval(scriptLoadedCheck);
    if(r) {
      window.clearInterval(setIntervalId);
      onScriptLoad()
    }
  }, 50)
};
bookmarklet.loadCSS = function(id, src, ownerDocument) {
  if(!ownerDocument.getElementById(id)) {
    var s = ownerDocument.createElement("link");
    s.id = id;
    s.type = "text/css";
    s.rel = "stylesheet";
    s.href = src;
    bookmarklet.getHead(ownerDocument).appendChild(s)
  }
};
bookmarklet.lastTimeoutId = null;
bookmarklet.showStatus = function(statusId, message, opt_timeToShow) {
  if(!document.body)return false;
  var statusLabel = document.getElementById(statusId);
  if(!statusLabel) {
    statusLabel = document.createElement("span");
    statusLabel.id = statusId;
    document.body.appendChild(statusLabel)
  }var isIE = navigator.userAgent.indexOf("MSIE") != -1;
  var position = isIE ? "absolute" : "fixed";
  statusLabel.style.cssText = "z-index: 99; font-size: 14px; font-weight: bold; " + "padding: 4px 6px 4px 6px; background: #FFF1A8; " + "position: " + position + "; top: 0";
  statusLabel.innerHTML = message;
  var docClientWidth = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
  statusLabel.style.left = (docClientWidth - statusLabel.clientWidth) / 2 + "px";
  if(bookmarklet.lastTimeoutId) {
    window.clearTimeout(bookmarklet.lastTimeoutId);
    bookmarklet.lastTimeoutId = null
  }if(opt_timeToShow)bookmarklet.lastTimeoutId = window.setTimeout(function() {
    bookmarklet.clearStatus(statusId)
  }, opt_timeToShow);
  return true
};
bookmarklet.clearStatus = function(statusId) {
  var statusElement = document.getElementById(statusId);
  if(statusElement) {
    statusElement.parentNode.removeChild(statusElement);
    return true
  }else return false
};
bookmarklet.getProtocol = function() {
  var protocol = window.location.protocol;
  return protocol == "https:" ? "https:" : "http:"
};
bookmarklet.getParameter = function(url, name) {
  if(url) {
    var regex = new RegExp("[?&]" + name + "=([^&#]*)");
    var result = regex.exec(url);
    if(result)return result[1]
  }return null
};
bookmarklet.hasActiveElementSupport = function() {
  return typeof document.activeElement != "undefined"
};
bookmarklet.getActiveField = function(opt_doc) {
  var doc = opt_doc || window.document;
  var activeElement;
  try {
    activeElement = doc.activeElement
  }catch(e) {
    return null
  }if(!activeElement)return null;
  if(bookmarklet.isEditableElement(activeElement))return activeElement;
  var iframes = doc.getElementsByTagName("iframe");
  for(var i = 0;i < iframes.length;i++)try {
    var iframe = iframes[i];
    var iframeDocument = iframe.contentWindow.document;
    if(!iframeDocument)continue;
    if((iframeDocument.designMode.toUpperCase() == "ON" || iframeDocument.body.contentEditable.toUpperCase() == "TRUE") && iframeDocument.hasFocus())return iframe;
    var iframeActiveField = bookmarklet.getActiveField(iframeDocument);
    if(iframeActiveField)return iframeActiveField
  }catch(e) {
  }return null
};
bookmarklet.isEditableElement = function(element) {
  var elementName = element.tagName.toUpperCase();
  var iframedoc;
  return elementName == "TEXTAREA" || elementName == "INPUT" && element.type.toUpperCase() == "TEXT" || elementName == "DIV" && element.contentEditable.toUpperCase() == "TRUE" || elementName == "IFRAME" && (iframedoc = element.contentWindow.document) && (iframedoc.designMode.toUpperCase() == "ON" || iframedoc.body.contentEditable.toUpperCase() == "TRUE")
};
bookmarklet.contains = function(arr, element) {
  for(var i = 0;i < arr.length;i++)if(arr[i] === element)return true;
  return false
};var t13nBookmarklet = {};
t13nBookmarklet.NAME = "t13nb";
t13nBookmarklet.SCRIPT_BASE_URL = "http://t13n.googlecode.com/svn/trunk/blet/";
t13nBookmarklet.CSS_BASE_URL = t13nBookmarklet.SCRIPT_BASE_URL;
t13nBookmarklet.IMAGE_BASE_URL = "http://t13n.googlecode.com/files/";
t13nBookmarklet.SCRIPT_URL = t13nBookmarklet.SCRIPT_BASE_URL + "rt13n.js";
t13nBookmarklet.SCRIPT_ID = "t13ns";
t13nBookmarklet.STATUS_ID = "t13n";
t13nBookmarklet.MESSAGE_LOADING = "Loading Google Transliteration";
t13nBookmarklet.MESSAGE_STILL_LOADING = "Still loading Google Transliteration";
t13nBookmarklet.MESSAGE_LOADED = "Google Transliteration loaded";
t13nBookmarklet.MESSAGE_ENABLED = "Google Transliteration is enabled. " + "To disable, click on the bookmarklet again";
t13nBookmarklet.MESSAGE_DISABLED = "Google Transliteration has been disabled. " + "To enable, click on the bookmarklet again";
t13nBookmarklet.MESSAGE_NOT_SUPPORTED = "Your browser is not supported. " + "Supported on Chrome 2+/Safari 4+/IE 6+/FF 3+";
t13nBookmarklet.MESSAGE_USAGE = "Google Transliteration is enabled. " + "Click on any input field to start using it";t13nBookmarklet.initialized = false;
t13nBookmarklet.loadURL = null;
t13nBookmarklet.lang = null;
t13nBookmarklet.control = null;
t13nBookmarklet.backgroundTimerId = null;
t13nBookmarklet.registeredElements = [];
t13nBookmarklet.CSS_ID = "t13nCSS";
t13nBookmarklet.CSS_URL = t13nBookmarklet.CSS_BASE_URL + "api.css";
t13nBookmarklet.KEYBOARD_SHORTCUT = navigator.platform.toLowerCase().indexOf("mac") != -1 ? "Meta+G" : "Ctrl+G";
t13nBookmarklet.initBookmarklet = function() {
  bookmarklet.showStatus(t13nBookmarklet.STATUS_ID, t13nBookmarklet.MESSAGE_LOADING);
  var t13nScript = document.getElementById(t13nBookmarklet.SCRIPT_ID);
  if(t13nScript) {
    t13nBookmarklet.loadURL = t13nScript.src;
    t13nBookmarklet.lang = bookmarklet.getParameter(t13nBookmarklet.loadURL, "l")
  }window[t13nBookmarklet.NAME] = t13nBookmarklet.toggle;
  if(!bookmarklet.hasActiveElementSupport()) {
    bookmarklet.showStatus(t13nBookmarklet.STATUS_ID, t13nBookmarklet.MESSAGE_NOT_SUPPORTED, 5000);
    return
  }bookmarklet.loadScript("t13nJSAPIScript", bookmarklet.getProtocol() + "//www.google.com/jsapi", "window.google && google.load", function() {
    google.load("elements", "1", {packages:"transliteration", nocss:true, callback:function() {
      t13nBookmarklet.initialized = true;
      bookmarklet.showStatus(t13nBookmarklet.STATUS_ID, t13nBookmarklet.MESSAGE_LOADED, 5000);
      if(t13nBookmarklet.lang)t13nBookmarklet.toggle()
    }})
  })
};
t13nBookmarklet.toggle = function(opt_lang) {
  var tbns = t13nBookmarklet;
  tbns.lang = opt_lang || tbns.lang || "hi";
  if(!bookmarklet.hasActiveElementSupport()) {
    bookmarklet.showStatus(tbns.STATUS_ID, tbns.MESSAGE_NOT_SUPPORTED, 5000);
    return
  }if(!tbns.initialized) {
    bookmarklet.showStatus(tbns.STATUS_ID, tbns.MESSAGE_STILL_LOADING);
    return
  }if(!google.elements.transliteration.isBrowserCompatible()) {
    bookmarklet.showStatus(tbns.STATUS_ID, tbns.MESSAGE_NOT_SUPPORTED, 5000);
    return
  }var tns = google.elements.transliteration;
  var translitControlClass = tns.TransliterationControl;
  if(!tbns.control) {
    var options = {sourceLanguage:tns.LanguageCode.ENGLISH, destinationLanguage:tbns.lang, shortcutKey:tbns.KEYBOARD_SHORTCUT, transliterationEnabled:false};
    tbns.control = new translitControlClass(options);
    tbns.control.addEventListener(translitControlClass.EventType.STATE_CHANGED, tbns.setElementStyle, tbns.control)
  }tbns.control.setLanguagePair(tns.LanguageCode.ENGLISH, tbns.lang);
  if(tbns.control.isTransliterationEnabled()) {
    window.clearInterval(t13nBookmarklet.backgroundTimerId);
    t13nBookmarklet.backgroundTimerId = null
  }else t13nBookmarklet.backgroundTimerId = window.setInterval(t13nBookmarklet.activeElementEnabler, 250);
  tbns.control.toggleTransliteration()
};
t13nBookmarklet.activeElementEnabler = function() {
  var tbns = t13nBookmarklet;
  if(!tbns.control.isTransliterationEnabled())return;
  var activeField = bookmarklet.getActiveField();
  if(!activeField)return;
  if(!bookmarklet.contains(tbns.registeredElements, activeField))try {
    activeField.style.paddingLeft = 0;
    activeField.style.paddingRight = 0;
    var contentWidth = activeField.clientWidth;
    activeField.style.paddingLeft = "";
    activeField.style.paddingRight = "";
    activeField.setAttribute("t13nContentWidth", contentWidth);
    bookmarklet.loadCSS(t13nBookmarklet.CSS_ID, t13nBookmarklet.CSS_URL, activeField.ownerDocument);
    try {
      tbns.control.makeTransliteratable([activeField])
    }catch(e) {
    }tbns.registeredElements.push(activeField);
    tbns.control.enableTransliteration();
    t13nBookmarklet.setElementStyle()
  }catch(e) {
  }
};
t13nBookmarklet.setElementStyle = function() {
  var tbns = t13nBookmarklet;
  for(var i = 0;i < tbns.registeredElements.length;i++) {
    var element = tbns.registeredElements[i];
    if(!element.parentNode)continue;
    var oldOffsetWidth = element.offsetWidth;
    element.style.backgroundImage = 'url("' + tbns.IMAGE_BASE_URL + tbns.lang + "_" + (tbns.control.isTransliterationEnabled() ? "e" : "d") + '.gif")';
    element.style.backgroundRepeat = "no-repeat";
    if(tbns.lang == "ar" || tbns.lang == "fa" || tbns.lang == "ur") {
      element.style.backgroundPosition = "100% 0%";
      element.style.paddingRight = "20px"
    }else {
      element.style.backgroundPosition = "0% 0%";
      element.style.paddingLeft = "20px"
    }var newOffsetWidth = element.offsetWidth;
    var contentWidth = parseInt(element.getAttribute("t13nContentWidth"));
    if(oldOffsetWidth != newOffsetWidth) {
      var boxSizeDifference = newOffsetWidth - oldOffsetWidth;
      element.style.width = contentWidth - boxSizeDifference + "px"
    }
  }if(tbns.control.isTransliterationEnabled())bookmarklet.showStatus(tbns.STATUS_ID, bookmarklet.getActiveField() ? tbns.MESSAGE_ENABLED : tbns.MESSAGE_USAGE, 3000);
  else bookmarklet.showStatus(tbns.STATUS_ID, tbns.MESSAGE_DISABLED, 3000)
};
t13nBookmarklet.initBookmarklet();})();
