import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  userRepositoryInMemory = new InMemoryUsersRepository();
  createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);

  it("should not be able to authenticate user than not exists", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "johndoe@rentx.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate user with wrong password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "johndoe@rentx.com",
        name: "John Doe",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "johndoe@rentx.com",
        password: "xxxxxx",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      email: "johndoe@rentx.com",
      name: "John Doe",
      password: "123456",
    });

    const authentication = await authenticateUserUseCase.execute({
      email: "johndoe@rentx.com",
      password: "123456",
    });

    expect(authentication).toHaveProperty("token");
  });
});
