import jwt from "jsonwebtoken";

class jwtService {
  constructor() {
    this.jwt = jwt;
    this.secretKey = process.env.JWT_SECRET_KEY;
  }
  generateToken(userId) {
    const token = this.jwt.sign({ user_id: userId }, this.secretKey, {
      expiresIn: "24h",
    });
    return token;
  }

  verifyToken(token) {
    return this.jwt.verify(token, this.secretKey);
  }
}

export default jwtService;
