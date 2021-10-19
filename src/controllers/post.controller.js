const db = require('../models')
const User = db.rest.models.user
const Post = db.rest.models.post
const path = require("path")
const fs = require("fs")
const baseUrl = "http://localhost:4000/uploads/"

exports.getAllPost = async (req, res) => {

    const post = await Post.findAll({
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
        data: post
    })
}

exports.getPost = async (req, res) => {
    const {id} = req.params

    const post = await Post.findOne({
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

    if (!post) {
        return res.status(400).send( {
            message: `No post found with the ${id}`,
            code: '400',
            data: []
        })
    }

    return res.send({
        message: 'Success',
        code: '200',
        data: post
    })
}

exports.createPost = async (req, res) => {
    const {body, file} = req.body

    if (!body) {
        return res.status(400).send( {
            message: `You need include body to create a post`,
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

        let newPost = await Post.create({
            user_id: req.user.user_id,
            body: body,
            photo: encodeURI(baseUrl + req.file.filename)
        })

        const post = await Post.findOne({
            where: {
                id: newPost.id
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
            data: post
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

exports.updatePost = async (req, res) => {
    const {body} = req.body

    const {id} = req.params

    const post = await Post.findOne({
        where: {
            id
        }
    })

    if (!post) {
        return res.status(400).send( {
            message: `No exists post with id ${id}`,
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

        if (body) {
            post.body = body
        }
        if (req.file) {
            post.photo = encodeURI(baseUrl + req.file.filename)
        }
        post.save()

        return res.send({
            message: `Post with ${id} has been updated`,
            code: '200',
            data: []
        })
    } catch(err) {
        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}

exports.deletePost = async (req, res) => {
    const {id} = req.params

    if(!id) {
        return res.status(400).send( {
            message: `Please provide the ID the post you want to delete`,
            code: '400',
            data: []
        }) 
    }

    const post = await Post.findOne({
        where: {
            id
        }
    })

    if (!post) {
        return res.status(400).send( {
            message: `No exists post with id ${id}`,
            code: '400',
            data: []
        })
    }

    try {
        await post.destroy()

        fs.unlink(decodeURI(__basedir + "/uploads/" + path.parse(post.photo).base), function(err) {
            if (err) {
                console.log(err)
                return res.send({
                    message: `Error delete photo, but succes delete post with id ${post.id}`,
                    code: '200',
                    data: []
                })
            } else {
                return res.send({
                    message: `Post id ${id} has been deleted`,
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