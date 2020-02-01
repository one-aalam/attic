const fs = require('fs');

const readFile = async(filePath, options = {
        returnJson: true,
        encoding: 'utf8'
    }) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, options.encoding, (err, data) => {
            if (err) {
               reject(err);
            }
            resolve(options.returnJson ? JSON.parse(data) : data);
        });
    })
};

const writeFile = async(fileData, filePath, options = {
    encoding: 'utf8'
}) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileData, options.encoding, (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    })
};

exports.read = readFile;
exports.write = writeFile;