/* eslint-disable consistent-return */
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

//com isso todas as rotas precisam estar autenticadas para serem acessadas
profileRouter.use(ensureAuthenticated);

profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;
