// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const debug = process.env.DEBUG;

app.on("ready", ready);
app.on("window-all-closed", closeWindow);
app.on("activate", activate);

function ready() {
  appWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/dist/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  if (debug) {
    appWindow.webContents.openDevTools();
  }
}

function activate() {
  if (win === null) {
    initwindow();
  }
}

function closeWindow() {
  if (process.platform !== "darwin") {
    app.quit();
  }

  process.exit(0);
}
