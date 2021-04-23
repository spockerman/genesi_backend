import {inject, injectable} from 'tsyringe';
import path from 'path';
import IUserRepository from '../repositories/IUsersRepository';
import IUserTokensRespository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/provider/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('UserTokensRespository')
    private userTokensRespository: IUserTokensRespository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,


    ){}
  public async execute({  email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if(!user){
      throw new AppError('User does not exists.');
    }
    const {token} = await this.userTokensRespository.generate(user.id);
    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views','forgot_password.hbs');
    await this.mailProvider.sendMail({
      to:{
        name: user.name,
        email:user.email,
      },
      subject: '[GoBarber] Recupercao de Senha',
      templateData:{
        file: forgotPasswordTemplate,
        variables:{
          name:user.name,
          link:`http://localhost:3333/reset_password?token=${token}`,
        }
      }
    });

  }
}
export default SendForgotPasswordEmailService;
