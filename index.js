function sortJobs(str) {
  // deal with all base cases here, so that if there are no dependants at all then the conditional sorting function should not run
  // (i.e. more efficiency)

  // case for empty string
  return !str.length ? ''

    // case for jobs with no dependants
    : !str.includes('=>') ? str.replace(/\s/g, '')

      // case for jobs with dependants
      : sortJobsWithDependants(str);
}

function sortJobsWithDependants(str) {

  const refObj = {};
  // create reference object with key-value pairs for job: dependant
  str.split('\n').forEach(jobString => !jobString[5]
    ? (refObj[jobString[0]] = undefined)
    : (refObj[jobString[0]] = jobString[5]));

  // pass array of nested arrays of job-dependant pairs to conditional sorting function
  return addJobsConditionally(Object.entries(refObj));
}

function addJobsConditionally(jobPairs) {

  let jobString = '';

  // use a "for" loop instead of .forEach() or .reduce() because it is the fastest way of looping
  for (let i = 0; i < jobPairs.length; i++) {

    // destructure the key-value pairs from each nested array
    const [job, dependant] = jobPairs[i];

    // return error if the job depends on itself
    if (job === dependant) {
      err = 'Jobs cannot depend on themselves.';
      return err;
    }

    // for cases where dependant is undefined, i.e. job has no dependency
    if (!dependant) {

      // ensure the string does not already include the job, otherwise ignore it
      if (!jobString.includes(job)) jobString += job;

      // for cases where dependant is defined
    } else {

      // if the string does not include both job AND dependant, then add dependant before adding the job
      !jobString.includes(job) && !jobString.includes(dependant) ?
        jobString += dependant + job

        // if the dependency has been satisfied, i.e. dependent has been added, then job can be added directly
        : jobString.includes(dependant) ? jobString += job

          // for all other cases, add dependant before all the previously added jobs & dependants
          : jobString = dependant + jobString;
    }
  }

  // once all jobs have been added based on dependants, check for circular dependencies, i.e. first and last job in string are the same
  // if no circular dependency, return the job string back to the sortJobs function
  return jobString[0] === jobString[jobString.length - 1] ? 'Jobs cannot have circular dependencies.' : jobString;
}

module.exports = { sortJobs };
