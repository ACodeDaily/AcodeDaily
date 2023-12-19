import pug from 'pug';
import { Service } from 'typedi';
import { Mail } from '@utils/constants';
import { renderTemplateData } from '@/interfaces/template.interface';

@Service()
export class Helper {
  public renderTemplate(data: renderTemplateData): string {
    return pug.compileFile(`${__dirname}/../views/${data.template}.pug`)({ ...data, brand: Mail.Brand, url: Mail.Url });
  }
}
