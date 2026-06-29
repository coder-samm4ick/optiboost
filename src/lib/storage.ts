import type { AppFile, ChangelogEntry, User } from "@/types";

const STORAGE_KEYS = {
  users: "nedohub_users",
  files: "nedohub_files",
  changelog: "nedohub_changelog",
  auth: "nedohub_auth",
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Users
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.users, []);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  setItem(STORAGE_KEYS.users, users);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// Files
export function getFiles(): AppFile[] {
  return getItem<AppFile[]>(STORAGE_KEYS.files, []);
}

export function addFile(file: AppFile): void {
  const files = getFiles();
  files.unshift(file);
  setItem(STORAGE_KEYS.files, files);
}

export function updateFile(updated: AppFile): void {
  const files = getFiles();
  const index = files.findIndex((f) => f.id === updated.id);
  if (index !== -1) {
    files[index] = updated;
    setItem(STORAGE_KEYS.files, files);
  }
}

export function deleteFile(id: string): void {
  const files = getFiles().filter((f) => f.id !== id);
  setItem(STORAGE_KEYS.files, files);
}

export function incrementDownloadCount(id: string): void {
  const files = getFiles();
  const file = files.find((f) => f.id === id);
  if (file) {
    file.downloadCount += 1;
    setItem(STORAGE_KEYS.files, files);
  }
}

// Changelog
export function getChangelog(): ChangelogEntry[] {
  return getItem<ChangelogEntry[]>(STORAGE_KEYS.changelog, []);
}

export function addChangelogEntry(entry: ChangelogEntry): void {
  const entries = getChangelog();
  entries.unshift(entry);
  setItem(STORAGE_KEYS.changelog, entries);
}

export function deleteChangelogEntry(id: string): void {
  const entries = getChangelog().filter((e) => e.id !== id);
  setItem(STORAGE_KEYS.changelog, entries);
}

// Auth
export function getAuth(): { user: Omit<User, "password"> | null } {
  return getItem<{ user: Omit<User, "password"> | null }>(STORAGE_KEYS.auth, { user: null });
}

export function setAuth(user: Omit<User, "password"> | null): void {
  setItem(STORAGE_KEYS.auth, { user });
}

// Demo data seeding
export function seedDemoData(): void {
  if (getUsers().length === 0) {
    addUser({
      id: crypto.randomUUID(),
      email: "admin@nedohub.ru",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
  }

  if (getFiles().length === 0) {
    const now = new Date().toISOString();
    addFile({
      id: crypto.randomUUID(),
      name: "NedoLauncher.exe",
      description: "Основной лаунчер для быстрого доступа ко всем утилитам проекта. Лёгкий, быстрый и безопасный.",
      version: "2.4.1",
      size: 14_200_000,
      mimeType: "application/x-msdownload",
      dataUrl: "",
      downloadCount: 1248,
      createdAt: now,
      updatedAt: now,
      tags: ["launcher", "windows"],
    });
    addFile({
      id: crypto.randomUUID(),
      name: "NedoConfig.zip",
      description: "Архив конфигураций и пресетов для продвинутой настройки окружения.",
      version: "1.8.0",
      size: 3_450_000,
      mimeType: "application/zip",
      dataUrl: "",
      downloadCount: 856,
      createdAt: now,
      updatedAt: now,
      tags: ["config", "archive"],
    });
    addFile({
      id: crypto.randomUUID(),
      name: "NedoTools.dmg",
      description: "Сборка инструментов для macOS. Включает скрипты автоматизации и утилиты мониторинга.",
      version: "3.0.2",
      size: 28_100_000,
      mimeType: "application/x-apple-diskimage",
      dataUrl: "",
      downloadCount: 432,
      createdAt: now,
      updatedAt: now,
      tags: ["macos", "tools"],
    });
  }

  if (getChangelog().length === 0) {
    addChangelogEntry({
      id: crypto.randomUUID(),
      version: "2.4.1",
      title: "Исправление стабильности лаунчера",
      date: new Date().toISOString(),
      type: "patch",
      changes: [
        "Устранена редкая ошибка при автоматическом обновлении",
        "Улучшена скорость запуска на Windows 11",
        "Обновлены встроенные сертификаты безопасности",
      ],
    });
    addChangelogEntry({
      id: crypto.randomUUID(),
      version: "2.4.0",
      title: "Новая панель управления",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: "minor",
      changes: [
        "Добавлена тёмная тема по умолчанию",
        "Реализован поиск по changelog",
        "Улучшена мобильная адаптация",
      ],
    });
    addChangelogEntry({
      id: crypto.randomUUID(),
      version: "2.0.0",
      title: "Полный редизайн платформы",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      type: "major",
      changes: [
        "Полностью обновлён интерфейс",
        "Добавлена система версионирования",
        "Интегрирована админ-панель",
      ],
    });
  }
}
