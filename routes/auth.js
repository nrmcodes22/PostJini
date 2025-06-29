const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');
const User=require('../models/user');
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback',
},async (accessToken,refreshToken,profile,done)=>{
    let user=await User.findOne({googleId:profile.id});
    if(!user)
    {
        user=await User.create({
            googleId:profile.id,
            name:profile.displayName,
            email:profile.emails[0].value,
            photo:profile.photos[0].value,
        });
    }
    return done(null,user);
}
));
passport.serializeUser((user,done)=>{
    done(null,user.id);
});
//done -tells user login is successfull
passport.deserializeUser(async (id,done)=>{
    const user=await User.findById(id);
    done(null,user);
});//agar hoga toh uska session details miljayega
