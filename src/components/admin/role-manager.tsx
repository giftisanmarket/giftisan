"use client";

import { useState } from "react";
import { Shield, User, Store, Check, ChevronDown } from "lucide-react";
import { updateUserRole } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

type UserRole = "CLIENT" | "ARTISAN" | "ADMIN";

interface RoleManagerProps {
  userId: string;
  currentRole: UserRole;
  dict: any;
}

export function RoleManager({ userId, currentRole, dict }: RoleManagerProps) {
  const [role, setRole] = useState<UserRole>(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const roles: { value: UserRole; label: string; icon: any; color: string }[] = [
    { value: "CLIENT", label: dict.admin.role_client || "Client", icon: User, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { value: "ARTISAN", label: dict.admin.role_artisan || "Artisan", icon: Store, color: "text-accent bg-accent/10 border-accent/20" },
    { value: "ADMIN", label: dict.admin.role_admin || "Admin", icon: Shield, color: "text-red-600 bg-red-50 border-red-200" },
  ];

  async function handleRoleChange(newRole: UserRole) {
    if (newRole === role) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const result = await updateUserRole(userId, newRole);

    if (result.success) {
      setRole(newRole);
      toast.success(dict.admin.role_updated || "Role updated successfully", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
      setIsOpen(false);
    } else {
      toast.error(result.error || "Failed to update role", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
    }
    setIsLoading(false);
  }

  const activeRole = roles.find(r => r.value === role) || roles[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50",
          activeRole.color
        )}
      >
        <activeRole.icon className="w-3 h-3" />
        {activeRole.label}
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full start-0 mt-2 w-40 bg-white rounded-2xl border border-primary/5 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-1.5">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRoleChange(r.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors",
                    role === r.value 
                      ? "bg-primary/5 text-primary" 
                      : "text-charcoal/40 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <r.icon className="w-3.5 h-3.5" />
                    {r.label}
                  </div>
                  {role === r.value && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

