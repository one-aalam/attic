import * as fs from 'fs';

export const readFile = async(filePath: string, options = {
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

export const writeFile = async(fileData: any, filePath: string, options = {
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