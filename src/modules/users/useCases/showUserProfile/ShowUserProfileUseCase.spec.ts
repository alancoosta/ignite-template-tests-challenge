import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("ShowUserProfileUseCase", () => {
  userRepositoryInMemory = new InMemoryUsersRepository();
  createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);

  it("should not be able to show user profile of nonexistent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123456");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      email: "johndoe@rentx.com",
      name: "John Doe",
      password: "123456",
    });

    const profile = await showUserProfileUseCase.execute(user.id);

    expect(profile).toHaveProperty("id");
  });
});
