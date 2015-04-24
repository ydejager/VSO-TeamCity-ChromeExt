// Saves options to chrome.storage
function save_options() {
  var teamcityurl = document.getElementById('teamcityurl').value;
  var buildtype = document.getElementById('buildtype').value;
  chrome.storage.sync.set({
    teamcityUrl: teamcityurl,
	buildType: buildtype
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function withOptions(withOptionsFunc) {
  chrome.storage.sync.get({
    teamcityUrl: 'http://localhost/',
	buildType: ''
  }, function(items) {
    withOptionsFunc(items);
  });
}

function restore_options() {
  withOptions(function (items) {
    document.getElementById('teamcityurl').value = items.teamcityUrl;
    document.getElementById('buildtype').value = items.buildType;  
  });
}