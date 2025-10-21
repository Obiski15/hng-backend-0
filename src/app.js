const express = require("express");
const rateLimit = require("express-rate-limit");
const catchAsync = require("./utils/catchAsync");
const errorHandler = require("./utils/errorHandler");

const { NAME, STACK, EMAIL } = require("./utils/constants");
const getFact = require("./utils/helpers");

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.get(
  "/me",
  catchAsync(async (_, res) => {
    const fact = await getFact();

    const data = {
      status: "success",
      user: {
        email: EMAIL,
        name: NAME,
        stack: STACK,
      },
      timestamp: new Date().toISOString(),
      fact: fact["fact"],
    };

    res.status(200).json(data);
  })
);

app.use((_, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
