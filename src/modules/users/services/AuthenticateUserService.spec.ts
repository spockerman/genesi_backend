import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '../services/AuthenticateUserService';
import CreateUserService from '../services/CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUsuer', ()=>{
  beforeEach(()=>{
     fakeUsersRepository = new FakeUsersRepository();
     fakeHashProvider = new FakeHashProvider();

     createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
     authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

  });
  it('should be able to authenticate', async ()=>{

    const user = await createUser.execute({
      name: 'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });


    const response = await authenticateUser.execute({
      email:'johndoe@gmail.com',
      password: '123456',
    })
    expect(response).toHaveProperty('token');

    expect(response.user).toEqual(user);
  });
it('should not be able to authenticate with a non existis user', async ()=>{
    expect(authenticateUser.execute({
      email:'johndoe@gmail.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to authenticate with wrong  password', async ()=>{
    const user = await createUser.execute({
      name: 'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    expect(authenticateUser.execute({
      email:'johndoe@gmail.com',
      password: '456789',
    })).rejects.toBeInstanceOf(AppError);


  });

});
