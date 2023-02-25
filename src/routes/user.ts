import { Router } from "express";
import { UserController } from "../controllers/user";

export const userRouter = Router();

const userController = new UserController();

userRouter.get("/feed", userController.getFeed);
userRouter.get("/:id", userController.getUserData);
userRouter.get("/profile", userController.getUserById);
userRouter.get("/recipe/:id", userController.getRecipeById);

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.post("/createRecipe", userController.createRecipe);
userRouter.post("/friend", userController.addFriend);

userRouter.put("/edit/:id", userController.editRecipe);

