import express from 'express';
import path from 'path';
import crypto from 'crypto';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Admin Configuration from Environment Variables (Zero Secrets in Frontend code)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@cambridgetutoracademy.com').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdminPass@Cambridge2026!';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'cambridge_academy_secure_admin_secret_key_2026_q8w9e';

// In-memory active admin sessions map (token -> expiration timestamp)
const activeAdminSessions = new Map<string, { email: string; expiresAt: number }>();

// Helper to generate secure signature
function createSignedToken(email: string): string {
  const timestamp = Date.now();
  const expiresAt = timestamp + 1000 * 60 * 60 * 24; // 24 hours
  const payload = `${email}:${timestamp}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
  activeAdminSessions.set(token, { email, expiresAt });
  return token;
}

function verifySignedToken(token: string): { valid: boolean; email?: string } {
  try {
    if (!token) return { valid: false };
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return { valid: false };
    const [email, timestamp, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) {
      activeAdminSessions.delete(token);
      return { valid: false };
    }
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${email}:${timestamp}:${expiresAtStr}`)
      .digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: true, email };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

// -------------------------------------------------------------
// SECURE BACKEND ADMIN AUTHENTICATION APIS
// -------------------------------------------------------------

// 1. Admin Login API
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const inputPass = String(password);

  // Secure comparison
  if (cleanEmail === ADMIN_EMAIL && inputPass === ADMIN_PASSWORD) {
    const token = createSignedToken(cleanEmail);
    return res.json({
      success: true,
      message: 'Admin authenticated successfully',
      token,
      user: {
        id: 'admin_master',
        name: 'Cambridge Academy Lead Administrator',
        email: cleanEmail,
        role: 'admin',
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrative email or password. Access denied.',
  });
});

// 2. Admin Token Verification API
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No authorization token provided.' });
  }

  const result = verifySignedToken(token);
  if (result.valid) {
    return res.json({
      valid: true,
      user: {
        id: 'admin_master',
        name: 'Cambridge Academy Lead Administrator',
        email: result.email,
        role: 'admin',
      },
    });
  }

  return res.status(401).json({ valid: false, message: 'Session expired or invalid token.' });
});

// 3. Admin Logout API
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token) {
    activeAdminSessions.delete(token);
  }
  return res.json({ success: true, message: 'Admin logged out successfully' });
});

// Middleware to protect admin-only routes on the server
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Admin authorization token required.' });
  }
  const result = verifySignedToken(token);
  if (!result.valid) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired admin credentials.' });
  }
  (req as any).adminEmail = result.email;
  next();
}

// Protected Admin Metrics & Governance API
app.get('/api/admin/metrics', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    serverTime: new Date().toISOString(),
    admin: (req as any).adminEmail,
    system: 'Cambridge Tutoring Platform Production Node',
  });
});

// 4. System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Cambridge Tutors Education API',
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// VITE SPA MIDDLEWARE / STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cambridge Tutors server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
