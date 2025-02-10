const path = require("path");
const fs = require("fs");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

module.exports = async (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      console.log(jwt_payload);
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwt_payload.sub,
          },
        });
        if (user) {
          return done(null, user);
        } else return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
