import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateSecretDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  public cfUserName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(256)
  public token: string;

  @IsString()
  @IsNotEmpty()
  public discordId: string;
}
