function getReply(results) {
  try {
    return results.length > 0 ? {data: results} : {message: 'No results found.'};
  } catch (err) {
    console.log(err);
    return {message: 'Server error!'};
  }
}

export {
  getReply
};