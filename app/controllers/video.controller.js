
const fs = require('fs');
const Video = require('../models/videos.model.js');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');

// Create and Save a new Video
exports.create = (req, res) => {

    // create thumbnail from video
    ffmpeg(`${req.file.path}`)
    .on('filenames', function(filenames) {
        console.log('screenshots are ' + filenames.join(', '));
    })
    .on('end', function() {
        console.log('screenshots were saved');
    })
    .on('error', function(err) {
        console.log('an error happened: ' + err.message);
    })
    .screenshots({
        count: 1,
        filename: `${req.file.filename}-thumbnail.png`,
        timestamps: [ '00:00:02.000' ],
        folder: 'uploads/thumbnail',
        size: '250x150'
    });

    // Create a Video object
    const videoData = new Video({
        title: req.body.title,
        description: req.body.description,
        thumbnail: `${req.file.filename}-thumbnail.png`,
        video: req.file.filename
    });

    // Save Video in the database
    videoData.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Video."
        });
    });
};

// Retrieve and return all roles from the database.
exports.findAll = (req, res) => {
	Video.find().sort({createdAt: 'desc'})
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving roles."
        });
    });
};

// Find a single video with a videoId
exports.findOne = (req, res) => {
	Video.findById(req.params.videoId)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Video not found with id " + req.params.videoId
            });
        }

        const path = `uploads/${data.video}`
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range
        //console.log(range); return false;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1

            const chunksize = (end-start)+1
            const file = fs.createReadStream(path, {start, end})
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head)
            file.pipe(res)
        } else {
            const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(path).pipe(res)
        }

    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Video not found with id " + req.params.videoId
            });
        }
        return res.status(500).send({
            message: "Error retrieving Video with id " + req.params.videoId
        });
    });
};

// Delete a video with the specified videoId in the request
exports.delete = (req, res) => {
	Video.findByIdAndRemove(req.params.videoId)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Video not found with id " + req.params.videoId
            });
        }
        res.send({message: "Video deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Video not found with id " + req.params.videoId
            });
        }
        return res.status(500).send({
            message: "Could not delete video with id " + req.params.videoId
        });
    });
};
