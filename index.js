var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");

// --- BUTTON
// Manage calls from button
var button = buttons.ActionButton({
  id: "alldebrid-this",
  label: "Send this tab to AllDebrid",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: goToDebridFromButton
});
function goToDebridFromButton(state) {
    tabs.open("http://www.alldebrid.com/service/?url=" + tabs.activeTab.url);
}


// --- MENU
// Manage calls on links from menu 
var menuItem = contextMenu.Item({
  label: "Send this Link to AllDebrid",
  context: [contextMenu.SelectorContext('a[href]'), contextMenu.PredicateContext(isNotMagnet)] ,
  contentScript: "self.on('click', function (node, data) {" +
                 "self.postMessage(node.href);" +
                 "});",
  image: self.data.url("icon-16.png"),
  onMessage: function (url) {
    goToDebridFromMenu(url);
  }
});


// Manage calls on text from menu 
var menuItem = contextMenu.Item({
  label: "Send this Text to AllDebrid",
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

// Manage calls on magnets from menu 
var { MatchPattern } = require("sdk/util/match-pattern");
var isMagnetPattern = new MatchPattern(/^magnet.*/);
function isMagnet(context){
  return isMagnetPattern.test(context.linkURL);
}
function isNotMagnet(context){
  return !isMagnetPattern.test(context.linkURL);
}
var menuItem = contextMenu.Item({
  label: "Send this Torrent to AllDebrid",
  context: contextMenu.PredicateContext(isMagnet),
  contentScript: "self.on('click', function (node, data) {" +
                 "self.postMessage(node.href||node.parentNode.href);" +
                 "});",
  image: self.data.url("icon-16.png"),
  onMessage: function (url) {
    console.log(url);
    goToDebridFromMenu(url);
  }
});

var magnetURL = "";
function goToDebridFromMenu(url) {
  if (isMagnetPattern.test(url)){
    magnetURL = url;
    tabs.open({
      url: "http://www.alldebrid.com/torrent/",
      onReady: injectMagnet
    });
  }
  else{
    tabs.open("http://www.alldebrid.com/service/?url=" + encodeURI(url));
  }
}
function injectMagnet(tab) {
  tab.attach({
    contentScript: "var x = document.getElementsByName('magnet')[0]; if(x!=null){x.value='"+magnetURL+"';}"
  });
}