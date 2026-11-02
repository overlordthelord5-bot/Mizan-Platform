import React, { useState, useMemo } from 'react';
import { useStore } from '../../lib/store';
import { translations } from '../../lib/translations';
import { formatEGP } from '../../lib/accounting';
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  Clock,
  Heart,
  Video,
  MessageSquare,
  UserCheck,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

interface AccountantDirectoryProps {
  initialSearchQuery?: string;
  onSelectAccountant: (accountantId: string) => void;
  onBookAccountant: (accountantId: string) => void;
}

export const AccountantDirectory: React.FC<AccountantDirectoryProps> = ({
  initialSearchQuery = '',
  onSelectAccountant,
  onBookAccountant,
}) => {
  const {
    language,
    accountantProfiles,
    profiles,
    categories,
    favorites,
    toggleFavorite,
  } = useStore();

  const t = translations[language];

  // Filters state
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [minExperience, setMinExperience] = useState<number>(0);
  const [maxPriceEgp, setMaxPriceEgp] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'exp'>('rating');

  // Filter published accountants
  const filteredAccountants = useMemo(() => {
    return accountantProfiles
      .filter((ap) => ap.is_published)
      .filter((ap) => {
        const profile = profiles.find((p) => p.id === ap.profile_id);
        if (!profile) return false;

        // Search matching
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = profile.full_name.toLowerCase().includes(q);
          const matchSpecialty = ap.specialty.toLowerCase().includes(q);
          const matchSub = ap.sub_specialties.some((s) => s.toLowerCase().includes(q));
          const matchCity = profile.city.toLowerCase().includes(q);
          const matchBio = ap.bio.toLowerCase().includes(q);
          if (!matchName && !matchSpecialty && !matchSub && !matchCity && !matchBio) {
            return false;
          }
        }

        // Specialty filter
        if (selectedSpecialty !== 'all') {
          const matchSpec = ap.specialty.includes(selectedSpecialty) || ap.sub_specialties.some((s) => s.includes(selectedSpecialty));
          if (!matchSpec) return false;
        }

        // Min Rating
        if (minRating > 0 && ap.rating < minRating) return false;

        // Min Experience
        if (minExperience > 0 && ap.years_of_experience < minExperience) return false;

        // Max Price
        const priceEgp = ap.hourly_rate_piasters / 100;
        if (priceEgp > maxPriceEgp) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.hourly_rate_piasters - b.hourly_rate_piasters;
        if (sortBy === 'price_desc') return b.hourly_rate_piasters - a.hourly_rate_piasters;
        if (sortBy === 'exp') return b.years_of_experience - a.years_of_experience;
        return 0;
      });
  }, [
    accountantProfiles,
    profiles,
    search,
    selectedSpecialty,
    minRating,
    minExperience,
    maxPriceEgp,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearch('');
    setSelectedSpecialty('all');
    setMinRating(0);
    setMinExperience(0);
    setMaxPriceEgp(2000);
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142B43]">
          {t.directory.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          {t.directory.subtitle}
        </p>
      </div>

      {/* Main Content: Sidebar Filters + Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#142B43]">
              <SlidersHorizontal className="w-4 h-4 text-[#D6AE57]" />
              <span>{t.directory.filters}</span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-[#DC5656] flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.directory.resetFilters}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              {language === 'ar' ? 'بحث بالاسم أو التخصص' : 'Search CPA'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full text-xs py-2 px-3 ps-8 rounded-xl border border-slate-200 focus:border-[#D6AE57] focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-2.5" />
            </div>
          </div>

          {/* Specialty Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t.directory.specialty}</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-[#D6AE57] focus:outline-none bg-white"
            >
              <option value="all">{t.directory.allSpecialties}</option>
              {categories.map((c) => (
                <option key={c.id} value={language === 'ar' ? c.name_ar : c.name_en}>
                  {language === 'ar' ? c.name_ar : c.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t.directory.minRating}</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-[#D6AE57] focus:outline-none bg-white"
            >
              <option value={0}>{t.directory.allRatings}</option>
              <option value={4.5}>★ 4.5+ وأعلى</option>
              <option value={4.8}>★ 4.8+ ممتاز</option>
            </select>
          </div>

          {/* Min Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">{t.directory.experience}</label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-[#D6AE57] focus:outline-none bg-white"
            >
              <option value={0}>{t.directory.allExperience}</option>
              <option value={5}>5+ {t.directory.years}</option>
              <option value={10}>10+ {t.directory.years}</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{t.directory.priceRange}</span>
              <span className="text-[#142B43] font-bold">{maxPriceEgp} ج.م</span>
            </div>
            <input
              type="range"
              min={500}
              max={2500}
              step={100}
              value={maxPriceEgp}
              onChange={(e) => setMaxPriceEgp(Number(e.target.value))}
              className="w-full accent-[#D6AE57] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>500 ج.م</span>
              <span>2,500 ج.م</span>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Bar: Count & Sort */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="font-semibold text-slate-700">
              {language === 'ar' ? 'تم العثور على' : 'Found'}{' '}
              <span className="text-[#142B43] font-bold text-sm">
                {filteredAccountants.length}
              </span>{' '}
              {language === 'ar' ? 'محاسب قانوني معتمد' : 'certified accountants'}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">{t.directory.sort}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white font-medium text-[#142B43] focus:outline-none"
              >
                <option value="rating">{t.directory.sortRating}</option>
                <option value="price_asc">{t.directory.sortPriceLow}</option>
                <option value="price_desc">{t.directory.sortPriceHigh}</option>
                <option value="exp">{t.directory.sortExp}</option>
              </select>
            </div>
          </div>

          {/* Empty State */}
          {filteredAccountants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#142B43]">{t.directory.noResults}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'جرب تقليل شروط التصفية أو البحث عن كلمة رئيسية أخرى مثل "ضرائب" أو "إقرارات".'
                  : 'Try broadening your search or adjusting filters.'}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-[#142B43] text-white text-xs font-bold"
              >
                {t.directory.resetFilters}
              </button>
            </div>
          ) : (
            /* Cards List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccountants.map((ap) => {
                const profile = profiles.find((p) => p.id === ap.profile_id);
                if (!profile) return null;
                const isFav = favorites.includes(ap.profile_id);

                return (
                  <div
                    key={ap.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#D6AE57] p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between relative group"
                  >
                    {/* Favorite toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(ap.profile_id)}
                      className={`absolute top-4 end-4 p-1.5 rounded-full border transition ${
                        isFav
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-white border-slate-200 text-slate-300 hover:text-slate-400'
                      }`}
                      aria-label="Favorite"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <div>
                      {/* Avatar & Header */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1 pe-6">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-[#142B43] truncate">
                              {profile.full_name}
                            </h3>
                            <ShieldCheck className="w-4 h-4 text-[#239B76] shrink-0" title="معتمد بسجل المحاسبين والمراجعين" />
                          </div>

                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {ap.title}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5 text-xs">
                            <div className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="ms-1">{ap.rating.toFixed(2)}</span>
                            </div>
                            <span className="text-slate-400">
                              ({ap.reviews_count} {language === 'ar' ? 'تقييم' : 'reviews'})
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-medium">{profile.city}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                        {ap.bio}
                      </p>

                      {/* Specialties tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {ap.sub_specialties.slice(0, 3).map((sub, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>

                      {/* Experience and Methods */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ap.years_of_experience} {t.directory.years}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500">
                          <span className="flex items-center gap-1" title="محادثة فيديو">
                            <Video className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                          <span className="flex items-center gap-1" title="محادثة نصية ومستندات">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                            {ap.license_number}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'سعر الجلسة' : 'Per session'}</span>
                        <span className="text-base font-extrabold text-[#142B43]">
                          {formatEGP(ap.hourly_rate_piasters, language)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectAccountant(ap.profile_id)}
                          className="px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition"
                        >
                          {t.directory.viewProfile}
                        </button>
                        <button
                          type="button"
                          onClick={() => onBookAccountant(ap.profile_id)}
                          className="px-4 py-2 rounded-xl bg-[#142B43] hover:bg-[#1C3552] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          {t.directory.bookNow}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
