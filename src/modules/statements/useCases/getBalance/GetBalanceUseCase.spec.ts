import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository

let createUser: CreateUserUseCase;
let getBalance: GetBalanceUseCase

describe('GetBalanceUseCase', () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository ();
    usersRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(usersRepository);
    getBalance = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it('should be able to list a user balance. ', async () => {
    const user = await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    const createStatement = new CreateStatementUseCase(usersRepository, statementsRepository);

    await createStatement.execute({
      user_id: user.id, type: OperationType.DEPOSIT, amount: 1500, description: 'celular'
    });

    await createStatement.execute({
      user_id: user.id, type: OperationType.WITHDRAW, amount: 100, description: 'lanche'
    });

    await createStatement.execute({
      user_id: user.id, type: OperationType.DEPOSIT, amount: 1150, description: 'salário'
    });

    const balance = await getBalance.execute({ user_id: user.id });

    expect(balance).toHaveProperty('statement');
    expect(balance.statement.length).toBe(3);
  });

  it('should not be able to list the balance of a non-existent user. ', async () => {

    expect(
      async () => getBalance.execute({ user_id: 'non-existent-user' })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });

});
