import { recipe, user } from "./../models/types";
import {
  EditRecipeInput,
  EditRecipeInputDTO,
  LoginInputDTO,
  SignupInputDTO,
  UserInputDTO,
} from "./../models/inputsDTO";
import {
  InvalidEmail,
  InvalidName,
  InvalidPassword,
  InvalidToken,
  UserNotFound,
} from "./../error/CustomError";
import { Authenticator } from "./../services/Authenticator";
import { UserDatabase } from "../database/userDatabase";
import { CustomError } from "../error/CustomError";
import { FriendInputDTO } from "../models/inputsDTO";
import { IdGenerator } from "../services/idGenerator";
import { addFriend, recipes } from "../models/types";

const userDatabase = new UserDatabase();
const authenticator = new Authenticator();
const idGenerator = new IdGenerator();

export class UserBusiness {
  public signup = async (input: SignupInputDTO) => {
    try {
      const { name, email, password } = input;

      if (!name || !email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos "Nome", "Email" e "Password"'
        );
      }

      if (name.length < 4) {
        throw new InvalidName();
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      if (password.length < 6) {
        throw new InvalidPassword();
      }

      const id: string = idGenerator.generateId();

      const user: user = {
        id,
        name,
        email,
        password,
      };

      const userDatabase = new UserDatabase();
      await userDatabase.insertUser(user);

      const token = authenticator.generateToken({ id });

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public login = async (input: LoginInputDTO) => {
    try {
      const { email, password } = input;

      if (!email || !password) {
        throw new CustomError(400, 'Preencha os campos "Email" e "Password"');
      }
      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      const userDatabase = new UserDatabase();
      const user = await userDatabase.findUserByEmail(email);

      if (!user) {
        throw new UserNotFound();
      }

      if (user.password !== password) {
        throw new InvalidPassword();
      }

      const token = authenticator.generateToken({ id: user.id });

      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public createRecipe = async (input: UserInputDTO) => {
    try {
      const { title, description, created_at, user_id } = input;

      if (!title || !description || !created_at || !user_id) {
        throw new CustomError(
          400,
          'Preencha os campos "name","descrição", "data da criação e id do usuário"'
        );
      }
      const id: string = idGenerator.generateId();

      const recipe: recipe = {
        id,
        title,
        description,
        created_at,
        user_id,
      };
      const userDatabase = new UserDatabase();
      await userDatabase.insertRecipe(recipe);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public editUser = async (input: EditRecipeInputDTO) => {
    try {
      const { title, description, created_at, user_id, id, token } = input;

      if (!title || !description || !created_at || !user_id || !id || !token) {
        throw new CustomError(
          400,
          'Preencha os campos "título", "descrição", "data da criação", id do usuário, id e "token"'
        );
      }

      const editRecipeInput: EditRecipeInput = {
        title,
        description,
        created_at,
        user_id,
        id,
      };

      const userDatabase = new UserDatabase();
      await userDatabase.editUser(editRecipeInput);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getUserById = async (token: string) => {
    try {
      const userDatabase = new UserDatabase();
      const user = await userDatabase.getUserById(token);
      return user;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  public async addFriend(input: FriendInputDTO): Promise<void> {
    try {
      const { user_id, follower_id } = input;

      if (!user_id || !follower_id) {
        throw new CustomError(400, "Invalid parameters");
      }

      const id: string = idGenerator.generateId();

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
