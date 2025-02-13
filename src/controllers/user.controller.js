import userService from "../services/user.service.js";

class userController {
  constructor() {
    this.userService = new userService();
  }

  async registerController(req, res) {
    try {
      const body = req.body;
      const data = await this.userService.register(body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async loginController(req, res) {
    try {
      const body = req.body;
      const data = await this.userService.login(body);
      res.json(data);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async userAllPostsController(req, res) {
    try {
      const TOKEN = req.headers.authorization.split(" ")[1];
      const posts = await this.userService.userAllPosts(TOKEN);
      res.json(posts);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}

export default userController;
