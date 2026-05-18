const { store } = require("../storage/memory.store");

function listItems({ page, limit }) {
  const totalItems = store.items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const items = store.items.slice(startIndex, startIndex + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && totalItems > 0
    }
  };
}

function createItem(payload) {
  const now = new Date().toISOString();
  const item = {
    id: String(store.nextItemId),
    name: payload.name.trim(),
    createdAt: now,
    updatedAt: now
  };

  store.nextItemId += 1;
  store.items.push(item);

  return item;
}

function findItemById(id) {
  return store.items.find((item) => item.id === String(id)) || null;
}

function updateItem(id, payload) {
  const item = findItemById(id);

  if (!item) {
    return null;
  }

  item.name = payload.name.trim();
  item.updatedAt = new Date().toISOString();

  return item;
}

function deleteItem(id) {
  const itemIndex = store.items.findIndex((item) => item.id === String(id));

  if (itemIndex === -1) {
    return null;
  }

  const [deletedItem] = store.items.splice(itemIndex, 1);

  return deletedItem;
}

module.exports = {
  listItems,
  createItem,
  findItemById,
  updateItem,
  deleteItem
};
