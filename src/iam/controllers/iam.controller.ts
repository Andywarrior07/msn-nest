import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IamService } from '../services/iam.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.iamService.signUp(signUpDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  sigInp(@Body() signInDto: SignInDto) {
    return this.iamService.signIn(signInDto);
  }
}
