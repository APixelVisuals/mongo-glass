module.exports = () => {

    //Modules
    const { ipcMain: ipc } = require("electron-better-ipc");
    const keytar = require("./ipc/keytar");
    const connect = require("./ipc/connect");
    const createDatabase = require("./ipc/createDatabase");
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

        //Connect
        const result = await connect(data);

        //Set client
        if (!data.testConnection) client = result.client;
        delete result.client;

        //Return
        return result;
    });

    //Close connection
    ipc.answerRenderer("closeConnection", () => {

        //No connection
        if (!client) return;

        //Close connection
        client.close();

        //Set client
        client = null;
    });

    //Create Database
    ipc.answerRenderer("createDatabase", async data => await createDatabase(client, data));

    //Get Databases
    ipc.answerRenderer("getDatabases", async data => await getDatabases(client, data || {}));

    //Delete Database
    ipc.answerRenderer("deleteDatabase", async data => await deleteDatabase(client, data));
};