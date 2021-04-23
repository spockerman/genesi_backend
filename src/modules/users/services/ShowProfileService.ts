import { inject, injectable} from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';


interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileSevice {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    ){}

    public async execute({ user_id}: IRequest): Promise<User> {

    const user = await this.userRepository.findById(user_id);
    if(!user){
      throw new AppError('User not found.');
    }

    return user;
  }
}
export default ShowProfileSevice;
