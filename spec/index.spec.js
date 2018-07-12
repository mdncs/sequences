const { expect } = require('chai');
const { sortJobs } = require('../index.js');

describe('sortJobs', () => {
  it('returns an empty string when passed an empty string', () => {
    expect(sortJobs('')).to.equal('');
  });
  it('returns the job when passed a string with a single job and no dependants', () => {
    expect(sortJobs('a')).to.equal('a');
    expect(sortJobs('f')).to.equal('f');
  });
  it('returns the jobs as a string when passed jobs with no dependants', () => {
    expect(sortJobs('a b c')).to.equal('abc');
    expect(sortJobs('d e f')).to.equal('def');
  });
});
