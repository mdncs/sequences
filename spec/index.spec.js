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
  it('returns the jobs ordered in a string when passed jobs with dependants', () => {
    // expect(sortJobs('a =>\nb => c\nc =>')).to.equal('acb');
    expect(sortJobs('a =>\nb => c\nc => f\nd => a\ne => b\nf =>')).to.equal(
      'facbde'
    );
  });
  it('returns an error if any job depends on itself', () => {
    expect(sortJobs('a =>\nb =>\nc => c')).to.equal(
      'Jobs cannot depend on themselves.'
    );
  });
  it('returns an error where jobs have circular dependencies', () => {
    expect(sortJobs('a =>\nb => c\nc => f\nd => a\ne =>\nf => b')).to.equal(
      'Jobs cannot have circular dependencies.'
    );
  });
});
