const { ProductController } = require("./controller")

var setup = (router) => {
    router
        .get("/:code", ProductController.get_by_id)
        .get("/", ProductController.getAll)
        .post("/", ProductController.create)
}
module.exports = {
    setup: setup
}