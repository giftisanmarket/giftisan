import { getAllUsers, deleteUser } from "@/lib/actions";
import { User, Shield, Store, Trash2, Calendar, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VerifyArtisanButton } from "@/components/admin/verify-artisan-button";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            Artisans & <span className="serif italic text-accent font-normal">Users</span>
          </h1>
          <p className="text-charcoal/40 font-medium">Manage permissions and view platform contributors.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-primary/5 shadow-sm">
          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Total Members</p>
          <p className="text-2xl font-black text-primary leading-none">{users.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/5">
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">User Profile</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Studio Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest">Activity</th>
              <th className="px-8 py-5 text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-cream/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/5 shadow-sm bg-cream">
                      <Image 
                        src={user.artisanProfile?.avatar || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                        alt={user.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <p className="font-bold text-primary">{user.name}</p>
                      <p className="text-xs text-charcoal/40">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    user.role === "ADMIN" ? "bg-red-50 text-red-600 border-red-200" :
                    user.role === "ARTISAN" ? "bg-accent/10 text-accent border-accent/20" :
                    "bg-blue-50 text-blue-600 border-blue-200"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {user.artisanProfile ? (
                    <div className="flex items-center gap-2 group/studio">
                      <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center">
                        <Store className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary group-hover/studio:text-accent transition-colors">
                          {user.artisanProfile.studioName || `${user.name}'s Studio`}
                        </p>
                        <p className="text-[10px] text-charcoal/40 italic mb-2">
                          {user.artisanProfile.location || "Global Studio"}
                        </p>
                        <VerifyArtisanButton artisanId={user.artisanProfile.id} currentStatus={user.artisanProfile.isVerified} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">N/A</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-charcoal/40">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-charcoal/40">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{user.orders?.length || 0} Orders</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    className="p-3 text-primary/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete User"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
