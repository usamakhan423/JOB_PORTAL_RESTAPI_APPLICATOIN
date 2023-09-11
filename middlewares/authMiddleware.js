import JWT from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // Getting the headers
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next("Auth Failed");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.SECRET_KEY);
    req.body.user = { userId: payload.userId };
    next();
  } catch (error) {
    return next("Auth Failed");
  }
};

export default authUser;
