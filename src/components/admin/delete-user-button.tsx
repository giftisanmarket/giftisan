"use client";

import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

import { toast } from "react-hot-toast";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
  dict: any;
}

export function DeleteUserButton({ userId, userName, dict }: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteUser(userId);
    
    if (result.success) {
      toast.success(dict.admin.user_deleted || "User deleted successfully", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
      setShowConfirm(false);
    } else {
      toast.error(result.error || dict.admin.delete_user_failed || "Failed to delete user", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className={cn(
          "p-3 text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          isDeleting && "animate-pulse text-red-500"
        )}
        title={dict.admin.delete_user}
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmationModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title={dict.admin.protocol_deletion}
        message={dict.admin.delete_user_message.replace('{name}', userName)}
        confirmText={dict.admin.confirm_deletion}
        isDestructive={true}
      />
    </>
  );
}

