import { Navbar } from "@/components/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Settings, User, Bell, Palette, Shield } from "lucide-react";

export default async function StudioSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ARTISAN") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 pt-40 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                Artisan Portal
              </div>
              <h1 className="text-5xl font-heading font-bold text-primary">Studio Settings</h1>
            </div>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] gap-12">
            {/* Sidebar Navigation */}
            <nav className="flex flex-col gap-2">
              {[
                { icon: User, label: "Profile", active: true },
                { icon: Palette, label: "Studio Brand", active: false },
                { icon: Bell, label: "Notifications", active: false },
                { icon: Shield, label: "Security", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    item.active 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-charcoal/40 hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Content Area */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-primary/5 shadow-2xl space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-cream rounded-full border border-primary/10 flex items-center justify-center text-2xl font-black text-primary">
                    {session.user.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">{session.user.name}</h3>
                    <p className="text-charcoal/40 font-medium">Head Artisan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Studio Name</label>
                    <input 
                      type="text" 
                      defaultValue={session.user.name || ""}
                      className="w-full h-14 px-6 rounded-2xl bg-cream/30 border border-primary/10 transition-all font-medium text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={session.user.email || ""}
                      disabled
                      className="w-full h-14 px-6 rounded-2xl bg-cream/5 border border-primary/5 text-primary/40 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/5 flex justify-end">
                <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-light transition-all shadow-xl shadow-primary/20">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
