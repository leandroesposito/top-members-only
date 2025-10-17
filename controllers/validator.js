const { body } = require("express-validator");

function bodyText(field, maxLength = Number.MAX_SAFE_INTEGER) {
  return body(field)
    .isLength({ max: maxLength })
    .withMessage(`${field} must be a text of at most ${maxLength} characters`);
}

function bodyBoolean(field) {
  return body(field)
    .isBoolean()
    .withMessage(`${field} must be boolean`)
    .toBoolean();
}

function bodyDate(field) {
  return body(field)
    .isDate()
    .withMessage(`${field} must be a valid date`)
    .toDate();
}

function bodyEqual(field1, field2) {
  return body(field1)
    .custom((value, { req }) => {
      return value === req.body[field2];
    })
    .withMessage(`${field1} must be equal to ${field2}`);
}

module.exports = {
  bodyText,
  bodyBoolean,
  bodyDate,
  bodyEqual,
};
