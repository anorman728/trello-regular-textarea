// ==UserScript==
// @name         Trello regular textarea
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  Add textarea to Trello that lets you write plaintext without their horrible markdown/rich text frankenstein abomination.
// @author       Andrew Norman
// @match        http*://*trello.com/*
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// ==/UserScript==

// This is the name of the class used for the text field.  This is what needs to
// be updated when Trello changes the class name of the shitbox.
// (The shitbox is the markdown/rich text frankenstein *before* it switches to editing mode.)
var sbClass = 'nch-textfield__input';

// This is the name of the class of the SB when it's in editing mode.
var focSbId = 'ak-editor-textarea';

// CONSOLE.LOG DOES NOT WORK!  Use document.debugs instead.  Can get the values
// from terminal just as easily.
document.debugs = [];

function run() {
    // If this doesn't seem to be running at all, try looking at the IIFE at the end.
    var shitbox = document.getElementsByClassName(sbClass)[0];
    var sbParent = shitbox.parentElement;
    var newbox = document.createElement('textarea');
    newbox.setAttribute('id', 'newbox-editor');
    newbox.setAttribute('style', 'width:100%;min-height:10em;background-color:white;border:solid');
    newbox.setAttribute('placeholder', 'Ctrl+Enter will copy the plaintext in this box to the Rich Text comment box.');
    newbox.setAttribute('tabindex', '0');
    sbParent.insertAdjacentElement('beforebegin', newbox);
    document.debugs.sbParent = sbParent;

    // On focus, focus the shitbox to make the entire thing appear, then get back to newbox.
    newbox.addEventListener('focus', function(ev) {
        //shitbox.querySelectorAll('[type="text"]')[0].focus();
        shitbox.focus(); // In the new version the sb itself is the text area.
        setTimeout(function() {
            newbox.focus();
        },300);
    });

    newbox.addEventListener('keyup', function(ev) {
        if (ev.code != 'Enter' || !ev.ctrlKey) {
            return;
        }

        var focusedshitbox = document.getElementById(focSbId);
        focusedshitbox.children[0].innerHTML = marked.parse(newbox.value);
        focusedshitbox.focus();
        newbox.value = '';

    });

}

function runintermed() {
    if (!location.href.match(/http(s)?:\/\/.*trello\.com\/c\/*/)) {
        return;
    }

    var shitboxes = document.getElementsByClassName(sbClass);
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
