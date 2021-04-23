import AppError from '@shared/errors/AppError';
import {inject, injectable} from 'tsyringe';
import { isAfter, addHours} from 'date-fns';
import IUserRepository from '../repositories/IUsersRepository';
import IUserTokensRespository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/model/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('UserTokensRespository')
    private userTokensRespository: IUserTokensRespository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
    ){}

  public async execute({  token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRespository.findByToken(token);

    if(!userToken){
       throw new AppError('User token does not found');
    }
    const user = await this.userRepository.findById(userToken?.user_id);

    if(!user){
      throw new AppError('User does not found');
   }
   const tokenCreatedAt =  userToken.created_at;
   const comparDate = addHours(tokenCreatedAt, 2);

   if(isAfter(Date.now(), comparDate)){
     throw new AppError( 'Token expired.');
   }

   user.password = await this.hashProvider.generateHash(password);
   await this.userRepository.save(user);

  }

}
export default ResetPasswordService;
