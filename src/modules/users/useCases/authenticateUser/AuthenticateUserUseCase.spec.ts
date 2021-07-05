import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let usersRepository: InMemoryUsersRepository;
let authenticateUser: AuthenticateUserUseCase;


describe('AuthenticateUserUseCase', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUser = new AuthenticateUserUseCase(usersRepository);
  });


  it('should be able to authenticate the user.', async () => {
    const createUser = new CreateUserUseCase(usersRepository);

    await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    const response = await authenticateUser.execute({
      email: 'user@test.com.br', password: '123123'
    });

    expect(response).toHaveProperty('token');

  });

  it('should not be able to authenticate the user with non-existent email.', async () => {

    expect(async () => authenticateUser.execute({
      email: 'non-existent@email.com', password: '123123'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it('should not be able to authenticate the user with wrong password.', async () => {
    const createUser = new CreateUserUseCase(usersRepository);

    await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    const response =

    expect(
      async () => await authenticateUser.execute({
        email: 'user@test.com.br', password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });


});
