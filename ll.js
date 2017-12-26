const arraySort = require('array-sort');

const calculateLexity = (currentTime, task) => task.deadline - (task.computationTime + currentTime);

module.exports.check = (tasks) => {
  let totalComputationTime = 0;
  let latestDeadline = 0;
  if (tasks.length > 1) {
    for (let taskIdx = 0; taskIdx < tasks.length; taskIdx += 1) {
      if (tasks[taskIdx].arrivalTime >= tasks[taskIdx].deadline ||
          tasks[taskIdx].arrivalTime + tasks[taskIdx].computationTime > tasks[taskIdx].deadline) {
        return false;
      }

      if (tasks[taskIdx].deadline > latestDeadline) {
        latestDeadline = tasks[taskIdx].deadline;
      }

      totalComputationTime += tasks[taskIdx].computationTime;
    }

    if (totalComputationTime <= latestDeadline) {
      return true;
    }
  }
  return false;
};

module.exports.run = (tasks) => {
  const scheduleInfo = {
    algorithm: 'LL',
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

  for (let time = 0; time < scheduleInfo.plotDuration; time += 1) {
    // Select a task by calculating it's lexity
    let taskIdx = 0;
    let currLeastLexity = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < scheduleInfo.taskCount; i += 1) {
      if (sortedTasks[i].arrivalTime <= time
        && time < sortedTasks[i].deadline
        && sortedTasks[i].computationTime > 0) {
        const lexity = calculateLexity(time, sortedTasks[i]);

        if (lexity < currLeastLexity) {
          currLeastLexity = lexity;
          taskIdx = i;
        }
      }
    }
    if (currLeastLexity !== Number.MAX_SAFE_INTEGER) {
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
