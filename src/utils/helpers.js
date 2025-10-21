const isPalindrome = (value) => {
  const reverse = value.toLowerCase().split("").reverse().join("");

  return value.toLowerCase() === reverse;
};

const wordCount = (value) => {
  return value.trim().split(" ").length;
};

const uniqueCharacters = (value) => {
  let frequencyMap = {};

  for (let i = 0; i < value.length; i++) {
    const [char] = value[i];

    if (!char.trim()) continue;

    if (frequencyMap[char]) {
      frequencyMap[char].push(char);
    } else {
      frequencyMap[char] = [];
      frequencyMap[char] = [...frequencyMap[char], char];
    }
  }

  return { unique: Object.keys(frequencyMap).length, frequencyMap };
};

const filterData = (
  stringArray,
  { is_palindrome, min_length, max_length, word_count, contains_character }
) => {
  return stringArray.filter((data) => {
    const properties = data.properties;

    if (
      is_palindrome !== undefined &&
      properties.is_palindrome !== is_palindrome
    )
      return false;

    if (min_length !== undefined && properties.length < +min_length)
      return false;

    if (max_length !== undefined && properties.length > +max_length)
      return false;

    if (word_count !== undefined && properties.word_count !== +word_count)
      return false;

    if (
      contains_character !== undefined &&
      !data.value.includes(contains_character)
    )
      return false;

    return true;
  });
};

module.exports = { uniqueCharacters, wordCount, isPalindrome, filterData };
