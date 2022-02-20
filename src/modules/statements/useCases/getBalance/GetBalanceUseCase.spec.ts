import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("GetBalanceUseCase", () => {
  userRepositoryInMemory = new InMemoryUsersRepository();
  statementRepositoryInMemory = new InMemoryStatementsRepository();

  createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  getBalanceUseCase = new GetBalanceUseCase(
    statementRepositoryInMemory,
    userRepositoryInMemory
  );

  it("should not be able to get balance of nonexistent uses", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe ",
      email: "johndoe@rentx.com",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(balance).toHaveProperty("statement", []);
    expect(balance).toHaveProperty("balance", 0);
  });
});
