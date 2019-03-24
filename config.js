require('dotenv').config()

const connect_db={
    host:process.env.HOST_DOMAIN,
    user:process.env.USER_CONN,
    password:process.env.PASS_CONN,
    database:process.env.DATABASE_NAME,
    queueLimit : 0,
    connectionLimit : 99999999, 
    multipleStatements: true,
}

module.exports={
    port:process.env.PORT,
    connect_db:connect_db
}