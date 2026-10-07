import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, HardDrive, Palette, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { formatBytes } from "../lib/utils";

export function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Eye },
  ];

  const handleSaveProfile = async () => {
    await updateProfile({ full_name: fullName });
    addToast({ type: "success", title: "Profile updated" });
  };

  const storagePercent = ((user?.storage_used_bytes || 0) / (user?.storage_quota_bytes || 1)) * 100;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">⚙ Settings</h1>
          <p className="text-surface-600 dark:text-surface-400">Manage your account and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                        : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "account" && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Account</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Avatar</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                        {user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                      </div>
                      <Button variant="outline" size="sm">Change avatar</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-500 cursor-not-allowed"
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>Save changes</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Security</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-surface-900 dark:text-white mb-2">Change password</h4>
                    <p className="text-sm text-surface-500 mb-3">Update your password to keep your account secure</p>
                    <Button variant="outline" size="sm">Change password</Button>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-800 pt-4">
                    <h4 className="text-sm font-medium text-surface-900 dark:text-white mb-2">Two-factor authentication</h4>
                    <p className="text-sm text-surface-500 mb-3">Add an extra layer of security to your account</p>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-800 pt-4">
                    <h4 className="text-sm font-medium text-surface-900 dark:text-white mb-2">Active sessions</h4>
                    <p className="text-sm text-surface-500 mb-3">Manage your active sessions across devices</p>
                    <div className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-surface-900 dark:text-white">Current session</p>
                          <p className="text-xs text-surface-500">Web • {navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser"}</p>
                        </div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Appearance</h3>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["light", "dark", "system"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            theme === t
                              ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                              : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600"
                          }`}
                        >
                          <div className={`w-full h-16 rounded-lg mb-2 ${
                            t === "light" ? "bg-white border border-surface-200" :
                            t === "dark" ? "bg-surface-900 border border-surface-700" :
                            "bg-gradient-to-br from-white to-surface-900"
                          }`} />
                          <p className="text-sm font-medium text-surface-900 dark:text-white capitalize">{t}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "storage" && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Storage</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-surface-600 dark:text-surface-400">Storage used</span>
                      <span className="font-medium text-surface-900 dark:text-white">
                        {formatBytes(user?.storage_used_bytes || 0)} / {formatBytes(user?.storage_quota_bytes || 0)}
                      </span>
                    </div>
                    <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full"
                        style={{ width: `${storagePercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-surface-500 mt-2">{storagePercent.toFixed(1)}% used</p>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-800 pt-4 space-y-3">
                    <h4 className="text-sm font-medium text-surface-900 dark:text-white">Storage breakdown</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Documents</span>
                      <span className="font-medium text-surface-900 dark:text-white">2.4 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Images</span>
                      <span className="font-medium text-surface-900 dark:text-white">3.1 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Videos</span>
                      <span className="font-medium text-surface-900 dark:text-white">1.2 GB</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">Other</span>
                      <span className="font-medium text-surface-900 dark:text-white">0.5 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(activeTab === "notifications" || activeTab === "privacy") && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white capitalize">{activeTab}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-surface-500">Settings for {activeTab} will be available soon.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
