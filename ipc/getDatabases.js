module.exports = async client => {

    //Get databases
    let { databases } = await client.db().admin().listDatabases();

    //Get stats
    databases = await Promise.all(databases.filter(d => !["admin", "local"].includes(d.name)).map(async d => {

        const stats = await client.db(d.name).stats();

        return {
            name: d.name,
            size: stats.storageSize,
            collections: stats.collections
        };
    }));

    //Return
    return databases;
};