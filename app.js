const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const url = require("url");

const debug = process.env.DEBUG;

let appWindow;

app.on("ready", ready);
app.on("window-all-closed", closeWindow);
app.on("activate", activate);
app.on("createWindow", createWindow);

function ready() {
  const mainScreen = screen.getPrimaryDisplay();
  const dimensions = mainScreen.size;

  appWindow = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    frame: true, // Set frame to true to show the minimize, maximize, and close buttons
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Hide menu bar
  appWindow.setMenuBarVisibility(false);

  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "/dist/index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // Open DevTools only if in debug mode
  if (debug) {
    appWindow.webContents.openDevTools();
  }
}

function activate() {
  if (appWindow === null) {
    ready();
  }
}

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    icon: "./icon/language_markdown_outline_icon_139425.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
}

function closeWindow() {
  if (process.platform !== "darwin") {
    app.quit();
  }

  process.exit(0);
}
