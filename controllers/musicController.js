const csv = require("csvtojson");
const MusicData = require("../models/musicDataModel");

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
