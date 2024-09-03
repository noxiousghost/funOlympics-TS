/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '../schemas/user.schema';
import Bcrypt from 'bcrypt';
import MailService from '../utils/mail.util';
import MailSender from '../utils/mailSender.util';

export const findAllUsers = async () => {
  return await User.find({}).populate('favourites');
};

export const findUserById = async (id: string) => {
  return await User.findById(id).populate('favourites');
};

export const createUser = async (userData: any) => {
  const { username, email, password, country, favoriteSport, phone } = userData;
  if (username.length < 3 || password.length < 3) {
    throw new Error(
      'Username and password must be at least 3 characters long!',
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }
  const passwordHash = await Bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    passwordHash,
    country,
    phone,
    favoriteSport,
  });
  const savedUser = await user.save();
  await MailSender.sendEmail(email); // Assuming sendEmail now handles exceptions internally
  return savedUser;
};

export const verifyUser = async (email: string, code: number) => {
  const mail = await MailService.find(email);
  if (mail && mail.code === code) {
    const user: any = await User.findOne({ email });
    user.verified = true;
    await user.save();
    return user;
  }
  return null;
};

export const updateUser = async (id: string, userData: any, user: any) => {
  if (user.id !== id && !user.isAdmin) {
    return { error: 'Unauthorized update!' };
  }
  const { username, email, password, country, favoriteSport, phone } = userData;
  const passwordHash = password ? await Bcrypt.hash(password, 10) : null;
  const newData = {
    username,
    email,
    passwordHash,
    country,
    favoriteSport,
    phone,
  };
  await User.findByIdAndUpdate(id, newData, { runValidators: true });
  return await User.findById(id);
};

export const updateFavourites = async (
  id: string,
  videoId: string,
  user: any,
) => {
  if (user.id !== id && !user.isAdmin) {
    return { success: false, error: 'Unauthorized!' };
  }
  const exists = user.favourites.some((fav: string) => fav === videoId);
  let result;
  if (exists) {
    user.favourites = user.favourites.filter((fav: string) => fav !== videoId);
    result = { message: 'Removed from favourites', data: user.favourites };
  } else {
    user.favourites.push(videoId);
    result = { message: 'Added to favourites', data: user.favourites };
  }
  await user.save();
  return { success: true, data: result };
};
