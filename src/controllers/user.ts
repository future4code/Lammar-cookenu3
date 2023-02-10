import { Request, Response } from "express";
import { UserBusiness } from "../business/user";
import { FriendInputDTO } from "../models/inputsDTO";

const userBusiness = new UserBusiness();

export class UserController {
  public async addFriend(req: Request, res: Response): Promise<void> {
    try {
      const input: FriendInputDTO = {
        user_id: req.body.user_id,
        follower_id: req.body.follower_id,
      };

      await userBusiness.addFriend(input);

      res.status(200).send({ message: "Friend added successfully" });
    } catch (error: any) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public async getFeed(req: Request, res: Response) {
    try {
      const result = await userBusiness.getFeed(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 404).send({ message: error.message });
    }
  }
}
