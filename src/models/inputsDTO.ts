export interface UserInputDTO {
  title: string;
  description: string;
  created_at: string;
}

export interface FriendInputDTO {
  user_id: string;
  follower_id: string;
}
