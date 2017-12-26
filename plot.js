const utils = require('./utils');

module.exports = (schedule) => {
  const plot = [];

  for (let taskIdx = 0; taskIdx < schedule.taskCount; taskIdx += 1) {
    plot.push([`T${taskIdx + 1}|`]);
  }

  plot.push(['t=0 ']);

  for (let time = 0; time < schedule.plotDuration; time += 1) {
    for (let taskIdx = 0; taskIdx < schedule.taskCount; taskIdx += 1) {
      if (schedule.schedule[time] === `T${taskIdx + 1}`) {
        plot[taskIdx] += 'x|';
      } else {
        plot[taskIdx] += '_|';
      }
    }
    plot[schedule.taskCount] += `${(time + 1) % 10} `;
  }

  utils.print(`Schedule for ${schedule.algorithm} algorithm:`);
  for (let line = 0; line < plot.length; line += 1) {
    utils.print(plot[line]);
  }
  if (schedule.result === true) {
    utils.print('All deadlines are OK.');
  } else {
    utils.print('Deadline missed:');
    utils.print(schedule.reason);
  }
};
