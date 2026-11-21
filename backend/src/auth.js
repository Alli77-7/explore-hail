const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-before-production';

function issueToken(user) {
    return jwt.sign({ sub: user.id, role: user.role || user.user_type, providerId: user.provider_slug || null }, JWT_SECRET, { expiresIn: '8h' });
}

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try { req.auth = jwt.verify(token, JWT_SECRET); next(); }
    catch { return res.status(401).json({ error: 'Invalid or expired session' }); }
}

function requireProvider(req, res, next) {
    if (!req.auth || !['provider', 'restaurant', 'hotel', 'admin'].includes(req.auth.role)) return res.status(403).json({ error: 'Provider access required' });
    next();
}

function requireAdmin(req, res, next) {
    if (!req.auth || req.auth.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
}

async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = { issueToken, requireAuth, requireProvider, requireAdmin, verifyPassword };
