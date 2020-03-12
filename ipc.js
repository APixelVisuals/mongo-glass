module.exports = () => {

    //Modules
    const { ipcMain: ipc } = require("electron-better-ipc");

    //Is Dev
    ipc.answerRenderer("isDev", () => process.env.DEV === "true");
};