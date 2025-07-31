# TouchDesigner WebSocket App

This project provides a simple WebSocket relay server and a web‑based control interface that you can use to talk to TouchDesigner.  It was designed as a drop‑in replacement for the Glitch.com app used in Torin Blankensmith's “Control TouchDesigner with a Website & Vice Versa” tutorial series.

## Features

* **WebSocket relay server:** When one client sends a message, the server broadcasts it to all other connected clients.  This allows TouchDesigner and your web UI to communicate in real‑time.
* **Static web interface:** The `/public/index.html` file contains a simple control panel with a slider, a colour picker and a text input.  Adjusting the controls sends JSON messages over the WebSocket.  Incoming messages are displayed in the interface.
* **No external build tools:** The app uses plain HTML, CSS and JavaScript.  You only need Node.js and a couple of dependencies (`express` and `ws`).

## Getting Started

1. **Install dependencies**

   ```bash
   cd td-websocket-app
   npm install
   ```

   This will install `express` and `ws`.  If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

2. **Run the server**

   ```bash
   npm start
   ```

   By default the server listens on port `3000`.  You can override this by setting the `PORT` environment variable:

   ```bash
   PORT=8080 npm start
   ```

3. **Open the web interface**

   Visit [`http://localhost:3000`](http://localhost:3000) (or the port you specified).  The page will automatically connect to the WebSocket and display its status.  Move the slider, pick a colour or send a custom message—each action sends a JSON message like `{"type": "slider", "value": "0.42"}` to the server.  Messages arriving from TouchDesigner (or other clients) appear in the message list.

4. **Connect from TouchDesigner**

   In TouchDesigner, add a **WebSocket DAT** and set its **Address** parameter to `ws://your-server-address:3000`.  Once connected, the DAT will receive the JSON messages sent from the browser.  You can also send messages from TouchDesigner back to the browser by writing to the DAT.

## Deploying

You can run this app locally on the same computer as TouchDesigner, or deploy it to a cloud service so that your projects are accessible over the internet.  Any hosting platform that supports Node.js and allows WebSocket connections will work.  Here are a few options:

* **Railway.app** – supports WebSockets out of the box, has a generous free tier and can deploy directly from a GitHub repository.
* **Render.com** – offers free static sites and low‑cost Node services with WebSocket support.
* **Heroku** (paid) – you can deploy Node.js apps using a Procfile.  Note that Heroku removed their free tier in late 2022.
* **Replit** – allows you to run Node.js projects with minimal configuration.  Create a new Repl, upload the files from this folder and click **Run** to start the server.  Replit will provide a public URL that you can use in TouchDesigner.

Follow your chosen platform’s documentation to create a new Node.js project, push the contents of `td-websocket-app` to it, and start the server.  Be sure to expose the port you specify and adjust the WebSocket URL in TouchDesigner accordingly.

## Customising the UI

The default interface is intentionally simple.  You can replace or extend it with your own controls by editing `public/index.html`.  Each time you send data to the WebSocket you should structure it as JSON with at least a `type` field so that your TouchDesigner script knows how to handle it.  The existing code demonstrates how to send slider, colour and text messages.

## License

This project is released under the MIT License.  Feel free to use, modify and share it for your own projects.