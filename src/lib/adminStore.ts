import { promises as fs } from "fs";
import path from "path";

export interface AdminConfig {
  username: string;
  password: string;
}

const adminConfigPath = path.join(process.cwd(), "src", "data", "admin.json");

const defaultAdminConfig: AdminConfig = {
  username: "admin",
  password: "admin123",
};

async function readAdminConfig(): Promise<AdminConfig> {
  try {
    const fileContents = await fs.readFile(adminConfigPath, "utf8");
    return JSON.parse(fileContents) as AdminConfig;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      await writeAdminConfig(defaultAdminConfig);
      return defaultAdminConfig;
    }
    throw error;
  }
}

async function writeAdminConfig(config: AdminConfig): Promise<void> {
  await fs.mkdir(path.dirname(adminConfigPath), { recursive: true });
  await fs.writeFile(adminConfigPath, JSON.stringify(config, null, 2), "utf8");
}

export async function getAdminConfig(): Promise<AdminConfig> {
  return readAdminConfig();
}

export async function validateAdminLogin(username: string, password: string): Promise<boolean> {
  const config = await readAdminConfig();
  return config.username === username && config.password === password;
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const config = await readAdminConfig();

  if (config.password !== currentPassword) {
    return false;
  }

  const nextConfig: AdminConfig = {
    ...config,
    password: newPassword,
  };

  await writeAdminConfig(nextConfig);
  return true;
}
