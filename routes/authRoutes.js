const passport = require("passport");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    // logout is automatically added to the request object by passport
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    // user is automatically added to the request object by passport
    res.send(req.user);
  });
};
