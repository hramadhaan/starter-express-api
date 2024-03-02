const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Invalid token.",
    });
  }

  if (!decodedToken) {
    res.status(401).json({
      success: false,
      message: "Please provide a valid token.",
    });
  }

  req.employeeId = decodedToken.employeeId;
  next();
};
