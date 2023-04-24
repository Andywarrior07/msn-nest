import { IsString } from 'class-validator';

export class MessagesDto {
  @IsString()
  from: string;

  @IsString()
  to: string;
}
