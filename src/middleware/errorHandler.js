const { HttpError } = require('../utils/error');

const errorHandler = (error, req, res, next) => {
  console.error('Errors: ', error);
  if (error instanceof HttpError) {
    res.status(error.code).json(error);
  } else {
    res.status(500).json();
  }
};

module.exports = { errorHandler }
