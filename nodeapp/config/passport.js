const passport = require("passport");
const OIDCStrategy = require("passport-openidconnect").Strategy;
const User = require("../models/user");

passport.use(
  new OIDCStrategy(
    {
      issuer: process.env.ISSUER,
      authorizationURL: process.env.AUTHORIZATION_URL,
      tokenURL: process.env.TOKEN_URL,
      userInfoURL: process.env.USER_INFO_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["openid", "profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOneAndUpdate(
          { email: profile.emails[0].value },
          {
            name: profile.displayName,
            email: profile.emails[0].value,
          },
          { upsert: true, new: true }
        );
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
