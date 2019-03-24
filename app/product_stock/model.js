const mysql = require('mysql')
const SHA256 = require("crypto-js/sha256")
const moment = require('moment')
const config = require("../../config")
const { save_log } = require("../../service")

const product_stock = {
    findAll(callback) {
        var pool = mysql.createPool(config.connect_db)
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query("SELECT * FROM product_stock",
                function (err, res, fields) {
                    connection.release()
                    pool.end()
                    callback(res)
                })
        })
    },
    find_by_code(code, callback) {
        var sql = "SELECT * FROM product_stock WHERE code='" + code + "'"
        var pool = mysql.createPool(config.connect_db)
        pool.getConnection(function (err, connection) {
            connection.query(sql, function (err, res, fields) {
                connection.release()
                pool.end()
                save_log(res, "FIND_BY_CODE", "product_stock", code)
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
                    stock_total: val.product_stock,
                    stock_sell: val.stock_sell,
                    stock_lost: val.stock_lost,
                    stock_available :0,
                    last_update: moment().format("YYYY-MM-DD H:m:s"),
                }
                sql += "INSERT INTO product_stock (code,stock_total,stock_sell,stock_lose,stock_available,last_update)\
                VALUES ('"+ data.code + "','" + data.stock_total + "','" + data.stock_sell + "','" + data.stock_lost + "','" + data.stock_available + "','" + data.last_update + "')\
                ON DUPLICATE KEY UPDATE \
                stock_total = stock_total+'"+ data.stock_total + "', \
                stock_sell = stock_sell+'"+ data.stock_sell + "', \
                stock_lose = stock_lose+'"+ data.stock_lost + "', \
                stock_available = stock_total-(stock_sell+stock_lose), \
                last_update='"+ data.last_update + "';\
                "
            });
            connection.query(sql, function (err, res, fields) {
                if (err) throw err;
                connection.release()
                pool.end()
                save_log(res, "CREATE", "product_stock", inData)
                callback(res)
            })
        })
    },
    update() { },
    destroy() { }
}
module.exports = {
    model: product_stock
}