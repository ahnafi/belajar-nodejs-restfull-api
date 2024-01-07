import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
  updateUserValidation,
  logoutUserValidation,
} from "../validation/user-validation.js";
import bcrypt from "bcrypt";
import { MyValidate } from "../validation/validation.js";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  // validate data user
  let user = MyValidate(registerUserValidation, request);
  // check apakah duplikat
  const countUser = await prisma.user.count({
    where: {
      username: user.username,
    },
  });
  if (countUser === 1) {
    throw new ResponseError(400, "Username Already Exists");
  }
  // hash password
  user.password = await bcrypt.hash(user.password, 10);

  return prisma.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  // MyValidate
  const loginRequest = MyValidate(loginUserValidation, request);
  // find database
  const user = await prisma.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });
  // logic jika username tidak ada
  if (!user.username) {
    throw new ResponseError(401, "username or password is wrong");
  }

  // compare password request to password user
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "username or password is wrong");
  }

  // create token
  const token = uuid().toString();

  // simpan ke database
  return prisma.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

const get = async (username) => {
  username = MyValidate(getUserValidation, username);

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  //
  if (!user) {
    throw new ResponseError(401, "User not found!");
  }
  return user;
};

const update = async (request) => {
  //validate
  const user = MyValidate(updateUserValidation, request);
  // check db
  const countUser = await prisma.user.count({
    where: {
      username: user.username,
    },
  });
  if (countUser !== 1) {
    throw new ResponseError(400, "User is not found");
  }

  //
  const data = {};
  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  // return update
  return prisma.user.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });
};

const logout = async (username) => {
  // check
  username = MyValidate(logoutUserValidation, username);
  //
  const user = prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
    },
  });
  if (!user) {
    throw new ResponseError(404, "user is not found");
  }
  // remove token
  return prisma.user.update({
    where: { username: username },
    data: { token: null },
    select: { username: true },
  });
};

export default { register, login, get, update, logout };
