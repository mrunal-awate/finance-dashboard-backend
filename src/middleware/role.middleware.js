const { errorResponse } = require('../utils/apiResponse');

// Pass allowed roles as array e.g. restrictTo('ADMIN', 'ANALYST')
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Required role: ${roles.join(' or ')}`
      );
    }
    next();
  };
};

module.exports = { restrictTo };