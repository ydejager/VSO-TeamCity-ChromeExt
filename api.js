var config = {
    // Set this to your TeamCity server URL. TeamCity 8 or higher required
    teamCityUrl: 'http://my.teamcity.server/',

    // You can find this in the editor of the build under "Build configuration ID"
    buildType: 'build_configuration_id'
};

function Builds(api) {
    this.getLastByBranchName = function (branchName, callback) {
        api.get('builds?locator=buildType:' + config.buildType + ',branch:' + branchName + ',count:1', function (builds) {
            var lastBuild = builds.build.length > 0 ? builds.build[0] : null;
            callback(lastBuild);
        });
    };

    return this;
}

function Api() {
    this.get = function (path, callback) {
        chrome.runtime.sendMessage({
            action: 'xhttp',
            url: config.teamCityUrl + 'httpAuth/app/rest/' + path
        }, function (responseText) {
            var json = JSON.parse(responseText);
            callback(json);
        });
    };

    this.builds = new Builds(this);

    return this;
}

var api = new Api();