// This is a simple jitsi bot to facilitate virtual meetings.
//
// This file released under the MIT license. See LICENSE file for more details.
//
// (c) 2021  the Society of Air Light Time & Space
// (c) 2021  Noah T

const https = require('https');
const fs = require('fs');
const puppeteer = require ('puppeteer');
const crypto = require('crypto');

const botName = "ALTBot";
const jitsiServer = "meet.jit.si";

const listenPort = 8000;

function newRoomKey(keyLength) {
    return (0, crypto.randomBytes)(keyLength / 2).toString('hex');
  }

var roomKey = "00000000";
var location = 'https://' + jitsiServer + '/altspace_' + roomKey

// Function stolen from stackoverflow:
// https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
function timeConversion(duration) {
  const portions = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - (hours * msInHour);
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - (minutes * msInMinute);
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
  }

  return portions.join(' ');
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://meet.jit.si/external_api.js"></script>
  </head>
  <body>
    <script>
      window.createRoom = (domain, roomKey, botName) => {
      const options = {
        height: 700,
        width: 700,
        roomName: roomKey,
        userInfo: {
            email: 'altspace@altspaceseattle.com',
            displayName: botName
        },
        configOverwrite: { startWithAudioMuted: true }
      };
        const api = new JitsiMeetExternalAPI(domain, options);

        api.addEventListener("participantLeft", () => {
            const numberOfParticipants = api.getNumberOfParticipants();
            if (numberOfParticipants == 1) {
                api.executeCommand('hangup');
                window.alert("Meeting ended!");
            };
        });
      };
    </script>
    <div id="meet"></div>
  </body>
</html>`;

// Technique borrowed from https://github.com/pojntfx/jitsi-meet-node-client
function connectToJitsi(key, start) {
        let roomName = "altspace_" + key;
        (async () => {
        const b = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--use-fake-device-for-media-stream",
                "--use-fake-ui-for-media-stream=1",
                "--disable-features=IsolateOrigins,site-per-process" // Necessary to control embedded iframe
                ],
                });
        const page = await b.newPage();
        page.on('dialog', async dialogue => {
            await dialogue.dismiss();
            if (dialogue.message() == "Meeting ended!") {
                state = "inactive";
                await b.close();
                let now = new Date(Date.now());
                let meetingLength = Math.abs(now.getTime() - start.getTime());
                console.log(dialogue.message() + " Elapsed time: " + timeConversion(meetingLength));
            };
        });
        await page.goto(`data:text/html,${html}`);
        await page.evaluate(`window.createRoom("${jitsiServer}", "${roomName}", "${botName}");`);
        const frame = page.frames().find(frame => frame.url() === '');
        await frame.waitForSelector('.action-btn');
        await frame.click('div[data-testid="prejoin.joinMeeting"]');
    })();
    return "active";
  }

var state = "inactive";

const keyopts = {
  key: fs.readFileSync('privkey.pem'),
  cert: fs.readFileSync('fullchain.pem')
};

https.createServer(keyopts, function (request, response) {
    let { url } = request;
    console.log(request.connection.remoteAddress + " requested " + url);
    if (url == "/") {
        if (state == "inactive") {
            var startTime = new Date(Date.now())
            roomKey = newRoomKey(roomKey.length);
            location = 'https://' + jitsiServer + '/altspace_' + roomKey
            state = connectToJitsi(roomKey, startTime);
            // *hat-tip* https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
            let timeStamp = startTime.
                toISOString().
                replace(/T/, ' ').
                replace(/\..+/, '');
           // console.log(timeStamp)
            console.log(timeStamp + " - New meeting started...");
            console.log(location);
        };
        response.writeHead(302, {
            'Location': location
        });
    } else if (url == "/status") {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("State: " + state);
    } else {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
    };
    response.end();
}).listen(listenPort);

