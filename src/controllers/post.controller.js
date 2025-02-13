import postService from "../services/post.service.js";

class postController {
  constructor() {
    this.postService = new postService();
  }
  async createPostController(req, res) {
    try {
      const body = req.body;
      const TOKEN = req.headers.authorization.split(" ")[1];
      const post = await this.postService.createPost(TOKEN, body);
      res.json(post);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async postsCategoryController(req, res) {
    try {
      const params = req.params;
      const posts = await this.postService.postsCategory(params);
      res.json(posts);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async topPostsController(req, res) {
    try {
      const posts = await this.postService.topPosts();
      res.json(posts);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async updatePostController(req, res) {
    try {
      const body = req.body;
      const params = req.params;
      const posts = await this.postService.updatePost(params, body);
      res.json(posts);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async deletePostController(req, res) {
    try {
      const params = req.params;
      const post = await this.postService.deletePost(params);
      res.json(post);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async searchPostController(req, res) {
    try {
      const { title, category } = req.query;
      const post = await this.postService.searchPost(title, category);
      res.json(post);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}

export default postController;
