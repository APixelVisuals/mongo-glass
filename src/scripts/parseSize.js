module.exports = input => input < 1000000 ?
    `${(input / 1000).toFixed(2)} KB` :
    (
        input < 1000000000 ?
            `${(input / 1000000).toFixed(2)} MB` :
            `${(input / 1000000000).toFixed(2)} GB`
    );