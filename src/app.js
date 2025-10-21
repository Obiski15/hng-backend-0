const express = require("express");
const rateLimit = require("express-rate-limit");
const crypto = require("crypto");

const errorHandler = require("./utils/errorHandler");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/AppError");
const {
  isPalindrome,
  uniqueCharacters,
  wordCount,
  filterData,
} = require("./utils/helpers");

const app = express();

app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

let stringArray = [];

app.post(
  "/strings",
  catchAsync(async (req, res, next) => {
    const value = req.body?.value;

    // check if value exist
    if (!value)
      return next(
        new AppError('Invalid request body or missing "value" field', 400)
      );

    // check if value is a string
    if (!isNaN(+value))
      return next(
        new AppError('Invalid data type for "value" (must be string)', 422)
      );

    const id = crypto.createHash("sha256").update(value).digest("hex");

    // check for existing string
    const dataExist = stringArray.find((data) => data.id === id);

    if (dataExist)
      return next(new AppError("String already exists in the system", 409));

    const analysed_string = {
      id,
      value,
      properties: {
        length: value.length,
        is_palindrome: isPalindrome(value),
        unique_characters: uniqueCharacters(value).unique,
        word_count: wordCount(value),
        sha256_hash: id,
        character_frequency_map: uniqueCharacters(value).frequencyMap,
      },
      created_at: new Date().toISOString(),
    };

    stringArray.push(analysed_string);

    res.status(201).json({ ...analysed_string });
  })
);

// Get All Strings with Filtering
app.get(
  "/strings",
  catchAsync(async (req, res, next) => {
    const acceptedQueries = [
      "contains_character",
      "word_count",
      "is_palindrome",
      "min_length",
      "max_length",
    ];
    const filtersApplied = {};

    Object.entries(req.query).forEach(([key, value]) => {
      if (!acceptedQueries.includes(key))
        return next(
          new AppError("Invalid query parameter values or types", 400)
        );

      if (
        key === "min_length" ||
        key === "max_length" ||
        key === "word_count"
      ) {
        filtersApplied[key] = +value;
      } else if (key === "is_palindrome") {
        if (value === "true") {
          filtersApplied[key] = true;
        } else {
          filtersApplied[key] = false;
        }
      } else {
        filtersApplied[key] = value;
      }
    });

    const data = filterData(stringArray, filtersApplied);

    res
      .status(200)
      .json({ data: [...data], count: data.length, filtersApplied });
  })
);

// Natural Language Filtering
app.get(
  "/strings/filter-by-natural-language",
  catchAsync(async (req, res, next) => {
    const query = req.query?.query;

    if (!query) return next(new AppError(" Missing query search param", 400));

    const vowels = {
      first: "a",
      second: "e",
      third: "i",
      fourth: "o",
      fifth: "u",
    };

    // test words
    // "all single word palindromic strings" → word_count=1, is_palindrome=true
    // "strings longer than 10 characters" → min_length=11
    // "palindromic strings that contain the first vowel" → is_palindrome=true, contains_character=a (or similar heuristic)
    // "strings containing the letter z" → contains_character=z

    const filters = {
      single: { word_count: 1 },
      palindromic: { is_palindrome: true },
    };

    let naturalLanguage;

    try {
      naturalLanguage = decodeURIComponent(query);
    } catch (error) {
      return next(new AppError("Unable to parse natural language query", 400));
    }

    const words = naturalLanguage.split(" ");

    const filtersApplied = {};

    for (let i = 0; i < words.length; i++) {
      if (words[i] === "vowel") {
        filtersApplied["contains_character"] = vowels[`${words[i - 1]}`];
      }

      if (words[i] === "characters") {
        filtersApplied["min_length"] = +words[i - 1];
      }

      if (words[i] === "single") {
        filtersApplied["single"] = filters["single"];
      }

      if (words[i] === "letter") {
        filtersApplied["contains_character"] = words[i + 1];
      }

      if (words[i] === "palindromic") {
        filtersApplied["palindromic"] = filters["palindromic"];
      }
    }

    const data = filterData(stringArray, filtersApplied);

    res.status(200).json({
      data,
      count: data.length,
      interpreted_query: {
        original: naturalLanguage,
        parsed_filters: filtersApplied,
      },
    });
  })
);

app.get(
  "/strings/:value",
  catchAsync(async (req, res, next) => {
    const value = req.params.value?.trim();

    const data = stringArray.find((s) => s.value === value);

    if (!data)
      return next(new AppError("String does not exist in the system", 404));

    res.status(200).json(data);
  })
);

app.delete(
  "/strings/:value",
  catchAsync((req, res, next) => {
    const value = req.params?.value?.trim();

    const toBeDeleted = stringArray.find((s) => s.value === value);

    if (!toBeDeleted)
      return next(new AppError("String does not exist in the system", 404));

    stringArray = stringArray.filter((s) => s.value !== value);

    res.status(204).end();
  })
);

app.use(async (_, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
