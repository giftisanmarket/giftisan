import { getAllUsers } from "@/lib/actions";
import { User, Shield, Store, Trash2, Calendar, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VerifyArtisanButton } from "@/components/admin/verify-artisan-button";
import { DeleteUserButton } from "@/components/admin/delete-user-button";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            Artisans & <span className="serif italic text-accent font-normal">Users</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">Manage permissions and view platform contributors.</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm shrink-0 w-full md:w-auto">
          <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Total Members</p>
          <p className="text-xl md:text-2xl font-black text-primary leading-none">{users.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scrollbar-hide">
          <table className="w-full text-left min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">User Profile</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Role</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Studio Status</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">Activity</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-cream/30 transition-colors group">
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-primary/5 shadow-sm bg-cream">
                        <Image 
                          src={user.artisanProfile?.avatar || user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt={user.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm md:text-base">{user.name}</p>
                        <p className="text-[10px] md:text-xs text-charcoal/40 truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    <span className={cn(
                      "px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border",
                      user.role === "ADMIN" ? "bg-red-50 text-red-600 border-red-200" :
                      user.role === "ARTISAN" ? "bg-accent/10 text-accent border-accent/20" :
                      "bg-blue-50 text-blue-600 border-blue-200"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    {user.artisanProfile ? (
                      <div className="flex items-center gap-2 group/studio">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/5 flex items-center justify-center">
                          <Store className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs font-bold text-primary group-hover/studio:text-accent transition-colors">
                            {user.artisanProfile.studioName || `${user.name}'s Studio`}
                          </p>
                          <p className="text-[9px] text-charcoal/40 italic mb-2">
                            {user.artisanProfile.location || "Global Studio"}
                          </p>
                          <VerifyArtisanButton 
                            artisanId={user.artisanProfile.id} 
                            currentStatus={user.artisanProfile.isVerified} 
                            status={user.artisanProfile.status}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[9px] md:text-[10px] font-bold text-primary/20 uppercase tracking-widest">N/A</span>
                    )}
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-bold text-charcoal/40">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-charcoal/40">
                        <ShoppingBag className="w-3 h-3" />
                        <span>{user.orders?.length || 0} Orders</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                    <DeleteUserButton userId={user.id} userName={user.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
