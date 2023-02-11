import { UserDatabase } from "../database/userDatabase";
import { CustomError } from "../error/CustomError";
import { FriendInputDTO } from "../models/inputsDTO";
import { generateId } from "../services/idGenerator";
import { addFriend, recipes } from "../models/types";

const userDatabase = new UserDatabase();

export class UserBusiness {

  public async addFriend(input: FriendInputDTO): Promise<void> {
    try {
      const { user_id, follower_id } = input;

      if (!user_id || !follower_id) {
        throw new CustomError(400, "Invalid parameters");
      }

      const id: string = generateId();

      const addFriend: addFriend = {
        id,
        user_id,
        follower_id,
      };

      await userDatabase.addFriend(addFriend);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  public async getFeed(id: string): Promise<recipes[]> {
    try {
      if (!id) {
        throw new CustomError(400, "Invalid parameters");
      }

      if (id.length !== 36) {
        throw new CustomError(400, "Invalid id");
      }

      return await userDatabase.getFeed(id);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
}
