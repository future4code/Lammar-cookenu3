export class CustomError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

export class Unauthorized extends CustomError {
  constructor() {
    super(401, "usuário não autorizado");
  }
}

export class InvalidToken extends CustomError {
  constructor() {
    super(401, "token inválido");
  }
}

export class InvalidEmail extends CustomError {
  constructor() {
    super(400, "Email Inválido");
  }
}

export class UserNotFound    extends CustomError {
  constructor() {
    super(404, "Usuário não encontrado ");
  }
}

export class InvalidPassword   extends CustomError {
  constructor() {
    super(401, "Password Incorreto");
  }
}

