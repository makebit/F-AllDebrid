var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");


// Manage calls from button
var button = buttons.ActionButton({
  id: "alldebrid-this",
  label: "Send to AllDebrid this tab",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: goToDebridFromButton
});

function goToDebridFromButton(state) {
    tabs.open("http://www.alldebrid.it/service/?url=" + tabs.activeTab.url);
}


// Manage calls on links from menu 
var menuItem = contextMenu.Item({
  label: "Send to AllDebrid",
  context: contextMenu.SelectorContext('a[href]') ,
  contentScript: "self.on('click', function (node, data) {" +
                 "self.postMessage(node.href);" +
                 "});",
  image: self.data.url("icon-16.png"),
  onMessage: function (url) {
    goToDebridFromMenu(url);
    console.log(url);
  }
});

function goToDebridFromMenu(url) {
    tabs.open("http://www.alldebrid.it/service/?url=" + encodeURI(url));
}


// Manage calls on text
var menuItem = contextMenu.Item({
  label: "Send to AllDebrid",
  context: contextMenu.SelectionContext(),
  contentScript: 'self.on("click", function () {' +
                 '  var text = window.getSelection().toString();' +
                 '  self.postMessage(text);' +
                 '});',
  image: self.data.url("icon-16.png"),
  onMessage: function (url) {
    goToDebridFromMenu(url);
  }
});