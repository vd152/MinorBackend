const csv = require("csvtojson");
const MusicData = require("../models/musicDataModel");
const fs = require('fs');
const path = require('path')

exports.getSongByMood = async (req, res) => {
  // MusicData.find({mood: req.params.mood}).then(songs=>{
  //   return res.status(200).json({songs})
  // }).catch(err => {
  //   console.log(err)
  // })
  MusicData.findRandom({mood: req.params.mood},{}, {limit: 5},(err, results) =>{
    if (!err) {
      return res.status(200).json({songs: results})
    }
  })
};
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
exports.saveMusicData = async (req, res) => {
  const csvFilePath = "D:/webdev stuff/minor project/music app backend/data/music.csv";
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
exports.classifyMusicData = async (req, res) => {
  const csvFilePath = "D:/webdev stuff/minor project/music app backend/data/mean.csv";
  let result;
  try {
    result = await csv().fromFile(csvFilePath);
  } catch (e) {
    console.log(e);
  }
  function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}
for(let i = 1; i <= 1000; i++){
  MusicData.findOne({id: i}).then(song=>{
    let tmp={}
    let acousticness = 1.000000, danceability = 1.000000, energy = 1.000000, instrumentalness= 1.000000, liveness = 1.000000, loudness = 1.000000, speechiness = 1.000000, tempo = 1.000000, valence = 1.000000;
    result.forEach(mean=>{
      if(Math.abs(mean.acousticness-song.features.acousticness) < acousticness){
        acousticness = Math.abs(mean.acousticness-song.features.acousticness);
        tmp.acousticness = mean.emotion
      }
      if(Math.abs(mean.danceability-song.features.danceability) < danceability){
        danceability = Math.abs(mean.danceability-song.features.danceability);
        tmp.danceability = mean.emotion
      }
      if(Math.abs(mean.energy-song.features.energy) < energy){
        energy = Math.abs(mean.energy-song.features.energy);
        tmp.energy = mean.emotion
      }
      if(Math.abs(mean.instrumentalness-song.features.instrumentalness) < instrumentalness){
        instrumentalness = Math.abs(mean.instrumentalness-song.features.instrumentalness);
        tmp.instrumentalness = mean.emotion
      }
      if(Math.abs(mean.liveness-song.features.liveness) < liveness){
        liveness = Math.abs(mean.liveness-song.features.liveness);
        tmp.liveness = mean.emotion
      }
      if(Math.abs(mean.loudness-song.features.loudness) < loudness){
        loudness = Math.abs(mean.loudness-song.features.loudness);
        tmp.loudness = mean.emotion
      }
      if(Math.abs(mean.speechiness-song.features.speechiness) < speechiness){
        speechiness = Math.abs(mean.speechiness-song.features.speechiness);
        tmp.speechiness = mean.emotion
      }
      if(Math.abs(mean.tempo-song.features.tempo) < tempo){
        tempo = Math.abs(mean.tempo-song.features.tempo);
        tmp.tempo = mean.emotion
      }
      if(Math.abs(mean.valence-song.features.valence) < valence){
        valence = Math.abs(mean.valence-song.features.valence);
        tmp.valence = mean.emotion
      }
    })
    let arr = [];
    Object.keys(tmp).forEach(key => arr.push(tmp[key]))
    console.log(song.songName + " ->"+ mode(arr))
    MusicData.findOneAndUpdate({id: i}, {$set: {"mood": mode(arr)}}, {new: true}).then(data=>{
      console.log(data)
    }).catch(err => {
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  })
}
};
