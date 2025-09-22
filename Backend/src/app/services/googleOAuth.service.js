const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const userModel = require("../model/user.model")

function configurePassport() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName || "";
      const lastName = profile.name?.familyName || "";
      const image = profile.photos?.[0]?.value || "";

      let user = await userModel.findOne({ email });

      if (!user) {
        user = new userModel({
          username: profile.displayName,
          email,
          fullName: { firstName, lastName },
          image,
        });

        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

}

module.exports = {
  passport,
  configurePassport
}