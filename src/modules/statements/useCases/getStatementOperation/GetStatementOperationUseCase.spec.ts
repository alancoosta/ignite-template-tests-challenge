import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("GetStatementOperationUseCase", () => {
  userRepositoryInMemory = new InMemoryUsersRepository();
  statementRepositoryInMemory = new InMemoryStatementsRepository();

  createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  createStatementUseCase = new CreateStatementUseCase(
    userRepositoryInMemory,
    statementRepositoryInMemory
  );
  getStatementOperationUseCase = new GetStatementOperationUseCase(
    userRepositoryInMemory,
    statementRepositoryInMemory
  );

  it("should not be able to get statement operation with nonexistent user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "123",
        statement_id: "456",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation with nonexistent statement", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "John Doe 5",
        email: "johndoe5@rentx.com",
        password: "123456",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "789",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should be able to get statement operation", async () => {
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

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(result).toHaveProperty("amount", 100);
  });
});
