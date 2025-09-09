/**
 * @description: This checks if there is a token in the request cookies
 *                - if yea, passes the logged in user to do the next function
 *                - else throws back a 401 unauthorized user
 */

const authProtector = async (req, res, next) => {
    // verify if jwt is in cookie
    const token = req.cookies.jwt;
    if (!token)
        return res.status(401).json({ error: "Unauthorized. Please log in" });

    // verify if token is valid
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();

    } catch (err) {
        console.log("Error in auth middleware", err.message)
        return res.status(403).json({ error: "Invalid or Expired token" });
    }
}