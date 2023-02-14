import { recipe, user } from "./../models/types";
import { CustomError } from "../error/CustomError";
import { Database } from "../connection/database";
import { addFriend, recipes } from "../models/types";

export class UserDatabase extends Database {
  private TABLE_USERS = "Users";
  private TABLE_RECIPES = "Recipes";
  private TABLE_FOLLOWERS = "Followers";

  public insertUser = async (user: user) => {
    try {
      await UserDatabase.connection
        .insert({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .into("Users");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public findUserByEmail = async (email: string) => {
    try {
      const result = await UserDatabase.connection("Users")
        .select()
        .where({ email });

      return result[0];
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public insertRecipe = async (recipe: recipe) => {
    try {
      await UserDatabase.connection
        .insert({
          title: recipe.title,
          description: recipe.description,
          created_at: recipe.created_at,
          user_id: recipe.user_id,
        })
        .into("Recipes");
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getUserById = async (id: string): Promise<any> => {
    const result = await UserDatabase.connection
      .select("*")
      .from("Users")
      .where({ id });

    return result[0];
  };

  public addFriend = async (friends: addFriend): Promise<void> => {
    try {
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

  public getFeed = async (id: string): Promise<recipes[]> => {
    try {
      const result = await Database.connection(this.TABLE_FOLLOWERS)
        .where(this.TABLE_FOLLOWERS + ".follower_id", id)
        .join(
          this.TABLE_USERS,
          this.TABLE_USERS + ".id",
          "=",
          this.TABLE_FOLLOWERS + ".user_id"
        )
        .join(
          this.TABLE_RECIPES,
          this.TABLE_RECIPES + ".user_id",
          "=",
          this.TABLE_USERS + ".id"
        )
        .select(
          this.TABLE_RECIPES + ".id",
          this.TABLE_RECIPES + ".title",
          this.TABLE_RECIPES + ".description",
          this.TABLE_RECIPES + ".created_at",
          this.TABLE_RECIPES + ".user_id",
          this.TABLE_USERS + ".name"
        )
        .orderBy(this.TABLE_RECIPES + ".created_at", "desc");
      return result;
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  };
}
