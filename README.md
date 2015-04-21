# VSO-TeamCity-ChromeExt
Integrate TeamCity build results into your Visual Studio Online setup.

Current version only supports the display of the last build result per pull request in the pull request list of VSO. 

## Configuration

You have to edit the api.js and manifest.json to correctly set the URL of your TeamCity server and the build configuration ID of the build that contains all the builds of the different feature branches.