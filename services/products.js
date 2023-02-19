const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
const pathInventori = '/api/admin/inventario';

const optionsFetching = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
};

export const getProducts = async (section, setState) => {
  const url = `${urlBackend}${pathInventori}?section=${section}`;
  const options = { ...optionsFetching };
  const req = await fetch(url, options);
  const products = await req.json();
  if (setState) return setState(products);
  return products;
};

export const deleteProducts = async products => {
  const url = `${urlBackend}${pathInventori}`;
  const options = { ...optionsFetching };
  options.method = 'DELETE';
  options.body = JSON.stringify(products);
  const req = await fetch(url, options);
  return await req.json();
};

export const updateProducts = async products => {
  const url = `${urlBackend}${pathInventori}`;
  const options = { ...optionsFetching };
  options.method = 'PUT';
  options.body = JSON.stringify(products);
  const req = await fetch(url, options);
  return await req.json();
};
