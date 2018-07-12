function sortJobs(str) {
  if (!str.length) {
    return '';
  } else if (str.length === 1) {
    return str;
  } else {
    return str.replace(/\s/g, '');
  }
}

module.exports = { sortJobs };
