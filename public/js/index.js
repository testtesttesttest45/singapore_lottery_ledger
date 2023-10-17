document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    alert("Device ready");
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    alert("Current URL: " + window.location.href);
    // Handle the back button
    document.addEventListener("backbutton", function(e) {
        alert("backbutton event triggered");
        alert("Current URL: " + window.location.href);
        if (window.location.href === "https://sg-lottery-ledger.as.r.appspot.com/index") {
            alert("On main page, exiting app");
            navigator.app.exitApp();
        } else {
            alert("Navigating back");
            history.back();
        }
    }, false);
}