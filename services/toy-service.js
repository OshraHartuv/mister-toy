const fs = require('fs');
const gToys = require('../data/toy.json');
const gLabels = require('../data/label.json');

module.exports = {
  query,
  getById,
  remove,
  save,
  getLabels
};

function getLabels(){
  return Promise.resolve(gLabels);

}

function query() {
  return Promise.resolve(gToys);
}

function getById(toyId) {
  const toy = gToys.find((toy) => toy._id === toyId);
  return Promise.resolve(toy);
}

function remove(toyId) {
  const idx = gToys.findIndex((toy) => toy._id === toyId);
  gToys.splice(idx, 1);
  return _saveToysToFile();
}

function save(toy) {
  if (toy._id) {
    const idx = gToys.findIndex((currToy) => currToy._id === toy._id);
    gToys.splice(idx, 1, toy);
    return _saveToysToFile().then(() => toy);
  } else {
    toy._id = _makeId();
    toy.createdAt = Date.now();
    gToys.push(toy);
    return _saveToysToFile()
      .then(() => toy);
  }
}

function _makeId(length = 5) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
