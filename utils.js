// Common utils
const math = require('mathjs');

// Least common multiple
module.exports.lcm = (numArr) => {
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

// Print control
module.exports.print = (stuffToPrint) => {
  console.log(stuffToPrint);
};
