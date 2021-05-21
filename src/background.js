"use strict";

import { app, protocol, BrowserWindow,ipcMain} from "electron";
import {autoUpdater} from 'electron-updater'

/*const electron = require('electron');
const path = require('path');
//用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区 ，通常被添加到一个 context menu 上.
const Menu = electron.Menu;
const Tray = electron.Tray;
//托盘对象
var appTray = null;*/

import {
  createProtocol
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
    },
  });
/*  let myWindow = null  //控制程序启动几个

  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      myWindow.focus()
    }
  })

  if (shouldQuit) {
    app.quit()
  }*/
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}


updateHandle();

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

function sendUpdateMessage(text) {
  mainWindow.webContents.send("message", text);
}

ipcMain.on("sendNowDownload", function() {
  mainWindow.webContents.send("nowDownLoadData");
});

function updateHandle() {
  const message = {
    error: { code: -1, msg: "检查更新出错" },
    checking: { code: 1, msg: "正在检查更新……" },
    updateAva: { code: 2, msg: "检测到新版本，正在下载……" },
    updateNotAva: { code: 0, msg: "现在使用的就是最新版本，不用更新" }
  };

  const uploadUrl = "http://locald.in.com";
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on("error", function() {
    // eslint-disable-next-line no-console
    console.log("error");
    sendUpdateMessage(message.error);
  });
  autoUpdater.on("checking-for-update", function() {
    // eslint-disable-next-line no-console
    console.log("checking-for-update");
    sendUpdateMessage(message.checking);
  });
  autoUpdater.on("update-available", function() {
    //sendUpdateMessage(message.updateAva)
    // eslint-disable-next-line no-console
    console.log("needToUpdate");
    sendUpdateMessage(message.updateAva);
  });
  autoUpdater.on("update-not-available", function() {
    // eslint-disable-next-line no-console
    console.log("NoNeedToUpdate");
    sendUpdateMessage(message.updateNotAva);
  });

  // 更新下载进度事件
  autoUpdater.on("download-progress", function(
      progressObj,
      bytesPerSecond,
      percent,
      total,
      transferred
  ) {
    // eslint-disable-next-line no-console
    console.log("downloadProgress" + progressObj);
    mainWindow.webContents.send(
        "downloadProgress",
        progressObj,
        bytesPerSecond,
        percent,
        total,
        transferred
    );
  });
  autoUpdater.on("update-downloaded", function() {
    autoUpdater.quitAndInstall();
  });

  // eslint-disable-next-line no-console
  console.log("readyToStartIPCMainCheck");
  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查

    autoUpdater.checkForUpdates();
  });
}
