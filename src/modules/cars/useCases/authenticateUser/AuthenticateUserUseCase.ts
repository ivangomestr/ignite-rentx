import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '../../../accounts/repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    // Usuário existe
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email or password incorrect!');
    }

    const passwordMatch = await compare(password, user.password);
    console.log(passwordMatch);

    // Senha está correta
    if (!passwordMatch) {
      throw new Error('Email or password incorrect!');
    }

    const token = sign({}, 'f02818d350fb5fb81b39605ee2d13dda', {
      subject: user.id,
      expiresIn: 'id',
    });

    return {
      user,
      token,
    };
  }
}

export { AuthenticateUserUseCase };