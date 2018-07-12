function sortJobs(str) {
  // case for empty string
  if (!str.length) {
    return '';
  } else if (!str.includes('=>')) {
    return str.replace(/\s/g, '');
  } else {
    return sortJobsWithDependants(str);
  }
}

function sortJobsWithDependants(str) {
  const jobsArr = [];
  const dependantsArr = [];
  str.split('\n').forEach((job, index) => {
    !job[5] ? dependantsArr.push(null) : dependantsArr.push(job[5]);
    jobsArr.push(job[0]);
  });
  return jobsArr;
}

module.exports = { sortJobs };
