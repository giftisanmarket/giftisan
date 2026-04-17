import { getAllUsers } from "@/lib/actions";
import { User, Shield, Store, Trash2, Calendar, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VerifyArtisanButton } from "@/components/admin/verify-artisan-button";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { RoleManager } from "@/components/admin/role-manager";

import { getDictionary } from "../../dictionaries";

export default async function AdminUsersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);
  const users = await getAllUsers();

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-primary tracking-tighter mb-2">
            {dict.admin.artisans_title} & <span className="serif italic text-accent font-normal">{dict.admin.users_accent}</span>
          </h1>
          <p className="text-charcoal/40 text-sm font-medium leading-relaxed max-w-md">{dict.admin.manage_members_desc}</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-primary/5 shadow-sm shrink-0 w-full md:w-auto">
          <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{dict.admin.total_members}</p>
          <p className="text-xl md:text-2xl font-black text-primary leading-none">{users.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar scrollbar-hide">
          <table className="w-full text-left min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/5">
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.user_profile}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.role}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.studio_status}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{dict.admin.activity}</th>
                <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest text-right">{dict.admin.actions}</th>
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
                    <RoleManager userId={user.id} currentRole={user.role} dict={dict} />
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6">
                    {user.artisanProfile ? (
                      <div className="flex items-center gap-3 md:gap-4 group/studio">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                        </div>
                        <div className="flex flex-col gap-3 min-w-0">
                          <div className="space-y-1">
                            <p className="font-bold text-primary text-sm truncate">
                              {user.artisanProfile.studioName || `${user.name}'s Studio`}
                            </p>
                            <p className="text-[10px] text-charcoal/40 italic">
                              {user.artisanProfile.location || dict.admin.global_studio}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                             <Link 
                               href={`/studio?artisanUserId=${user.id}`}
                               className="h-8 md:h-9 px-4 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-light transition-all active:scale-95 shadow-sm"
                             >
                               {dict.admin.preview_studio}
                             </Link>
                             <VerifyArtisanButton 
                               artisanId={user.artisanProfile.id} 
                               currentStatus={user.artisanProfile.isVerified} 
                               status={user.artisanProfile.status}
                               dict={dict}
                             />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[9px] md:text-[10px] font-bold text-primary/20 uppercase tracking-widest">{dict.admin.not_applicable}</span>
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
                        <span>{dict.admin.orders_count.replace('{count}', (user.orders?.length || 0).toString())}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 md:py-6 text-right">
                    <DeleteUserButton userId={user.id} userName={user.name} dict={dict} />
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
