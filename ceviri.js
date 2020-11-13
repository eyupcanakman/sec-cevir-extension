(function(window, document) {
  'use strict';
  let scOptionItems = {
    hedefDil: 'tr',
    hizliKisayolTusu: 'v',
    hizliKisayolTusuOn: 'alt',
    kisayolTusu: 'c',
    kisayolTusuOn: '',
  };

  String.prototype.sc_capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  function sc_urlOlustur(hedefDil, text) {
    let url = 'https://translate.google.com/m?sl=auto';
    url += '&tl=' + encodeURIComponent(hedefDil);
    url += '&q=' + encodeURIComponent(text);
    return url;
  }

  function sc_cevir(hedefDil) {
    let selectedText = sc_getSelectionText().replace(/(?:\r\n|\r|\n)/g, ' ');
    if (selectedText) {
      sc_createArkaplan();
      sc_createTooltip(
          '<p style="font-size:13px;margin:0;padding:0;color:black;">Yükleniyor</p>');
      sc_loadXMLDoc(sc_urlOlustur(hedefDil, selectedText), 'sc_ceviri');
    }
  }

  function sc_ceviriKutusuOlustur(hedefDil) {
    let el = document.getElementById('sc_ceviriinputdiv');
    if (el) {
      //el.parentNode.removeChild(el);
    } else {
      let div = document.createElement('div');
      let divhtml = '';
      divhtml += '<input type="text" id="sc_ceviriinput" style="margin-bottom:10px;width:90%;"><div id="sc_ceviriinputsonuc"></div>';
      div.innerHTML = divhtml;
      div.id = 'sc_ceviriinputdiv';
      div.style.height = 'auto';
      div.style.width = 'auto';
      div.style.border = '1px solid #ccc';
      div.style.background = '#eaeaea';
      div.style.zIndex = '2147483647';
      div.style.maxWidth = (sc_getWindowWidth() / 4) + 'px';
      div.style.padding = '15px';
      div.style.position = 'fixed';
      div.style.top = (sc_getWindowHeight() / 2) - 100 + 'px';
      div.style.left = (sc_getWindowWidth() / 2) - 100 + 'px';
      sc_createArkaplan();

      document.body.appendChild(div);
      let elem = document.getElementById('sc_ceviriinput');
      elem.focus();
      elem.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
          let text = elem.value;
          if (text) {
            document.getElementById(
                'sc_ceviriinputsonuc').innerHTML = 'Yükleniyor';
            sc_loadXMLDoc(sc_urlOlustur(hedefDil, text),
                'sc_ceviriinputsonuc');
          }
        }
      });
    }

  }

  document.onkeydown = function(e) {
    e = e || window.event;

    chrome.runtime.sendMessage({contentScriptQuery: 'scGetOptions'},
        response => {
          scOptionItems = response;
        });

    let items = scOptionItems;

    if (e.keyCode === items.hizliKisayolTusu.charCodeAt(0) || e.keyCode ===
        items.hizliKisayolTusu.toUpperCase().charCodeAt(0)) {
      let ontus_hizli = true;
      let hizliKisayolTusuOn = items.hizliKisayolTusuOn;
      if (hizliKisayolTusuOn === 'ctrl') {
        ontus_hizli = e.ctrlKey;
      }
      if (hizliKisayolTusuOn === 'alt') {
        ontus_hizli = e.altKey;
      }
      if (hizliKisayolTusuOn === 'shift') {
        ontus_hizli = e.shiftKey;
      }
      if (hizliKisayolTusuOn === 'meta') {
        ontus_hizli = e.metaKey;
      }

      if (hizliKisayolTusuOn.length === 0) {
        ontus_hizli = !(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey);
      }

      if (ontus_hizli) {
        sc_ceviriKutusuOlustur(items.hedefDil);
        e.preventDefault();
      }
    }

    if (e.keyCode === items.kisayolTusu.charCodeAt(0) || e.keyCode ===
        items.kisayolTusu.toUpperCase().charCodeAt(0)) {
      let ontus = true;
      let kisayolTusuOn = items.kisayolTusuOn;
      if (kisayolTusuOn === 'ctrl') {
        ontus = e.ctrlKey;
      }
      if (kisayolTusuOn === 'alt') {
        ontus = e.altKey;
      }
      if (kisayolTusuOn === 'shift') {
        ontus = e.shiftKey;
      }
      if (kisayolTusuOn === 'meta') {
        ontus = e.metaKey;
      }

      if (kisayolTusuOn.length === 0) {
        ontus = !(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey);
      }

      if (ontus) {
        sc_cevir(items.hedefDil);
      }
    }

    if (e.keyCode === 27) {
      sc_closeTooltip();
      sc_closeCeviriKutusu();
      sc_closeArkaplan();
    }
  };

  document.onclick = function() {
    if (event.target.id !== 'sc_cevirispan' &&
        event.target.id !== 'sc_ceviri' &&
        (
            typeof (event.target.parentNode) !== 'undefined' &&
            (
                event.target.parentNode.id === null ||
                event.target.parentNode.id !== 'sc_cevirispan'
            )
        ) &&
        event.target.id !== 'sc_ceviriinputdiv' &&
        event.target.id !== 'sc_ceviriinputsonuc' &&
        event.target.id !== 'sc_ceviriinput') {
      sc_closeTooltip();
      sc_closeCeviriKutusu();
      sc_closeArkaplan();
    }
  };

  function sc_parseRequest(veri, elemid) {
    let htmlObject = document.createElement('html');
    htmlObject.innerHTML = veri;
    let resultContainer = htmlObject.querySelector('.t0');
    if (!resultContainer) {
      resultContainer = htmlObject.querySelector('.result-container');
    }
    if (!resultContainer) {
      return;
    }
    let cevirison = resultContainer.innerText;
    let translateResult = cevirison.sc_capitalize();

    let tt_text = '<p style="line-height:18px;font-size:17px;margin:1px 0;padding:0;color:black;text-align:left; font-family:Arial,Serif,Verdana,serif;">' +
        translateResult + '</p>';

    let ceviritt = document.getElementById(elemid) ?
        document.getElementById(elemid) :
        sc_createTooltip('Yükleniyor');
    if (ceviritt) {
      ceviritt.innerHTML = '<span id="sc_cevirispan" onclick="return true;">' +
          tt_text + '</span>';
    }
  }

  function sc_loadXMLDoc(t_url, elemid) {
    chrome.runtime.sendMessage(
        {contentScriptQuery: 'scTranslateRequest', url: t_url}, response => {
          sc_parseRequest(response, elemid);
        });
    return true;
  }

  function sc_createArkaplan() {
    sc_closeArkaplan();
    let div = document.createElement('div');
    div.id = 'sc_ceviriarkaplan';
    div.style.height = sc_getWindowHeight() + 'px';
    div.style.width = sc_getWindowWidth() + 'px';
    div.style.background = '#eaeaea';
    div.style.zIndex = '2147483646';
    div.style.position = 'fixed';
    div.style.opacity = '0.4';
    div.style.top = 0 + 'px';
    div.style.left = 0 + 'px';

    document.body.appendChild(div);
  }

  function sc_closeTooltip() {
    let el = document.getElementById('sc_ceviri');
    if (el) {
      el.parentNode.removeChild(el);
    }
  }

  function sc_closeCeviriKutusu() {
    let el = document.getElementById('sc_ceviriinputdiv');
    if (el) {
      el.parentNode.removeChild(el);
    }
  }

  function sc_closeArkaplan() {
    let el = document.getElementById('sc_ceviriarkaplan');
    if (el) {
      el.parentNode.removeChild(el);
      sc_closeArkaplan();
    }
  }

  function sc_getWindowWidth() {
    return window.innerWidth;
  }

  function sc_getWindowHeight() {
    return window.innerHeight;
  }

  function sc_getSelectionText() {
    let text = '';
    if (window.getSelection) {
      text = window.getSelection().toString().trim();
    } else if (document.selection && document.selection.type !== 'Control') {
      text = document.selection.createRange().text.trim();
    }
    return text;
  }

  function sc_createTooltip(foo_text) {
    sc_closeTooltip();
    let selection = window.getSelection();
    if (selection.type === 'Range') {
      let range = selection.getRangeAt(0);
      let rect = range.getBoundingClientRect();

      let div = document.createElement('div');
      div.style.position = 'fixed';
      div.style.top = (2 + rect.height + rect.top) + 'px';
      div.style.left = rect.left + 'px';
      div.style.height = 'auto';
      div.style.width = 'auto';
      div.style.border = '1px solid #ccc';
      div.style.background = '#eaeaea';
      div.style.zIndex = '2147483647';
      div.style.maxWidth = (sc_getWindowWidth() / 4) + 'px';
      div.style.padding = '15px';
      let divhtml = '';
      divhtml += foo_text;
      div.innerHTML = divhtml;
      div.id = 'sc_ceviri';
      document.body.appendChild(div);
      return document.getElementById('sc_ceviri');
    }
  }
})(window, document);