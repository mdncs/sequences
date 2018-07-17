
# sequences

## Description

This repo consists of a main function sortJobs() which takes an input in the format of "letter =>" (for single jobs with no dependants) or "letter =>\nletter =>\nletter =>" (for multiple jobs with no dependants) or "leter => letter\nletter => letter" (for multiple jobs with dependats) etc. and returns the jobs sorted with the dependants places ahead of the jobs depending on them.

A funtional approach was initially employed in creating pure functions which would then be called within the main sortJobs() function (as evident from the commit history). The functions were then all refactored into one class SortedJobsWithDependants which is then called as a constructor and creates a string with ordered jobs within the sortJobs() function. This OOP approach is more in line with the OOP style in Ruby.

The main function sortJobs() handles some of the base cases, e.g. empty string passed to the function.
All necessary loops have been done with a "for" loop instead of JS array methods like forEach() or reduce() since "for" loops are less computationally intensive and also faster.

The initial approach (as evident in previous commits) was to modify the initial string given by creating 2 arrays (one for jobs and one for dependants), then checking for equivalency and indexes in order to switch places between jobs and dependants based on positions in the dependants array. However, checking for circular dependency would be unnecessarily complex with this approach (e.g. with a "while" loop within a "for" loop, or by creating a job string anyway). In this case, simply adding jobs conditionally to a string seemed much simpler than switching jobs' places in an array based on indexes in a second array.

The expected outcome was tested at each step via TDD with Mocha and Chai. Individual class methods have not been tested, as their outcome already has been (e.g. checking for invalid data formats via main function).


## Cases

1. Main base cases: Write a function sortJobs() which checks for empty strings and for single, no-dependant jobs.
    - Case for empty string:
        ```
        !str.length ? ''
        ```
    - Case for single job with no dependants:
        ```
        str.length === 4 && str.match(/[a-z]{1} =>/) ? str[0]
        ```
2. Non-base cases: 
- If sortJobs() has not already returned, it returns a new sorted list constructed by a class SortedJobsWithDependants. The method createReferenceArray() first creates a reference object for key/value pairs of jobs and dependants, then returns an array with nested arrays consisting of job/dependant pairs:

        createReferenceArray() {

          const refObj = {};
          const jobArr = this.string.split('\n');
          for (let i = 0; i < jobArr.length; i++) {
            let job = jobArr[i];
            !job[5]
              ? (refObj[job[0]] = undefined)
              : (refObj[job[0]] = job[5]);
          }
          return Object.entries(refObj);
        }
        
- The final sorted list is created by the class method addJobsConditionally() which calls the createReferenceArray() method, then uses a "for" loop to destructure the job and the dependants for each nested array for simplicity (instead of working with array[i][0] and array[i][1]), and then check for different conditions and add jobs/dependants to an empty string conditionally:

    ```
    addJobsConditionally() {
          const jobPairs = this.createReferenceArray();
          let jobString = '';
          for (let i = 0; i < jobPairs.length; i++) {
            const [job, dependant] = jobPairs[i];
          }
        }

- While looping, the method conditionally adds letters to the initially empty string (use of ternary operator instead of "if" statements for cleaner code):

    - no dependants (i.e. if dependant is undefined, and string does not already include the job, then concatenate the job to the already-existing string):
        ```
        if (!dependant) {
          if (!jobString.includes(job)) jobString += job;
        }
        ```
    - with dependants not already in string (i.e. if dependancy has not been satisfied and job does not exist in the string, first add the dependant to ensure dependency is satisfied, then add job):
        ```
        !jobString.includes(job) && !jobString.includes(dependant) ?
            jobString += dependant + job
        ```
    - with dependants already in string (i.e. dependancy has already been satisfied):
        ```
        jobString.includes(dependant) ? jobString += job
        ```
    - all other cases, add the dependant at the very beginning of the string to ensure dependancy is satisfied:
        ```
        jobString = dependant + jobString;
        ```

3. More edge cases and cases with error output: 

- before creating the reference array, the method checkForInvalidData() takes an array of jobs, then ensures the data passed is in the format "letter =>" for no-dependant jobs or "letter => letter" for jobs with dependants. If the job is neither 4-characters long AND the correct format, OR 6-characters long AND the correct format, then this method returns a value of false, which is then checked in the createReferenceArray() method to ensure format is valid and returns an error if it is not.

    ```
    for (let i = 0; i < array.length; i++) {
      if (!(array[i].length === 4 && /[a-z]{1} =>/gi.test(array[i])
        || (array[i].length === 6 && /[a-z]{1} => [a-z]{1}/gi.test(array[i])))) {
        return false;
      } else {
        return true;
      }
    }
    ```

4. Cases with error output:

- Illegal characters in data: Immediately after entering the "for" loop and destructuring the nested arrays, the method addJobsConditionally() checks that neither the job nor the dependant contain any illegal characters (i.e. anything but letters), such as digits or special characters; else, return an error for invalid data.

        ```
        if (job.match(/\d|\W/) || (dependant && dependant.match(/\d|\W/))) return 'The data is invalid.';
        ```
    
- Self-dependency: Then, the methos checks that the job is not the same as its dependant before running the rest of the code. If they are the same, it returns an error for self-dependency.
    ```
    if (job === dependant) return 'Jobs cannot depend on themselves.';
    ```
    
- Circular dependency: Once all jobs have been added to the string: check for circular dependencies, i.e. first and last job in string are the same; if no circular dependency, return the job string back to the main function
    ```
    return jobString[0] === jobString[jobString.length - 1] ? 'Jobs cannot have circular dependencies.' : jobString;
    ```
    