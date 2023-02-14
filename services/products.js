export const getProducts = async (section, setState) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/inventario?section=${
      section || 'todo'
    }`,
    {
      credentials: 'include',
    }
  );
  const products = await req.json();
  if (setState) return setState(products);
  return products;
};
