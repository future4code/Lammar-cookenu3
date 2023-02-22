export type addFriend = {
  id: string;
  user_id: string;
  userToFollowId: string;
};

export type recipes = {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  user_id: string;
};

export type recipe = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  userId: string;
  userName: string;
};
export type user = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthenticationData = {
  id: string;
};
