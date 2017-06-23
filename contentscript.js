// AJ Almaguer - 

var scriptElement = document.createElement('script');
scriptElement.src = chrome.extension.getURL('script.js');
(document.head||document.documentElement).appendChild(scriptElement);

scriptElement.onload = function() {
    scriptElement.parentNode.removeChild(scriptElement);
};