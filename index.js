function sortJobs(str) {
  // deal with all base cases here, so that if there are no dependants at all then the conditional sorting function should not run
  // (i.e. more efficiency)

  const { sortedWithDependants } = new SortedJobsWithDependants(str);

  // case for empty string
  return !str.length ? ''

    // case for only one job with no dependants
    : str.length === 4 && str.match(/[a-z]{1} =>/) ? str[0]

      // case for job with dependants
      : sortedWithDependants;
}

class SortedJobsWithDependants {

  constructor(string) {
    this.string = string;
    this.sortedWithDependants = this.addJobsConditionally();
  }

  createReferenceArray() {

    // create reference array with key-value pairs for job: dependant
    const refObj = {};
    const jobArr = this.string.split('\n');
    if (!this.checkForInvalidData(jobArr)) return 'The data is invalid.';
    for (let i = 0; i < jobArr.length; i++) {
      let job = jobArr[i];
      !job[5]
        ? (refObj[job[0]] = undefined)
        : (refObj[job[0]] = job[5]);
    }
    return Object.entries(refObj);
  }

  checkForInvalidData(array) {
    for (let i = 0; i < array.length; i++) {
      if (!(array[i].length === 4 && /[a-z]{1} =>/.test(array[i])
        || (array[i].length === 6 && /[a-z]{1} => [a-z]{1}/.test(array[i])))) {
        return false;
      } else {
        return true;
      }
    }
  }

  addJobsConditionally() {
    const jobPairs = this.createReferenceArray();
    let jobString = '';

    // use a "for" loop instead of .forEach() or .reduce() because it is the fastest way of looping
    for (let i = 0; i < jobPairs.length; i++) {

      // destructure the key-value pairs from each nested array
      const [job, dependant] = jobPairs[i];

      // return error if the job depends on itself
      if (job === dependant) return 'Jobs cannot depend on themselves.';

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

    // check again for special characters or digits in the resulting string
    if (/\d|\W/.test(jobString)) return 'The data is invalid.';

    // once all jobs have been added based on dependants, check for circular dependencies, i.e. first and last job in string are the same
    // if no circular dependency, return the job string back to the sortJobs function
    return jobString[0] === jobString[jobString.length - 1] ? 'Jobs cannot have circular dependencies.' : jobString;
  }
}

module.exports = { sortJobs };
