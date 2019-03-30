chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.contentScriptQuery === 'scTranslateRequest') {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
          sendResponse(xmlhttp.responseText)
        }
      }
      xmlhttp.open("GET",request.url,true);
      xmlhttp.send();
    } else if (request.contentScriptQuery === 'scGetOptions') {
      chrome.storage.sync.get({
        hedefDil: 'tr',
        hizliKisayolTusu: 'v',
        hizliKisayolTusuOn: 'alt',
        kisayolTusu: 'c',
        kisayolTusuOn: ''
      }, function(items) {
        sendResponse(items);
      });
    }
    return true;
  }
);