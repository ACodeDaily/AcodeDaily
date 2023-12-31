import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { UpdateUser, UpdateUserRoles, User } from '@/interfaces/user.interface';
import { UserService } from '@services/users.service';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user._id;
      const userData: UpdateUser = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public verifyModerator = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const adminId: string = req.user._id;
      const updateUserData: User = await this.user.verifyModerator(userId, adminId);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public verifyReferrer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const adminId: string = req.user._id;
      const updateUserData: User = await this.user.verifyReferrer(userId, adminId);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public getReferrers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const findAllReferrersData: User[] = await this.user.getReferrers(filter);

      res.status(200).json({ data: findAllReferrersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getModerators = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = req.query;
      const findAllModeratorsData: User[] = await this.user.getModerators(filter);

      res.status(200).json({ data: findAllModeratorsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getModeratorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moderatorId: string = req.params.id;
      const findOneModeratorData: User = await this.user.getModeratorById(moderatorId);

      res.status(200).json({ data: findOneModeratorData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public getReferrerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const referrerId: string = req.params.id;
      const findOneReferrerData: User = await this.user.getReferrerById(referrerId);

      res.status(200).json({ data: findOneReferrerData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: UpdateUserRoles = req.body;
      const updateUserData: User = await this.user.updateRoles(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}
