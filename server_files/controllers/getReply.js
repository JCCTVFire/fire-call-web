function getReply(results) {
  try {
    return results.length > 0 ? {data: results, size: results.length} : {message: 'No results found.'};
  } catch (err) {
    console.error(err);
    return {error: 'Server error'};
  }
}

export {
  getReply
};