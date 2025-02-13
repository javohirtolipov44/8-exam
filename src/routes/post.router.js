import { Router } from "express";
import postController from "../controllers/post.controller.js";

const postRouter = Router();

const controller = new postController();

postRouter.post("/posts/create", (req, res) =>
  controller.createPostController(req, res)
);

postRouter.get("/posts/category/:category", (req, res) =>
  controller.postsCategoryController(req, res)
);

postRouter.get("/posts/top", (req, res) =>
  controller.topPostsController(req, res)
);

postRouter.put("/posts/:id", (req, res) =>
  controller.updatePostController(req, res)
);

postRouter.delete("/posts/:id", (req, res) =>
  controller.deletePostController(req, res)
);

postRouter.get("/posts/search", (req, res) =>
  controller.searchPostController(req, res)
);

export default postRouter;
