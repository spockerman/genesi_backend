import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from'../../users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUsuer', ()=>{
  beforeEach(()=>{
     fakeUsersRepository = new FakeUsersRepository();
     fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

  });

  it('should be able to create a new user', async ()=>{

    const user = await createUser.execute({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });
    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user whih a existent email', async ()=>{
    await createUser.execute({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });
    expect(createUser.execute({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

});
