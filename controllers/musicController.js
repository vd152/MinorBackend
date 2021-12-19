const csv = require("csvtojson");
const MusicData = require("../models/musicDataModel");
const fs = require('fs');
const path = require('path')

exports.getAudioMood = async (req, res) => {};
exports.searchSongs = async (req, res) => {
  const searchWord = req.query.search
  MusicData.find({ songName: { $regex: searchWord, $options: "i" }}).limit(100).then(results=>{
    return res.status(200).json({
      songs: results
    })
  }).catch(err => {
    console.log(err)
    return res.status(500).json({message: "Something went wrong."})
  })
}
exports.getSongByYear = async (req, res) => {
  let year = req.params.year
  MusicData.find({year: year}).sort({'popularity': -1}).then(results=>{
    //console.log(results)
    return res.status(200).json({
      songs: results
    })
  }).catch(err=>{
    return res.status(500).json({message: "Something went wrong."})
  })
};
exports.getPopularSongs = async (req, res) => {
  MusicData.find({}).sort({'popularity': -1}).limit(100).then(results=>{
    return res.status(200).json({
      songs: results
    })
  }).catch(err=>{
    console.log(err)
    return res.status(500).json({message: "Something went wrong."})
  })
}
exports.saveMusicData = async (req, res) => {
  const csvFilePath = "C:/Users/Vidhi/Desktop/music app backend/data/music.csv";
  let result;
  try {
    result = await csv().fromFile(csvFilePath);
  } catch (e) {
    console.log(e);
  }
  result.forEach((song) => {
    const musicData = new MusicData({
      id: parseInt(song.id),
      songName: song.song_clean,
      artistName: song.artist_clean,
      ftArtist: song.artist_featured.lengh == '' ? null : song.artist_featured,
      explicit: song.explicit == "0" ? false : true,
      popularity: song.popularity,
      year: song.year,
      features: {
        acousticness: song.acousticness,
        danceability: song.danceability,
        energy: song.energy,
        instrumentalness: song.instrumentalness,
        liveness: song.liveness,
        loudness: song.loudness,
        speechiness: song.speechiness,
        tempo: song.tempo,
        valence: song.valence,
      },
    });
    musicData
      .save()
      .then((savedSong) => {
        console.log(savedSong.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }); 
    //return res.status(200).json({message:`successfully added songs`});
};
exports.getMusicById = async (req, res) => {
  let audioId = req.params.id
  var filePath = path.join(__dirname, `../data/musicData/${audioId}.mp3`);
  var stat = fs.statSync(filePath);
  var total = stat.size;
  if (req.headers.range) {
      var range = req.headers.range;
      var parts = range.replace(/bytes=/, "").split("-");
      var partialstart = parts[0];
      var partialend = parts[1];

      var start = parseInt(partialstart, 10);
      var end = partialend ? parseInt(partialend, 10) : total-1;
      var chunksize = (end-start)+1;
      var readStream = fs.createReadStream(filePath, {start: start, end: end});
      res.writeHead(206, {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
          'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg'
      });
      readStream.pipe(res);
   } else {
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
      fs.createReadStream(filePath).pipe(res);
   }
}