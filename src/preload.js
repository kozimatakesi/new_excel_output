const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send("notify", message);
    },
  },

  filesApi: {
    searchDirPath() {
      ipcRenderer.send("searchDirPath");
    },
    createExcelFile(dirPath) {
      ipcRenderer.send("createExcelFile", dirPath);
    },
  },

  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, arg) => callback(event, arg));
  },
});
