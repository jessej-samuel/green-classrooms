const express = require("express");
const odm = require("./odm");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { LogSchema, TimeTableSchema, OnDurationSchema } = require("./schema");
const { checkIfClassIsHappening } = require("./utils");

odm.initDB();

const Log = mongoose.model("logs", LogSchema);
const TimeTable = mongoose.model("timetables", TimeTableSchema);
const OnDuration = mongoose.model("ondurations", OnDurationSchema);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.ip, req.method, req.url);
  next();
});
app.use(cors());
let sus_data= [2055.55, 1988.45]
app.get("/", async (req, res) => {
  const time = new Date();
  if (req.query.time) {
    time.setTime(parseInt(req.query.time));
    console.log(time);
  }
  const log = new Log({
    time: {
      day: time.getDay(),
      h: time.getHours(),
      m: time.getMinutes(),
    },
  });

  checkIfClassIsHappening(time.getTime(), TimeTable, OnDuration).then(
    async ({ isClass, switchOffAt }) => {
      switchOffAt.setSeconds(0);
      const response = isClass ? switchOffAt.getTime() - time.getTime() : 0;

      res.send(response.toString());
      log.type = isClass ? "ENTER" : "SHUTDOWN";
      log.switchOffAt = switchOffAt.getTime();

      // for debugging: set checking date to today
      switchOffAt.setDate(time.getDate());

      if (isClass && switchOffAt.getTime() - time.getTime() > 0.9 * 1000) {
        const onduration = new OnDuration({
          from: {
            h: time.getHours(),
            m: time.getMinutes(),
            day: time.getDay(),
          },
          to: {
            h: switchOffAt.getHours(),
            m: switchOffAt.getMinutes(),
            day: time.getDay(),
          },
          dur: (switchOffAt.getTime() - time.getTime()) / 1000, // in seconds
        });
        const doc = await onduration.save();
      }

      log.save();
    }
  );
});

app.get("/predict_today_consumption", async (req, res) => {
  const prevDurations = await OnDuration.find({
    "from.day": 1,
  });
  if (prevDurations.length === 0) {
    res.json({ avg: 0 });
    return;
  }
  const avg = prevDurations.reduce((acc, curr) => acc + curr.dur, 0);
  res.json({ avg: avg / prevDurations.length });
});

app.get("/last_5_day_consumption", async (req, res) => {
  let data = [];
  for (let i = 1; i <= 5; i++) {
    const prevDurations = await OnDuration.find({
      "from.day": i,
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 6)),
      },
    });
    console.log(prevDurations.length, "docs found");
    if (prevDurations.length === 0) {
      data.push({ day: i, avg: 0, tot: 0 });
    } else {
      const tot = prevDurations.reduce((acc, curr) => acc + curr.dur, 0);
      data.push({
        day: i,
        avg: tot / prevDurations.length / 60 / 60,
        tot: tot / 60 / 60, // /60/60 is for converting into hours
      });
    }
  }
  res.json(data);
});

app.get("/generate", (req, res) => {
  TimeTable.find().then((docs) => {
    for (let i = 0; i < docs.length; i++) {
      const start = new Date();
      const end = new Date();
      start.setHours(docs[i].from.h);
      start.setMinutes(docs[i].from.m);

      end.setHours(docs[i].to.h);
      end.setMinutes(docs[i].to.m);
      // get random time to switch on between start and end
      const randomTime = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      const onduration = new OnDuration({
        from: {
          h: randomTime.getHours(),
          m: randomTime.getMinutes(),
          day: docs[i].from.day,
        },
        to: {
          h: end.getHours(),
          m: end.getMinutes(),
          day: docs[i].from.day,
        },
        dur: (end.getTime() - randomTime.getTime()) / 1000, // in seconds
      });
      onduration.save();
    }
  });
  res.send("done");
});

app.listen(5000, "192.168.189.92");
