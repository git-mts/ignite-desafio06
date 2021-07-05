import { isTransformDescriptor } from "tsyringe/dist/typings/providers/injection-token";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let showUserProfile: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;


describe('ShowUserProfileUseCase', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfile = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to list the user profile.', async () => {



    const { id: userId } = await usersRepository.create({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    const user = await showUserProfile.execute(userId as string);

    expect(user.name).toBe('Test');
    expect(user.email).toBe('user@test.com.br');

  });

  it('should not ble able to list the profile a non-existent user.', async () => {

    expect(
      async () => showUserProfile.execute('non-existent-user')
    ).rejects.toBeInstanceOf(ShowUserProfileError);

  });

});
