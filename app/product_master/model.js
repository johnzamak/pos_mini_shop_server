const mysql = require('mysql')
const SHA256 = require("crypto-js/sha256")
const moment = require('moment')
const config = require("../../config")
const { save_log } = require("../../service")
const product_stock = require("../product_stock/model")

const product_master = {
    findAll(callback) {
        var pool = mysql.createPool(config.connect_db)
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query("SELECT * FROM product_master",
                function (err, res, fields) {
                    connection.release()
                    pool.end()
                    callback(res)
                })
        })
    },
    find_by_code(code, callback) {
        var sql = "SELECT product_master.code,product_master.product_name,product_master.product_price,product_master.product_unit \
        ,product_stock.stock_available \
        FROM product_master \
        LEFT JOIN product_stock ON product_master.code = product_stock.code \
        WHERE product_master.code = '"+ code + "' \
        "
        var pool = mysql.createPool(config.connect_db)
        pool.getConnection(function (err, connection) {
            connection.query(sql, function (err, res, fields) {
                connection.release()
                pool.end()
                callback(res)
            })
        })
    },
    create(inData, callback) {
        var pool = mysql.createPool(config.connect_db)
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            var sql = ""
            inData.forEach((val, index) => {
                var data = {
                    code: val.code,
                    product_code: val.product_code,
                    product_name: val.product_name,
                    product_price: val.product_price,
                    product_unit: val.product_unit,
                    last_update: moment().format("YYYY-MM-DD H:m:s"),
                }
                sql += "INSERT INTO product_master (code,product_code,product_name,product_price,product_unit,last_update)\
                VALUES ('"+ data.code + "','" + data.product_code + "','" + data.product_name + "','" + data.product_price + "','" + data.product_unit + "','" + data.last_update + "')\
                ON DUPLICATE KEY UPDATE \
                product_name='"+ data.product_name + "', \
                product_price='"+ data.product_price + "', \
                product_unit='"+ data.product_unit + "', \
                last_update='"+ data.last_update + "';\
                "
            });
            connection.query(sql, function (err, res, fields) {
                if (err) throw err;
                connection.release()
                pool.end()
                save_log(res, "INSERT", "product_master", inData)
                if (inData[0].product_stock > 0) {
                    product_stock.model.create(inData, (res_stock) => {
                        callback(res_stock)
                    })
                } else {
                    callback(res)
                }
            })
        })
    },
    update() { },
    destroy() { }
}
module.exports = {
    model: product_master
}