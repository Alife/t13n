
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

(function(){
var bookmarkletsmanager = {};
bookmarkletsmanager.DEFINITION_TEMPLATE = "javascript:(@BMNAME@=window.@BMNAME@||@BMDEF@)(@BMARGS@)";
bookmarkletsmanager.getDefinition = function(bookmarkletName, bookmarkletArgs) {
  var template = bookmarkletsmanager.DEFINITION_TEMPLATE;
  return template.replace(/@BMNAME@/g, bookmarkletName).replace(/@BMDEF@/g, String(window[bookmarkletName].define)).replace(/@BMARGS@/g, bookmarkletArgs)
};
bookmarkletsmanager.createBookmarklet = function(anchorId, bookmarkletName) {
  var args = [];
  for(var i = 2;i < arguments.length;i++)args.push("'" + String(arguments[i]).replace("'", "\\'") + "'");
  var bookmarkletArgs = args.join(",");
  document.getElementById(anchorId).href = bookmarkletsmanager.getDefinition(bookmarkletName, bookmarkletArgs)
};
window["bookmarkletsmanager"] = bookmarkletsmanager;
})();
