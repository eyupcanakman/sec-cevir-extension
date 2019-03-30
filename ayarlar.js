// Saves options to chrome.storage
function save_options() {
  var hedef_dil = document.getElementById('hedef_dil').value;
  var kisayol_tusu = document.getElementById('kisayol_tusu').value;
  var kisayol_tusu_on = document.getElementById('kisayol_tusu_on').value;
  var hizli_kisayol_tusu = document.getElementById('hizli_kisayol_tusu').value;
  var hizli_kisayol_tusu_on = document.getElementById('hizli_kisayol_tusu_on').value;
  chrome.storage.sync.set({
    hedefDil: hedef_dil,
    kisayolTusu: kisayol_tusu,
    kisayolTusuOn: kisayol_tusu_on,
    hizliKisayolTusu: hizli_kisayol_tusu,
    hizliKisayolTusuOn: hizli_kisayol_tusu_on
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Değişiklikler kaydedildi. Sayfayı yenilemeyi unutmayınız.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
function restore_options() {
  chrome.storage.sync.get({
    hedefDil: 'tr',
    kisayolTusu:'c',
    kisayolTusuOn:'',
    hizliKisayolTusu:'v',
    hizliKisayolTusuOn:'alt'
  }, function(items) {
    document.getElementById('hedef_dil').value = items.hedefDil;
    document.getElementById('kisayol_tusu').value = items.kisayolTusu;
    document.getElementById('kisayol_tusu_on').value = items.kisayolTusuOn;
    document.getElementById('hizli_kisayol_tusu').value = items.hizliKisayolTusu;
    document.getElementById('hizli_kisayol_tusu_on').value = items.hizliKisayolTusuOn;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);