import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initialData } from './src/data/initialData.ts';
import { FullDatabase, PhotoItem, StoryChapter, SocialLink, ProofItem, MediaItem } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'liyana_editorial_secret_2026_luxury';

// Ensure data and upload directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize Database if not exists
function getDatabase(): FullDatabase {
  if (!fs.existsSync(DB_FILE)) {
    saveDatabase(initialData);
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...initialData,
      ...parsed,
      homepage: { ...initialData.homepage, ...(parsed.homepage || {}) },
      about: { ...initialData.about, ...(parsed.about || {}) },
      contact: { ...initialData.contact, ...(parsed.contact || {}) },
      settings: { ...initialData.settings, ...(parsed.settings || {}) },
      stories: Array.isArray(parsed.stories) ? parsed.stories : initialData.stories,
      photos: Array.isArray(parsed.photos) ? parsed.photos : initialData.photos,
      socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : initialData.socialLinks,
      proofs: Array.isArray(parsed.proofs) ? parsed.proofs : initialData.proofs,
      media: Array.isArray(parsed.media) ? parsed.media : (initialData.media || []),
    };
  } catch (e) {
    console.error('Error reading database file, falling back to initial data:', e);
    return initialData;
  }
}

function saveDatabase(data: FullDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[CMS] Database successfully saved (${new Date().toISOString()})`);
  } catch (e) {
    console.error('Error saving database file:', e);
  }
}

// Initialize Admin User
interface StoredAdmin {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  lastLogin?: string;
}

function getAdminUser(): StoredAdmin {
  const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@liyanashrestha.com';
  if (!fs.existsSync(ADMIN_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('LiyanaAdmin2026!', salt);
    const defaultAdmin: StoredAdmin = {
      id: 'admin-1',
      email: defaultEmail,
      passwordHash: hash,
      name: 'Liyana Shrestha',
      role: 'superadmin'
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2), 'utf-8');
    return defaultAdmin;
  }
  try {
    const raw = fs.readFileSync(ADMIN_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading admin file:', e);
    const salt = bcrypt.genSaltSync(10);
    return {
      id: 'admin-1',
      email: defaultEmail,
      passwordHash: bcrypt.hashSync('LiyanaAdmin2026!', salt),
      name: 'Liyana Shrestha',
      role: 'superadmin'
    };
  }
}

function saveAdminUser(admin: StoredAdmin) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2), 'utf-8');
}

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp, gif, avif, svg) are allowed'));
    }
    cb(null, true);
  }
});

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve Uploaded Files
app.use('/uploads', express.static(UPLOADS_DIR));

// JWT Authentication Middleware
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    (req as any).user = user;
    next();
  });
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public content endpoint - filtered for published items
app.get('/api/content', (_req, res) => {
  const db = getDatabase();
  const publicData = {
    homepage: db.homepage,
    stories: (db.stories || []).filter(s => s.published).sort((a, b) => a.order - b.order),
    photos: (db.photos || []).filter(p => p.published).sort((a, b) => a.order - b.order),
    about: db.about,
    socialLinks: (db.socialLinks || []).filter(l => l.enabled).sort((a, b) => a.order - b.order),
    contact: db.contact,
    proofs: (db.proofs || []).filter(p => p.published).sort((a, b) => a.order - b.order),
    settings: db.settings
  };
  res.json(publicData);
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Admin login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = getAdminUser();
  if (email.toLowerCase().trim() !== admin.email.toLowerCase().trim()) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  saveAdminUser(admin);

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin
    }
  });
});

// Verify token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const admin = getAdminUser();
  res.json({
    valid: true,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      lastLogin: admin.lastLogin
    }
  });
});

// Change admin password / profile
app.post('/api/auth/update-profile', authenticateToken, (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const admin = getAdminUser();

  if (currentPassword && newPassword) {
    const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password does not match' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(newPassword, salt);
  }

  if (name) admin.name = name;
  if (email) admin.email = email;

  saveAdminUser(admin);
  res.json({ success: true, message: 'Admin profile updated successfully', user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } });
});

// Admin change password
app.post('/api/admin/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  const admin = getAdminUser();
  const isMatch = bcrypt.compareSync(currentPassword, admin.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Current password does not match' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  const salt = bcrypt.genSaltSync(10);
  admin.passwordHash = bcrypt.hashSync(newPassword, salt);
  saveAdminUser(admin);
  res.json({ success: true, message: 'Admin password updated successfully' });
});

// -------------------------------------------------------------
// ADMIN CONTENT MANAGEMENT ROUTES (PROTECTED)
// -------------------------------------------------------------

// Get full database (including drafts & media)
app.get('/api/admin/all-content', authenticateToken, (_req, res) => {
  const db = getDatabase();
  res.json(db);
});

// Update Homepage Settings
app.post('/api/admin/homepage', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.homepage = { ...db.homepage, ...req.body };
  saveDatabase(db);
  res.json({ success: true, homepage: db.homepage });
});

// Story Chapters CRUD
app.get('/api/admin/stories', authenticateToken, (_req, res) => {
  const db = getDatabase();
  res.json(db.stories || []);
});

app.post('/api/admin/stories', authenticateToken, (req, res) => {
  const db = getDatabase();
  const newChapter: StoryChapter = {
    id: `story-${Date.now()}`,
    chapterNumber: req.body.chapterNumber || `0${(db.stories?.length || 0) + 1}`,
    title: req.body.title || 'NEW CHAPTER',
    heading: req.body.heading || '',
    description: req.body.description || '',
    quote: req.body.quote || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
    imageCaption: req.body.imageCaption || '',
    layout: req.body.layout || ((db.stories?.length || 0) % 2 === 0 ? 'text-left' : 'text-right'),
    order: Number(req.body.order) || (db.stories?.length || 0) + 1,
    published: req.body.published !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.stories = [...(db.stories || []), newChapter];
  saveDatabase(db);
  res.json({ success: true, chapter: newChapter });
});

app.put('/api/admin/stories/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const index = (db.stories || []).findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  db.stories[index] = {
    ...db.stories[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveDatabase(db);
  res.json({ success: true, chapter: db.stories[index] });
});

app.delete('/api/admin/stories/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.stories = (db.stories || []).filter(s => s.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Chapter deleted' });
});

// Photo Management CRUD
app.get('/api/admin/photos', authenticateToken, (_req, res) => {
  const db = getDatabase();
  res.json(db.photos || []);
});

app.post('/api/admin/photos', authenticateToken, (req, res) => {
  const db = getDatabase();
  const newPhoto: PhotoItem = {
    id: `photo-${Date.now()}`,
    title: req.body.title || 'Untitled Photo',
    category: req.body.category || 'Portrait',
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: req.body.aspectRatio || 'portrait',
    featured: Boolean(req.body.featured),
    order: Number(req.body.order) || (db.photos?.length || 0) + 1,
    published: req.body.published !== false,
    location: req.body.location || 'Kathmandu',
    year: req.body.year || '2026',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.photos = [...(db.photos || []), newPhoto];
  saveDatabase(db);
  res.json({ success: true, photo: newPhoto });
});

app.put('/api/admin/photos/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const index = (db.photos || []).findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  db.photos[index] = {
    ...db.photos[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  saveDatabase(db);
  res.json({ success: true, photo: db.photos[index] });
});

app.delete('/api/admin/photos/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.photos = (db.photos || []).filter(p => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Photo deleted' });
});

// About Profile Management
app.post('/api/admin/about', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.about = {
    ...db.about,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  saveDatabase(db);
  res.json({ success: true, about: db.about });
});

// Social Links CRUD
app.get('/api/admin/social-links', authenticateToken, (_req, res) => {
  const db = getDatabase();
  res.json(db.socialLinks || []);
});

app.post('/api/admin/social-links', authenticateToken, (req, res) => {
  const db = getDatabase();
  const newLink: SocialLink = {
    id: `social-${Date.now()}`,
    platform: req.body.platform || 'Other',
    label: req.body.label || 'Social Link',
    url: req.body.url || 'https://',
    handle: req.body.handle || '',
    featured: Boolean(req.body.featured),
    order: Number(req.body.order) || (db.socialLinks?.length || 0) + 1,
    enabled: req.body.enabled !== false
  };

  db.socialLinks = [...(db.socialLinks || []), newLink];
  saveDatabase(db);
  res.json({ success: true, link: newLink });
});

app.put('/api/admin/social-links/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const index = (db.socialLinks || []).findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Social link not found' });
  }

  db.socialLinks[index] = {
    ...db.socialLinks[index],
    ...req.body
  };

  saveDatabase(db);
  res.json({ success: true, link: db.socialLinks[index] });
});

app.delete('/api/admin/social-links/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.socialLinks = (db.socialLinks || []).filter(l => l.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Social link deleted' });
});

// Contact Settings
app.post('/api/admin/contact', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.contact = { ...db.contact, ...req.body };
  saveDatabase(db);
  res.json({ success: true, contact: db.contact });
});

// Proofs CRUD
app.get('/api/admin/proofs', authenticateToken, (_req, res) => {
  const db = getDatabase();
  res.json(db.proofs || []);
});

app.post('/api/admin/proofs', authenticateToken, (req, res) => {
  const db = getDatabase();
  const newProof: ProofItem = {
    id: `proof-${Date.now()}`,
    title: req.body.title || 'New Review / Collaboration',
    clientOrContext: req.body.clientOrContext || 'Client Proof',
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    order: Number(req.body.order) || (db.proofs?.length || 0) + 1,
    published: req.body.published !== false,
    createdAt: new Date().toISOString()
  };

  db.proofs = [...(db.proofs || []), newProof];
  saveDatabase(db);
  res.json({ success: true, proof: newProof });
});

app.put('/api/admin/proofs/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const index = (db.proofs || []).findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Proof not found' });
  }

  db.proofs[index] = {
    ...db.proofs[index],
    ...req.body
  };

  saveDatabase(db);
  res.json({ success: true, proof: db.proofs[index] });
});

app.delete('/api/admin/proofs/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.proofs = (db.proofs || []).filter(p => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Proof deleted' });
});

// Site Settings
app.post('/api/admin/settings', authenticateToken, (req, res) => {
  const db = getDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json({ success: true, settings: db.settings });
});

// Media Library
app.get('/api/admin/media', authenticateToken, (_req, res) => {
  const db = getDatabase();
  res.json(db.media || []);
});

app.delete('/api/admin/media/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const item = (db.media || []).find(m => m.id === req.params.id);
  if (item && item.url.startsWith('/uploads/')) {
    const filename = item.url.replace('/uploads/', '');
    const filepath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Error deleting local file:', err);
      }
    }
  }

  db.media = (db.media || []).filter(m => m.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true, message: 'Media item deleted' });
});

// Upload File Endpoint
app.post('/api/admin/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const mediaItem: MediaItem = {
    id: `media-${Date.now()}`,
    name: req.file.originalname,
    url: fileUrl,
    size: req.file.size,
    type: req.file.mimetype,
    uploadedAt: new Date().toISOString()
  };

  const db = getDatabase();
  db.media = [mediaItem, ...(db.media || [])];
  saveDatabase(db);

  res.json({
    success: true,
    url: fileUrl,
    media: mediaItem
  });
});

// Reset Database to Seed Data
app.post('/api/admin/reset-data', authenticateToken, (_req, res) => {
  saveDatabase(initialData);
  res.json({ success: true, message: 'Database reset to default editorial template', data: initialData });
});

// -------------------------------------------------------------
// VITE DEV SERVER & PRODUCTION STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Liyana Shrestha Editorial Server running on http://localhost:${PORT}`);
  });
}

startServer();
