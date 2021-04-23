import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
// import FakeMailProvider from '../providers/MailProvider/fakes/FakeMailProvider';
import FakeMailProvider from '@shared/container/provider/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from'../../users/services/SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository:FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;


describe('SendForgotPasswordEmail', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeMailProvider,
    );
  } )

  it('should be able to recovery the password send a email', async ()=>{
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password:'123456',
    });
    const user = await sendForgotPasswordEmail.execute({
      email:'johndoe@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a non-exists user password', async ()=>{
    await expect(
      sendForgotPasswordEmail.execute({
      email:'johndoe@gmail.com',
    }),
    ).rejects.toBeInstanceOf(AppError);
  });


  it('should generate a forgot password token', async ()=>{
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password:'123456',
      });

      await sendForgotPasswordEmail.execute({
        email:'johndoe@gmail.com',
      });

      expect(generateToken).toHaveBeenCalledWith(user.id);
  });


});
