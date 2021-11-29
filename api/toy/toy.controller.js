const toyService = require('./toy.service.js');
const reviewService = require('../review/review.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getToys(req, res) {
  try {
    var queryParams = req.query;
    const toys = await toyService.query(queryParams)
    res.json(toys);
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}
async function getLabels(req, res) {
  try {
    const labels = await toyService.labelQuery()
    res.json(labels);
  } catch (err) {
    logger.error('Failed to get labels', err)
    res.status(500).send({ err: 'Failed to get labels' })
  }
}

// GET BY ID 
async function getToyById(req, res) {
  try {
    // console.log('controller ');
    const toyId = req.params.id;
    const toy = await toyService.getById(toyId);
    toy.review = await reviewService.query({aboutToyId:toyId})
    console.log(toy);
    res.json(toy)
  } catch (err) {

    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

// POST (add toy)
async function addToy(req, res) {
  try {
    const toy = req.body;
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

// PUT (Update toy)
async function updateToy(req, res) {
  console.log('heyush');
  try {
    const toy = req.body;
    console.log('toy before update',toy);
    const updatedToy = await toyService.update(toy)
    console.log('toy after update', updatedToy);
    res.json(updatedToy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}

// DELETE (Remove toy)
async function removeToy(req, res) {
  try {
    const toyId = req.params.id;
    const removedId = await toyService.remove(toyId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

module.exports = {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  getLabels
}
