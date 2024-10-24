const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.signup = async (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 7200 }); // 2 hours
        res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        res.cookie('userId', user._id.toString(), { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        res.cookie('email', user.email, { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        res.cookie('username', user.username, { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).send({ message: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null, message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 7200 }); // 2 hours
        res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        res.cookie('userId', user._id.toString(), { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        res.cookie('email', user.email, { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds
        res.cookie('username', user.username, { httpOnly: false, maxAge: 7200000 }); // 2 hours in milliseconds

        res.status(200).send({ auth: true, token: token });
    } catch (error) {
        res.status(500).send({ message: 'Error on the server', error: error.message });
    }
};