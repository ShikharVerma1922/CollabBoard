import axios from "axios";

export const getCurrentUser = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/users/me", {
    withCredentials: true, // crucial for cookie auth
  });
  return res.data.data.user;
};

export const registerUser = async ({ username, email, password }) => {
  const res = await axios.post(
    "http://localhost:3000/api/v1/users/register",
    { username, email, password },
    { withCredentials: true }
  );
  return res.data;
};

export const loginUser = async ({ usernameOrEmail, password }) => {
  const res = await axios.post(
    "http://localhost:3000/api/v1/users/login",
    {
      username: usernameOrEmail,
      email: usernameOrEmail,
      password,
    },
    { withCredentials: true }
  );
  return res.data.data.user;
};
