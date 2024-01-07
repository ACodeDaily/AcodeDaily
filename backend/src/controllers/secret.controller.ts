import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateSecret, Secret, VerifySecret } from '@interfaces/secret.interface';
import { SecretService } from '@services/secret.service';

export class SecretController {
  public secret = Container.get(SecretService);

  public getSecrets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSecretsData: Secret[] = await this.secret.findAllSecret();

      res.status(200).json({ data: findAllSecretsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public verifySecret = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, cfUserName }: VerifySecret = req.body;
      const findOneSecretData: Secret = await this.secret.findSecret({ token, cfUserName });

      res.status(200).json({ data: findOneSecretData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createSecret = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secretData: CreateSecret = req.body;
      const createSecretData: Secret = await this.secret.createSecret(secretData);

      res.status(201).json({ data: createSecretData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateSecret = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secretId: string = req.params.id;
      const secretData: Secret = req.body;
      const updateSecretData: Secret = await this.secret.updateSecret(secretId, secretData);

      res.status(200).json({ data: updateSecretData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSecret = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const SecretId: string = req.params.id;
      const deleteSecretData: Secret = await this.secret.deleteSecret(SecretId);

      res.status(200).json({ data: deleteSecretData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
