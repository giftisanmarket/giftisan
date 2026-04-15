"use client";

import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteUser(userId);
    
    if (result.error) {
      // In a real app we'd use a toast logic here
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
        title="Delete User"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmationModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Protocol: Deletion"
        message={`This will permanently remove ${userName} and all associated treasures and history from the Giftisan collective. This action is irreversible.`}
        confirmText="Confirm Deletion"
        isDestructive={true}
      />
    </>
  );
}
