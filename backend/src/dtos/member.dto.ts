import { IsEmail, IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Matches, IsEnum, Min, Max, IsLowercase } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  public cfUserName: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public jobId: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public message: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^https:\/\/drive\.google\.com\//)
  public resume: string;

  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  public org: string;

  @IsOptional()
  @IsString()
  public phoneNumber?: string;

  @IsNumber()
  @IsPositive()
  @Min(0, { message: 'CGPA must be at least 1' })
  @Max(20, { message: 'CGPA cannot exceed 10' })
  public cgpa: number;

  @IsNumber()
  @IsPositive()
  @Min(0, { message: 'Years of experience must be at least 0' })
  @Max(20, { message: 'Years of experience cannot exceed 20' })
  public yoe: number;

  @IsString()
  @IsNotEmpty()
  public token: string;
}

export class UpdateMemberStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['accepted', 'rejected'])
  public status: string;

  @IsString()
  @IsNotEmpty()
  public referrerResponse: string;
}
