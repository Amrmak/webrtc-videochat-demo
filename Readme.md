# WebRTC Video Chat Demo

## Prerequisites:

1.  [Node.js](https://nodejs.org/en/)
2.  [Yarn](https://yarnpkg.com/lang/en/docs/install)

Note:

> You can use npm package manager instead of yarn, but you'd have to use "npm install" in both client folder and server folder, and run them separately.

## Installation:

To run the app on your local machine, follow these steps:

1.  Clone the repo

```sh
git clone https://github.com/amrmak/webrtc-videochat-demo
```

2.  Install dependencies

```sh
yarn install
```

3.  Start both the signaling server and client server together

```sh
yarn start
```

3.  You can alternatively run each server separetly (make sure to run each command in a different terminal windows)

```sh
yarn server
```

```sh
yarn client
```

4.  Open http://localhost:1234 on your browser.
