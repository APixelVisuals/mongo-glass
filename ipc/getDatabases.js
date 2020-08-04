module.exports = async (client, { namesOnly }) => {

    //Get databases
    let { databases } = await client.db().admin().listDatabases();

    //Parse databases
    databases = databases.map(d => d.name).filter(d => !["admin", "local"].includes(d));

    //Get stats
    if (!namesOnly) databases = await Promise.all(databases.map(async d => {

        const stats = await client.db(d).stats();

        return {
            name: d,
            size: stats.storageSize,
            collections: stats.collections
        };
    }));

    //Return
    return databases;
};