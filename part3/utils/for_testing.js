const reverse = (string) => {
  return string.split("").reverse().join("");
};

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

// console.log(reverse("Hello"));
// console.log(average([2,3,4,5]));

module.exports = {
  reverse,
  average,
};
