module.exports = async ({ hostname, port, srv, authenticationEnabled, username, password, authenticationDatabase, testConnection }) => {

    //Modules
    const { MongoClient } = require("mongodb");

    //Define client
    const client = new MongoClient(`mongodb${srv ? "+srv" : ""}://${(authenticationEnabled && username && password) ? `${username}:${password}@` : ""}${hostname || "127.0.0.1"}${srv ? "" : `:${port || 27017}`}${authenticationEnabled ? `/${authenticationDatabase || "admin"}` : ""}`);

    //Connect to database
    let connectionError;
    await client.connect().catch(err => connectionError = err);

    //Close connection
    if (testConnection) client.close();

    //Return
    return {
        client,
        success: !connectionError,
        error: connectionError && connectionError.toString()
    };
};