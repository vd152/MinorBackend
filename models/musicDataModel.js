const mongoose = require("mongoose");
var random = require('mongoose-simple-random');

const musicDataSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    songName: {
      type: String,
      required: true,
    },
    artistName: {
      type: String,
      required: true,
    },
    ftArtist: {
      type: String,
    },
    mood:{
      type: String,
    },
    explicit: {
      type: Boolean,
      required: true,
    },
    popularity: {
      type: String,
    },
    year: {
      type: String,
      required: true,
    },
    features: {
      acousticness: {
        type: String,
      },
      danceability: {
        type: String,
      },
      energy: {
        type: String,
      },
      instrumentalness: {
        type: String,
      },
      liveness: {
        type: String,
      },
      loudness: {
        type: String,
      },
      speechiness: {
        type: String,
      },
      tempo: {
        type: String,
      },
      valence: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);
musicDataSchema.plugin(random);
module.exports = MusicData = mongoose.model("musicData", musicDataSchema, 'musicData');
