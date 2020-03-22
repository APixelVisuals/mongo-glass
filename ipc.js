module.exports = () => {

    //Modules
    const { ipcMain: ipc } = require("electron-better-ipc");
    const testConnection = require("./ipc/testConnection");
    const keytar = require("./ipc/keytar");

    //Is Dev
    ipc.answerRenderer("isDev", () => process.env.DEV === "true");

    //Test Connection
    ipc.answerRenderer("testConnection", async data => await testConnection(data));

    //Keytar
    ipc.answerRenderer("keytar", async data => await keytar(data));
};