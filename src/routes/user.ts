import { Router } from "express";
import { UserController } from "../controllers/user";

export const userRouter = Router();

const userController = new UserController();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/profile", userController.getUserById);
userRouter.post("/createRecipe", userController.createRecipe);
userRouter.post("/friend", userController.addFriend);
userRouter.get("/feed/:id", userController.getFeed);
