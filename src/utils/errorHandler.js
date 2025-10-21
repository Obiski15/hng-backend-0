const errorHandler = (err, _, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(err.statusCode ?? 500).json({
    status: "error",
    message: !err.isOperational ? "Something went wrong" : err.message,
  });

  next();
};

module.exports = errorHandler;
