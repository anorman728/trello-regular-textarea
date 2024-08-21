// ==UserScript==
// @name         Trello regular textarea
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  Add textarea to Trello that lets you write plaintext without
//               their horrible markdown/rich text frankenstein abomination.
// @author       Andrew Norman
// @match        http*://*trello.com/*
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// ==/UserScript==

function run() {
    var shitbox = document.getElementsByClassName('new-comment')[0];
    var newbox = document.createElement('textarea');
    newbox.setAttribute('id', 'newbox-editor');
    newbox.setAttribute('style', 'width:100%;min-height:10em;background-color:white;border:solid');
    newbox.setAttribute('placeholder', 'Ctrl+Enter will copy the plaintext in this box to the Rich Text comment box.');
    shitbox.insertAdjacentElement('beforebegin', newbox);

    // On focus, focus the shitbox to make the entire thing appear, then get back to newbox.
    newbox.addEventListener('focus', function(ev) {
        shitbox.getElementsByTagName('input')[0].focus();
        setTimeout(function() {
            newbox.focus();
        },200);
    });

    newbox.addEventListener('keyup', function(ev) {
        if (ev.code != 'Enter' || !ev.ctrlKey) {
            return;
        }

        var focusedshitboxes = shitbox.getElementsByClassName('ua-chrome');
        var focusedshitbox = focusedshitboxes[focusedshitboxes.length - 1];
        focusedshitbox.focus();
        //focusedshitbox.innerHTML = newbox.value.replace(/(?:\r\n|\r|\n)/g, '<br>');
        focusedshitbox.innerHTML = marked.parse(newbox.value);
        newbox.value = '';

    });

}

function runintermed() {
    if (!location.href.match(/http(s)?:\/\/.*trello\.com\/c\/*/)) {
        return;
    }

    var shitboxes = document.getElementsByClassName('new-comment');
    // Need to check if this box is loaded.  I can't figure out any other way to do this.
    if (shitboxes.length == 0) {
        setTimeout(function() {
            runintermed();
        }, 200);
    } else {
        run();
    }
}

(function() {window.addEventListener('load', function() {
    var oldurl = location.href;
    //window.addEventListener('popstate', function(ev){
    setInterval(function() {
        // Have to add this nonsense because Trello decided that page reloading
        // will cause heads to explode.
        // There's also no way to properly detect url changes.
        if (location.href == oldurl) {
            return;
        }

        oldurl = location.href;
        runintermed();
    }, 500);
    runintermed(); // Always run at least once, no matter the page.
},false);})();

