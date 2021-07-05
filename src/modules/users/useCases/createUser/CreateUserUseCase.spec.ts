import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUser: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;


describe('CreateUserUseCase', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(usersRepository);
  });


  it('should be able to create a new user.', async () => {

    const name = 'Test';

    const user = await createUser.execute({
      name, email: 'user@test.com.br', password: 'test'
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(name);

  });

  it('should not be able to crate a new user with e-mail already registered.', async () => {

    const email = 'user@test.com.br';

    await createUser.execute({
      name: 'Test', email, password: 'test'
    });

    expect(
      async () => createUser.execute({ name: 'Test 2', email, password: '123123'})
    ).rejects.toBeInstanceOf(CreateUserError);

  });
});
