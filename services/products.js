const urlBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
const pathInventario = '/api/admin/inventario';

const optionsFetching = { credentials: 'include' };

export const addProduct = async product => {
  const url = `${urlBackend}${pathInventario}`;
  const options = { ...optionsFetching };
  options.method = 'POST';
  options.body = product;
  const req = await fetch(url, options);
  return await req.json();
};

export const getProducts = async (section, setState) => {
  const url = `${urlBackend}${pathInventario}?section=${section}`;
  const req = await fetch(url, optionsFetching);
  const products = await req.json();
  if (setState) return setState(products);
  return products;
};

export const deleteProduct = async product => {
  const url = `${urlBackend}${pathInventario}`;
  const options = { ...optionsFetching };
  options.method = 'DELETE';
  options.headers = { 'Content-Type': 'application/json' };
  options.body = JSON.stringify(product);
  console.log(product);
  const req = await fetch(url, options);
  return await req.json();
};

export const updateProduct = async product => {
  const url = `${urlBackend}${pathInventario}`;
  const options = { ...optionsFetching };
  options.method = 'PUT';
  options.body = product;
  const req = await fetch(url, options);
  return await req.json();
};
