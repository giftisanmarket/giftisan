"use client";

import { useState } from "react";
import { Trash2, AlertCircle, X } from "lucide-react";
import { deleteSubscriber } from "@/lib/actions";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function DeleteSubscriberButton({ id, email, dict }: { id: string, email: string, dict: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteSubscriber(id);
    if (result.success) {
      toast.success(dict.admin.subscriber_deleted || "Subscriber removed", {
        style: { borderRadius: '20px', background: '#1a2c2c', color: '#fff' }
      });
      setIsOpen(false);
    } else {
      toast.error(result.error || "Failed to remove subscriber");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95 group"
        title="Delete Subscriber"
      >
        <Trash2 className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="absolute inset-0" 
            onClick={() => !isDeleting && setIsOpen(false)} 
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl sm:rounded-[2rem] shadow-2xl border border-primary/5 p-6 sm:p-8 md:p-10 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
              className="absolute top-5 end-5 sm:top-6 sm:end-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-red-50 flex items-center justify-center text-red-500">
                <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{dict.admin.protocol_deletion || "Protocol: Deletion"}</p>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-primary tracking-tight">Remove Subscriber?</h3>
                <p className="text-charcoal/40 text-xs sm:text-sm font-medium leading-relaxed">
                  Are you sure you want to remove <span className="text-primary font-bold">{email}</span> from the mailing list?
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl border border-primary/10 text-primary font-bold hover:bg-primary/5 transition-all text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? "Removing..." : "Confirm Removal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

