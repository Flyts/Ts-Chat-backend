const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt  = require('passport-jwt').ExtractJwt,
      { config }  = require('./config'),
      passport    = require("passport"),
      User        = require("../models/user")

const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey    = config.jwt_txt_encrypt

passport.use(new JwtStrategy(opts, function(jwt_payload, done) 
{
    User.findOne({_id: jwt_payload.userId}, (err, user) => 
    {
        if(err) {
            return done(err, false);
        }
        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    })
}))