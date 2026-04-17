"use client";

import { useState, useRef } from "react";
import { User, Camera, Save, ArrowLeft, Check, X, AlertTriangle, Trash2 } from "lucide-react";
import { updateUser, deleteAccountAction } from "@/lib/actions";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function SettingsClient({ user, dict }: { user: any; dict: any }) {
  const router = useRouter();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [image, setImage] = useState(user.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new (window as any).Image();
        img.onload = () => {
          // Create a canvas to resize/compress the image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions (e.g., 400x400 for avatars)
          const MAX_SIZE = 400;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Export as highly compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setImage(compressedDataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const res = await updateUser(user.id, formData);
      
      if (res.success) {
        await update({ name, image }); 
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.refresh();
        }, 2000);
      } else {
        toast.error(res.error || dict.common?.error_updating_profile || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error(dict.common?.unexpected_error || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    
    const res = await deleteAccountAction(user.id);
    
    if (res.success) {
      toast.success(dict.common?.account_deleted_success || "Account deleted successfully.");
      // Perform a clean redirect to home while clearing the session
      await signOut({ 
        redirect: true,
        callbackUrl: "/" 
      });
    } else {
      setDeleteError(res.error || dict.common?.something_went_wrong || "Something went wrong.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-0">
      <div className="mb-8 md:mb-12 flex items-center justify-between">
        <div>
          <Link href="/profile" className="flex items-center gap-2 text-charcoal/40 hover:text-primary transition-colors text-[10px] md:text-sm font-bold uppercase tracking-widest mb-3 md:mb-4 group">
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:-translate-x-1" />
            {dict.profile.back_to_profile}
          </Link>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary italic serif">{dict.profile.settings_title_base} <span className="not-italic">{dict.profile.settings_title_accent}</span></h1>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 end-4 start-4 md:start-auto md:end-10 md:bottom-10 z-[200] px-6 md:px-10 py-4 md:py-5 bg-white text-green-600 rounded-3xl md:rounded-[2rem] font-bold flex items-center gap-4 shadow-2xl border border-green-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
               <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">{dict.profile.settings_saved}</p>
              <p className="text-[10px] text-green-600/60 mt-1 uppercase font-bold">{dict.profile.profile_synced}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-12 gap-6 md:gap-12">
        <div className="md:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary/5 border border-primary/5 flex flex-col items-center text-center">
             <div 
               className="relative w-28 h-28 md:w-40 md:h-40 mb-4 md:mb-6 group cursor-pointer"
               onClick={handleImageClick}
             >
               <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all" />
               <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                 <Image 
                   src={image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}`} 
                   alt={name} 
                   fill 
                   className="object-cover"
                 />
               </div>
               <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-full">
                 <Camera className="w-8 h-8 text-white" />
               </div>
             </div>
             <h3 className="font-heading font-bold text-primary truncate w-full text-base md:text-xl">{name || dict.profile.your_name}</h3>
             <p className="text-[9px] md:text-[10px] text-charcoal/40 font-bold uppercase tracking-widest mt-1">{dict.profile.profile_preview}</p>
          </div>
          
          <div className="p-5 md:p-8 bg-primary rounded-[1.5rem] md:rounded-[2.5rem] text-white space-y-3 md:space-y-4 shadow-xl shadow-primary/10">
             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{dict.profile.privacy_note_title}</p>
             <p className="text-xs md:text-sm leading-relaxed text-white/80 italic">"{dict.profile.privacy_note_desc}"</p>
          </div>
        </div>

        <div className="md:col-span-8">
          <form onSubmit={handleSave} className="bg-white rounded-[2rem] md:rounded-[3rem] p-5 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-6 md:space-y-10">
            <div className="space-y-5 md:space-y-6">
              <div className="grid gap-1.5 md:gap-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.auth.signup_full_name}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 md:h-16 px-6 md:px-8 bg-cream/30 border border-primary/5 rounded-xl md:rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary placeholder:text-primary/40 text-sm md:text-base active:scale-[0.99]"
                  placeholder={dict.auth.signup_name_placeholder}
                />
              </div>

              <div className="grid gap-1.5 md:gap-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.profile.profile_photo_label || "Profile Photo"}</label>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={image.startsWith('data:') ? (dict.profile.custom_photo || 'Custom Photo') : image}
                      readOnly
                      className="w-full h-14 md:h-16 px-6 md:px-8 bg-cream/10 border border-primary/5 rounded-xl md:rounded-2xl font-bold text-primary/40 cursor-default text-[10px] md:text-sm truncate"
                      placeholder={dict.profile.no_photo || "No photo"}
                    />
                  </div>
                  <label className="cursor-pointer group relative">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="h-14 md:h-16 px-6 md:px-8 bg-accent text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-accent-light transition-all shadow-lg shadow-accent/20 text-xs md:text-base active:scale-95">
                      <Camera className="w-5 h-5" />
                      {dict.profile.upload_action}
                    </div>
                  </label>
                </div>
                <p className="ms-4 text-[9px] text-charcoal/40 italic">{dict.profile.photo_max_size}</p>
              </div>

              <div className="grid gap-1.5 md:gap-2">
                 <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary/40 ms-4">{dict.auth.login_email_label}</label>
                 <div className="w-full h-14 md:h-16 px-6 md:px-8 bg-primary/5 border border-primary/5 rounded-xl md:rounded-2xl flex items-center font-bold text-primary/40 cursor-not-allowed text-xs md:text-base overflow-hidden">
                  <span className="truncate flex-1">{user.email}</span>
                  <span className="ms-2 text-[7px] md:text-[8px] px-2 py-0.5 md:py-1 bg-white/50 rounded-md uppercase tracking-widest whitespace-nowrap">{dict.profile.read_only}</span>
                 </div>
              </div>
            </div>

            <div className="pt-6 md:pt-8 border-t border-primary/5 flex">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto md:px-12 h-14 md:h-16 bg-primary text-white font-bold rounded-xl md:rounded-2xl hover:bg-primary-light transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 text-xs md:text-base active:scale-95"
              >
                {isSaving ? dict.profile.updating_action : dict.profile.save_changes}
                <Save className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </form>

          <div className="mt-8 md:mt-12 bg-red-50/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 border border-red-100 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center lg:text-start">
              <h3 className="text-xl font-heading font-bold text-red-900 mb-1 md:mb-2">{dict.profile.danger_zone}</h3>
              <p className="text-xs md:text-sm text-red-700/60 max-w-sm">{dict.profile.delete_account_desc}</p>
            </div>
            <button 
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full lg:w-auto px-10 h-14 bg-white border-2 border-red-200 text-red-600 font-bold rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg shadow-red-500/5 disabled:opacity-50 whitespace-nowrap text-sm active:scale-95"
            >
              {dict.profile.delete_account_action}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 start-0 w-full h-2 bg-red-500" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-10 h-10 rounded-full border border-primary/5 flex items-center justify-center hover:bg-primary/5 transition-colors"
                >
                  <X className="w-5 h-5 text-primary/40" />
                </button>
              </div>

              <div className="space-y-4 mb-10">
                <h2 className="text-3xl font-heading font-bold text-primary italic serif">{dict.profile.final_goodbye_base} <span className="not-italic">{dict.profile.final_goodbye_accent}</span></h2>
                <p className="text-charcoal/60 leading-relaxed font-medium">
                  {dict.profile.delete_confirm_desc}
                </p>
              </div>

              {deleteError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center italic border border-red-100">
                  {deleteError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="h-14 bg-cream text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all text-sm uppercase tracking-widest"
                >
                  {dict.profile.keep_account_action}
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="h-14 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 group text-sm uppercase tracking-widest"
                >
                  {isDeleting ? dict.profile.deleting_action : dict.profile.erase_data_action}
                  {!isDeleting && <Trash2 className="w-4 h-4 group-hover:shake" />}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

