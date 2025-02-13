import userModel from "../models/user.model.js";
import bcrypt, { compare } from "bcrypt";
import jwtService from "./jwt.service.js";
import postModel from "../models/post.model.js";

class userService {
  constructor() {
    this.userModel = userModel;
    this.postModel = postModel;
    this.jwtService = new jwtService();
  }

  async register(body) {
    const findUser = await this.userModel.findOne({ username: body.username });
    const hashedPassword = await bcrypt.hash(body.password, 12);
    if (findUser) throw new Error("username already existed");
    const user = await this.userModel.create({
      ...body,
      password: hashedPassword,
    });
    const token = this.jwtService.generateToken(user._id);
    const data = {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
    return data;
  }

  async login(body) {
    const findUser = await this.userModel.findOne({ email: body.email });
    if (findUser) {
      const comparePassword = await bcrypt.compare(
        body.password,
        findUser.password
      );
      if (comparePassword) {
        const token = this.jwtService.generateToken(findUser._id);
        const data = {
          token,
          user: {
            username: findUser.username,
            email: findUser.email,
          },
        };
        return data;
      } else {
        throw new Error("Parol mos kelmadi");
      }
    } else {
      throw new Error("User topilmadi");
    }
  }

  async userAllPosts(TOKEN) {
    const token = this.jwtService.verifyToken(TOKEN);
    const userId = token.user_id;
    const findPost = await this.postModel.find(
      { author: userId },
      { _id: 0, title: 1, category: 1, views: 1, createdAt: 1 }
    );
    const data = {
      posts: findPost,
    };
    return data;
  }
}

export default userService;
