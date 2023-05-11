const Song = require('../models/Song');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllSongs = async (req, res) => {
  // get all songs under the userId
  const songs = await Song.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ songs, count: songs.length });
};

const getSong = async (req, res) => {
  const { userId } = req.user;
  const { id: songId } = req.params;

  const song = await Song.findOne({ _id: songId, createdBy: userId });
  if (!song) {
    throw new NotFoundError(`No song with id ${songId}`);
  }
  res.status(StatusCodes.OK).json({ song });
};
const createSong = async (req, res) => {
  //create a property createBy on req.body and assign to req.user.userId
  req.body.createdBy = req.user.userId;
  const song = await Song.create(req.body);
  res.status(StatusCodes.CREATED).json({ song });
};

const updateSong = async (req, res) => {
  const { userId } = req.user;
  const { id: songId } = req.params;
  const { title, artist } = req.body;
  if (title === '' || artist === '') {
    throw new BadRequestError('Title or artist cannot be empty');
  }

  const updateSong = await Song.findByIdAndUpdate(
    {
      _id: songId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updateSong) {
    throw new NotFoundError(`No song with id ${songId}`);
  }
  res.status(StatusCodes.OK).send({ updateSong });
};
const deleteSong = async (req, res) => {
  const { userId } = req.user;
  const { id: songId } = req.params;

  const song = await Song.findOneAndRemove({
    _id: songId,
    createdBy: userId,
  });
  if (!song) {
    throw new NotFoundError(`No song with id ${songId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
};
