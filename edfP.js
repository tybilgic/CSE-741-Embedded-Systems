const arraySort = require('array-sort');
const utils = require('./utils');

module.exports.check = (tasks) => {
  let utilization = 0;
  if (tasks.length > 1) {
    for (let taskIdx = 0; taskIdx < tasks.length; taskIdx += 1) {
      if (tasks[taskIdx].arrivalTime >= tasks[taskIdx].deadline ||
          tasks[taskIdx].arrivalTime + tasks[taskIdx].computationTime > tasks[taskIdx].deadline) {
        return false;
      }
      utilization += (tasks[taskIdx].requiredTime / tasks[taskIdx].period);
    }
    if (utilization <= 1) {
      return true;
    }
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

  const taskPeriods = [];

  for (let i = 0; i < tasks.length; i += 1) {
    taskPeriods.push(tasks[i].deadline);
  }

  scheduleInfo.plotDuration = utils.lcm(taskPeriods);

  // copy tasks array to sortedTasks
  const sortedTasks = JSON.parse(JSON.stringify(tasks));

  // Sort tasks: earliest deadline first
  arraySort(sortedTasks, 'deadline');

  for (let time = 0; time < scheduleInfo.plotDuration; time += 1) {
    // Go over task list, check periods and update tasks
    for (let i = 0; i < scheduleInfo.taskCount; i += 1) {
      if (sortedTasks[i].isPeriodic === true
        && time === (sortedTasks[i].arrivalTime + sortedTasks[i].period)) {
        sortedTasks[i].arrivalTime += sortedTasks[i].period;
        sortedTasks[i].deadline += sortedTasks[i].period;
        sortedTasks[i].computationTime = sortedTasks[i].requiredTime;
      }
    }

    // Sort by deadline
    arraySort(sortedTasks, 'deadline');

    // Select a task by looking at it's arrival time and remaining computation time
    let taskIdx;
    for (taskIdx = 0; taskIdx < scheduleInfo.taskCount; taskIdx += 1) {
      if (sortedTasks[taskIdx].arrivalTime <= time
        && time < sortedTasks[taskIdx].deadline
        && sortedTasks[taskIdx].computationTime > 0) {
        break;
      }
    }

    if (taskIdx < scheduleInfo.taskCount) {
      // Push current process to the schedule array
      scheduleInfo.schedule.push(sortedTasks[taskIdx].name);
      sortedTasks[taskIdx].computationTime -= 1;

      // Check deadline
      if (time + 1 === sortedTasks[taskIdx].deadline && sortedTasks[taskIdx].computationTime > 0) {
        scheduleInfo.result = false;
        scheduleInfo.reason += `Task '${sortedTasks[taskIdx].name}' missed it's deadline at time=${time + 1}.\n`;
      }
    } else {
      // No task available insert Pass and increase plot duration
      scheduleInfo.schedule.push('P');
      scheduleInfo.plotDuration += 1;
    }
  }
  return scheduleInfo;
};
