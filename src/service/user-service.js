import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  registerUserValidation,
  loginUserValidation,
  getUserValidation,
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

export default { register, login, get };
