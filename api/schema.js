const { default: mongoose } = require("mongoose");

const LogSchema = new mongoose.Schema({
  type: String, //"ENTER" | "SHUTDOWN" | "ON"
  time: {
    day: Number,
    h: Number,
    m: Number,
  },
});

const TimeTableSchema = new mongoose.Schema({
  from: {
    day: Number,
    h: Number,
    m: Number,
  },
  to: {
    day: Number,
    h: Number,
    m: Number,
  },
});

const OnDurationSchema = new mongoose.Schema({
  from: {
    h: Number,
    m: Number,
    day: Number,
  },
  to: {
    h: Number,
    m: Number,
    day: Number,
  },
  dur: Number,
});

LogSchema.set("timestamps", true);
TimeTableSchema.set("timestamps", true);
OnDurationSchema.set("timestamps", true);

module.exports = {
  LogSchema,
  TimeTableSchema,
  OnDurationSchema,
};
