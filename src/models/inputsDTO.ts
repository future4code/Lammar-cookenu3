export interface UserInputDTO {
  title: string;
  description: string;
  created_at: string;
}

export interface SignupInputDTO {
  name: string, 
  email: string, 
  password: string
}

export interface LoginInputDTO {
  email: string;
  password: string;
 
}

export interface FriendInputDTO {
  user_id: string;
  follower_id: string;
}
