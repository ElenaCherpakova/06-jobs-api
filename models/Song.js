const mongoose = require('mongoose');
const { Schema } = mongoose;

const SongSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a song name'],
      maxLength: 100,
    },
    artist: {
      type: String,
      required: [true, 'Please provide an artist'],
      maxLength: 100,
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'energetic', 'relaxed'],
      default: 'happy',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Song', SongSchema);
