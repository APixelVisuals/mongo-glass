module.exports = async (client, { database, namesOnly }) => {

    //Get database
    database = client.db(database);

    //Get collections
    let collections = await database.listCollections(null, { nameOnly: true });

    //Parse databases
    collections = (await collections.toArray()).map(c => c.name);

    //Get stats
    if (!namesOnly) collections = await Promise.all(collections.map(async c => {

        const stats = await database.collection(c).stats();

        return {
            name: c,
            size: stats.storageSize,
            documents: stats.count
        };
    }));

    //Return
    return collections;
};