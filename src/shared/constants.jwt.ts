export const jwtConstants = {
    expiresIn: 3600 * 24, // 24h
    secret: process.env.JWT_SECRET
};