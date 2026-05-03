"use client";

import { motion } from "framer-motion";
import { 
  MousePointer2, 
  Heart, 
  Percent, 
  BarChart3, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag, 
  Star, 
  Clock, 
  X,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BespokeImage } from "@/components/bespoke-image";
import { SalesChart } from "@/components/sales-chart";

interface OverviewTabProps {
  dict: any;
  lang: string;
  totalViews: number;
  totalFavorites: number;
  conversionRate: string;
  totalRevenue: number;
  products: any[];
  sales: any[];
  topVariants: any[];
  activities: any[];
}

export function OverviewTab({
  dict,
  lang,
  totalViews,
  totalFavorites,
  conversionRate,
  totalRevenue,
  products,
  sales,
  topVariants,
  activities
}: OverviewTabProps) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: dict.studio.stats_impressions,
            value: totalViews.toLocaleString(),
            icon: MousePointer2,
            color: "bg-purple-500",
            tooltip: dict.studio.tooltip_impressions
          },
          {
            label: dict.studio.stats_loves,
            value: totalFavorites,
            icon: Heart,
            color: "bg-red-500",
            tooltip: dict.studio.tooltip_loves
          },
          {
            label: dict.studio.stats_success,
            value: `${conversionRate}%`,
            icon: Percent,
            color: "bg-indigo-500",
            tooltip: dict.studio.tooltip_success
          },
          {
            label: dict.studio.stats_revenue,
            value: `${dict.product.currency} ${totalRevenue.toLocaleString()}`,
            icon: BarChart3,
            color: "bg-green-500",
            tooltip: dict.studio.tooltip_revenue
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5">
            <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6", stat.color)}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex items-center gap-2 mb-1 group relative">
              <p className="text-xs font-black text-primary/40 uppercase tracking-widest">{stat.label}</p>
              {stat.tooltip && (
                <>
                  <Info className="w-3 h-3 text-primary/20 cursor-help" />
                  <div className="absolute bottom-full start-0 mb-2 w-64 p-3 bg-primary text-[10px] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl leading-relaxed">
                    {stat.tooltip}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-baseline gap-1 md:gap-2">
              <p className="text-xl md:text-3xl font-heading font-bold text-primary">{stat.value}</p>
              {stat.label === dict.studio.stats_success && (
                <span className={cn(
                  "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                  parseFloat(stat.value.toString()) === 0 ? "bg-cream text-primary/40 border-primary/5" :
                    parseFloat(stat.value.toString()) < 2 ? "bg-blue-50 text-blue-600 border-blue-100" :
                      parseFloat(stat.value.toString()) <= 5 ? "bg-green-50 text-green-600 border-green-100" :
                        parseFloat(stat.value.toString()) <= 10 ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                          "bg-accent/10 text-accent border-accent/20"
                )}>
                  {parseFloat(stat.value.toString()) === 0 ? dict.studio.status_building :
                    parseFloat(stat.value.toString()) < 2 ? dict.studio.status_rising :
                      parseFloat(stat.value.toString()) <= 5 ? dict.studio.status_healthy :
                        parseFloat(stat.value.toString()) <= 10 ? dict.studio.status_exceptional :
                          dict.studio.status_legendary}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pro Insights */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="bg-primary text-white p-8 md:p-10 lg:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center md:items-start text-center md:text-start">
          <div className="relative z-10 w-full flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/60 text-[9px] font-black uppercase tracking-widest mb-8 md:mb-10">
              <Sparkles className="w-3.5 h-3.5" />
              {dict.studio.most_desired_treasure}
            </div>
            {(() => {
              const topViewed = [...products].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
              if (!topViewed) return <p className="text-white/40 italic">{dict.studio.gallery_empty}</p>;
              return (
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="relative w-24 h-24 md:w-20 lg:w-28 aspect-square rounded-3xl overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl">
                    <BespokeImage src={topViewed.images[0]} alt="" fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold tracking-tight">{topViewed.name}</h4>
                    <p className="text-white/40 text-sm md:text-lg font-medium">{dict.studio.visits_count.replace('{count}', (topViewed.views || 0).toString())}</p>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="absolute top-0 end-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="bg-white p-8 md:p-10 lg:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col items-center md:items-start text-center md:text-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest mb-8 md:mb-10">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {dict.studio.best_selling_piece}
          </div>
          {(() => {
            const topSold = [...products].sort((a, b) => {
              const aSales = sales.filter(s => s.productId === a.id).length;
              const bSales = sales.filter(s => s.productId === b.id).length;
              return bSales - aSales;
            })[0];
            if (!topSold) return <p className="text-charcoal/30 italic">{dict.studio.waiting_first_sale}</p>;
            const soldCount = sales.filter(s => s.productId === topSold.id).length;
            return (
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="relative w-24 h-24 md:w-20 lg:w-28 aspect-square rounded-3xl overflow-hidden border border-primary/5 shrink-0 shadow-xl">
                  <BespokeImage src={topSold.images[0]} alt="" fill className="object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary tracking-tight">{topSold.name}</h4>
                  <p className="text-charcoal/40 text-sm md:text-lg font-medium">{dict.studio.units_traveling.replace('{count}', soldCount.toString())}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Variant Performance */}
      {topVariants.length > 0 && (
        <div className="bg-white p-10 rounded-[3rem] border border-primary/5 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest">
              <BarChart3 className="w-3 h-3" />
              {dict.edit_product.variant_performance}
            </div>
            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Top 5 Favorites</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {topVariants.map((v: any, i: number) => (
              <div key={i} className="flex flex-col gap-4 group cursor-default">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/5 shrink-0 transition-transform group-hover:scale-105">
                  <BespokeImage src={v.image} alt="" fill className="object-cover" />
                  <div className="absolute top-2 start-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-black text-indigo-600 shadow-sm">
                    #{i + 1}
                  </div>
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-primary truncate">{v.productName}</h5>
                  <p className="text-[10px] font-medium text-charcoal/40 uppercase tracking-widest truncate">
                    {v.name}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-black text-indigo-600">
                      {dict.edit_product.sold_count.replace('{count}', v.quantity.toString())}
                    </span>
                    <span className="text-[10px] text-charcoal/20">•</span>
                    <span className="text-[10px] font-bold text-primary/40">
                      {dict.product.currency} {v.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] p-6 md:p-10 lg:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{dict.studio.sales_performance} <span className="serif italic font-normal text-accent">{dict.studio.sales_performance_accent}</span></h2>
            <p className="text-charcoal/40 mt-1">{dict.studio.daily_revenue_desc}</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-accent px-4 py-2 bg-accent/10 rounded-full">
            <ArrowUpRight className="w-4 h-4" />
            {dict.studio.live_data}
          </div>
        </div>
        <SalesChart sales={sales} tickFormatter={(value) => `EGP ${value}`} />
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-[3rem] p-6 md:p-10 lg:p-12 border border-primary/5 shadow-2xl shadow-primary/5">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-primary">{dict.studio.recent_activity} <span className="serif italic font-normal text-accent">{dict.studio.recent_activity_accent || "Flow"}</span></h2>
            <p className="text-charcoal/40 mt-1">{dict.studio.no_activity_desc || "Insights from your workshop's pulse."}</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {activities.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-cream/20 rounded-[1.5rem] md:rounded-[2rem] border border-dashed border-primary/10">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-primary/10 mx-auto mb-4" />
              <p className="text-charcoal/30 italic text-sm">{dict.studio.no_activity}</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id + activity.type} className="flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] hover:bg-cream/50 transition-all group border border-transparent hover:border-primary/5">
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  activity.type === 'SALE' ? "bg-green-500 text-white shadow-green-500/20" :
                    activity.type === 'REVIEW' ? "bg-accent text-white shadow-accent/20" :
                      activity.status === 'APPROVED' ? "bg-blue-500 text-white shadow-blue-500/20" :
                        activity.status === 'REJECTED' ? "bg-red-500 text-white shadow-red-500/20" :
                          "bg-amber-500 text-white shadow-amber-500/20"
                )}>
                  {activity.type === 'SALE' ? <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" /> :
                    activity.type === 'REVIEW' ? <Star className="w-4 h-4 md:w-5 md:h-5" /> :
                      activity.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> :
                        activity.status === 'REJECTED' ? <X className="w-4 h-4 md:w-5 md:h-5" /> :
                          <Clock className="w-4 h-4 md:w-5 md:h-5" />}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-primary text-sm md:text-base">
                    {activity.type === 'SALE' ? dict.studio.activity_sale :
                      activity.type === 'REVIEW' ? dict.studio.activity_review :
                        activity.status === 'APPROVED' ? dict.studio.activity_product_approved :
                          activity.status === 'REJECTED' ? dict.studio.activity_product_rejected :
                            dict.studio.activity_product_pending}
                  </h4>
                  <p className="text-[10px] md:text-xs text-charcoal/60 leading-relaxed max-w-md">
                    {activity.type === 'SALE' ? dict.studio.activity_sale_desc.replace('{customer}', activity.customer).replace('{name}', activity.name) :
                      activity.type === 'REVIEW' ? dict.studio.activity_review_desc.replace('{name}', activity.name) :
                        activity.status === 'APPROVED' ? dict.studio.activity_product_approved_desc.replace('{name}', activity.name) :
                          activity.status === 'REJECTED' ? (
                            <>
                              {dict.studio.activity_product_rejected_desc.replace('{name}', activity.name)}
                              {activity.reason && (
                                <span className="block mt-1 font-bold text-red-500 italic">
                                  "{activity.reason}"
                                </span>
                              )}
                            </>
                          ) :
                            dict.studio.activity_product_pending_desc.replace('{name}', activity.name)}
                  </p>
                </div>

                <div className="text-end shrink-0">
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] text-primary/20 whitespace-nowrap">{new Date(activity.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' })}</p>
                  <p className="text-[8px] md:text-[9px] font-bold text-accent whitespace-nowrap">{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
