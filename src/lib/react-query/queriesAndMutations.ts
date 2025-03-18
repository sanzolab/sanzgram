import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  CreateUserAccount,
  createPost,
  deletePost,
  deleteSavePost,
  getCurrentUser,
  getInfinitePosts,
  getInfiniteUsers,
  getPostById,
  getRecentPosts,
  getSavedPosts,
  getUserById,
  getUsers,
  likePost,
  savedPost,
  searchPosts,
  signInAccount,
  signOutAccount,
  updatePost,
  updateUser,
} from "../appwrite/api";
import {
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
  IUseGetSavedPostResult,
} from "@/types";
import { QUERY_KEYS } from "./QUERY_KEYS";
import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";

interface DocumentList<T> {
  documents: T[];
}

/**
 * Returns a mutation hook for creating a new user account.
 *
 * @return {UseMutationResult<unknown, unknown, INewUser, unknown>} The mutation hook for creating a new user account.
 */

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => CreateUserAccount(user),
  });
};
/**
 * Returns a mutation hook for signing in an account.
 *
 * @return {UseMutationResult<unknown, unknown, { email: string, password: string }, unknown>} The mutation hook for signing in an account.
 */

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};
/**
 * Returns a mutation hook for signing out an account.
 *
 * @return {UseMutationResult} The mutation hook for signing out an account.
 */
export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

/**
 * Returns a query hook for getting the top users based on the provided limit.
 *
 * @param {number | undefined} limit - The maximum number of top users to retrieve.
 * @return {UseQueryResult} The query hook for getting the top users.
 */
export const useGetTopUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

/**
 * Returns a mutation hook for creating a new post.
 *
 * @return {UseMutationResult<unknown, unknown, INewPost, unknown>} The mutation hook for creating a new post.
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),

    onSuccess: () => {
      //force to fecth post again
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

/**
 * Returns a mutation hook for updating an existing user.
 *
 * @return {UseMutationResult<unknown, unknown, IUpdateUser, unknown>} The mutation hook for updating an existing user.
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { checkAuthUser } = useUserContext();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITY_USERS],
      });
      checkAuthUser();
    },
  });
};
/**
 * Returns a query hook for getting recent posts.
 *
 * @return {UseInfiniteQueryResult<Page<Models.Document>, unknown, unknown>} The query hook for getting recent posts.
 */
export const useGetRecentPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: 0,
  });
};

export const useLikedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
/**
 * Custom hook that returns a mutation function for saving a post.
 *
 * @return {MutationHook} A mutation hook that takes an object with `postId` and `userId` properties.
 * The mutation function saves the post by calling the `savedPost` function from the `appwrite/api` module.
 * On success, it invalidates the queries for recent posts, posts, and current user in the query client.
 */

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savedPost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

/**
 * Returns a hook that fetches saved posts for a given user using React Query's useInfiniteQuery hook.
 *
 * @param {string} userId - The ID of the user whose saved posts are being fetched.
 * @return {IUseGetSavedPostResult} - An object containing the fetched data and functions to fetch more data.
 */

export const useGetSavedPost = (
  userId: string,
  options = {}
): IUseGetSavedPostResult => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_SAVED_POST, userId],
    queryFn: ({ pageParam = 0 }) => getSavedPosts({ userId, pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: 0,
    enabled: !!userId,
    ...options,
  });
};
/**
 * Returns a hook that deletes a saved post record and invalidates relevant queries.
 */

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavePost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

/**
 * Returns a hook that fetches the current user from the server.
 *
 * @return {UseQueryResult<User, unknown>} The result of the query, which contains the current user.
 */
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};
export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

// export const useGetUser = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITY_USERS],
//     queryFn: getInfiniteUsers,
//     getNextPageParam: (lastPage) => {
//       if (lastPage && lastPage.documents.length === 0) return null;
//       const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
//       return lastId;
//     },
//     initialPageParam: 0,
//   });
// };

export const useGetUser = (): UseInfiniteQueryResult<
  DocumentList<Models.Document>,
  Error
> => {
  return useInfiniteQuery<
    DocumentList<Models.Document>,
    Error,
    DocumentList<Models.Document>,
    [string]
  >({
    queryKey: [QUERY_KEYS.GET_INFINITY_USERS],
    queryFn: async ({ pageParam = null }) => {
      const result = await getInfiniteUsers({ pageParam: pageParam as string });
      return result ?? { documents: [] };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.documents.length === 0) return null;
      return lastPage.documents[lastPage.documents.length - 1].$id ?? null;
    },
    initialPageParam: 0,
  });
};

// export const useGetUser = (): UseInfiniteQueryResult<
//   DocumentList<Models.Document>,
//   Error
// > => {
//   return useInfiniteQuery<
//     DocumentList<Models.Document>,
//     Error,
//     DocumentList<Models.Document>,
//     [string]
//   >({
//     queryKey: [QUERY_KEYS.GET_INFINITY_USERS],
//     queryFn: async ({ pageParam }) => {
//       const result = await getInfiniteUsers({ pageParam: pageParam as string });
//       if (!result) {
//         return { documents: [] };
//       }
//       return result;
//     },
//     getNextPageParam: (lastPage) => {
//       if (lastPage && lastPage.documents.length === 0) return null;
//       const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
//       return lastId;
//     },
//     initialPageParam: 0,
//   });
// };

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId, //fetch the post oonly when the postId change
  });
};
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: getInfinitePosts,
//     getNextPageParam: (lastPage) => {
//       if (lastPage && lastPage.documents.length === 0) return null;
//       const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
//       return lastId;
//     },
//     initialPageParam: 0,
//   });
// };

// interface Document {
//   $id: string;
//   // otras propiedades del documento
// }

export const useGetPosts = (): UseInfiniteQueryResult<
  DocumentList<Models.Document>,
  Error
> => {
  return useInfiniteQuery<
    DocumentList<Models.Document>,
    Error,
    DocumentList<Models.Document>,
    [string]
  >({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: async ({ pageParam }) => {
      const result = await getInfinitePosts({ pageParam: pageParam as number });
      if (!result) {
        return { documents: [] };
      }
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.documents.length === 0) return null;
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: 0,
  });
};
export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};
