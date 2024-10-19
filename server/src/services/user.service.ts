import User from '../schemas/user.schema';
import Bcrypt from 'bcrypt';
import MailService from '../services/mail.service';
import otpService, { OtpType } from '../services/otp.service';
import jwt from 'jsonwebtoken';
import { envVars } from '../configs/envVars.config';
import { AppError } from '../middlewares/errorHandlers.middleware';
import { logger } from '../configs/logger.config';
import { IUser } from '../interfaces/user.interface';

const SECRET = envVars.JWTSECRET as string;

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

export const createUser = async (userData: IUser) => {
  const { username, email, password, country, favoriteSport, phone } = userData;
  if ((await User.findOne({ email })) || (await User.findOne({ phone }))) {
    throw new AppError('User with that email or phone already exists', 400);
  }
  const passwordHash = await Bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: passwordHash,
    country,
    phone,
    favoriteSport,
  });
  const result = await user.save();
  if (!result) {
    throw new AppError('User not created', 400);
  }
  logger.info(`New ${result.username} user created`);
  const sendEmail = await MailService.sendOtpEmail(email, OtpType.SIGNUP);
  if (!sendEmail) {
    throw new AppError('Error while sending verification email', 400);
  }
  return result;
};

export const verifyUser = async (email: string, code: number) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not registered', 404);
  }
  const mail = await otpService.findOtp(email, OtpType.SIGNUP);
  if (!mail) {
    throw new AppError('Verification code not found', 400);
  }
  if (mail.code !== code) {
    throw new AppError('Invalid OTP', 400);
  }
  user.verified = true;
  const result = await user.save();
  if (!result) {
    throw new AppError('User not verified', 400);
  }
  logger.info(`${result.username} user verified`);
  return user;
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

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid email or password', 400);
  }
  const passwordCorrect = await Bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    throw new AppError('Invalid email or password', 400);
  }
  try {
    const userForToken = {
      username: user.username,
      email: user.email,
      country: user.country,
      favoriteSport: user.favoriteSport,
      isAdmin: user.isAdmin,
      id: user._id?.toString() || '',
    };
    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1d' });
    user.logged_in = (user.logged_in || 0) + 1;
    await user.save();
    logger.info(`${user.username} user logged in`);
    return { token };
  } catch (error) {
    throw new AppError(error as string, 500);
  }
};
