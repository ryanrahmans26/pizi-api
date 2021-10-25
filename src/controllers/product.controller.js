const db = require('../models')
const User = db.rest.models.user
const Product = db.rest.models.product
const path = require("path")
const fs = require("fs")
const { title } = require('process')
const baseUrl = `${process.env.BASE_URL}/uploads/`

exports.getAllProduct = async (req, res) => {

    const product = await Product.findAll({
        include:[
            {
                model: User,
                as: 'user'
            }
        ],
    })

    return res.send({
        message: 'Success',
        code: '200',
        data: product
    })
}

exports.getProduct = async (req, res) => {
    const {id} = req.params

    const product = await Product.findOne({
        where: {
            id
        },
        include:[
            {
                model: User,
                as: 'user'
            }
        ],
    })

    if (!product) {
        return res.status(400).send( {
            message: `No product found with the ${id}`,
            code: '400',
            data: []
        })
    }

    return res.send({
        message: 'Success',
        code: '200',
        data: product
    })
}

exports.createProduct = async (req, res) => {
    const {title, description, file} = req.body

    if (!title || !description) {
        return res.status(400).send( {
            message: `You need include body and description to create a product`,
            code: '400',
            data: []
        })
    }

    try {
        // await uploadFile(req, res)

        if (req.file == undefined) {
            return res.status(400).send({
                message: `Please upload a file`,
                code: '400',
                data: []
            })
        }

        let newProduct = await Product.create({
            user_id: req.user.user_id,
            title: title,
            description: description,
            photo: encodeURI(baseUrl + req.file.filename)
        })

        const product = await Product.findOne({
            where: {
                id: newProduct.id
            },
            include:[
                {
                    model: User,
                    as: 'user'
                }
            ],
        })

        return res.send({
            message: 'Success',
            code: '200',
            data: product
        })

        
    } catch(err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
              message: "File size cannot be larger than 2MB!",
            });
          }

        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}

exports.updateProduct = async (req, res) => {
    const {title, description} = req.body

    const {id} = req.params

    const product = await Product.findOne({
        where: {
            id
        }
    })

    if (!product) {
        return res.status(400).send( {
            message: `No exists product with id ${id}`,
            code: '400',
            data: []
        })
    }

    try {
        // await uploadFile(req, res)

        if (req.file == undefined) {
            return res.status(400).send({
                message: `Please upload a file`,
                code: '400',
                data: []
            })
        }

        if (title) {
            product.title = title
        }
        if (description) {
            product.description = description
        }
        if (req.file) {
            product.photo = encodeURI(baseUrl + req.file.filename)
        }
        product.save()

        return res.send({
            message: `Product with ${id} has been updated`,
            code: '200',
            data: product
        })
    } catch(err) {
        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}

exports.deleteProduct = async (req, res) => {
    const {id} = req.params

    if(!id) {
        return res.status(400).send( {
            message: `Please provide the ID the product you want to delete`,
            code: '400',
            data: []
        }) 
    }

    const product = await Product.findOne({
        where: {
            id
        }
    })

    if (!product) {
        return res.status(400).send( {
            message: `No exists product with id ${id}`,
            code: '400',
            data: []
        })
    }

    try {
        await product.destroy()

        fs.unlink(decodeURI(__basedir + "/uploads/" + path.parse(product.photo).base), function(err) {
            if (err) {
                console.log(err)
                return res.send({
                    message: `Error delete photo, but succes delete product with id ${product.id}`,
                    code: '200',
                    data: []
                })
            } else {
                return res.send({
                    message: `Product id ${id} has been deleted`,
                    code: '200',
                    data: []
                })
            }
          });
    
    } catch(err) {
        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}