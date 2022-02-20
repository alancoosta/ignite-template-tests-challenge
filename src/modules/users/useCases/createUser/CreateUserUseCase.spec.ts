import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", () => {
  userRepositoryInMemory = new InMemoryUsersRepository();
  createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

  it("should not be able to create user if user already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "John Doe",
        email: "johndoe@rentx.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "John Doe",
        email: "johndoe@rentx.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });

  it("should be able to create user", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@rentx.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });
});
