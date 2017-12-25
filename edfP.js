const arraySort = require('array-sort');
const math = require('mathjs');

const lcm = (numArr) => {
  if (numArr.length > 1) {
    let result = 0;
    result = math.lcm(numArr[0], numArr[1]);
    for (let i = 2; i < numArr.length; i += 1) {
      result = math.lcm(result, numArr[i]);
    }
    return result;
  }
  return false;
};

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

  const taskPeriods = [];

  for (let i = 0; i < tasks.length; i += 1) {
    taskPeriods.push(tasks[i].deadline);
  }

  scheduleInfo.plotDuration = lcm(taskPeriods);

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
