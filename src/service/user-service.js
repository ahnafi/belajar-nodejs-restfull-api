import { prisma } from "../app/database.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import bcrypt from "bcrypt";

const register = async (response) => {
  // validate data user
  let user = registerUserValidation(response);
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
  user.password = bcrypt.hash(user.password, 10);

  return prisma.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

export default { register };
