import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import jwtService from "./jwt.service.js";

class postService {
  constructor() {
    this.postModel = postModel;
    this.userModel = userModel;
    this.jwtService = new jwtService();
  }

  async createPost(TOKEN, body) {
    const token = this.jwtService.verifyToken(TOKEN);
    const userId = token.user_id;
    const findUser = await this.userModel.findOne({ _id: userId });
    const views = Math.floor(Math.random() * 1000);

    if (findUser) {
      const post = await this.postModel.create({
        ...body,
        author: userId,
        views,
      });
      const data = {
        success: true,
        post: {
          title: post.title,
          content: post.content,
          author: post.author,
          createdAt: post.createdAt,
        },
      };
      return data;
    } else {
      throw new Error("User topilmadi");
    }
  }

  async postsCategory(params) {
    const posts = await this.postModel.aggregate([
      {
        $match: { category: params.category },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          title: 1,
          content: 1,
          author: "$author.username",
          views: 1,
        },
      },
      {
        $sort: { views: -1 },
      },
    ]);

    const data = {
      posts,
    };

    return data;
  }

  async topPosts() {
    const posts = await this.postModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          _id: 0,
          title: 1,
          views: 1,
          author: "$author.username",
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    const data = {
      topPosts: posts,
    };

    return data;
  }

  async updatePost(params, body) {
    const id = params.id;
    const post = await this.postModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          title: body.title,
          content: body.content,
          category: body.category,
        },
      },
      {
        returnDocument: "after",
      }
    );
    const data = {
      success: true,
      updatedPost: {
        title: post.title,
        content: post.content,
        category: post.category,
      },
    };

    return data;
  }

  async deletePost(params) {
    const postId = params.id;
    const post = await this.postModel.deleteOne({ _id: postId });
    if (post.deletedCount === 1) {
      const data = {
        success: true,
        message: "Post o'chirildi",
      };
      return data;
    } else {
      throw new Error("Bunday post mavjud emas");
    }
  }

  async searchPost(title, category) {
    let filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (category) {
      filter.category = category;
    } // title va category mavjud bolsa ikkalasini oladi
    const post = await this.postModel
      .find(filter)
      .select("title content category");
    return post;
  }
}

export default postService;
