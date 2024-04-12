const checkIfClassIsHappening = async (epoch, TimeTable) => {
  const time = new Date(epoch);
  const day = time.getDay();

  const h = time.getHours();
  const m = time.getMinutes();

  const timetable = await TimeTable.find({});
  let isClass = false;
  let switchOffAt = new Date();

  timetable.forEach((t) => {
    const from = new Date();
    const to = new Date();
    const now = new Date();

    from.setHours(t.from.h);
    from.setMinutes(t.from.m);

    to.setHours(t.to.h);
    to.setMinutes(t.to.m);

    now.setHours(h);
    now.setMinutes(m);

    if (now >= from && now <= to && day === t.from.day) {
      isClass = true;
      switchOffAt = new Date();
      switchOffAt.setHours(t.to.h);
      switchOffAt.setMinutes(t.to.m);
      console.log("Class is happening, switch off at", switchOffAt);
    }
  });
  return { isClass, switchOffAt };
};

module.exports = {
  checkIfClassIsHappening,
};
