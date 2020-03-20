module.exports = async ({ keytarFunction, params }) => {

    //Modules
    const keytar = require("keytar");

    //Run
    return await keytar[keytarFunction](...params);
};