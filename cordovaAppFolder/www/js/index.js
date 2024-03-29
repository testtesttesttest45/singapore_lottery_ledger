/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    return states[networkState];
}

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    attemptConnection();
}

function attemptConnection() {
    const serverMessage = document.getElementById('server-message');
    const cordovaInterface = document.getElementById('cordova-interface');
    const iframe = document.getElementById('contentFrame');

    serverMessage.textContent = 'Checking connection...';
    serverMessage.style.backgroundColor = '#0eb3d8';

    // Use fetch with 'no-cors' mode to check if the server is responsive
    fetch('https://singapore-lottery-ledger.onrender.com')
        .then(response => {
            if (response.status === 200) {
                // If status is 200 OK, then load the iframe content
                iframe.src = 'https://singapore-lottery-ledger.onrender.com';

                iframe.onload = function () {
                    setTimeout(function () {
                        serverMessage.textContent = 'Connection success! Redirecting...';
                        serverMessage.style.backgroundColor = '#3bd57c';
                        setTimeout(function () {
                            cordovaInterface.style.display = 'none';
                            iframe.style.display = 'block';
                        }, 1000);
                    }, 1200);
                };
            } else {
                throw new Error(`Server responded with status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error(error); // Log the error for debugging
            setTimeout(function () {
                serverMessage.textContent = 'Connection error!';
                serverMessage.style.backgroundColor = '#c51b5b';
                document.getElementById('tryAgainButton').style.display = 'block';
            }, 500);
        });
}



// Handle the "Try Again" button click
document.getElementById('tryAgainButton').addEventListener('click', function () {
    document.getElementById('tryAgainButton').style.display = 'none'; // Hide the button
    attemptConnection(); // Attempt connection again
});

document.addEventListener("offline", onOffline, false);
document.addEventListener("online", onOnline, false);

function onOffline() {
    document.getElementById('connection-lost-notice').style.display = 'block';
}

function onOnline() {
    document.getElementById('connection-lost-notice').style.display = 'none';
}