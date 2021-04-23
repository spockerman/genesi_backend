import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileSevice from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileSevice;

describe('ShowProfile', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileSevice(fakeUsersRepository);

  });
  it('should be able to show the profile', async ()=>{

   const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });
    const profile = await showProfile.execute({
      user_id: user.id,
    })
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@gmail.com');
  });
  it('should not be able to show the profile from a no-existing user', async ()=>{
    await expect(
      showProfile.execute({
      user_id: '111111',
    })).rejects.toBeInstanceOf(AppError);

   });

});
