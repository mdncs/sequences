
# sequences

## Intro

The purpose of this exercise is to see how you approach a problem, and how you solve it. We’re interested to see how you structureyour Ruby code, your command of the language and good design and testing principles, bear this in mind throughout.

HINT: Start with a method that accepts a single string argument and returns a string (or a collection) which represents the orderedsequence of jobs (since each job is a single character).

HINT: Brownie points will be given for showing us your working (notes, commit history, some kind of idea how you approached the problem.

HINT: We’re pretty keen on tested code. Have Fun.

## The Challenge

Imagine we have a list of jobs, each represented by a character. Because certain jobs must be done before others, a job may have adependency on another job. For example, a may depend on b, meaning the final sequence of jobs should place b before a. If a has nodependency, the position of a in the final sequence does not matter. Given you’re passed an empty string (no jobs), the result should be an empty sequence.

1. Case for empty string:
    ```
    !str.length ? ''
    ```
2. Base cases: if there are no dependants at all, replace any non-letter character with an empty string. Write a function sortJobs() which checks for empty strings and for any cases without any dependents.

    ```
    !str.includes('=>') ? str.replace(/\s/g, '')
    ```

    - Given the following job structure, the result should be a sequence consisting of a single job a:

        - a =>

    - Given the following job structure, he result should be a sequence containing all three jobs abc in no significant order:

        - a =>
        - b =>
        - c =>

    - Given the following job structure, the result should be a sequence that positions c before b, containing all three jobs abc:

        - a =>
        - b => c
        - c =>

3. Cases where jobs have dependants: If sortJobs() has not already returned, it returns a new sorted list constructed by a class SortedJobsWithDependants.

    - Step 1: write a class SortedJobsWithDependants with a constructor that receives a string and returns a list of jobs sorted by function addJobsConditionally() based on their dependencies.

        ```
        class SortedJobsWithDependants {

          constructor(string) {
            this.string = string;
            this.sortedWithDependants = this.addJobsConditionally();
          }
        }
        ```

    - Step 2: write a function createReferenceArray() which creates a reference object for key/value pairs of jobs and dependants, then returns an array with nested arrays consisting of job/dependant pairs:

        ```
        createReferenceArray() {

          const refObj = {};
          this.string.split('\n').forEach(jobString => !jobString[5]
              ? (refObj[jobString[0]] = undefined)
              : (refObj[jobString[0]] = jobString[5]));
          return Object.entries(refObj);
        }
        ```
    - Step 3: write the function addJobsConditionally() which takes the previously created reference array, creates an empty string as an accumulator, then loops through the array and destructures the job and the dependants for each nested array for simplicity (instead of working with array[i][0] and array[i][1]). Although array methods like .forEach() and .reduce() can also be used, a "for" loop is the fastest way to loop through an array.

        ```
        addJobsConditionally() {
        
          const jobPairs = this.createReferenceArray();
          let jobString = '';
          for (let i = 0; i < jobPairs.length; i++) {
            const [job, dependant] = jobPairs[i];
          }
        }
        ```

        While looping, the function conditionally adds letters to the initially empty string (use of ternary operator instead of "if" statements for cleaner code):

        ```
        // if the job has no dependant and has not yet been added

        if (!dependant) {
          if (!jobString.includes(job)) jobString += job;
        }
        ```
        For cases where the dependant is not undefined:
        
        ```
        // if the string does not include the job nor the dependant, add them both with the dependant first:

        !jobString.includes(job) && !jobString.includes(dependant) ?
          jobString += dependant + job;
        ```
        or else: 
        ```
        // if the dependency has already been satisfied, the job can now be added:

        jobString.includes(dependant) ? jobString += job
        ```
        or in any other case:
        ```
        // add the dependant at the beginning of the string

        : jobString = dependant + jobString;
        ```
        Then check for errors before returning the string.


    - Given the following job structure, the result should be a sequence that positions f before c, c before b, b before e and a before d containing all six jobs abcdef.

        - a =>
        - b => c
        - c => f
        - d => a
        - e => b
        - f =>

4. Cases with error output:

    Immediately after entering the "for" loop, check that the job is not the same as its dependant before running the rest of the code. If they are, return error.
    ```
    if (job === dependant) return 'Jobs cannot depend on themselves.';
    ```
    - Given the following job structure, the result should be an error stating that jobs can’t depend on themselves.

        - a =>
        - b =>
        - c => c

    Once all jobs have been added to the string: check for circular dependencies, i.e. first and last job in string are the same; if no circular dependency, return the job string back to the main function
    ```
    return jobString[0] === jobString[jobString.length - 1] ? 'Jobs cannot have circular dependencies.' : jobString;
    ```

    -  Given the following job structure, the result should be an error stating that jobs can’t have circular dependencies.
        - a =>
        - b => c
        - c => f
        - d => a
        - e =>
        - f => b
    