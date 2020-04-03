module.exports = async (client, { database }) => {

    //Delete database
    let error;
    await client.db(database).dropDatabase().catch(err => error = err);

    //Return
    return error && error.toString();
};