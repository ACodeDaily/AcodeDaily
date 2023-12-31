import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsEnum, IsArray, IsOptional } from 'class-validator';

enum UpdateUserRoles {
  Moderator = 'moderator',
  Referrer = 'referrer',
}
export class SignupUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsNumber()
  @IsNotEmpty()
  public otp: number;

  @IsString()
  @IsNotEmpty()
  public org: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public org: string;
}

export class UpdateUserRolesDto {
  @IsArray()
  @IsNotEmpty()
  @IsEnum(UpdateUserRoles, { each: true })
  public role: string;
}
