import { inject, injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';


interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ){}

    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {

    const user = await this.userRepository.findById(user_id);
    if(!user){
      throw new AppError('User not found.');
    }

    const userWithUpdateEmail = await this.userRepository.findByEmail(email);
    if(userWithUpdateEmail && userWithUpdateEmail.id !== user_id){
      throw new AppError('E-mail already in use.');
    }
    user.name = name;
    user.email = email;

    if(password && !old_password){
      throw new AppError('You need to inform the old password to set a new password');
    }


    if(password && old_password){
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if (!checkOldPassword){
        throw new AppError('You old password is incorret');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}
export default UpdateProfileService;
