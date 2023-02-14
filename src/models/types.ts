export type addFriend = {
  id: string;
  user_id: string;
  follower_id: string;
};

export type recipes = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
};

export type recipe = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
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
