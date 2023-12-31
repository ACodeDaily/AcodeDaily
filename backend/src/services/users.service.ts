import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { UpdateUser, UpdateUserRoles, User, UserFilter } from '@/interfaces/user.interface';
import { UserModel } from '@/models/user.model';

@Service()
export class UserService {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserModel.find();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await UserModel.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await UserModel.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserModel.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: UpdateUser): Promise<User> {
    let updateQuery = UserModel.findByIdAndUpdate(userId, userData, { new: true });
    if (userData.org) updateQuery = UserModel.findByIdAndUpdate(userId, { isVerified: false }, { new: true });
    const updateUserById: User = await updateQuery;

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await UserModel.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    return deleteUserById;
  }

  public async verifyModerator(userId: string, adminId: string): Promise<User> {
    const findUser: User = await UserModel.findById(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserById = await UserModel.findByIdAndUpdate(
      userId,
      {
        role: ['moderator'],
        verifiedBy: adminId,
        isVerified: true,
      },
      {
        new: true,
      },
    );

    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async verifyReferrer(userId: string, adminOrModId: string): Promise<User> {
    const findUser: User = await UserModel.findById(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserById: User = await UserModel.findByIdAndUpdate(
      userId,
      { verifiedBy: adminOrModId, isVerified: true },
      {
        new: true,
      },
    );
    if (!updateUserById) throw new HttpException(409, "User doesn't exist");

    return updateUserById;
  }

  public async getReferrers(filter: UserFilter): Promise<User[]> {
    let referrers: User[] = [];
    let referrerQuery = UserModel.find({ role: { $in: ['referrer'] } });

    if (filter.org) referrerQuery = referrerQuery.find({ org: filter.org });
    if (filter.isVerified) referrerQuery = referrerQuery.find({ isVerified: filter.isVerified });
    if (filter.sort) referrerQuery = referrerQuery.sort({ createdAt: filter.sort });
    if (filter.totalReferred) referrerQuery = referrerQuery.sort({ totalReferred: filter.totalReferred });

    referrers = await referrerQuery;
    return referrers;
  }

  public async getModerators(filter: UserFilter): Promise<User[]> {
    let referrers: User[] = [];
    let referrerQuery = UserModel.find({ role: { $in: ['moderator'] } });

    if (filter.org) referrerQuery = referrerQuery.find({ org: filter.org });
    if (filter.isVerified) referrerQuery = referrerQuery.find({ isVerified: filter.isVerified });
    if (filter.sort) referrerQuery = referrerQuery.sort({ createdAt: filter.sort });
    if (filter.totalReferred) referrerQuery = referrerQuery.sort({ totalReferred: filter.totalReferred });

    referrers = await referrerQuery;
    return referrers;
  }

  public async getModeratorById(moderatorId: string): Promise<User> {
    const findModerator: User = await UserModel.findOne({ _id: moderatorId }).populate('activities').populate({
      path: 'verifiedBy',
      select: 'username role',
    });
    if (!findModerator) throw new HttpException(409, "Moderator doesn't exist");
    return findModerator;
  }

  public async getReferrerById(referrerId: string): Promise<User> {
    const findReferrer: User = await UserModel.findOne({ _id: referrerId }).populate('activities').populate({
      path: 'verifiedBy',
      select: 'username role',
    });
    if (!findReferrer) throw new HttpException(409, "Referrer doesn't exist");
    return findReferrer;
  }

  public async updateRoles(userId: string, userData: UpdateUserRoles): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
    if (!updatedUser) throw new HttpException(409, "User doesn't exist");
    return updatedUser;
  }
}
