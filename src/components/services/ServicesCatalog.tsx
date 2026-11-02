import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import {
  Scale,
  Clock,
  Video,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ServicesCatalogProps {
  onSelectService: (serviceId: string, accountantId?: string) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ onSelectService }) => {
  const { language, categories, services, profiles } = useStore();
  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredServices = services
    .filter((s) => s.is_active)
    .filter((s) => (activeCategory === 'all' ? true : s.category_id === activeCategory));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142B43]">
          {language === 'ar' ? 'دليل الخدمات والاستشارات المحاسبية' : 'Accounting Services Catalog'}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          {language === 'ar'
            ? 'خدمات محاسبية وضريبية مصممة خصيصاً لتلبية متطلبات الأفراد، الأطباء، المهندسين، وأصحاب الأعمال الحرة'
            : 'Tailored accounting and tax advisory packages for private individuals and freelancers.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeCategory === 'all'
              ? 'bg-[#142B43] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          {language === 'ar' ? 'جميع الخدمات' : 'All Services'}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === c.id
                ? 'bg-[#142B43] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {language === 'ar' ? c.name_ar : c.name_en}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => {
          const category = categories.find((c) => c.id === srv.category_id);
          const accountant = srv.accountant_id
            ? profiles.find((p) => p.id === srv.accountant_id)
            : null;

          return (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-[#D6AE57] transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#142B43]">
                    {category ? (language === 'ar' ? category.name_ar : category.name_en) : ''}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.duration_minutes} دقيقة</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#142B43]">
                  {language === 'ar' ? srv.name_ar : srv.name_en}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'ar' ? srv.description_ar : srv.description_en}
                </p>

                {accountant && (
                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                    <img
                      src={accountant.avatar_url}
                      alt={accountant.full_name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>المحاسب المعتمد: {accountant.full_name}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'القيمة' : 'Fee'}</span>
                  <span className="text-base font-black text-[#142B43]">
                    {formatEGP(srv.price_piasters, language)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectService(srv.id, srv.accountant_id)}
                  className="px-4 py-2 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {language === 'ar' ? 'حجز هذه الخدمة' : 'Book Service'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
