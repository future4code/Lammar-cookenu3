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

  public insertRecipe = async (recipe: recipes) => {
    try {
      await UserDatabase.connection
        .insert({
          id: recipe.id,
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

  public getUserById = async (id: string): Promise<user> => {
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
          follower_id: friends.userToFollowId,
        })
        .into(this.TABLE_FOLLOWERS);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  };

  public getFeed = async (id: string): Promise<recipes[]> => {
    try {
      const result = await Database.connection.raw(`
      SELECT Recipes.id, Recipes.title, Recipes.description, DATE_FORMAT (Recipes.created_at, '%d/%m/%Y') AS createdAt, Recipes.user_id AS userId, Users.name AS userName
      FROM Recipes 
      JOIN Followers ON Recipes.user_id = Followers.follower_id
      JOIN Users ON Users.id = Followers.follower_id
      WHERE Followers.user_id = '${id}'
      ORDER BY Recipes.created_at DESC
      `);
      return result[0];
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  };

}
