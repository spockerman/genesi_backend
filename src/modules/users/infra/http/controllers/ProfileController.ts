import {Response, Request} from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileSevice from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response>{
    const user_id = request.user.id;
    const { name, email,  password, old_password } = request.body;
    const showProfile = container.resolve(ShowProfileSevice);

    const user = await showProfile.execute({user_id});

    return response.json(user);
  }
  public async update(request : Request, response: Response): Promise<Response>{
    const user_id = request.user.id;
    const { name, email,  password, old_password } = request.body;
    const resetPassword = container.resolve(UpdateProfileService);
    await resetPassword.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(204).json();
  }

}
