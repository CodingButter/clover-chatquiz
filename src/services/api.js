const endpoint = "https://chatstyler.tk/crud";

const call = async (crud, does, payload) => {
  const params = Object.keys(payload || {})
    .map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(payload[k]);
    })
    .join("&");

  const results = await fetch(`${endpoint}/${crud}/${does}?${params}`);
  return await results.json();
};

const create = async (does, payload) => {
  return await call("create", "chatquestion", payload);
};

const read = async (does, payload) => {
  return await call("read", does, payload);
};

const update = async (does, payload) => {
  return await call("update", does, payload);
};

export { create, read, update };
