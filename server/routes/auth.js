var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

//    clientID: config.clientID,
//    clientSecret: config.clientSecret,
passport.use(new FacebookStrategy({
        clientID: "660694474039594",
        clientSecret: "a920955f7b716d8de10a4a7a0cf7b193",
        callbackURL: "/auth/facebook/callback"
    }, function (accessToken, refreshToken, profile, done) {
        if (!profile) {
            console.log("Fail FB login");
            // TODO
        }
        process.nextTick(function () {
            // facebookから帰ってきた情報を元に、本システム用のauth情報を取得or作成
            User.findOne({facebookId: profile["id"]}, function (err, identity) {
                if (err) {
                    console.log('FindUserErr:' + err);
                    return done(err);
                }
                // if user is not registered, register it
                if (!identity) {
                    var user = new User();
                    user.facebookId = profile["id"];
                    user.name = profile["displayName"];
                    user.save(function (err) {
                        if(err) console.log(err);
                        console.log("registered");
                    });
                    return done(null, user);
                }
                return done(null, identity);
            });
            //var util = require('util');
            //console.log(util.inspect(profile));
        });
    }
));

// ここに入るのは整形済みのuser(identity)情報
passport.serializeUser(function (user, done) {
    done(null, user);
});

// ここではuserを元にdbから情報引っ張ったほうがベター?
passport.deserializeUser(function (user, done) {
    done(null, user);
});

router.get('/facebook', passport.authenticate('facebook'));
// TODO
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/fail'
}));

router.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.send(200);
});

module.exports = router;
