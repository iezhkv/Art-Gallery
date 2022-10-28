const router = require('express').Router();

const authService = require('../services/authService');
const { sessionName } = require('../constants');
const { alreadyLoggedIn } = require('../middlewares/authMiddleware');
const { isAuth } = require('../middlewares/authMiddleware');


router.get('/login', alreadyLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.get('/register', alreadyLoggedIn, (req, res) => {
    res.render('auth/register');
});
router.get('/profile', isAuth, (req, res) => {
    res.render('auth/profile');
});
router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(sessionName);
    res.redirect('/');
});

router.post('/login', alreadyLoggedIn, async(req, res) => {
    try {
        let token = await authService.login(req.body);
            
        if (!token) {
            return res.redirect('/404');
        }

        res.cookie(sessionName, token);

        res.redirect('/');
    } catch (error) {
        res.status(400).render('auth/login', { error: error.message })
    }
});

router.post('/register', alreadyLoggedIn, async (req, res) => {
    console.log(req.body);
    try {
        const user = await authService.register(req.body);
        
        let token = await authService.createToken(user);
        res.cookie(sessionName, token, { httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(401).render('auth/register', {error: error.message});
    }
});


module.exports = router; 