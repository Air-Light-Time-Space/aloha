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

 - [Several other things](https://github.com/puppeteer/puppeteer/issues/290#issuecomment-322838700) if you happen to be trying to install to a headless debian/ubuntu box

## Installation:

### Clone repository:
    $ git clone https://github.com/Air-Light-Time-Space/aloha.git
    $ cd aloha

### Install dependencies:
    $ (cd app && npm install)

## Deployment

### Add a user

Add an unprivileged system user to run the app

    $ sudo useradd -r aloha -s /bin/false

### Setting up as systemd service:

Update *aloha.service* with the appropriate WorkingDirectory and ExecStart.

    $ edit aloha.service

Install the service.

    $ sudo cp aloha.service /lib/systemd/system/aloha.service

Tell systemd about the service.
    
    $ sudo systemctl daemon-reload
    $ sudo systemctl enable aloha
    $ sudo systemctl restart aloha
