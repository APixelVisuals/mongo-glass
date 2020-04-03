module.exports = () => {

    //Modules
    const { ipcMain: ipc } = require("electron-better-ipc");
    const keytar = require("./ipc/keytar");
    const connect = require("./ipc/connect");
    const getDatabases = require("./ipc/getDatabases");
    const deleteDatabase = require("./ipc/deleteDatabase");

    //Define client
    let client;

    //Is Dev
    ipc.answerRenderer("isDev", () => process.env.DEV === "true");

    //Keytar
    ipc.answerRenderer("keytar", async data => await keytar(data));

    //Connect
    ipc.answerRenderer("connect", async data => {

        const result = await connect(data);

        if (!data.testConnection) client = result.client;

        delete result.client;
        return result;
    });

    //Get Databases
    ipc.answerRenderer("getDatabases", async () => await getDatabases(client));

    //Delete Database
    ipc.answerRenderer("deleteDatabase", async data => await deleteDatabase(client, data));
};