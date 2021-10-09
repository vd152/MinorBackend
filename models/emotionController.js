const faceapi = require('face-api.js');
const canvas  = require('canvas')

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

exports.getEmotion = async(req, res)=>{
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./public/models')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./public/models');
    await faceapi.nets.faceExpressionNet.loadFromDisk('./public/models');

    const image = "https://vidhiangrish.com/assets/img/picture.png"
    const img = await canvas.loadImage(image)
    try{
        const detections = await faceapi.detectSingleFace(img).withFaceExpressions();
        return res.json({ 
            detections
        })
    }catch(err){
        console.log(err)
        return res.json({ 
            error: err
        })
    }
}