const itemsService = require("../services/items.service");
const { success, error } = require("../utils/response");
const { parsePagination, validateId, validateItemName } = require("../utils/validate");

function getItems(req, res) {
  const pagination = parsePagination(req.query);

  if (pagination.error) {
    return error(res, {
      statusCode: 400,
      message: pagination.error,
      code: "VALIDATION_ERROR"
    });
  }

  return success(res, {
    data: itemsService.listItems(pagination),
    message: "Items retrieved"
  });
}

function createItem(req, res) {
  const validationError = validateItemName(req.body && req.body.name);

  if (validationError) {
    return error(res, {
      statusCode: 400,
      message: validationError,
      code: "VALIDATION_ERROR"
    });
  }

  return success(res, {
    statusCode: 201,
    data: itemsService.createItem(req.body),
    message: "Item created"
  });
}

function getItemById(req, res) {
  const validationError = validateId(req.params.id);

  if (validationError) {
    return error(res, {
      statusCode: 400,
      message: validationError,
      code: "VALIDATION_ERROR"
    });
  }

  const item = itemsService.findItemById(req.params.id);

  if (!item) {
    return error(res, {
      statusCode: 404,
      message: "Item not found",
      code: "NOT_FOUND"
    });
  }

  return success(res, {
    data: item,
    message: "Item retrieved"
  });
}

function updateItem(req, res) {
  const idError = validateId(req.params.id);
  const nameError = validateItemName(req.body && req.body.name);

  if (idError || nameError) {
    return error(res, {
      statusCode: 400,
      message: idError || nameError,
      code: "VALIDATION_ERROR"
    });
  }

  const item = itemsService.updateItem(req.params.id, req.body);

  if (!item) {
    return error(res, {
      statusCode: 404,
      message: "Item not found",
      code: "NOT_FOUND"
    });
  }

  return success(res, {
    data: item,
    message: "Item updated"
  });
}

function deleteItem(req, res) {
  const validationError = validateId(req.params.id);

  if (validationError) {
    return error(res, {
      statusCode: 400,
      message: validationError,
      code: "VALIDATION_ERROR"
    });
  }

  const item = itemsService.deleteItem(req.params.id);

  if (!item) {
    return error(res, {
      statusCode: 404,
      message: "Item not found",
      code: "NOT_FOUND"
    });
  }

  return success(res, {
    data: item,
    message: "Item deleted"
  });
}

module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem
};
