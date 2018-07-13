function sortJobs(str) {
  // case for empty string
  if (!str.length) {
    return '';
    // case for jobs with no dependants
  } else if (!str.includes('=>')) {
    return str.replace(/\s/g, '');
    // case for jobs with dependants
  } else {
    return sortJobsWithDependants(str);
  }
}

function sortJobsWithDependants(str) {
  let err = false;
  const jobsArr = [];
  const dependantsArr = [];
  str.split('\n').forEach(job => {
    !job[5] ? dependantsArr.push(null) : dependantsArr.push(job[5]);
    jobsArr.push(job[0]);
  });
  return switchDepPlaces(jobsArr, dependantsArr, err);
}

function switchDepPlaces(jobs, dependants, err) {
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i] === dependants[i]) {
      err = 'Jobs cannot depend on themselves.';
      return err;
    }
    const depIndex = jobs.indexOf(dependants[i]);
    if (i < depIndex) {
      let temp = jobs[i];
      jobs[i] = jobs[depIndex];
      jobs[depIndex] = temp;
      temp = dependants[i];
      dependants[i] = dependants[depIndex];
      dependants[depIndex] = temp;
      i--;
    }
  }

  return jobs.join('');
}

module.exports = { sortJobs };
