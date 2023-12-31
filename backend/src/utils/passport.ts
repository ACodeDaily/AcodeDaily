import passport from 'passport';
import { Container } from 'typedi';
import { EmailSender } from '@utils/mail';
import passportGoogle from 'passport-google-oauth20';
import { UserModel } from '@/models/user.model';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@config';
import { Mail } from './constants';

const GoogleStrategy = passportGoogle.Strategy;
const emailSender = Container.get(EmailSender);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v3/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ email: profile.emails?.[0].value });

      // If user doesn't exist creates a new user. (similar to sign up)
      if (!user) {
        const newUser = await UserModel.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails?.[0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
        });
        await emailSender.sendMailWrapper({ to: newUser.email, template: 'welcome', username: newUser.username, subject: Mail.WelcomeSubject });
        if (newUser) {
          // set the user object in the done callback
          done(null, newUser);
        }
      } else {
        done(null, user);
      }
    },
  ),
);
