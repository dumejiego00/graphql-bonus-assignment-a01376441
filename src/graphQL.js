"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
    tag: String!
  }

  type Tag {
    id: ID!
    name: String!
  }

  input PostCreate {
    title: String!
    content: String!
    tagId: ID!
  }

  input PostUpdate{
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getTags: [Tag!]! 
    getPostsByTag(id: ID!): [Post!]! 
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!):Post
    updatePost(newPost: PostUpdate!):Post!
    createTag(name: String!): Tag!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
    getTags: (_parent, args, { app }) => {
      return app.db.tags;
    },
    getPostsByTag: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.filter((post) => post.tag === id);
    },
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content, tagId } = newPost;
      console.log(tagId);
      const post = {
        id: randomUUID(),
        title,
        content,
        tag: tagId,
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, args, { app }) => {
      const { id } = args;
      const index = app.db.posts.findIndex((post) => post.id === id);
      if (index === -1) {
        throw new Error("Post not found");
      }
      const deletedPost = app.db.posts.splice(index, 1);
      return deletedPost[0];
    },
    updatePost: (_parent, { newPost }, { app }) => {
      const { id, title, content } = newPost;
      const index = app.db.posts.findIndex((post) => post.id === id);
      if (index === -1) {
        throw new Error("Post not found");
      }
      app.db.posts[index].title = title;
      app.db.posts[index].content = content;
      return app.db.posts[index];
    },
    createTag: (_parent,  args , { app }) => {
      const { name } = args;
      const newTag = {
        id: `tag${app.db.tags.length + 1}`,
        name: name,
      };
      app.db.tags.push(newTag);
      return newTag;
    },
  },
};

export const loaders = {};
