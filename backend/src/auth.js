const crypto = require("crypto");

// جديد — يصدر رمز جلسة دخول موقّعًا صالحًا لمدة ثلاث ساعات.
function createToken(user) {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret) throw new Error("AUTH_TOKEN_SECRET is not configured");
    const payload = Buffer.from(JSON.stringify({
        id: user.id,
        role: user.user_type,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 3,
    })).toString("base64url");
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
    return `${payload}.${signature}`;
}

// جديد — يتحقق من توقيع رمز الدخول وصلاحيته ثم يعيد بيانات الحساب الموثوقة.
function readToken(token) {
    const secret = process.env.AUTH_TOKEN_SECRET;
    if (!secret || typeof token !== "string") return null;
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    try {
        const user = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        return user.id && user.exp > Date.now() / 1000 ? user : null;
    } catch {
        return null;
    }
}

// جديد — يخزن كلمة المرور كتجزئة scrypt مع ملح مختلف لكل مستخدم.
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `scrypt:${salt}:${hash}`;
}

// جديد — يقارن كلمة المرور المدخلة بالتجزئة المحفوظة في قاعدة البيانات.
function checkPassword(password, stored) {
    const [algorithm, salt, savedHash] = String(stored || "").split(":");
    if (algorithm !== "scrypt" || !salt || !savedHash) return false;
    const actual = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(savedHash, "hex");
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

// جديد — يفرض تسجيل الدخول على المسارات المحمية.
function requireAuth(req, res, next) {
    const value = req.get("authorization") || "";
    const user = value.startsWith("Bearer ") ? readToken(value.slice(7)) : null;
    if (!user) return res.status(401).json({ error: "Authentication required" });
    req.user = user;
    next();
}

// جديد — يمنع استخدام المسار إلا من الحسابات ذات الدور المطلوب.
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission" });
        }
        next();
    };
}

// جديد — يتيح وظائف المصادقة والتحقق لبقية ملفات الخادم.
module.exports = { createToken, checkPassword, hashPassword, requireAuth, requireRole };
