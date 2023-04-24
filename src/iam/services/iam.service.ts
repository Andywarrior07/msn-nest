import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './../../users/schemas/user.schema';
import { SignUpDto } from '../dtos/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { randomUUID } from 'crypto';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IamService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, username } = signUpDto;

    try {
      const user = new this.model({
        email,
        username,
        password: await this.hashingService.hash(password),
      });

      await user.save();
    } catch (err) {
      if (err && err.code === 11000) {
        throw new ConflictException('Email already exists');
      }

      throw new InternalServerErrorException(err);
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User or password incorrect');
    }

    const isEqual = await this.hashingService.compare(password, user.password);

    if (!isEqual) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    const accessToken = await this.generateToken(user);
    return { accessToken, userId: user._id };
  }

  async generateToken(user: User) {
    // const refreshTokenId = randomUUID();
    // const [accessToken, refreshToken] = await Promise.all([
    const [accessToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user._id,
        this.configService.get<number>('JWT_ACCESS_TOKEN_TTL'),
        { email: user.email },
      ),
      // this.signToken(
      //   user._id,
      //   this.configService.get<number>('JWT_REFRESH_TOKEN_TTL'),
      //   {
      //     refreshTokenId,
      //   },
      // ),
    ]);

    // await this.refreshTokenStorage.insert(user._id, refreshTokenId);

    return accessToken;
  }

  decodeToken(accessToken: string): any {
    return this.jwtService.decode(accessToken);
  }

  // async refreshToken(refreshTokenDto: RefreshTokenDto) {
  //   try {
  //     const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
  //       Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
  //     >(refreshTokenDto.refreshToken, {
  //       secret: this.jwtConfiguration.secret,
  //       audience: this.jwtConfiguration.audience,
  //       issuer: this.jwtConfiguration.issuer,
  //     });
  //     const user = await this.model.findOne({ _id: sub });
  //     const isValid = await this.refreshTokenStorage.validate(
  //       user._id,
  //       refreshTokenId,
  //     );

  //     if (!isValid) {
  //       throw new Error('Refresh token is invalid');
  //     }

  //     await this.refreshTokenStorage.invalidate(user._id);

  //     return this.generateToken(user);
  //   } catch (err) {
  //     if (err instanceof InvalidatedRefreshTokenError) {
  //       throw new UnauthorizedException('Access denied');
  //     }

  //     throw new UnauthorizedException();
  //   }
  // }

  private async signToken<T>(_id: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: _id,
        ...payload,
      },
      {
        // audience: this.jwtConfiguration.audience,
        // issuer: this.jwtConfiguration.issuer,
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
      },
    );
  }
}
