module.exports = (schedule) => {
  const plot = [];

  for (let taskIdx = 0; taskIdx < schedule.taskCount; taskIdx += 1) {
    plot.push([`T${taskIdx + 1}|`]);
  }

  for (let time = 0; time < schedule.plotDuration; time += 1) {
    for (let taskIdx = 0; taskIdx < schedule.taskCount; taskIdx += 1) {
      if (schedule.schedule[time] === `T${taskIdx + 1}`) {
        // plot[taskIdx] += ' \u25A0 ';
        plot[taskIdx] += ' x ';
      } else {
        plot[taskIdx] += ' _ ';
      }
    }
  }

  console.log(`Schedule for ${schedule.algorithm} algorithm:`);
  for (let line = 0; line < plot.length; line += 1) {
    console.log(plot[line]);
  }
  if (schedule.result === true) {
    console.log('All deadlines are OK.');
  } else {
    console.log('Deadline missed:');
    console.log(schedule.reason);
  }
};
