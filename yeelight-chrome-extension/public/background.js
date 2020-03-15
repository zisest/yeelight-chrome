/* global chrome */
chrome.runtime.onStartup.addListener(function() {
    chrome.storage.sync.clear()
})