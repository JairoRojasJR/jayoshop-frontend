export const getIsAdminAuth = async context => {
  const cookie = context.req.headers.cookie;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log('Getting is admin auth');

  const res = await fetch(`${backendUrl}/api/auth/admin/login`, {
    headers: {
      origin: 'http://localhost:3000',
      Cookie: cookie,
    },
  });
  const data = await res.json();
  return { props: { data } };
};
