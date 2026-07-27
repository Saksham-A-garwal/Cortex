const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const UserModel = require("../Model/UserModel");

// ==========================================
// 1. GOOGLE STRATEGY
// ==========================================
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        proxy: true, // Crucial for Vercel/Render deployments!
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0].value;

          // Check if this email already exists in our database
          let user = await UserModel.findOne({ email: email });

          if (user) {
            // If they exist, but don't have a googleId, attach it!
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // If they don't exist, create a brand new account!
          user = await UserModel.create({
            fullname: profile.displayName || "Google User",
            email: email,
            googleId: profile.id,
            authProvider: "google",
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
}

// ==========================================
// 2. GITHUB STRATEGY
// ==========================================
if (process.env.GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"], // We specifically ask GitHub for their email
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
          
          // If GitHub doesn't give us an email (e.g. privacy settings), generate a dummy one
          if (!email) {
            email = `${profile.username}@github.com`;
          }

          let user = await UserModel.findOne({ email: email });

          if (user) {
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          user = await UserModel.create({
            fullname: profile.displayName || profile.username || "GitHub User",
            email: email,
            githubId: profile.id,
            authProvider: "github",
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
}

// These two functions are required by Passport to keep the connection alive during the redirect
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
