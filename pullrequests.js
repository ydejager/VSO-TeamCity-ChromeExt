var prPanelSelector = 'div.rightPane > div.right-hub-content > div.hub-pivot-content > div.versioncontrol-pullrequests-content > div.navigation-view-tab';
window.addEventListener("load", waitForPrs, false);

function waitForPrs() {
    var poll = function () {
        var prPanel = document.querySelector(prPanelSelector);
        if (prPanel) {
            clearInterval(timer);
            watchPrs(prPanel);
        }
    }

    var timer = setInterval(poll, 111);
}
function getPrBranchName(prEntryEl) {
    var span = prEntryEl.querySelector("div > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(1) > span:nth-child(5)");
    return span.innerText;
}

function setPrBuildStatus(prEntryEl, branchName, build) {
    var statusElementId = 'status-' + branchName;
    var statusEl = document.getElementById(statusElementId);

    if (!statusEl) {
        statusEl = document.createElement('span');
        statusEl.id = statusElementId;
        
        var titleEl = prEntryEl.querySelector('table > tbody > tr > td > table.vc-pullrequest-entry-details > tbody > tr > td > a.vc-pullrequest-entry-title');
        titleEl.parentNode.appendChild(statusEl);
    }

    var text;
    var icon;
    switch (build && build.status) {
        case 'SUCCESS':
            text = '<a href="' + build.webUrl + '">Build ' + build.number + ' succeeded</a>';
            icon = 'succeeded';
            break;

        case 'FAILURE':
            text = '<a href="' + build.webUrl + '">Build ' + build.number + ' failed</a>';
            icon = 'failed';
            break;

        default:
            text = 'No build found for branch' + branchName;
            icon = 'waiting-response-transparent';
    }

    statusEl.style.float = 'right';
    statusEl.innerHTML = '<span class="icon icon-tfs-vc-status-' + icon +'"></span><span class="vc-pullrequest-discussion-system-merge-ready">' + text + '</span>';
}

function updatePr(prEntryEl) {
    var update = function (branchName) {
        setPrBuildStatus(prEntryEl, branchName, null);

        api.builds.getLastByBranchName(branchName, function (lastBuild) {
            setPrBuildStatus(prEntryEl, branchName, lastBuild);
        });
    }

    var timer;
    var wait = function () {
        var branchName = getPrBranchName(prEntryEl);
        if (branchName != '') {
            clearInterval(timer);
            update(branchName)
        }
    }

    timer = setInterval(wait, 250);
}

function watchPrs(prPanel) {
    prPanel.addEventListener("DOMNodeInserted", function (e) {
        var node = e.target;
        if (node.localName == 'div' && node.className == 'vc-pullrequest-entry') {
            updatePr(node);            
        }
    });
}

