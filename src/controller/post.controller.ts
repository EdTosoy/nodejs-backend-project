import { get } from 'lodash';
import { Request, Response } from 'express';
import {
  createPost,
  deletePost,
  findAndUpdate,
  findPost,
} from '../service/post.service';

export const createPostHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const { body } = req;

  const post = await createPost({ ...body, user: userId });

  return res.send(post);
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const postId = get(req, 'params.postId');
  const update = req.body;

  const post = await findPost({ postId });

  if (!post) {
    return res.sendStatus(404);
  }

  if (String(post.user) !== userId) {
    return res.sendStatus(401);
  }

  const updatedPost = await findAndUpdate({ postId }, update, { new: true });

  return res.send(updatedPost);
};
export const getPostHandler = async (req: Request, res: Response) => {
  const postId = get(req, 'params.postId');
  const post = await findPost({ postId });
  if (!post) {
    return res.sendStatus(404);
  }
  return res.send(post);
};
export const deletePostHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const postId = get(req, 'params.postId');
  const post = await findPost({ postId });
  if (!post) {
    return res.sendStatus(404);
  }

  if (String(post.user) !== String(userId)) {
    return res.sendStatus(401);
  }

  await deletePost({ postId });
  return res.sendStatus(200);
};
