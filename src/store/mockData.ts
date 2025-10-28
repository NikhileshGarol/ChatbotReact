// src/store/mockData.ts
export type Company = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  url?: string; // short url key
  status?: 'active' | 'inactive';
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  companyId?: string | null;
  status?: 'active' | 'inactive';
  createdAt: string;
};

const STORAGE_KEY = 'mock_db_v1';

type DB = {
  companies: Company[];
  users: User[];
};

const defaultDB: DB = {
  companies: [
    {
      id: 'c_1',
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '+91-9999999999',
      website: 'https://acme.example',
      address: 'Mumbai, India',
      url: 'acme',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: 'u_admin',
      name: 'Admin User',
      email: 'admin@acme.com',
      phone: '+91-9000000000',
      role: 'admin',
      companyId: 'c_1',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_1',
      name: 'John Doe',
      email: 'john@acme.com',
      phone: '+91-9000000001',
      role: 'user',
      companyId: 'c_1',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
  ],
};

function readDB(): DB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDB));
      return defaultDB;
    }
    return JSON.parse(raw) as DB;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
}

function writeDB(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

/* Companies API */
export function getCompanies(): Company[] {
  return readDB().companies;
}

export function addCompany(payload: Omit<Company, 'id' | 'createdAt'>): Company {
  const db = readDB();
  const newCompany: Company = {
    id: `c_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  db.companies = [newCompany, ...db.companies];
  writeDB(db);
  return newCompany;
}

export function updateCompany(id: string, payload: Partial<Company>): Company | null {
  const db = readDB();
  const idx = db.companies.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  db.companies[idx] = { ...db.companies[idx], ...payload };
  writeDB(db);
  return db.companies[idx];
}

export function deleteCompany(id: string): boolean {
  const db = readDB();
  db.companies = db.companies.filter((c) => c.id !== id);
  // Also dissociate users from this company
  db.users = db.users.map((u) => (u.companyId === id ? { ...u, companyId: null } : u));
  writeDB(db);
  return true;
}

export function isCompanyUrlAvailable(url: string, excludeId?: string): boolean {
  const db = readDB();
  const found = db.companies.find((c) => c.url?.toLowerCase() === url.toLowerCase() && c.id !== excludeId);
  return !found;
}

/* Users API */
export function getUsers(): User[] {
  return readDB().users;
}

export function addUser(payload: Omit<User, 'id' | 'createdAt'>): User {
  const db = readDB();
  const newUser: User = {
    id: `u_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  db.users = [newUser, ...db.users];
  writeDB(db);
  return newUser;
}

export function updateUser(id: string, payload: Partial<User>): User | null {
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  db.users[idx] = { ...db.users[idx], ...payload };
  writeDB(db);
  return db.users[idx];
}

export function deleteUser(id: string): boolean {
  const db = readDB();
  db.users = db.users.filter((u) => u.id !== id);
  writeDB(db);
  return true;
}
