import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPassword from'../../users/services/ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository:FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPassword;
let fakeHashProvider:FakeHashProvider;

describe('ResetPasswordService', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPassword(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  } )

  it('should be able to recovery the password send a email', async ()=>{
   const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password:'123456',
    });
    const {token} = await fakeUserTokensRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password:'123123',
      token,
    })
    const updateUser = await fakeUsersRepository.findById(user.id);
    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updateUser?.password).toBe('123123');
  });

  it('should be able to reset the password with non-existing token', async ()=>{
     await expect(
       resetPassword.execute({
         token: 'non-exists-token',
         password:'123456',
       }),
     ).rejects.toBeInstanceOf(AppError)
   });
   it('should be able to reset the password with non-existing user', async ()=>{
    const {token} = await fakeUserTokensRepository.generate('non-existing-user');
    await expect(
      resetPassword.execute({
        token,
        password:'123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  });

  it('should be able to recovery the password after expirated time', async ()=>{
    const user = await fakeUsersRepository.create({
       name: 'John Doe',
       email: 'johndoe@gmail.com',
       password:'123456',
     });
     const {token} = await fakeUserTokensRepository.generate(user.id);
     jest.spyOn(Date, 'now').mockImplementationOnce ( () => {
       const customDate = new Date();
       return customDate.setHours(customDate.getHours()+3);
     })

     await expect(
      resetPassword.execute({
        password:'123123',
        token,
      })
     ).rejects.toBeInstanceOf(AppError);

   });

});
