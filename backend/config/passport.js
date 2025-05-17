const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );
      if (rows.length === 0) return done(null, false);

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;
