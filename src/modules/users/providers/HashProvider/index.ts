import {container} from 'tsyringe';
import IHashProvider from '../HashProvider/model/IHashProvider';
import BCryptHashProvider from '../HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

