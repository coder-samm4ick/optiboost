export interface User {
  id: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface AppFile {
  id: string;
  name: string;
  description: string;
  version: string;
  size: number;
  mimeType: string;
  dataUrl: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  date: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

export interface AuthState {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
}
