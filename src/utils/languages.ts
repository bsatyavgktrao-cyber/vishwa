/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  title: string;
  subtitle: string;
  menu_home: string;
  menu_kundli: string;
  menu_signs: string;
  menu_match: string;
  menu_numerology: string;
  menu_panchang: string;
  menu_muhurta: string;
  menu_remedies: string;
  menu_blog: string;
  menu_contact: string;
  menu_admin: string;
  form_header: string;
  form_name: string;
  form_gender: string;
  form_dob: string;
  form_tob: string;
  form_country: string;
  form_city: string;
  form_lat: string;
  form_lng: string;
  form_tz: string;
  form_lang: string;
  form_submit: string;
  btn_calculate: string;
  loading: string;
  result_header: string;
  birth_info: string;
  kundli_chart: string;
  planetary_positions: string;
  rashi_nakshatra: string;
  dasha_report: string;
  ai_horoscope: string;
  timings_header: string;
  remedies_header: string;
}

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "ar", name: "Arabic (العربية)" },
];

export const TRANSLATIONS: { [key: string]: TranslationSet } = {
  en: {
    title: "Vishwa Jyotish",
    subtitle: "AI-Powered Vedic Astrology & Kundli Engine",
    menu_home: "Horoscopes",
    menu_kundli: "Free Kundli",
    menu_signs: "Zodiac Signs",
    menu_match: "Match Making",
    menu_numerology: "Numerology",
    menu_panchang: "Panchang",
    menu_muhurta: "Muhurta",
    menu_remedies: "Remedies",
    menu_blog: "Astro Blog",
    menu_contact: "Contact",
    menu_admin: "Admin Settings",
    form_header: "Prepare Your Birth Chart (Kundli)",
    form_name: "Name",
    form_gender: "Gender",
    form_dob: "Date of Birth",
    form_tob: "Time of Birth",
    form_country: "Country",
    form_city: "City of Birth",
    form_lat: "Latitude (e.g. 17.385)",
    form_lng: "Longitude (e.g. 78.486)",
    form_tz: "Timezone (Offset hours index)",
    form_lang: "Consultation Language",
    form_submit: "Generate Charts & AI Horoscope",
    btn_calculate: "Calculate Now",
    loading: "Calculating celestial coordinates and streaming Gemini AI predictions...",
    result_header: "Your Personal Vedic Horoscope Results",
    birth_info: "Birth Specification Details",
    kundli_chart: "Vedic Kundli Charts",
    planetary_positions: "Planetary Degrees & Coordinate Deck",
    rashi_nakshatra: "Rashi, Nakshatra & Pada Alignment",
    dasha_report: "Vimshottari Dasha Periods",
    ai_horoscope: "Personalized Gemini AI Horoscope",
    timings_header: "Vedic Daily Timings Calendar",
    remedies_header: "Recommended Astrological Remedies",
  },
  te: {
    title: "విశ్వ జ్యోతిష్యం",
    subtitle: "కృత్రిమ మేధస్సు మరియు వేద జాతక కేంద్రం",
    menu_home: "రాశి ఫలాలు",
    menu_kundli: "ఉచిత జాతకం",
    menu_signs: "ద్వాదశ రాశులు",
    menu_match: "వధూవరుల పొంతన",
    menu_numerology: "సంఖ్యాశాస్త్రం",
    menu_panchang: "పంచాంగం",
    menu_muhurta: "శుభ ముహూర్తం",
    menu_remedies: "పరిహారాలు",
    menu_blog: "జ్యోతిష్య సమాచారం",
    menu_contact: "సంప్రదించండి",
    menu_admin: "నిర్వాహక విభాగం",
    form_header: "మీ జన్మ కుండలి తయారు చేసుకోండి",
    form_name: "పేరు",
    form_gender: "లింగం",
    form_dob: "పుట్టిన తేదీ",
    form_tob: "పుట్టిన సమయం",
    form_country: "దేశం",
    form_city: "జన్మ స్థలం",
    form_lat: "అక్షాంశం",
    form_lng: "రేఖాంశం",
    form_tz: "టైమ్ జోన్",
    form_lang: "సంప్రదింపుల భాష",
    form_submit: "కుండలి మరియు దైవజ్ఞ జాతకం పొందుము",
    btn_calculate: "గణించుము",
    loading: "గ్రహాల గతులను లెక్కిస్తోంది, కృత్రిమ మేధస్సు ద్వారా జాతకాన్ని రూపొందిస్తోంది...",
    result_header: "మీ వ్యక్తిగత వేద జాతక ఫలితాలు",
    birth_info: "జనన వివరాలు",
    kundli_chart: "వేద జన్మ కుండలి",
    planetary_positions: "గ్రహాల స్థితులు - డిగ్రీలు",
    rashi_nakshatra: "రాశి, నక్షత్రము మరియు పాదములు",
    dasha_report: "విం శోత్తరీ మహాదశలు",
    ai_horoscope: "జ్యోతిష్య విశ్లేషణ (Gemini AI)",
    timings_header: "శుభ అశుభ సమయాలు",
    remedies_header: "సూచించబడిన గ్రహ పరిహారాలు",
  },
  hi: {
    title: "विश्व ज्योतिष",
    subtitle: "AI-संचालित वैदिक ज्योतिष और कुंडली इंजन",
    menu_home: "राशिफल",
    menu_kundli: "निःशुल्क कुंडली",
    menu_signs: "राशियां",
    menu_match: "कुंडली मिलान",
    menu_numerology: "अंकशास्त्र",
    menu_panchang: "पंचांग",
    menu_muhurta: "शुभ मुहूर्त",
    menu_remedies: "उपाय एवं रत्न",
    menu_blog: "एस्ट्रो ब्लॉग",
    menu_contact: "संपर्क करें",
    menu_admin: "प्रशासन",
    form_header: "अपनी जन्म कुंडली तैयार करें",
    form_name: "नाम",
    form_gender: "लिंग",
    form_dob: "जन्म तिथि",
    form_tob: "जन्म समय",
    form_country: "देश",
    form_city: "जन्म स्थान",
    form_lat: "अक्षांश",
    form_lng: "रेखांश",
    form_tz: "टाइमजोन",
    form_lang: "परामर्श की भाषा",
    form_submit: "कुंडली और ज्योतिषीय भविष्यफल प्राप्त करें",
    btn_calculate: "गणना करें",
    loading: "ग्रहों की स्थिति की गणना हो रही है और जेमिनी एआई भविष्यवाणियां तैयार की जा रही हैं...",
    result_header: "आपका व्यक्तिगत वैदिक राशिफल",
    birth_info: "जन्म विवरण तालिका",
    kundli_chart: "वैदिक जन्म कुंडली",
    planetary_positions: "ग्रहों की स्पष्ट स्थिति और अंश",
    rashi_nakshatra: "राशि, नक्षत्र और चरण संरेखण",
    dasha_report: "विंशोत्तरी दशा भविष्यफल",
    ai_horoscope: "जेमिनी एआई द्वारा व्यक्तिगत विश्लेषण",
    timings_header: "वैदिक दैनिक काल चक्र",
    remedies_header: "ग्रहों के वैदिक और शास्त्रीय उपाय",
  },
  ta: {
    title: "விஸ்வ ஜோதிடம்",
    subtitle: "AI-ஆல் இயங்கும் வேத ஜோதிட ஜாதக கணிப்பு",
    menu_home: "ராசி பலன்கள்",
    menu_kundli: "இலவச ஜாதகம்",
    menu_signs: "விண்மீன் ராசிகள்",
    menu_match: "திருமண பொருத்தம்",
    menu_numerology: "எண் கணிதம்",
    menu_panchang: "பஞ்சாங்கம்",
    menu_muhurta: "சுப முகூர்த்தம்",
    menu_remedies: "பரிகாரங்கள்",
    menu_blog: "ஜோதிட வலைப்பதிவு",
    menu_contact: "தொடர்பு",
    menu_admin: "நிர்வாகம்",
    form_header: "உங்கள் ஜாதகத்தை தயார் செய்யுங்கள்",
    form_name: "பெயர்",
    form_gender: "பாலினம்",
    form_dob: "பிறந்த தேதி",
    form_tob: "பிறந்த நேரம்",
    form_country: "நாடு",
    form_city: "பிறந்த இடம்",
    form_lat: "அட்சரேகை",
    form_lng: "தீர்க்கரேகை",
    form_tz: "நேர மண்டலம்",
    form_lang: "ஆலோசனை மொழி",
    form_submit: "ஜாதகம் மற்றும் AI கணிப்பு பெறுக",
    btn_calculate: "கணக்கிடுங்கள்",
    loading: "கிரக நிலைகளை கணக்கிடுகிறது, AI ஜாதக பலன்களை உருவாக்குகிறது...",
    result_header: "உங்களது வேத ஜோதிட பலன்கள்",
    birth_info: "பிறப்பு விபரங்கள்",
    kundli_chart: "வேத ஜாதக கட்டம்",
    planetary_positions: "கிரக நிலைகளும் பாகைகளும்",
    rashi_nakshatra: "ராசி, நட்சத்திரம் மற்றும் பாத அமைப்புகள்",
    dasha_report: "விம்சோத்தரி மகா தசா காலங்கள்",
    ai_horoscope: "மேம்பட்ட AI ஜாதக பகுப்பாய்வு",
    timings_header: "தினசரி கால அட்டவணை",
    remedies_header: "பரிந்துரைக்கப்பட்ட பரிகாரங்கள்",
  },
  kn: {
    title: "ವಿಶ್ವ ಜ್ಯೋತಿಷ್ಯ",
    subtitle: "AI-ಆಧಾರಿತ ವೈದಿಕ ಕುಂಡಲಿ",
    menu_home: "ರಾಶಿಭವಿಷ್ಯ",
    menu_kundli: "ಉಚಿತ ಕುಂಡಲಿ",
    menu_signs: "ರಾಶಿಗಳು",
    menu_match: "ಮದುವೆ ಹೊಂದಾಣಿಕೆ",
    menu_numerology: "ಸಂಖ್ಯಾಶಾಸ್ತ್ರ",
    menu_panchang: "ಪಂಚಾಂಗ",
    menu_muhurta: "ಮುಹೂರ್ತ",
    menu_remedies: "ಪರಿಹಾರಗಳು",
    menu_blog: "ಬ್ಲಾಗ್",
    menu_contact: "ಸಂಪರ್ಕಿಸಿ",
    menu_admin: "ನಿರ್ವಹಣೆ",
    form_header: "ನಿಮ್ಮ ಕುಂಡಲಿಯನ್ನು ರಚಿಸಿ",
    form_name: "ಹೆಸರು",
    form_gender: "ಲಿಂಗ",
    form_dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ",
    form_tob: "ಹುಟ್ಟಿದ ಸಮಯ",
    form_country: "ದೇಶ",
    form_city: "ಹುಟ್ಟಿದ ಊರು",
    form_lat: "ಅಕ್ಷಾಂಶ",
    form_lng: "ರೇಖಾಂಶ",
    form_tz: "ಸಮಯ ವಲಯ",
    form_lang: "ಭಾಷೆ",
    form_submit: "ಕುಂಡಲಿ ಮತ್ತು AI ಭವಿಷ್ಯ ಪಡೆಯಿರಿ",
    btn_calculate: "ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
    loading: "ಜ್ಞಾನವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    result_header: "ನಿಮ್ಮ ವೈದಿಕ ಕುಂಡಲಿ",
    birth_info: "ಹುಟ್ಟಿದ ಮಾಹಿತಿ",
    kundli_chart: "ಕುಂಡಲಿ ಚಾರ್ಟ್",
    planetary_positions: "ಗ್ರಹಗಳ ಸ್ಥಾನ",
    rashi_nakshatra: "ರಾಶಿ ಮತ್ತು ನಕ್ಷತ್ರ",
    dasha_report: "ದಶಾ ಭವಿಷ್ಯ",
    ai_horoscope: "AI ವೈಯಕ್ತಿಕ ಭವಿಷ್ಯ",
    timings_header: "ದೈನಂದಿನ ಸಮಯಗಳು",
    remedies_header: "ಜ್ಯೋತಿಷ್ಯ ಪರಿಹಾರಗಳು",
  },
  ml: {
    title: "വിശ്വ ജ്യോതിഷം",
    subtitle: "AI-അധിഷ്ഠിത വേദ ജാതകം",
    menu_home: "ജാതകം",
    menu_kundli: "സൗജന്യ കുണ്ഡലി",
    menu_signs: "രാശികൾ",
    menu_match: "വിവാഹ പൊരുത്തം",
    menu_numerology: "സംഖ്യാശാസ്ത്രം",
    menu_panchang: "പഞ്ചാംഗം",
    menu_muhurta: "മുഹൂർത്തം",
    menu_remedies: "പ്രതിവിധികൾ",
    menu_blog: "ബ്ലോഗ്",
    menu_contact: "ബന്ധപ്പെടുക",
    menu_admin: "അഡ്മിൻ",
    form_header: "നിങ്ങളുടെ ജാതകം സൃഷ്ടിക്കുക",
    form_name: "പേര്",
    form_gender: "ലിംഗം",
    form_dob: "ജനനതിയ്യതി",
    form_tob: "ജനനസമയം",
    form_country: "രാജ്യം",
    form_city: "ജനിച്ച നഗരം",
    form_lat: "അക്ഷാംശം",
    form_lng: "രേഖാംശം",
    form_tz: "സമയമേഖല",
    form_lang: "ഭാഷ",
    form_submit: "കുണ്ഡലിയും AI ജാതകവും നേടുക",
    btn_calculate: "കണക്കുകൂട്ടുക",
    loading: "ഗ്രഹങ്ങളെ വിശകലനം ചെയ്യുന്നു...",
    result_header: "നിങ്ങളുടെ വേദ ജാതകം",
    birth_info: "ജനന വിവരങ്ങൾ",
    kundli_chart: "കുണ്ഡലി ചാർട്ട്",
    planetary_positions: "ഗ്രഹങ്ങളുടെ സ്ഥാനം",
    rashi_nakshatra: "രാശിയും നക്ഷത്രവും",
    dasha_report: "ദശാ ഫലം",
    ai_horoscope: "AI വ്യക്തിഗത ജാതകം",
    timings_header: "പ്രതിദിന സമയങ്ങൾ",
    remedies_header: "ജ്യോതിഷ പ്രതിവിധികൾ",
  }
};

// Fallback to English for any undefined language
export function getTranslation(lang: string, key: keyof TranslationSet): string {
  const set = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  const fallback = TRANSLATIONS["en"];
  return set[key] || fallback[key] || String(key);
}
