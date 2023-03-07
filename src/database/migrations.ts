import { Database } from "../connection/database";
import { CustomError } from "../error/CustomError";

class CreateTables extends Database {
  public async adcDadosNaTables(): Promise<void> {
    try {
      await Database.connection
        .raw(
          `
          INSERT INTO Users (id, name, email, password, role)
          VALUES("2afbe1e8-c33c-4122-884b-4a9f0c11135b",
                 "Gabriel","gabriel@gmail.com", "$2b$10", "ADMIN"),
                ("ad2b733a-29da-49c6-b41a-42322bdcd184","Julia", "julia@gmail.com", "$2b$10", "ADMIN"),
                ("69a3ca5f-55a9-48cd-aeb2-d8764c5161f2","Santiago", "santiago@gmail.com", "$2b$10", "ADMIN");

          INSERT INTO Recipes (id, title, description, user_id)
                values("2a80d0a1-7055-4e81-836c-c5977e50091c", "torta de maça",
                       "40 minutos são suficientes para preparar uma deliciosa torta de maçã que rende 10 poções e vai fazer todos ficarem com água na boca. Confira a receita!", "2afbe1e8-c33c-4122-884b-4a9f0c11135b"),
                      ("45ea6f89-e277-4575-987d-8cd12da12a63", "bolinho de chuva",
                      "O bolinho de chuva é um prato com gostinho de infância, perfeito para o lanche da tarde acompanhado de um café ou um chocolate quente cremoso.", "ad2b733a-29da-49c6-b41a-42322bdcd184"),
                      ("f48a06cf-b6c8-4d51-988b-baad5f9c38a5", "bolo de cenoura",
                      "O bolo de cenoura é uma opção simples e prática para o café da manhã, lanche da tarde ou para uma ocasião especial com famílias e amigos.", "69a3ca5f-55a9-48cd-aeb2-d8764c5161f2");

   `
        )
        .then(() => {
          console.log(`Data created successfully!`);
          Database.connection.destroy();
        })
        .catch((error: any) => console.log(error.sqlMessage || error.message));
    } catch (error: any) {
      throw new CustomError(error.statusCode, error.message);
    }
  }
}

const createTables = new CreateTables();
createTables.adcDadosNaTables();

