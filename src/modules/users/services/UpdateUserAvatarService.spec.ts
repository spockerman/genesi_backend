import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from'./UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

  });
  it('should be able to upload a new avatar', async ()=>{

    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id:user.id,
      avatarFileName: 'avatar.jpg',
    });
    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should be not able to upload a avatar from a non exists user', async ()=>{
    expect(updateUserAvatar.execute({
      user_id:'no-existing-user',
      avatarFileName: 'avatar.jpg',
    }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when a new are upload', async ()=>{
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.create({
      name:'John Doe',
      email:'johndoe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id:user.id,
      avatarFileName: 'avatar.jpg',
    });
    await updateUserAvatar.execute({
      user_id:user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
    expect(user.avatar).toBe('avatar2.jpg');
  });

});
