import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository

let createUser: CreateUserUseCase;
let getStatementOperation: GetStatementOperationUseCase

describe('GetStatementOperationUseCase', () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository ();
    usersRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(usersRepository);
    getStatementOperation = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it('should be able to list a statement. ', async () => {
    const user = await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    const createStatement = new CreateStatementUseCase(usersRepository, statementsRepository);

    const  statement = await createStatement.execute({
      user_id: user.id, type: OperationType.DEPOSIT, amount: 1500, description: 'celular'
    });

    const response = await getStatementOperation.execute({ user_id: user.id, statement_id: statement.id });

    expect(response.user_id).toBe(user.id);
    expect(response.id).toBe(statement.id);
    expect(response.type).toBe(OperationType.DEPOSIT);
  });

  it('should not be able to list a statement non-existent user.', async () => {

    expect(
      async () => getStatementOperation.execute({ user_id: 'non-existent-user', statement_id: '123123' })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be able to list a non-existent statement.', async () => {

    const user = await createUser.execute({
      name: 'Test', email: 'user@test.com.br', password: '123123'
    });

    expect(
      async () => getStatementOperation.execute({ user_id: user.id, statement_id: 'non-existent-statement' })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

});
