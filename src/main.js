const {
  BrowserWindow,
  app,
  ipcMain,
  Notification,
  dialog,
} = require("electron");
const path = require("path");
const fs = require("fs").promises;
const xlsx = require("xlsx");
const execSync = require('child_process').execSync;

const xutil = xlsx.utils;

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("src/index.html");
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notifiation", body: message }).show();
});

ipcMain.on("searchDirPath", async (event) => {
  const dirInfo = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "title",
  });
  const dirPath = dirInfo.filePaths[0];
  event.reply("dirPath", dirPath);
});


ipcMain.on("openFile", () => {
  const excelFile = "/Users/kawamoto/Desktop/20210612_SB関東/20210612_SB関東.xls"
  const stdout = execSync(excelFile);
});

ipcMain.on("createExcelFile", (_, dirPath) => {

  const AllFiles = [];

  // 対象ディレクトリ内の全てのファイルを取得する関数
  const getAllFiles = async (directoryPath) => {
    const dirName = path.basename(directoryPath);
    const innerDirFiles = await fs.readdir(directoryPath, {
      withFileTypes: true,
    });
    for (const file of innerDirFiles) {
      if (file.isFile()) {
        const stats = await fs.stat(`${directoryPath}/${file.name}`);
        AllFiles.push({
          path: directoryPath,
          dir: dirName,
          name: file.name,
          size: stats.size,
          date: stats.mtime.toLocaleDateString(),
          time: stats.mtime.toLocaleTimeString(),
        });
      }
    }
    const dirOnly = innerDirFiles.filter((file) => file.isDirectory());
    // 対象ディレクトリ内にディレクトリがなかった時は終了
    if (dirOnly.length === 0) {
      return;
    }
    for (const dir of dirOnly) {
      const newDirPath = `${directoryPath}/${dir.name}`;
      await getAllFiles(newDirPath);
    }
  };

  const forExcel = [
    [
      "フォルダ名",
      "ファイル名",
      "ファイルサイズ",
      "更新日",
      "開始時間",
      "更新時間",
    ],
  ];
  let fileDir = dirPath;
  (async () => {
    await getAllFiles(dirPath);
    for (const file of AllFiles) {
      if (file.name != ".DS_Store") {
        const checkTime = file.name.match(/_\d{6}\D/);
        let startTime = "";
        if (checkTime) {
          const time = checkTime[0].slice(1).slice(0, -1);
          const hour = time.slice(0, 2);
          const min = time.slice(2, 4);
          const sec = time.slice(4);
          startTime = `${hour}:${min}:${sec}`;
        }
        if(fileDir !== file.dir) {
          forExcel.push([],[file.path]);
        }

        fileDir = file.dir;

        forExcel.push([
          file.dir,
          file.name,
          `${(file.size / 1000000).toFixed(2)}Mbyte`,
          file.date,
          startTime,
          file.time,
        ]);
      }
    }
    console.log(forExcel);
    const wb = xutil.book_new();
    const ws = xutil.aoa_to_sheet(forExcel);
    const wsName = path.basename(dirPath);
    xutil.book_append_sheet(wb, ws, wsName);
    xlsx.writeFile(wb, `${dirPath}/${path.basename(dirPath)}.xls`);
    new Notification({
      title: "完了",
      body: "EXCELファイルを作成しました",
    }).show();
  })();
});

app.whenReady().then(createWindow);
