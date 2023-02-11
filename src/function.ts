import { CustomError } from "./error/CustomError";
import { FriendInputDTO } from "./models/inputsDTO";
import { Database } from "./connection/database";


export class VerifyFunctions extends Database {
    
    public checkFriend = async (input: FriendInputDTO): Promise<Boolean> => {
        try {
            const result = await Database.connection
            .select("*")
            .from("Followers")
            .where({user_id: input.user_id, follower_id: input.follower_id})

            if(result.length > 0) {
                throw new CustomError(400, "Friendship already exists");
            }
            return true;
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message);
        }
    }

    
    public verifyUser = async (id: string): Promise<Boolean> => {
        try {
            const result = await Database.connection
            .select("*")
            .from("Users")
            .where({id})

            if(result.length === 0) {
                throw new CustomError(404, "User not found");
            }

            return true;
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message);
        }
    }
    
}