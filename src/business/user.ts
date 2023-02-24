import { user } from "./../models/types";
import {
  LoginInputDTO,
  RecipeInputDTO,
  SignupInputDTO,
} from "./../models/inputsDTO";
import {
  InvalidEmail,
  InvalidName,
  InvalidPassword,
  UserNotFound,
} from "./../error/CustomError";
import { Authenticator } from "./../services/Authenticator";
import { UserDatabase } from "../database/userDatabase";
import { CustomError } from "../error/CustomError";
import { IdGenerator } from "../services/idGenerator";
import { addFriend, recipes, recipe } from "../models/types";

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

  public createRecipe = async (input: RecipeInputDTO) => {
    try {
      const { title, description, user_id } = input;

      if (!title || !description || !user_id) {
        throw new CustomError(
          400,
          'Preencha os campos "name","descrição", "data da criação e id do usuário"'
        );
      }

      const id: string = idGenerator.generateId();

      const recipe: recipes = {
        id,
        title,
        description,
        created_at: new Date(),
        user_id: user_id,
      };
      const userDatabase = new UserDatabase();
      await userDatabase.insertRecipe(recipe);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public getUserById = async (token: string) => {
    try {
      const user = await userDatabase.getUserById(token);

      const userwithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      return userwithoutPassword;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  public getRecipeById = async (token: string) => {
    try {
      const recipes = await userDatabase.getRecipeById(token);

      const recipeWithoutToken = {
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        created_at: recipes.created_at

        
      };

      return recipeWithoutToken ;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  public async addFriend(input: string, inputToken: string): Promise<void> {
    try {

      const addFriend: addFriend = {
        id: idGenerator.generateId(),
        user_id: input,
        userToFollowId: inputToken,
      };

      await userDatabase.addFriend(addFriend);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }

  public async getFeed(inputToken: string): Promise<recipes[]> {
    try {
      return await userDatabase.getFeed(inputToken);
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
}

