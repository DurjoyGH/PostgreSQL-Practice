const prisma = require('../configs/prismaClient');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashPassword = await argon2.hash(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword
            },
        });

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user.id,
                email: user.email
            },
        });

    } catch (err) {
        res.status(400).json({
            error: "Email already exists!",
        });
    }
};