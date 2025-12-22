/**
 * Countries list for dropdowns
 * Supports both Arabic and English names
 */

export interface Country {
  code: string;
  nameEn: string;
  nameAr: string;
}

export const countries: Country[] = [
  { code: "EG", nameEn: "Egypt", nameAr: "مصر" },
  { code: "SA", nameEn: "Saudi Arabia", nameAr: "السعودية" },
  { code: "AE", nameEn: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة" },
  { code: "KW", nameEn: "Kuwait", nameAr: "الكويت" },
  { code: "QA", nameEn: "Qatar", nameAr: "قطر" },
  { code: "BH", nameEn: "Bahrain", nameAr: "البحرين" },
  { code: "OM", nameEn: "Oman", nameAr: "عمان" },
  { code: "JO", nameEn: "Jordan", nameAr: "الأردن" },
  { code: "LB", nameEn: "Lebanon", nameAr: "لبنان" },
  { code: "SY", nameEn: "Syria", nameAr: "سوريا" },
  { code: "IQ", nameEn: "Iraq", nameAr: "العراق" },
  { code: "YE", nameEn: "Yemen", nameAr: "اليمن" },
  { code: "LY", nameEn: "Libya", nameAr: "ليبيا" },
  { code: "TN", nameEn: "Tunisia", nameAr: "تونس" },
  { code: "DZ", nameEn: "Algeria", nameAr: "الجزائر" },
  { code: "MA", nameEn: "Morocco", nameAr: "المغرب" },
  { code: "SD", nameEn: "Sudan", nameAr: "السودان" },
  { code: "US", nameEn: "United States", nameAr: "الولايات المتحدة" },
  { code: "GB", nameEn: "United Kingdom", nameAr: "المملكة المتحدة" },
  { code: "CA", nameEn: "Canada", nameAr: "كندا" },
  { code: "AU", nameEn: "Australia", nameAr: "أستراليا" },
  { code: "FR", nameEn: "France", nameAr: "فرنسا" },
  { code: "DE", nameEn: "Germany", nameAr: "ألمانيا" },
  { code: "IT", nameEn: "Italy", nameAr: "إيطاليا" },
  { code: "ES", nameEn: "Spain", nameAr: "إسبانيا" },
  { code: "TR", nameEn: "Turkey", nameAr: "تركيا" },
  { code: "IN", nameEn: "India", nameAr: "الهند" },
  { code: "CN", nameEn: "China", nameAr: "الصين" },
  { code: "JP", nameEn: "Japan", nameAr: "اليابان" },
  { code: "KR", nameEn: "South Korea", nameAr: "كوريا الجنوبية" },
  { code: "BR", nameEn: "Brazil", nameAr: "البرازيل" },
  { code: "MX", nameEn: "Mexico", nameAr: "المكسيك" },
  { code: "AR", nameEn: "Argentina", nameAr: "الأرجنتين" },
  { code: "ZA", nameEn: "South Africa", nameAr: "جنوب أفريقيا" },
  { code: "NG", nameEn: "Nigeria", nameAr: "نيجيريا" },
  { code: "KE", nameEn: "Kenya", nameAr: "كينيا" },
  { code: "PK", nameEn: "Pakistan", nameAr: "باكستان" },
  { code: "BD", nameEn: "Bangladesh", nameAr: "بنغلاديش" },
  { code: "ID", nameEn: "Indonesia", nameAr: "إندونيسيا" },
  { code: "PH", nameEn: "Philippines", nameAr: "الفلبين" },
  { code: "VN", nameEn: "Vietnam", nameAr: "فيتنام" },
  { code: "TH", nameEn: "Thailand", nameAr: "تايلاند" },
  { code: "MY", nameEn: "Malaysia", nameAr: "ماليزيا" },
  { code: "SG", nameEn: "Singapore", nameAr: "سنغافورة" },
  { code: "NZ", nameEn: "New Zealand", nameAr: "نيوزيلندا" },
  { code: "NL", nameEn: "Netherlands", nameAr: "هولندا" },
  { code: "BE", nameEn: "Belgium", nameAr: "بلجيكا" },
  { code: "CH", nameEn: "Switzerland", nameAr: "سويسرا" },
  { code: "AT", nameEn: "Austria", nameAr: "النمسا" },
  { code: "SE", nameEn: "Sweden", nameAr: "السويد" },
  { code: "NO", nameEn: "Norway", nameAr: "النرويج" },
  { code: "DK", nameEn: "Denmark", nameAr: "الدنمارك" },
  { code: "FI", nameEn: "Finland", nameAr: "فنلندا" },
  { code: "PL", nameEn: "Poland", nameAr: "بولندا" },
  { code: "GR", nameEn: "Greece", nameAr: "اليونان" },
  { code: "PT", nameEn: "Portugal", nameAr: "البرتغال" },
  { code: "IE", nameEn: "Ireland", nameAr: "أيرلندا" },
  { code: "IL", nameEn: "Israel", nameAr: "إسرائيل" },
  { code: "IR", nameEn: "Iran", nameAr: "إيران" },
  { code: "AF", nameEn: "Afghanistan", nameAr: "أفغانستان" },
  { code: "RU", nameEn: "Russia", nameAr: "روسيا" },
  { code: "UA", nameEn: "Ukraine", nameAr: "أوكرانيا" },
  { code: "RO", nameEn: "Romania", nameAr: "رومانيا" },
  { code: "CZ", nameEn: "Czech Republic", nameAr: "جمهورية التشيك" },
  { code: "HU", nameEn: "Hungary", nameAr: "المجر" },
];

/**
 * Get countries list as options for Select component
 * @param language - Language code ('ar' or 'en')
 * @returns Array of { value, label } options
 */
export function getCountriesOptions(language: string = "en"): { value: string; label: string }[] {
  return countries.map((country) => ({
    value: country.code,
    label: language === "ar" ? country.nameAr : country.nameEn,
  }));
}

/**
 * Get country name by code
 * @param code - Country code
 * @param language - Language code ('ar' or 'en')
 * @returns Country name
 */
export function getCountryName(code: string, language: string = "en"): string {
  const country = countries.find((c) => c.code === code);
  if (!country) return code;
  return language === "ar" ? country.nameAr : country.nameEn;
}

