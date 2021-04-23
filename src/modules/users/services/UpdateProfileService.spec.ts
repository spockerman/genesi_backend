import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let UpdateProfile: UpdateProfileService;

describe('UpdateProfile', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    UpdateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

  });
  it('should be able to upload your profile', async ()=>{

    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    const updateUser = await UpdateProfile.execute({
      user_id:user.id,
      name:'John Doe2',
      email:'johndoe2@gmail.com',
    });
    expect(updateUser.name).toBe('John Doe2');
    expect(updateUser.email).toBe('johndoe2@gmail.com');
  });


  it('should be able to upload your password', async ()=>{

    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    const updateUser = await UpdateProfile.execute({
      user_id:user.id,
      name:'John Doe2',
      email:'johndoe2@gmail.com',
      old_password:'123456',
      password:'666666',
    });
    expect(updateUser.password).toBe('666666');
  });

  it('should be inform the old password to upload your password', async ()=>{

    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      UpdateProfile.execute({
        user_id: user.id,
        name: 'Marie Doe',
        email: 'mariedoe@gmail.com',
        password:'123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be inform the corret old password to upload your password', async ()=>{

    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      UpdateProfile.execute({
        user_id: user.id,
        name: 'Marie Doe',
        email: 'mariedoe@gmail.com',
        old_password: '444444',
        password:'123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to chance you email to a existing email' , async ()=>{

    await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name:'Test',
      email:'test@gmail.com',
      password: '123456',
    });

    await expect(
      UpdateProfile.execute({
        user_id: user.id,
        name: 'Marie Doe',
        email:'johndoe@gmail.com',
        password:'123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to show the profile from a no-existing user', async ()=>{
    await expect(
      UpdateProfile.execute({
      user_id: '111111',
      name:'Teste',
      email:'test@gmail.com',
    })).rejects.toBeInstanceOf(AppError);

   });


});
