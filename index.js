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

  addJobsConditionally() {
    const jobPairs = this.createReferenceArray();
    let jobString = '';

    // use a "for" loop instead of .forEach() or .reduce() because it is the fastest way of looping
    for (let i = 0; i < jobPairs.length; i++) {

      // destructure the key-value pairs from each nested array
      const [job, dependant] = jobPairs[i];

      // check if the job/dependant contains any special characters or digits before going forward
      if (job.match(/\d|\W/) || (dependant && dependant.match(/\d|\W/))) return 'The data is invalid.';

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

    // once all jobs have been added based on dependants, check for circular dependencies, i.e. first and last job in string are the same
    // if no circular dependency, return the job string back to the sortJobs function
    return jobString[0] === jobString[jobString.length - 1] ? 'Jobs cannot have circular dependencies.' : jobString;
  }

  createReferenceArray() {

    // create reference array with key-value pairs for job: dependant
    const refObj = {};
    const jobArr = this.string.split('\n');
    // checks that data format matches what should be passed
    if (!this.checkForInvalidData(jobArr)) return 'The data is invalid.';

    // if data format is valid, creates a reference object of job: dependant key-value pairs
    for (let i = 0; i < jobArr.length; i++) {
      let job = jobArr[i];
      !job[5]
        ? (refObj[job[0]] = undefined)
        : (refObj[job[0]] = job[5]);
    }
    // returns an array of nested arrays of job / job: dependant pairs
    return Object.entries(refObj);
  }

  checkForInvalidData(array) {
    // loops through the array of jobs and checks for two cases (regardless of lower/upper case letters)
    // - if job either has no dependants (i.e. is 4 characters long) AND does not match the format of letter + ' =>'
    // OR job has dependants (i.e. 6 chars long) AND does not match the format of letter + ' => ' + letter
    // return a falsy value which then returns an invalid data error back in createReferenceArray() before going through rest of code
    for (let i = 0; i < array.length; i++) {
      if (!(array[i].length === 4 && /[a-z]{1} =>/gi.test(array[i])
        || (array[i].length === 6 && /[a-z]{1} => [a-z]{1}/gi.test(array[i])))) {
        return false;
      } else {
        return true;
      }
    }
  }
}

module.exports = { sortJobs };
