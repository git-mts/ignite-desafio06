import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository

let createUser: CreateUserUseCase;
let createStatement: CreateStatementUseCase

describe('CreateStatementUseCase', () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository ();
    usersRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(usersRepository);
    createStatement = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it('should not be able to create a new statement with non-existent user.', async () => {
    const user = await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    const statement = await createStatement.execute({
      user_id: user.id, type: OperationType.DEPOSIT, amount: 1500, description: 'celular'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a new statement with non-existent user.', async () => {

    expect(
      async () => createStatement.execute({
        user_id: 'non-existent-user', type: OperationType.DEPOSIT, amount: 1500, description: 'celular'
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to create a new withdrawal with insufficient balance.', async () => {

    const user = await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    expect(
      async () => createStatement.execute({
        user_id: user.id, type: OperationType.WITHDRAW, amount: 1500, description: 'celular'
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });



});
