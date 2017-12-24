const arraySort = require('array-sort');

module.exports.check = (tasks) => {
  if (tasks.length > 1) {
    for (let taskIdx = 0; taskIdx < tasks.length; taskIdx += 1) {
      if (tasks[taskIdx].arrivalTime >= tasks[taskIdx].deadline ||
          tasks[taskIdx].arrivalTime + tasks[taskIdx].computationTime > tasks[taskIdx].deadline) {
        return false;
      }
    }
    return true;
  }
  return false;
};

module.exports.run = (tasks) => {
  const scheduleInfo = {
    algorithm: 'EDF',
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

  // Sort tasks: lowest deadline first
  arraySort(sortedTasks, 'deadline');

  for (let time = 0; time < scheduleInfo.plotDuration; time += 1) {
    // Select a task by looking at it's arrival time and remaining computation time
    let taskIdx;
    for (taskIdx = 0; taskIdx < scheduleInfo.taskCount; taskIdx += 1) {
      if (sortedTasks[taskIdx].arrivalTime <= time
        && time < sortedTasks[taskIdx].deadline
        && sortedTasks[taskIdx].computationTime > 0) {
        break;
      }
    }

    // Push current process to the schedule array
    scheduleInfo.schedule.push(sortedTasks[taskIdx].name);
    sortedTasks[taskIdx].computationTime -= 1;

    // Check deadline
    if (time + 1 === sortedTasks[taskIdx].deadline && sortedTasks[taskIdx].computationTime > 0) {
      scheduleInfo.result = false;
      scheduleInfo.reason += `Task '${sortedTasks[taskIdx].name}' missed it's deadline at time=${time + 1}.\n`;
    }
  }

  return scheduleInfo;
};
