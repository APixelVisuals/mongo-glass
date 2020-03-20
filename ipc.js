module.exports = () => {

    //Modules
    const { ipcMain: ipc } = require("electron-better-ipc");
    const keytar = require("./ipc/keytar");

    //Is Dev
    ipc.answerRenderer("isDev", () => process.env.DEV === "true");

    //Keytar
    ipc.answerRenderer("keytar", async data => await keytar(data));
};