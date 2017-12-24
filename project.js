const fs = require('fs');
const readLine = require('readline');
const path = require('path');
// const math = require('mathjs');

// scheduling algorithms
const edd = require('./edd');
const edf = require('./edf');
const ll = require('./ll');
const rm = require('./rm');

// plotter
const plot = require('./plot');

const tasks = [];

function checkAllAperiodic() {
  for (let i = 0; i < tasks.length; i += 1) {
    if (tasks[i].isPeriodic === true) {
      return false;
    }
  }
  return true;
}

function readTasksFromFile() {
  let inputFileName = process.argv[2];

  if (typeof inputFileName === 'undefined') {
    inputFileName = 'input.txt';
  }

  const filename = path.join(__dirname, inputFileName);

  const lineReader = readLine.createInterface({
    input: fs.createReadStream(filename),
  });

  let lineCount = 0;
  lineReader.on('line', (line) => {
    if (lineCount === 0) {
      // console.log(`${line} tasks will be scheduled.`);
      lineCount += 1;
    } else {
      const task = line.split(' ');
      const taskObj = {
        name: `T${lineCount}`,
        isPeriodic: task[0] === '0',
        arrivalTime: parseInt(task[1], 10),
        computationTime: parseInt(task[2], 10),
        deadline: parseInt(task[3], 10),
      };
      tasks.push(taskObj);
      lineCount += 1;
    }
  });

  lineReader.on('close', () => {
    if (checkAllAperiodic() === true) {
      // Run aperiodic task schedulers EDD, EDF, LL
      if (edd.check(tasks)) {
        const eddSchedule = edd.run(tasks);
        plot(eddSchedule);
      } else {
        console.log('Cannot schedule with EDD!');
      }

      if (edf.check(tasks)) {
        const edfSchedule = edf.run(tasks);
        plot(edfSchedule);
      } else {
        console.log('Cannot schedule with EDF!');
      }

      if (ll.check(tasks)) {
        const llSchedule = ll.run(tasks);
        plot(llSchedule);
      } else {
        console.log('Cannot schedule with LL!');
      }
    } else {
      // Run periodic schedulers RM, EDF
      if (edf.check(tasks)) {
        const edfSchedule = edf.run(tasks);
        plot(edfSchedule);
      } else {
        console.log('Cannot schedule with EDF!');
      }

      if (rm.check(tasks)) {
        const rmSchedule = rm.run(tasks);
        plot(rmSchedule);
      } else {
        console.log('Cannot schedule with RM!');
      }
    }
  });
}

readTasksFromFile();
