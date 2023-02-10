import { CustomError } from "../error/CustomError";
import { Database } from "../connection/database";
import { addFriend, post } from "../models/types";

export class UserDatabase extends Database {
  private TABLE_USERS = "Users";
  private TABLE_RECIPES = "Recipes";
  private TABLE_FOLLOWERS = "Followers";

  public addFriend = async (friends: addFriend): Promise<void> => {
    try {
      Database.connection.initialize();
      await Database.connection
        .insert({
          id: friends.id,
          user_id: friends.user_id,
          follower_id: friends.follower_id,
        })
        .into(this.TABLE_FOLLOWERS);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  };

  public getFeed = async (id: string): Promise<post[]> => {
    try {
      Database.connection.initialize();
      const result = await Database.connection
      (this.TABLE_FOLLOWERS)
      .where(this.TABLE_FOLLOWERS + ".follower_id", id)
      .join(this.TABLE_USERS, this.TABLE_USERS + ".id", "=", this.TABLE_FOLLOWERS + ".user_id")
      .join(this.TABLE_RECIPES, this.TABLE_RECIPES + ".user_id", "=", this.TABLE_USERS + ".id")
      .select(
        this.TABLE_RECIPES + ".id",
        this.TABLE_RECIPES + ".title",
        this.TABLE_RECIPES + ".description",
        this.TABLE_RECIPES + ".created_at",
        this.TABLE_RECIPES + ".user_id",
        this.TABLE_USERS + ".name",
      );
      return result;
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  };
}
