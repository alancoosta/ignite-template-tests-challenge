import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
describe("CreateStatementUseCase", () => {
  userRepositoryInMemory = new InMemoryUsersRepository();
  statementRepositoryInMemory = new InMemoryStatementsRepository();

  createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  createStatementUseCase = new CreateStatementUseCase(
    userRepositoryInMemory,
    statementRepositoryInMemory
  );

  it("should not be able to create a statement with nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "12345",
        amount: 100,
        description: "Statement deposit",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a statement withdraw with insufficient funds", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "John Doe ",
        email: "johndoe@rentx.com",
        password: "123456",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        amount: 100,
        description: "Statement withdraw",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be able to create a statement with type withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe 3",
      email: "johndoe3@rentx.com",
      password: "123456",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 200,
      description: "Statement deposit",
      type: OperationType.DEPOSIT,
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "Statement withdraw",
      type: OperationType.WITHDRAW,
    });

    expect(statement.type).toEqual("withdraw");
  });

  it("should be able to create a statement with type deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe 2",
      email: "johndoe2@rentx.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "Statement deposit",
      type: OperationType.DEPOSIT,
    });

    expect(statement.type).toEqual("deposit");
  });
});
