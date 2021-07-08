const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

/*
 * This gets executed when the done function
 * gets called from the GoogleStrategy callback.
 * It creates an identifying token for the user
 * (just their mongo id in our case) and puts it
 * in a cookie.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/*
 * This gets the user's record from the db based
 * on the token in their cookie.  It is added to
 * request objects.
 */
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        done(null, existingUser);
      } else {
        // we don't have a user with this ID, make a new record
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      }
    }
  )
);
