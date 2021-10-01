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
