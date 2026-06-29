import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Upload,
  FileText,
  Users,
  Trash2,
  Plus,
  Save,
  Tag,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import { getFiles, addFile, deleteFile, getChangelog, addChangelogEntry, deleteChangelogEntry, getUsers } from "@/lib/storage";
import { formatBytes, formatDate, generateId } from "@/lib/utils";
import type { AppFile, ChangelogEntry } from "@/types";

const tabs = [
  { id: "files", label: "Файлы", icon: FileText },
  { id: "changelog", label: "Changelog", icon: FileText },
  { id: "users", label: "Пользователи", icon: Users },
];

export default function Admin() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState<AppFile[]>([]);
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [users, setUsers] = useState(getUsers());
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      navigate("/");
      return;
    }
    refreshData();
  }, [isAuthenticated, isAdmin, navigate]);

  const refreshData = () => {
    setFiles(getFiles());
    setChangelog(getChangelog());
    setUsers(getUsers());
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <PageLayout>
      <SEOHead
        title="Админ-панель — NedoHub"
        description="Управление файлами, changelog и пользователями в админ-панели NedoHub."
        keywords="админ панель, управление файлами, загрузка файлов, changelog"
      />

      <section className="relative min-h-[calc(100dvh-80px)] px-5 py-10">

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#477f0b]/10 text-[#69b715]">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">Админ-панель</h1>
                <p className="text-sm text-[#555]">Управление контентом и пользователями</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="btn-secondary self-start"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </button>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#477f0b] text-white"
                    : "bg-[#0b0b0b] text-[#a0a0a0] hover:bg-[#151515]"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "files" && (
              <FilesTab key="files" files={files} refresh={refreshData} showToast={showToast} />
            )}
            {activeTab === "changelog" && (
              <ChangelogTab key="changelog" entries={changelog} refresh={refreshData} showToast={showToast} />
            )}
            {activeTab === "users" && <UsersTab key="users" users={users} />}
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl ${
              toast.type === "success"
                ? "border-[#477f0b]/30 bg-[#0b0b0b] text-[#69b715]"
                : "border-red-400/30 bg-[#0b0b0b] text-[#e06c75]"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

function FilesTab({
  files,
  refresh,
  showToast,
}: {
  files: AppFile[];
  refresh: () => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    version: "1.0.0",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    if (!form.name) {
      setForm((prev) => ({ ...prev, name: file.name }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Выберите файл для загрузки", "error");
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });

      const newFile: AppFile = {
        id: generateId(),
        name: form.name || selectedFile.name,
        description: form.description,
        version: form.version,
        size: selectedFile.size,
        mimeType: selectedFile.type || "application/octet-stream",
        dataUrl,
        downloadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      addFile(newFile);
      refresh();
      setForm({ name: "", description: "", version: "1.0.0", tags: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Файл успешно загружен");
    } catch {
      showToast("Ошибка при загрузке файла", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить файл?")) {
      deleteFile(id);
      refresh();
      showToast("Файл удалён");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-8"
    >
      <div className="card-base border-gradient p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-white">Загрузить новый файл</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? "border-[#477f0b] bg-[#477f0b]/10"
                : selectedFile
                ? "border-[#375543] bg-[#0a0f08]"
                : "border-[#222] bg-[#0a0a0a] hover:border-[#333]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Upload className={`mx-auto mb-3 h-8 w-8 ${dragActive ? "text-[#69b715]" : "text-[#333]"}`} />
            {selectedFile ? (
              <div className="text-sm">
                <p className="font-medium text-white">{selectedFile.name}</p>
                <p className="text-[#555]">{formatBytes(selectedFile.size)}</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-[#a0a0a0]">Перетащите файл или нажмите для выбора</p>
                <p className="mt-1 text-xs text-[#555]">Максимальный размер ограничен возможностями браузера</p>
              </>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Название файла</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="NedoLauncher.exe"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Версия</label>
              <input
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="1.0.0"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Краткое описание файла..."
              className="input-field min-h-[100px] resize-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Теги (через запятую)</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="windows, launcher, stable"
                className="input-field !pl-11"
              />
            </div>
          </div>

          <button type="submit" disabled={isUploading} className="btn-primary">
            <Save className="h-4 w-4" />
            {isUploading ? "Загрузка..." : "Опубликовать файл"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-5 text-xl font-semibold text-white">Опубликованные файлы</h2>
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#0b0b0b] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#477f0b]/10 text-[#69b715]">
                    <FileCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{file.name}</h3>
                    <p className="text-xs text-[#555]">
                      v{file.version} • {formatBytes(file.size)} • {formatDate(file.updatedAt)} •{" "}
                      {file.downloadCount} загрузок
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="btn-secondary self-start !border-red-400/20 !bg-red-400/10 !text-[#e06c75] hover:!bg-red-400/20 sm:self-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Удалить
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-[#0b0b0b] p-8 text-center text-sm text-[#555]">
            Нет опубликованных файлов
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ChangelogTab({
  entries,
  refresh,
  showToast,
}: {
  entries: ChangelogEntry[];
  refresh: () => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [form, setForm] = useState({
    version: "",
    title: "",
    type: "patch" as ChangelogEntry["type"],
    changes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const changesList = form.changes
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    if (changesList.length === 0) {
      showToast("Добавьте хотя бы одно изменение", "error");
      return;
    }

    addChangelogEntry({
      id: generateId(),
      version: form.version,
      title: form.title,
      type: form.type,
      date: new Date().toISOString(),
      changes: changesList,
    });

    refresh();
    setForm({ version: "", title: "", type: "patch", changes: "" });
    showToast("Запись changelog добавлена");
  };

  const handleDelete = (id: string) => {
    if (confirm("Удалить запись?")) {
      deleteChangelogEntry(id);
      refresh();
      showToast("Запись удалена");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="space-y-8"
    >
      <div className="card-base border-gradient p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-semibold text-white">Добавить запись</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Версия</label>
              <input
                type="text"
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="1.0.0"
                className="input-field"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Заголовок</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Краткое название обновления"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Тип обновления</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ChangelogEntry["type"] })}
              className="input-field"
            >
              <option value="patch">Patch — исправления</option>
              <option value="minor">Minor — улучшения</option>
              <option value="major">Major — крупные изменения</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#a0a0a0]">Изменения (каждое с новой строки)</label>
            <textarea
              value={form.changes}
              onChange={(e) => setForm({ ...form, changes: e.target.value })}
              placeholder="- Исправлен баг авторизации&#10;- Улучшена производительность"
              className="input-field min-h-[120px] resize-none"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            <Plus className="h-4 w-4" />
            Добавить запись
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-5 text-xl font-semibold text-white">История записей</h2>
        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-4 rounded-xl border border-white/5 bg-[#0b0b0b] p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="badge badge-green">v{entry.version}</span>
                    <span className="text-xs text-[#555]">{formatDate(entry.date)}</span>
                  </div>
                  <h3 className="font-medium text-white">{entry.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {entry.changes.map((c, i) => (
                      <li key={i} className="text-xs text-[#a0a0a0]">• {c}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="btn-secondary self-start !border-red-400/20 !bg-red-400/10 !text-[#e06c75] hover:!bg-red-400/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/5 bg-[#0b0b0b] p-8 text-center text-sm text-[#555]">
            Записей пока нет
          </div>
        )}
      </div>
    </motion.div>
  );
}

function UsersTab({ users }: { users: ReturnType<typeof getUsers> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <div className="overflow-hidden rounded-xl border border-white/5 bg-[#0b0b0b]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02]">
            <tr>
              <th className="px-5 py-3 font-medium text-[#a0a0a0]">Email</th>
              <th className="px-5 py-3 font-medium text-[#a0a0a0]">Роль</th>
              <th className="px-5 py-3 font-medium text-[#a0a0a0]">Дата регистрации</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-3 text-white">{user.email}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${user.role === "admin" ? "badge-amber" : "badge-green"}`}>
                    {user.role === "admin" ? "Админ" : "Пользователь"}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#555]">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-sm text-[#555]">Пользователей пока нет</div>
        )}
      </div>
    </motion.div>
  );
}
