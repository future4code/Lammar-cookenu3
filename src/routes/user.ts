import { Router } from "express";
import { UserController } from "../controllers/user";

export const userRouter = Router();

const userController = new UserController();

userRouter.get("/getUserData", userController.getUserData);
userRouter.post("/createRecipe", userController.createRecipe);
userRouter.post("/friend", userController.addFriend);
userRouter.get("/feed/:id", userController.getFeed);
