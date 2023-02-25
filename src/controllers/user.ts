import { Authenticator } from "./../services/Authenticator";
import {
  LoginInputDTO,
  RecipeInputDTO,
  SignupInputDTO,
} from "./../models/inputsDTO";
import { Request, Response } from "express";
import { UserBusiness } from "../business/user";
import { VerifyFunctions } from "../function";
import { recipes } from "../models/types";

const userBusiness = new UserBusiness();
const authenticator = new Authenticator();
const functions = new VerifyFunctions();

export class UserController {
  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const input: SignupInputDTO = {
        name,
        email,
        password,
      };

      const token = await userBusiness.signup(input);

      res.status(200).send({ message: "Usuário criado com sucesso!", token });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const input: LoginInputDTO = {
        email,
        password,
      };

      const access_token = await userBusiness.login(input);

      res.status(200).send({ access_token });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public createRecipe = async (req: Request, res: Response) => {
    try {
      const { title, description, user_id } = req.body;

      const input: RecipeInputDTO = {
        title,
        description,
        user_id,
      };

      await userBusiness.createRecipe(input);

      res.status(201).send({ message: "Recipe created successfully", input });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public getUserById = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const authenticationData = authenticator.getTokenData(token);

      const user = await userBusiness.getUserById(authenticationData.id);

      res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };

  public getRecipeById = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const authenticationData = authenticator.getTokenData(token);

      const recipes = await userBusiness.getRecipeById(authenticationData.id);

      res.status(200).send({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        created_at: recipes.created_at
      });

    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };

  public async addFriend(req: Request, res: Response): Promise<void> {
    try {

      const token = req.headers.authorization as string;
      const inputToken = authenticator.getTokenData(token);

      const input = { follower_id: req.body.userToFollowId }
      

      if (!input.follower_id) {
        throw new Error("Please provide a follower id");
      }

      await functions.verifyFriendship(input);

      await userBusiness.addFriend(inputToken.id, input.follower_id);

      res.status(200).send({ message: "Friend added successfully" });
    } catch (error: any) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public async getFeed(req: Request, res: Response) {
    try {

      const token = req.headers.authorization as string;
      const inputToken = authenticator.getTokenData(token);
      
      const result = await userBusiness.getFeed(inputToken.id);

      if (result.length === 0) {
        throw new Error("No recipes Found");
      }

      res.status(200).json({"Recipes:" : result});

    } catch (error: any) {
      res.status(error.statusCode || 404).send({ message: error.message });
    }
  }

  public async getUserData(req: Request, res: Response) {
    try {
      const result = await userBusiness.getUserById(req.params.id);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 404).send({ message: error.message });
    }
  }
}
