import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  // Header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // token ke andar jo data dala tha (id, email)
    req.user = decoded;

    next(); // allow
