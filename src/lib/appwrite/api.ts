import { ID, ImageGravity, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

/**
 * Creates a new user account with the provided user information.
 *
 * @param {INewUser} user - The user object containing the user's information.
 * @return {Promise<Object>} A promise that resolves to the newly created user.
 */
export async function CreateUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarUrl.toString(),
      username: user.username,
    });
    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

/**
 * Saves a user to the database.
 *
 * @param {Object} user - The user object containing the user's information.
 * @param {string} user.accountId - The account ID of the user.
 * @param {string} user.name - The name of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.imageUrl - The URL of the user's image.
 * @param {string} user.username - The username of the user.
 * @return {Promise<Object>} A promise that resolves to the newly created user document.
 */
export async function saveUserToDB(user: {
  accountId: string;
  name: string;
  email: string;
  imageUrl: string;
  username: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.error(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    // const result = await account.listSessions()

    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.error(error);
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
}
export async function getUserById(userId: string) {
  try {
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", userId)]
    );

    if (!user) throw Error;
    return user.documents[0];
  } catch (error) {
    console.error(error);
  }
}

export async function getUsers(limit?: number) {
  const queries = [Query.orderDesc("$createdAt")];
  if (limit !== undefined) {
    queries.push(Query.limit(limit));
  }

  try {
    const topUsers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!topUsers) throw Error;
    return topUsers;
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);

    const fileUrlWithOutTransformation = storage.getFileView(
      appwriteConfig.storageId,
      uploadedFile.$id
    ).href;

    if (!fileUrl || !fileUrlWithOutTransformation) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    //tags to array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    console.log(
      "post",
      storage.getFileView(appwriteConfig.storageId, uploadedFile.$id)
    );

    //post to database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrlWithOutTransformation,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.error(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadFile;
  } catch (error) {
    console.error(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getRecentPosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$createdAt"), Query.limit(2)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.error(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function savedPost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function deleteSavePost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}
export async function getSavedPosts({
  userId,
  pageParam,
}: {
  userId: string;
  pageParam?: number;
}) {
  const query = [Query.equal("user", userId), Query.limit(5)];

  if (pageParam) {
    query.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const savedPosts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      query
    );
    if (!savedPosts) throw Error;

    return savedPosts;
  } catch (error) {
    console.error(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        imageId: image.imageId,
        imageUrl: image.imageUrl,
      }
    );
    if (!updatePost && user.imageId) {
      await deleteFile(user.imageId);
      throw Error;
    }
    return updatedUser;
  } catch (error) {
    console.error(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);

      const fileUrlWithOutTransformation = storage.getFileView(
        appwriteConfig.storageId,
        uploadedFile.$id
      ).href;

      if (!fileUrl || !fileUrlWithOutTransformation) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      // image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      image = {
        ...image,
        imageUrl: new URL(fileUrlWithOutTransformation),
        imageId: uploadedFile.$id,
      };
    }

    //tags to array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //post to database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        // imageUrl: image.imageUrl,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    if (hasFileToUpdate && post.imageId && post.imageId !== image.imageId) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

export async function getPosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(3)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.error(error);
  }
}

// export async function getInfiniteUsers({ pageParam }: { pageParam: number }) {
//   try {
//     const queries = [Query.limit(2)];

//     if (pageParam) {
//       queries.push(Query.cursorAfter(pageParam.toString()));
//     }

//     const users = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       queries
//     );
//     if (!users) throw Error;

//     return users;
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function getInfiniteUsers({
  pageParam,
}: {
  pageParam: string | null;
}) {
  try {
    const queries = [Query.limit(3)];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.error(error);
  }
}
