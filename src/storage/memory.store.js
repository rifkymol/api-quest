const store = {
  items: [],
  nextItemId: 1
};

function resetStore() {
  store.items = [];
  store.nextItemId = 1;
}

module.exports = {
  store,
  resetStore
};
