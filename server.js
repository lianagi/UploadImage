const express = require('express')

const upload = require('./multer')

const bodyParser = require('body-parser')

const cloudinary = require('./cloudinary')

const fs = require('fs')

const app = express()

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("hello world")
})

// make a post request

app.use('/upload-images',upload.array('image'), async(req, res) =>{

    const uploader = async (path) => await cloudinary.uploads(path,'Images')

    if(req.method === 'POST'){
        const urls = []

        const files = req.files

        for(const file of files) {
            const {path} = file 

            const newPath = await uploader(path)

            urls.push(newPath)

            fs.unlinkSync(path)
        }
        res.status(200).json({
            message: 'Images Uploaded Successfully',
            data:urls
        })
    }else{
        res.status(405).json({
            err:"Images not uploaded successfully"
        })
    }
})

app.listen(5000, () =>  {
    console.log("Server is listening on Port 5000")
})