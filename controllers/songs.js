const Song = require('../models/Song');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllSongs = async (req, res) => {
  res.send('get all songs');
};

const getSong = async (req, res) => {
  res.send('get one song');
};
const createSong = async (req, res) => {
  //create a property createBy on req.body and assign to req.user.userId
  req.body.createdBy = req.user.userId;
  const song = await Song.create(req.body);
  res.status(StatusCodes.CREATED).json({ song });
};

const updateSong = async (req, res) => {
  res.send('update a song');
};
const deleteSong = async (req, res) => {
  res.send('delete a song');
};

module.exports = {
  getAllSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
};
