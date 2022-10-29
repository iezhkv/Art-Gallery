const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { secret, saltRounds } = require('../constants');

exports.register = async ({ username, password, repeatPassword, address }) => {
    let user = await User.findOne({ username });

    if (user) {
        throw {
            message: 'Username already exists'
        };
    }
    if (!username) {
        throw {
            message: 'Username cannot be blank'
        };
    }
  

    if (password !== repeatPassword) {
        throw {
            message: 'Password missmatch'
        };
    }
    if (password.length <= 3) {
        throw {
            message: 'Password must contain atleast 3 simbols'
        };
    }

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    let createdUser = User.create({
        username,
        password: hashedPassword,
        address,
    });

    return createdUser;
};

exports.login = async ({ username, password }) => {

    let user = await User.findOne({ username });

    if (!user) {
        throw {
            message: 'Invalid username or password'
        };
    }
    

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw {
            message: 'Invalid username or password'
        };
    }

    let result = this.createToken(user);

    return result;
};

exports.createToken = (user) => {
    let result = new Promise((resolve, reject) => {
        jwt.sign({ _id: user._id, username: user.username }, secret, { expiresIn: '2d' }, (err, token) => {
            if (err) {
                return reject(err);
            }

            resolve(token);
        });
    });

    return result;
}