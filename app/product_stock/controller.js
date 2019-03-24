const { model } = require("./model")

const ProductController = {
    getAll(req, res) {
        model.findAll((res_data) => {
            res.json(res_data)
        })
    },
    get_by_id(req, res) {
        model.find_by_code(req.params.code, (res_data) => {
            res.json(res_data)
        })
    },
    create(req, res) {
        model.create(req.body, (res_data) => {
            res.json(res_data)
        })
    }
}
module.exports = {
    ProductController: ProductController
}