//Modules
const electron = require("electron");
const ipc = require("./ipc");

//Define window
let window;

electron.app.on("ready", () => {

    //Create window
    window = new electron.BrowserWindow({ title: "MongoGlass", backgroundColor: "#000000", webPreferences: { nodeIntegration: true } });
    window.maximize();

    //Remove window reference when closed
    window.on("closed", () => window = null);

    //Load index.html
    window.loadURL(process.env.DEV === "true" ? "http://localhost:3000" : `file://${__dirname}/build/index.html`);
});

//IPC
ipc();