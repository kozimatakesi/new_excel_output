const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send("notify", message);
    },
  },
  dragApi: (event) => {
    ipcRenderer.send('ondragstart', event);
  },

  filesApi: {
    searchDirPath() {
      ipcRenderer.send("searchDirPath");
    },
    createExcelFile(dirPath) {
      ipcRenderer.send("createExcelFile", dirPath);
    },
    openFile() {
      ipcRenderer.send("openFile");
    }
  },

  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, arg) => callback(event, arg));
  },
});
