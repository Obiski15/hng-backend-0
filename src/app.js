const express = require("express");
const rateLimit = require("express-rate-limit");

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

app.get("/me", async (_, res) => {
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
});

app.use((err, _, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    console.error(err);
  }

  res.status(500).json({
    status: "error",
    message: err.message || "Something went wrong",
  });

  next();
});

module.exports = app;
