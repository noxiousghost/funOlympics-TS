import User from '../schemas/user.schema';
import Bcrypt from 'bcrypt';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { logger } from '../configs/logger.config';
import { IUser } from '../interfaces/user.interface';

export const findAllUsers = async () => {
  const result = await User.find({});
  if (!result) {
    throw new AppError('Users not found', 404);
  }
  return result;
  // return await User.find({}).populate('favourites');
};

export const findUserById = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError('User not found', 404);
  }
  return result;
};

export const updateUser = async (id: string, userData: IUser) => {
  const { username, email, password, country, favoriteSport, phone } = userData;
  const currentUser = await User.findById(id);
  if (!currentUser) {
    throw new AppError('User not found', 404);
  }
  // Check only if the email is different from the current one
  if (email && email !== currentUser.email) {
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      throw new AppError('User with that email already exists', 400);
    }
  }
  // Check only if the phone is different from the current one
  if (phone && phone !== currentUser.phone) {
    const userPhone = await User.findOne({ phone });
    if (userPhone) {
      throw new AppError('User with that phone number already exists', 400);
    }
  }
  const passwordHash = password ? await Bcrypt.hash(password, 10) : null;
  const newData = {
    username,
    email,
    password: passwordHash,
    country,
    favoriteSport,
    phone,
  };
  const result = await User.findByIdAndUpdate(id, newData);
  if (!result) {
    throw new AppError('User not updated', 400);
  }
  logger.info(`${result.username} user updated`);
  return await User.findById(id);
};

//todo : work on it after video feature is added
// export const updateFavourites = async (
//   id: string,
//   videoId: string,
//   user: IUser,
// ) => {
//   if (user.id !== id && !user.isAdmin) {
//     throw new AppError('Unauthorized!', 401);
//   }
//   try {
//     const exists = user.favourites.some((fav: string) => fav === videoId);
//     let result;
//     if (exists) {
//       user.favourites = user.favourites.filter(
//         (fav: string) => fav !== videoId,
//       );
//       result = { message: 'Removed from favourites', data: user.favourites };
//     } else {
//       user.favourites.push(videoId);
//       result = { message: 'Added to favourites', data: user.favourites };
//     }
//     await user.save();
//     return { success: true, data: result };
//   } catch (error) {
//     throw new AppError(error as string, 500);
//   }
// };
