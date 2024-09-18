const dbConn = require('./db-conn');

exports.getDetails = (query, qryData) => {
    return new Promise((resolve, reject) => {
        dbConn.query(query, qryData, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};
exports.addRecord = async (tbl, data) => {
    const query = 'INSERT ?? SET ?'
    const qryData = [tbl, data];
    return new Promise((resolve, reject) => {
        dbConn.query(query, qryData, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result)
        })
    })
}
exports.updateRecord = async (tbl, data, whr) => {
    const query = 'UPDATE ?? SET ? WHERE ?'
    const qryData = [tbl, data, whr];
    return new Promise((resolve, reject) => {
        dbConn.query(query, qryData, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result)
        })
    })
}
exports.delRecord = async (tbl, whr) => {
    const query = 'DELETE FROM ?? WHERE ?'
    const qryData = [tbl, whr];
    return new Promise((resolve, reject) => {
        dbConn.query(query, qryData, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result)
        })
    })
}
exports.formatQry = (qry, qry_data) => {
    return dbConn.format(qry, qry_data)
}