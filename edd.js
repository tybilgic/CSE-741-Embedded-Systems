const arraySort = require('array-sort');

module.exports.check = (tasks) => {
  if (tasks.length > 1) {
    for (let taskIdx = 0; taskIdx < tasks.length; taskIdx += 1) {
      if (tasks[taskIdx].computationTime > tasks[taskIdx].deadline) {
        return false;
      }
    }
    return true;
  }
  return false;
};

module.exports.run = (tasks) => {
  const scheduleInfo = {
    algorithm: 'EDD',
    taskCount: tasks.length,
    schedule: [],
    plotDuration: 0,
    result: true,
    reason: '',
  };

  for (let i = 0; i < tasks.length; i += 1) {
    scheduleInfo.plotDuration += tasks[i].computationTime;
  }

  // copy tasks array to sortedTasks
  const sortedTasks = JSON.parse(JSON.stringify(tasks));

  // Sort tasks: earliest deadline first
  arraySort(sortedTasks, 'deadline');

  // Prepare the schedule
  for (let time = 0, taskIdx = 0; time < scheduleInfo.plotDuration; time += 1) {
    // Push current process to the schedule array
    scheduleInfo.schedule.push(sortedTasks[taskIdx].name);
    sortedTasks[taskIdx].computationTime -= 1;

    // Check deadline
    if (time + 1 === sortedTasks[taskIdx].deadline && sortedTasks[taskIdx].computationTime > 0) {
      scheduleInfo.result = false;
      scheduleInfo.reason += `Task '${sortedTasks[taskIdx].name}' missed it's deadline at time=${time + 1}.\n`;
    }
    // If remaining computation time for the current process is zero, proceed to next process
    if (sortedTasks[taskIdx].computationTime === 0) {
      taskIdx += 1;
    }
  }

  return scheduleInfo;
};
