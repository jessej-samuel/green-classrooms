const mongoose = require("mongoose");

const init = async () => {
  await mongoose.connect("mongodb://localhost:27017/green-classrooms");
};

module.exports = {
  initDB: init,
};
