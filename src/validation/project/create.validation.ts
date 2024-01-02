import { body } from 'express-validator';

export const CreateProjectFields = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('abbre')
        .notEmpty().withMessage('Abbre is required')
        .isString()
        .isLength({ min: 2 }).withMessage('Abbre must be at least 2 characters long'),

    body('icon')
        .notEmpty().withMessage('Icon is required')
        .custom((value) => {
            if (!isBase64Image(value)) {
                throw new Error('Icon must be a valid base64 image');
            }
            return true;
        }),

    body('secret')
        .notEmpty().withMessage('Secret is required')
        .custom((value, { req }) => {
            const basicAuthRegex = /^[A-Za-z0-9+/]*$/;
            if (!basicAuthRegex.test(value)) {
                throw new Error('Invalid Basic Authentication format');
            }
            return true;
        }),

    body('authorized_ip')
        .optional()
        .notEmpty().withMessage('Authorized_ip is required')
        .isString()
        .isLength({ min: 2 }).withMessage('Authorized_ip must be at least 2 characters long'),
];

function isBase64Image(value: string) {
    return /^data:image\//.test(value);
}