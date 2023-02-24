import { Router } from "express";
import { UserController } from "../controllers/user";

export const userRouter = Router();

const userController = new UserController();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/profile", userController.getUserById);
userRouter.get("/recipe", userController.getRecipeById);
userRouter.post("/createRecipe", userController.createRecipe);
userRouter.post("/follow", userController.addFriend);
userRouter.get("/feed", userController.getFeed);
userRouter.get("/:id", userController.getUserData);

