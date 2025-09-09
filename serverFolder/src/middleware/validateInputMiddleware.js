/**
 * validates user details as a middleware
 */



export const middlewareInputValidation = (schema) => (req, res, next) => {
    /** validates the user details */

    const { error } = schema.validate(req.body || {});
    if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({ error: errorMessage });
    }

    next();
}
