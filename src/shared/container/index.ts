import {container} from 'tsyringe';
import './provider';

import IAppointmentsRespository from '@modules/appointments/repositories/IAppointmentRepository';
import AppointmentsRespository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';


import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRespository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRespository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IHashProvider from '@modules/users/providers/HashProvider/model/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IAppointmentsRespository>(
    'AppointmentsRespository',
    AppointmentsRespository,
    );

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
     UsersRepository,
  );
  container.registerSingleton<IUserTokensRespository>(
    'UserTokensRespository',
    UserTokensRespository,
  );



  container.registerSingleton<IHashProvider>(
    'HashProvider',
    BCryptHashProvider,
  );
