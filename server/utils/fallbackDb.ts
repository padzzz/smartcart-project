import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export interface FallbackUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

const FILE_PATH = path.join(process.cwd(), "fallback_db_store.json");

// Default Admin User pre-seeded for easy logging in.
const defaultAdmin: FallbackUser = {
  _id: "fb_u1",
  name: "Admin User",
  email: "admin@example.com",
  passwordHash: "$2a$10$6Rz3GscC4bIuDkU2mS2JruRCH8I.N605pB0F2Hly5oD93m/pY2zBq", // password123
  isAdmin: true
};

export const fallbackUsers: FallbackUser[] = [defaultAdmin];
export const fallbackOrders: any[] = [];

// Load persisted fallback data at startup synchronously
try {
  if (fs.existsSync(FILE_PATH)) {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    if (data.users && Array.isArray(data.users)) {
      // Avoid duplicating the admin user if already in JSON
      const filteredUsers = data.users.filter((u: any) => u._id !== "fb_u1");
      fallbackUsers.push(...filteredUsers);
    }
    if (data.orders && Array.isArray(data.orders)) {
      fallbackOrders.push(...data.orders);
    }
  }
} catch (err) {
  console.error("Error reading fallback storage file:", err);
}

export const syncFallbackToDisk = () => {
  try {
    const data = {
      users: fallbackUsers.filter(u => u._id !== "fb_u1"),
      orders: fallbackOrders,
    };
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing fallback storage file:", err);
  }
};

export const comparePassword = async (enteredPassword: string, storedHashOrText: string) => {
  if (enteredPassword === storedHashOrText) return true;
  try {
    return await bcrypt.compare(enteredPassword, storedHashOrText);
  } catch (err) {
    return false;
  }
};

