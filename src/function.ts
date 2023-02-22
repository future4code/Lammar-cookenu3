import { CustomError } from "./error/CustomError";
import { FriendInputDTO } from "./models/inputsDTO";
import { Database } from "./connection/database";


export class VerifyFunctions extends Database {
    
    public verifyFriendship = async (input: FriendInputDTO): Promise<Boolean> => {
        try {
            const result = await Database.connection
            .select("*")
            .from("Followers")
            .where({follower_id: input.follower_id})

            if(result.length > 0) {
                throw new CustomError(400, "Friendship already exists");
            }

            const result2 = await Database.connection
            .select("*")
            .from("Users")
            .where({id: input.follower_id})

            if(result2.length === 0) {
                throw new CustomError(400, "User not found");
            }

            return true;
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message);
        }
    }
}