aloha
=====
This is a simple nodejs puppeteer script that helps facilitate our meetings on
jitsi.

**aloha.js** creates a randomly-named jitsi room then listens for https requests. It
redirects all visitors to the same room. When everyone has left the room *aloha.js*
disconnects as well so as to avoid wasting resources.

## Dependencies:

 - node.js  (https://nodejs.org)

 - Puppeteer (https://developers.google.com/web/tools/puppeteer)

 - [Several other things](https://github.com/puppeteer/puppeteer/issues/290#issuecomment-322838700) if you happen to be trying to install to a headless debian/ubuntu box:

    $ apt-get install chromium-browser libatk1.0.0 libatk-bridge2.0-0 libxkbcommon-x11-0 gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

## Installation:

### Clone repository:
    $ git clone https://github.com/Air-Light-Time-Space/aloha.git
    $ cd aloha

### Install dependencies:
    $ npm install

#### Setting up as systemd service:

Create a new file at */lib/systemd/system/aloha.service* with the following contents.
Change the WorkingDirectory and ExecStart paths as appropriate:
    
    [Unit]
    Description=aloha jitsi bot
    After=network-online.target

    [Service]
    Restart=on-failure
    WorkingDirectory=/path/to/aloha
    ExecStart=/usr/bin/node /path/to/aloha/aloha.js

    [Install]
    WantedBy=multi-user.target

Then:
    
    $ systemctl daemon-reload
    $ systemctl enable aloha
    $ systemctl restart aloha
