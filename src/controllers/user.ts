import { LoginInputDTO, SignupInputDTO, UserInputDTO } from "./../models/inputsDTO";
import { Request, Response } from "express";
import { UserBusiness } from "../business/user";
import { VerifyFunctions } from "../function";
import { FriendInputDTO } from "../models/inputsDTO";

const userBusiness = new UserBusiness();
const verifyFunctions = new VerifyFunctions();

export class UserController {

  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const input: SignupInputDTO = {
        name,
        email,
        password
      };

      const userBusiness = new UserBusiness()
      const token = await userBusiness.signup(input);

      res.status(200).send({message:"Usuário criado com sucesso!", token });
      
    } catch (error: any) {
      res.status(400).send(error.message)      
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const input: LoginInputDTO = {
        email,
        password
      };

      const userBusiness = new UserBusiness()
      const token = await userBusiness.login(input);

      res.status(200).send({message: token });
      
    } catch (error: any) {
      res.status(400).send(error.message)     
    }
  };

  public createRecipe = async (req: Request, res: Response) => {
    try {
      const { title, description, created_at } = req.body;

      const input: UserInputDTO = {
        title,
        description,
        created_at,
      };

      res.status(201).send(input);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public getUserData = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;

      const userBusiness = new UserBusiness();
      const userData = await userBusiness.getUserData(token);

      res
        .status(201)
        .send({ id: userData.id, name: userData.name, email: userData.email });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  };

  public async addFriend(req: Request, res: Response): Promise<void> {
    try {
      const input: FriendInputDTO = {
        user_id: req.body.user_id,
        follower_id: req.body.follower_id,
      };

      if (!input.user_id || !input.follower_id) {
        throw new Error("Missing input");
      }

      if (input.user_id === input.follower_id) {
        throw new Error("You can't follow yourself");
      }

      await verifyFunctions.checkFriend(input);

      await verifyFunctions.verifyUser(input.user_id);

      await verifyFunctions.verifyUser(input.follower_id);

      await userBusiness.addFriend(input);

      res.status(200).send({ message: "Friend added successfully" });
    } catch (error: any) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  };

  public async getFeed(req: Request, res: Response) {
    try {
      const result = await userBusiness.getFeed(req.params.id);

      await verifyFunctions.verifyUser(req.params.id);

      if (result.length === 0) {
        throw new Error("No recipes Found");
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 404).send({ message: error.message });
    }
  }
}
