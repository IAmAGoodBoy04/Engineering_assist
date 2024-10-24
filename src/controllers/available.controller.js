const mongoose = require('mongoose');
const AvailableCollege = require('../models/available_colleges.model');
const AvailableTextbook = require('../models/available_textbooks.model');

exports.addCollege = async (req, res) => {
  try {
    const college = new AvailableCollege({ name: req.body.name });
    await college.save();

    await mongoose.connection.createCollection(req.body.name);

    res.status(201).send({ message: 'College added successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error adding college', error: error.message });
  }
};

exports.addTextbook = async (req, res) => {
  try {
    const textbook = new AvailableTextbook({
      name: req.body.name,
      userID: req.body.userId
    });
    await textbook.save();
    res.status(201).send({ message: 'Textbook added successfully' });
  } catch (error) {
    console.log(req.body);
    console.log(error);
    res.status(500).send({ message: 'Error adding textbook', error: error.message });
  }
};

exports.getColleges = async (req, res) => {
  try {
    const colleges = await AvailableCollege.find();
    res.status(200).send(colleges);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching colleges', error: error.message });
  }
};

exports.getTextbooks = async (req, res) => {
  try {
    const userID = req.query.userId;
    if (!userID) {
      return res.status(400).send({ message: 'userID query parameter is required' });
    }
    const textbooks = await AvailableTextbook.find({ userID: userID });
    res.status(200).send(textbooks);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching textbooks', error: error.message });
  }
};