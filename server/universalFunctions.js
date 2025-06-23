import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userId = decoded.userId;
            req.userId = userId;
            next();
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};