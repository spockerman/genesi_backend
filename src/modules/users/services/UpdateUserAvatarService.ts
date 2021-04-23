import path from 'path';
import fs from 'fs';
import { inject, injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/provider/StorageProvider/models/IStorageProvider';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    ){}

    public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    const filename = await this.storageProvider.saveFile(avatarFileName);
    user.avatar = filename;
    await this.userRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;
