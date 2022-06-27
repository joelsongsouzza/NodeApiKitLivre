//import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');

const secret = `${process.env.SECRET}`;
const timer = `${process.env.TEMPO}`;
module.exports = { sign() {payload => jwt.sign(payload, secret, {expiresIn: timer})},
 decode() {token => jwt.verify(token, secret)}}
