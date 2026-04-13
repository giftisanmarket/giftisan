"use client";

import { useState } from "react";
import { User, Camera, Save, ArrowLeft, Check } from "lucide-react";
import { updateUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function SettingsClient({ user }: { user: any }) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const res = await updateUser(user.id, { name, image });
    
    if (res.success) {
      await update({ name, image }); // Force NextAuth to refresh its session data
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.refresh();
      }, 2000);
    } else {
      alert(res.error || "Failed to update profile");
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <Link href="/profile" className="flex items-center gap-2 text-charcoal/40 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Profile
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary italic serif">Account <span className="not-italic">Settings</span></h1>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-10 right-10 z-[200] px-10 py-5 bg-white text-green-600 rounded-[2rem] font-bold flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-green-50 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg">
               <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest leading-none">Settings Saved</p>
              <p className="text-[10px] text-green-600/60 mt-1 uppercase font-bold">Your profile is now synced.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-8">
           <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary/5 border border-primary/5 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-6 group">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image 
                    src={image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}`} 
                    alt={name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-full cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-primary truncate w-full">{name || "Your Name"}</h3>
              <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest mt-1">Profile Preview</p>
           </div>
           
           <div className="p-8 bg-primary rounded-[2.5rem] text-white space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Privacy Note</p>
              <p className="text-sm leading-relaxed text-white/80 italic">"Your information is only shared with artisans you purchase from to ensure seamless delivery of your treasures."</p>
           </div>
        </div>

        <div className="md:col-span-8">
          <form onSubmit={handleSave} className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-primary/5 border border-primary/5 space-y-10">
            <div className="space-y-6">
              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-16 px-8 bg-cream/30 border border-primary/5 rounded-2xl focus:outline-none focus:border-accent transition-all font-bold text-primary placeholder:text-primary/40"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Profile Photo</label>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={image.startsWith('data:') ? 'Custom Uploaded Photo' : image}
                      readOnly
                      className="w-full h-16 px-8 bg-cream/10 border border-primary/5 rounded-2xl font-bold text-primary/40 cursor-default"
                      placeholder="No photo uploaded"
                    />
                  </div>
                  <label className="cursor-pointer group relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="h-16 px-8 bg-accent text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-accent-light transition-all shadow-lg shadow-accent/20">
                      <Camera className="w-5 h-5" />
                      Upload
                    </div>
                  </label>
                </div>
                <p className="ml-4 text-[10px] text-charcoal/40 italic">JPG, PNG or GIF. Max 2MB recommended.</p>
              </div>

              <div className="grid gap-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-4">Email Address</label>
                 <div className="w-full h-16 px-8 bg-primary/5 border border-primary/5 rounded-2xl flex items-center font-bold text-primary/40 cursor-not-allowed">
                  {user.email}
                  <span className="ml-auto text-[9px] px-2 py-1 bg-white/50 rounded-md uppercase tracking-tighter">Read Only</span>
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-primary/5 flex justify-end">
              <button 
                type="submit"
                disabled={isSaving}
                className="px-12 h-16 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all flex items-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {isSaving ? "Updating..." : "Save Changes"}
                <Save className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
