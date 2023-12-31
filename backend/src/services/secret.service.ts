import Container, { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { SecretModel } from '@models/secret.model';
import { CreateSecret, Secret } from '@interfaces/secret.interface';
import { Helper } from '@/utils/helper';
import { Constants } from '@/utils/constants';

@Service()
export class SecretService {
  private helper = Container.get(Helper);

  public async findAllSecret(): Promise<Secret[]> {
    const secrets: Secret[] = await SecretModel.find();
    return secrets;
  }

  public async findSecret(data: CreateSecret): Promise<Secret> {
    const findSecret: Secret = await SecretModel.findOne(data);

    if (!findSecret) throw new HttpException(409, 'Wrong token or username ');

    const tokenAge = this.helper.calculateTimeDifference(findSecret.tokenIssuedAt);

    if (tokenAge > Constants.oneDay) throw new HttpException(409, 'Token is incorrect or expired');

    return findSecret;
  }

  public async createSecret(secretData: CreateSecret): Promise<Secret> {
    const presentDate = new Date();
    const thisMonth = presentDate.getMonth();
    const thisYear = presentDate.getFullYear();

    const findSecretData = await SecretModel.findOne({ cfUserName: secretData.cfUserName });

    if (findSecretData) {
      const key = `${thisMonth}${thisYear}`;
      const request: number = findSecretData.date.get(key);

      if (request > 7) {
        throw new HttpException(409, 'You have reached the limit of requests for this month');
      }
      const updateSecretData: Secret = await SecretModel.findByIdAndUpdate(
        findSecretData._id,
        {
          date: { [key]: request + 1 },
          token: secretData.token,
          tokenIssuedAt: Date.now(),
        },
        { new: true },
      );
      return updateSecretData;
    }

    const createSecretData: Secret = await SecretModel.create({ ...secretData, date: { [`${thisMonth}${thisYear}`]: 1 } });

    return createSecretData;
  }

  public async updateSecret(secretId: string, secretData: Secret): Promise<Secret> {
    const updateSecretById: Secret = await SecretModel.findByIdAndUpdate(secretId, { secretData });
    if (!updateSecretById) throw new HttpException(409, "Secret doesn't exist");

    return updateSecretById;
  }

  public async deleteSecret(secretId: string): Promise<Secret> {
    const deleteSecretById: Secret = await SecretModel.findByIdAndDelete(secretId);
    if (!deleteSecretById) throw new HttpException(409, "Secret doesn't exist");

    return deleteSecretById;
  }
}
