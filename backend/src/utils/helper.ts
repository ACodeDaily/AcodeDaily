import pug from 'pug';
import { Service } from 'typedi';
import { Mail } from '@utils/constants';
import { renderTemplateData } from '@/interfaces/template.interface';
import { VerifyAccessKeyAndSecretKey } from '@/interfaces/secret.interface';
import { Request } from 'express';
import { Member } from '@/interfaces/member.interface';

@Service()
export class Helper {
  public renderTemplate(data: renderTemplateData): string {
    return pug.compileFile(`${__dirname}/../views/${data.template}.pug`)({ ...data, brand: Mail.Brand, url: Mail.Url });
  }

  public calculateTimeDifference(updatedAt: Date): number {
    const currentTime = new Date();
    const updatedTime = new Date(updatedAt);
    const differenceInMilliseconds = currentTime.getTime() - updatedTime.getTime();
    return differenceInMilliseconds / (1000 * 60 * 60 * 24); // Convert milliseconds to days
  }

  public getAuthorization(req: Request): string | null {
    const coockie = req.cookies['Authorization'];
    if (coockie) return coockie;

    const header = req.header('Authorization');
    if (header) return header.split('Bearer ')[1];

    return null;
  }

  public getAccessAndSecretKey(req: Request): VerifyAccessKeyAndSecretKey {
    const access_key = req.header('access_key');
    const secret_key = req.header('secret_key');
    return { access_key, secret_key };
  }

  public sendStatusUpdateToDiscord(member: Member): void {
    // const { cfUserName, status, referrerResponse } = member;
    return;
  }

  public areArraysEqual(array1: any[], array2: any[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }
}
