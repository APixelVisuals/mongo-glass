module.exports = async (client, { database, collectionData }) => {

    //Create database
    let error;
    await client.db(database).createCollection(collectionData.name, {
        capped: Boolean(collectionData.cappedCollection),
        size: collectionData.cappedCollection ? collectionData.cappedCollection.maximumSize : null,
        max: collectionData.cappedCollection ? collectionData.cappedCollection.maximumDocuments : null,
        collation: collectionData.customCollation ? {
            locale: `${collectionData.customCollation.locale}${collectionData.customCollation.localeVariant ? `@collation=${collectionData.customCollation.localeVariant}` : ""}`,
            strength: collectionData.customCollation.strength,
            caseLevel: collectionData.customCollation.caseLevel,
            caseFirst: collectionData.customCollation.caseFirst,
            numericOrdering: collectionData.customCollation.numericOrdering,
            alternate: collectionData.customCollation.alternate,
            maxVariable: collectionData.customCollation.maxVariable,
            backwards: collectionData.customCollation.backwards,
            normalization: collectionData.customCollation.normalization
        } : null
    }).catch(err => error = err);

    //Return
    return error && error.toString();
};