function validateItemName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    return "Name is required";
  }

  return null;
}

function validateId(id) {
  if (typeof id !== "string" || id.trim() === "") {
    return "ID is required";
  }

  return null;
}

function parsePagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);

  if (!Number.isInteger(page) || page < 1) {
    return {
      error: "Page must be a positive integer"
    };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return {
      error: "Limit must be a positive integer up to 100"
    };
  }

  return {
    page,
    limit
  };
}

module.exports = {
  validateItemName,
  validateId,
  parsePagination
};
