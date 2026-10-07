import { motion } from "framer-motion";
import { Users, Search, MoreVertical } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { Shield } from "lucide-react";
import { useState } from "react";

const demoUsers = [
  { id: "1", name: "Vab Idriss", email: "vab@vitechafrica.com", role: "ADMIN", storage: "7.2 GB", status: "active", created: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "USER", storage: "3.4 GB", status: "active", created: "2024-02-20" },
  { id: "3", name: "Michael Chen", email: "michael@example.com", role: "USER", storage: "5.1 GB", status: "active", created: "2024-03-10" },
  { id: "4", name: "Emma Wilson", email: "emma@example.com", role: "USER", storage: "2.8 GB", status: "suspended", created: "2024-03-25" },
  { id: "5", name: "David Brown", email: "david@example.com", role: "USER", storage: "4.5 GB", status: "active", created: "2024-04-05" },
];

export function AdminUsers() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  if (user?.role !== "ADMIN") {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-surface-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  const filteredUsers = demoUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Users</h1>
            <p className="text-surface-600 dark:text-surface-400">Manage user accounts and permissions</p>
          </div>
          <Button>
            <Users className="w-4 h-4" /> Add User
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-surface-500 uppercase">User</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-surface-500 uppercase hidden md:table-cell">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-surface-500 uppercase hidden lg:table-cell">Storage</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-surface-500 uppercase hidden lg:table-cell">Status</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-surface-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                        u.role === "ADMIN" ? "bg-brand-100 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" : "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                      }`}>
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">{u.storage}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                        u.status === "active" ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                        <MoreVertical className="w-4 h-4 text-surface-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
