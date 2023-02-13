import { recipe } from "./../models/types";
import { LoginInputDTO, UserInputDTO } from "./../models/inputsDTO";
import { InvalidEmail, InvalidPassword, InvalidToken, UserNotFound } from "./../error/CustomError";
import { Authenticator } from "./../services/Authenticator";
import { UserDatabase } from "../database/userDatabase";
import { CustomError } from "../error/CustomError";
import { FriendInputDTO } from "../models/inputsDTO";
import { generateId } from "../services/idGenerator";
import { addFriend, recipes } from "../models/types";

const userDatabase = new UserDatabase();
const authenticator = new Authenticator();

export class UserBusiness {
  public login = async (input: LoginInputDTO) => {
    try {
      const { email, password } = input;

      if( !email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos "Email" e "Password"'
        );
      }
      if (!email.includes("@")){
        throw new InvalidEmail;
      } 

      const userDatabase = new UserDatabase();
      const user = await userDatabase.findUserByEmail(email);

      if(!user) {
        throw new UserNotFound()
      }

      if(user.password !== password){
        throw new InvalidPassword()
      }

      const token = authenticator.generateToken({ id: user.id })
      
      return token 

    } catch (error: any) {
      throw new CustomError(400, error.message);

      
    }
  }

  public createRecipe = async (input: UserInputDTO) => {
    try {
      const { title, description, created_at } = input;

      if (!title || !description || !created_at) {
        throw new CustomError(
          400,
          'Preencha os campos "name","descrição" e "data da criação"'
        );
      }
      const id: string = generateId();

      const recipe: recipe = {
        id,
        title,
        description,
        created_at,
      };
      const userDatabase = new UserDatabase();
      await userDatabase.insertRecipe(recipe);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getUserData = async (token: string) => {
    try {
      if (!token) {
        throw new InvalidToken();
      }

      const { id } = authenticator.getTokenData(token);

      const userDatabase = new UserDatabase();
      const { name, email } = await userDatabase.findUser("id", id);

      return { id, name, email };
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

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
