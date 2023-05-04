const express = require('express');
const router = express.Router();

const {
  getAllSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
} = require('../controllers/songs');

router.route('/').post(createSong).get(getAllSongs);
router.route('/:id').get(getSong).patch(updateSong).delete(deleteSong);

module.exports = router;