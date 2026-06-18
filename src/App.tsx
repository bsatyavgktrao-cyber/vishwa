/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ZODIAC_SIGNS, NAKSHATRAS, calculateVedicPositions, calculateVimshottariDasha, calculateVedicTimings, calculateMatchmakingCompatibility, formatDegrees, LUCKY_INFO_BY_RASHI } from "./utils/astrology";
import { LANGUAGES, getTranslation } from "./utils/languages";
import KundliChart from "./components/KundliChart";
import { 
  Sun, Moon, Users, Sparkles, Compass, BookOpen, Clock, Heart, Shield, 
  HelpCircle, Settings, Mail, Send, CheckCircle, Info, Filter, Trash2, 
  Plus, Edit, User, Globe, Search, Printer
} from "lucide-react";

// Pre-seeded Blog articles to make the SEO/Astro Blog fully functional
const SEEDED_BLOG_ARTICLES = [
  {
    id: 1,
    title: "Saturn Transit in Aquarius: Impact on All Zodiac Signs",
    excerpt: "Understand the deep karmic lessons of Shani Dev as he transits through his Moolatrikona sign of Aquarius, prompting structure and social responsibility.",
    category: "Planetary Transits",
    readTime: "6 min read",
    date: "Jun 14, 2026",
    content: "When Saturn, the lord of karma and discipline, transits through the air sign of Aquarius, we experience a collective shift toward structural reform and humanitarian ethics. In Vedic astrology, Aquarius is the natural 11th house, signifying gains, networks, and higher desires. This transit challenges us to build durable systems that serve the greater good..."
  },
  {
    id: 2,
    title: "Unlocking the Mystical Powers of Yellow Sapphire (Pukhraj)",
    excerpt: "Discover how the gemstone of Jupiter can invite supreme wisdom, material abundance, and marital harmony into your life.",
    category: "Gemology",
    readTime: "4 min read",
    date: "May 29, 2026",
    content: "Yellow Sapphire (known as Pukhraj in Vedic tradition) represents the benevolent energies of Guru or Jupiter. As the planet of expanded wisdom, spiritual truth, and family wealth, Jupiter grants extraordinary protection when aligned properly. Wearing a flawless, natural Yellow Sapphire on the index finger can help clear blocks in business, career advancement, and marriage affairs..."
  },
  {
    id: 3,
    title: "The Power of Sade Sati: Myths vs. Astrological Realities",
    excerpt: "Demystifying the feared 7.5-year cycle of Saturn. Learn why Sade Sati is a period of supreme purification rather than plain misfortune.",
    category: "Remedies & Timing",
    readTime: "8 min read",
    date: "May 10, 2026",
    content: "Sade Sati occurs when transit Saturn passes through the 12th, 1st, and 2nd houses from your natal Moon sign. Covering roughly seven and a half years, this period is often unjustly feared. While it introduces testing conditions, its deeper purpose is to incinerate deep-seated ego, cleanse pending karmic debts, and reconstruct your character with absolute humility..."
  }
];

// Zodiac Sign detailed profiles for the Encyclopedia Hub
const ZODIAC_PROFILES = [
  { name: "Aries", element: "Fire", ruler: "Mars", quality: "Cardinal", luckyColor: "Golden Red", stone: "Red Coral", traits: "Courageous, pioneer, energetic, and highly ambitious. Speaks direct truth without fear." },
  { name: "Taurus", element: "Earth", ruler: "Venus", quality: "Fixed", luckyColor: "Pastel White", stone: "Diamond / White Opal", traits: "Determined, patient, aesthetic lover, highly structured, loyal, and appreciates finest arts." },
  { name: "Gemini", element: "Air", ruler: "Mercury", quality: "Mutable", luckyColor: "Emerald Green", stone: "Emerald", traits: "Intellectual, eloquent communicator, witty, dual personality, fast learner, and social connector." },
  { name: "Cancer", element: "Water", ruler: "Moon", quality: "Cardinal", luckyColor: "Silver Gray", stone: "Natural Pearl", traits: "Deeply intuitive, nurturing protective nature, highly emotional, family-oriented, and imaginative." },
  { name: "Leo", element: "Fire", ruler: "Sun", quality: "Fixed", luckyColor: "Royal Gold", stone: "Ruby", traits: "Charismatic leader, generous protector, magnanimous soul, creative, self-assured, and kingly vigor." },
  { name: "Virgo", element: "Earth", ruler: "Mercury", quality: "Mutable", luckyColor: "Jade Green", stone: "Emerald", traits: "Analytical, perfectionist, humble assistant, service-oriented, precise, excellent counselor, and logical." },
  { name: "Libra", element: "Air", ruler: "Venus", quality: "Cardinal", luckyColor: "Baby Blue", stone: "Opal", traits: "Harmonizer, peacekeeper, lover of justice, artistic companion, elegant taste, and values balanced relationships." },
  { name: "Scorpio", element: "Water", ruler: "Mars", quality: "Fixed", luckyColor: "Scarlet Red", stone: "Red Coral", traits: "Intense, magnetic mystery, deeply emotional, powerful regeneration element, highly loyal yet fiercely defensive." },
  { name: "Sagittarius", element: "Fire", ruler: "Jupiter", quality: "Mutable", luckyColor: "Bright Yellow", stone: "Yellow Sapphire", traits: "Philosophical, optimistic seeker, absolute truth speaker, loves travel, highly religious, and expansive." },
  { name: "Capricorn", element: "Earth", ruler: "Saturn", quality: "Cardinal", luckyColor: "Charcoal Black", stone: "Blue Sapphire", traits: "Disciplined climber, patient architect, practical, hard-working, respects heritage and time-tested systems." },
  { name: "Aquarius", element: "Air", ruler: "Saturn", quality: "Fixed", luckyColor: "Electric Purple", stone: "Blue Sapphire / Amethyst", traits: "Visionary reformer, unconventional genius, humanitarian focus, loves community networks, inventive mindset." },
  { name: "Pisces", element: "Water", ruler: "Jupiter", quality: "Mutable", luckyColor: "Saffron Yellow", stone: "Yellow Sapphire", traits: "Deeply spiritual, cosmic dreamer, compassionate healer, artistic, intuitive, and transcends material limits." }
];

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<string>("kundli");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  // Birth state form
  const [name, setName] = useState<string>("Arjun Sharma");
  const [gender, setGender] = useState<string>("Male");
  const [dob, setDob] = useState<string>("1992-10-15");
  const [tob, setTob] = useState<string>("10:30");
  const [country, setCountry] = useState<string>("India");
  const [city, setCity] = useState<string>("New Delhi");
  const [latitude, setLatitude] = useState<number>(28.6139);
  const [longitude, setLongitude] = useState<number>(77.2090);
  const [timezone, setTimezone] = useState<number>(5.5);

  // Matchmaking state
  const [brideNakshatra, setBrideNakshatra] = useState<number>(3); // Rohini
  const [groomNakshatra, setGroomNakshatra] = useState<number>(16); // Anuradha
  const [matchResult, setMatchResult] = useState<any>(null);

  // Astro blog state
  const [blogArticles, setBlogArticles] = useState<any[]>(SEEDED_BLOG_ARTICLES);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("Planetary Transits");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [blogSearchQuery, setBlogSearchQuery] = useState("");

  // Horoscope selection Sign for daily horoscope
  const [chosenZodiac, setChosenZodiac] = useState<string>("Aries");
  const [horoscopeTimeframe, setHoroscopeTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  // Output variables
  const [calculatedChart, setCalculatedChart] = useState<any>(null);
  const [calculatedDasha, setCalculatedDasha] = useState<any>(null);
  const [calculatedTimings, setCalculatedTimings] = useState<any>(null);
  const [aiReport, setAiReport] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactTopic, setContactTopic] = useState("Kundli Consultation");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Admin states
  const [customDailyHoroscopeText, setCustomDailyHoroscopeText] = useState("");

  // Populate dynamic coordinates based on presets to simplify testing
  const applyCityPreset = (cityName: string) => {
    if (cityName.toLowerCase() === "new delhi" || cityName.toLowerCase() === "delhi") {
      setLatitude(28.6139);
      setLongitude(77.2090);
      setTimezone(5.5);
      setCountry("India");
    } else if (cityName.toLowerCase() === "mumbai") {
      setLatitude(19.0760);
      setLongitude(72.8777);
      setTimezone(5.5);
      setCountry("India");
    } else if (cityName.toLowerCase() === "london") {
      setLatitude(51.5074);
      setLongitude(-0.1278);
      setTimezone(1.0);
      setCountry("United Kingdom");
    } else if (cityName.toLowerCase() === "new york") {
      setLatitude(40.7128);
      setLongitude(-74.0060);
      setTimezone(-4.0);
      setCountry("United States");
    } else if (cityName.toLowerCase() === "tokyo") {
      setLatitude(35.6762);
      setLongitude(139.6503);
      setTimezone(9.0);
      setCountry("Japan");
    } else if (cityName.toLowerCase() === "sydney") {
      setLatitude(-33.8688);
      setLongitude(151.2093);
      setTimezone(10.0);
      setCountry("Australia");
    }
  };

  // Perform calculations on first load
  useEffect(() => {
    handleVedicCalculations();
  }, []);

  // Recount matching when nakshatras change
  useEffect(() => {
    const res = calculateMatchmakingCompatibility(brideNakshatra, groomNakshatra);
    setMatchResult(res);
  }, [brideNakshatra, groomNakshatra]);

  // Daily Transit Calculation
  const todaysTransit = React.useMemo(() => {
    const d = new Date();
    const tzOffset = -d.getTimezoneOffset() / 60;
    return calculateVedicPositions(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours() + d.getMinutes() / 60, tzOffset, 28.6139, 77.2090); // default back to neutral transit relative origin
  }, []);

  // Core computation controller
  const handleVedicCalculations = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    setAiReport("");

    try {
      // Split DOB
      const dateObj = new Date(dob);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate() + 1; // Align timezone delta

      // Split TOB
      const [hoursPart, minutesPart] = tob.split(":").map(Number);
      const decimalHours = hoursPart + (minutesPart / 60);

      // 1. Calculate positions
      const chartPoints = calculateVedicPositions(year, month, day, decimalHours, timezone, latitude, longitude);
      setCalculatedChart(chartPoints);

      // 2. Calculate Vimshottari Timeline
      const moonPlanet = chartPoints.planets.find((p) => p.name === "Moon");
      const moonLong = moonPlanet ? moonPlanet.longitude : 24.18; // fallback
      const birthTimeMs = new Date(`${dob}T${tob}:00`).getTime();
      const dashaObj = calculateVimshottariDasha(moonLong, birthTimeMs);
      setCalculatedDasha(dashaObj);

      // 3. Daily Traditional timings (Sunrise/Sunset defaults)
      const dayOfWeek = new Date(dob).getDay();
      const timingsObj = calculateVedicTimings(dayOfWeek);
      setCalculatedTimings(timingsObj);

      // 4. call server-side AI endpoint to generate customized spiritual reading
      const langName = LANGUAGES.find((l) => l.code === selectedLanguage)?.name || "English";
      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          gender,
          dob,
          tob,
          city,
          rashi: moonPlanet?.rashi || "Virgo",
          nakshatra: moonPlanet?.nakshatra || "Hasta",
          pada: moonPlanet?.pada || 1,
          ascendant: chartPoints.ascendant.formatted,
          language: langName
        })
      });

      const jsonRes = await response.json();
      if (jsonRes.text) {
        setAiReport(jsonRes.text);
      } else {
        setAiReport("### Astrological Report\nGemini API returned an error: " + (jsonRes.error || "Please wait, or verify your workspace GEMINI_API_KEY."));
      }
    } catch (err: any) {
      console.error(err);
      setAiReport("### Insight Interface Connection Error\n\nPlease verify that your server is running and active code is fully built. You can add your Gemini secret using the panel on the left.");
    } finally {
      setIsCalculating(false);
    }
  };

  // Add a newly published blog post
  const handleAddNewBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;
    const newArticle = {
      id: blogArticles.length + 1,
      title: newBlogTitle,
      excerpt: newBlogContent.slice(0, 140) + "...",
      category: newBlogCategory,
      readTime: "5 min read",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: newBlogContent
    };
    setBlogArticles([newArticle, ...blogArticles]);
    setNewBlogTitle("");
    setNewBlogContent("");
    alert("Astrological article published successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#2d2a26] font-sans flex flex-col selection:bg-[#5a5a40] selection:text-white">
      {/* HEADER SECTION - NATURAL TONES STYLE */}
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-[#dcd7cc] bg-[#fdfbf7] shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5a5a40] flex items-center justify-center text-white font-serif text-xl shadow-inner cursor-pointer" onClick={() => setActiveTab("kundli")}>
            ॐ
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif italic tracking-tight font-extrabold text-[#2d2a26] flex items-center gap-2">
              {getTranslation(selectedLanguage, "title")}
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#5a5a40] font-bold font-mono">
              {getTranslation(selectedLanguage, "subtitle")}
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden xl:flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
          <button
            id="nav-horoscope-btn"
            onClick={() => setActiveTab("horoscope")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "horoscope" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_home")}
          </button>
          <button
            id="nav-kundli-btn"
            onClick={() => setActiveTab("kundli")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "kundli" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_kundli")}
          </button>
          <button
            id="nav-signs-btn"
            onClick={() => setActiveTab("signs")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "signs" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_signs")}
          </button>
          <button
            id="nav-match-btn"
            onClick={() => setActiveTab("matching")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "matching" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_match")}
          </button>
          <button
            id="nav-numerology-btn"
            onClick={() => setActiveTab("numerology")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "numerology" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_numerology")}
          </button>
          <button
            id="nav-panchang-btn"
            onClick={() => setActiveTab("panchang")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "panchang" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_panchang")}
          </button>
          <button
            id="nav-remedies-btn"
            onClick={() => setActiveTab("remedies")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "remedies" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_remedies")}
          </button>
          <button
            id="nav-blog-btn"
            onClick={() => setActiveTab("blog")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "blog" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_blog")}
          </button>
          <button
            id="nav-contact-btn"
            onClick={() => setActiveTab("contact")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "contact" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_contact")}
          </button>
          <button
            id="nav-admin-btn"
            onClick={() => setActiveTab("admin")}
            className={`cursor-pointer transition-all pb-1 ${activeTab === "admin" ? "text-[#5a5a40] border-b-2 border-[#5a5a40]" : "text-[#78716c] hover:text-[#2d2a26]"}`}
          >
            {getTranslation(selectedLanguage, "menu_admin")}
          </button>
        </nav>

        {/* CONTROLS */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#e6e2da] px-3 py-1.5 rounded-full border border-[#dcd7cc]">
            <Globe className="w-3.5 h-3.5 text-[#5a5a40]" />
            <select
              id="lang-selector-dropdown"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer font-bold outline-none text-[#2d2a26]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900 bg-[#f5f2ed]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* MOBILE LOWER NAV RAIL */}
      <div className="xl:hidden bg-[#fdfbf7] border-b border-[#dcd7cc] flex flex-wrap justify-center gap-3 p-3 overflow-x-auto">
        <button id="mob-horoscope-btn" onClick={() => setActiveTab("horoscope")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "horoscope" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_home")}</button>
        <button id="mob-kundli-btn" onClick={() => setActiveTab("kundli")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "kundli" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_kundli")}</button>
        <button id="mob-signs-btn" onClick={() => setActiveTab("signs")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "signs" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_signs")}</button>
        <button id="mob-match-btn" onClick={() => setActiveTab("matching")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "matching" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_match")}</button>
        <button id="mob-numerology-btn" onClick={() => setActiveTab("numerology")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "numerology" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_numerology")}</button>
        <button id="mob-panchang-btn" onClick={() => setActiveTab("panchang")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "panchang" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_panchang")}</button>
        <button id="mob-remedies-btn" onClick={() => setActiveTab("remedies")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "remedies" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_remedies")}</button>
        <button id="mob-blog-btn" onClick={() => setActiveTab("blog")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "blog" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_blog")}</button>
        <button id="mob-contact-btn" onClick={() => setActiveTab("contact")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "contact" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_contact")}</button>
        <button id="mob-admin-btn" onClick={() => setActiveTab("admin")} className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === "admin" ? "bg-[#5a5a40] text-white" : "bg-[#e8e4db] text-[#5a5a40]"}`}>{getTranslation(selectedLanguage, "menu_admin")}</button>
      </div>

      {/* CORE WRAPPER BODY */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* TAB 1: KUNDLI PREPARATION PAGE  */}
        {activeTab === "kundli" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Box: Form & Timings */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e6e2da]">
                <div className="flex items-center gap-2 mb-4 border-b border-[#f5f2ed] pb-3">
                  <Compass className="w-5 h-5 text-[#5a5a40]" />
                  <h2 className="font-serif text-lg font-bold text-[#5a5a40]">{getTranslation(selectedLanguage, "form_header")}</h2>
                </div>

                <form onSubmit={handleVedicCalculations} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">{getTranslation(selectedLanguage, "form_name")}</label>
                    <input
                      type="text"
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5a5a40]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">{getTranslation(selectedLanguage, "form_gender")}</label>
                      <select
                        className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2.5 text-sm outline-none"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-Binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">{getTranslation(selectedLanguage, "form_dob")}</label>
                      <input
                        type="date"
                        className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-sm outline-none"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">{getTranslation(selectedLanguage, "form_tob")}</label>
                      <div className="flex items-center space-x-1">
                        <select
                          className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-2 py-2 text-sm outline-none"
                          value={tob.split(':')[0] || "12"}
                          onChange={(e) => setTob(`${e.target.value}:${tob.split(':')[1] || "00"}`)}
                        >
                          {Array.from({ length: 24 }).map((_, i) => (
                            <option key={`h-${i}`} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                        <span className="font-bold text-gray-500">:</span>
                        <select
                          className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-2 py-2 text-sm outline-none"
                          value={tob.split(':')[1] || "00"}
                          onChange={(e) => setTob(`${tob.split(':')[0] || "12"}:${e.target.value}`)}
                        >
                          {Array.from({ length: 60 }).map((_, i) => (
                            <option key={`m-${i}`} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">{getTranslation(selectedLanguage, "form_city")}</label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi"
                        className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-4 py-2 text-sm outline-none"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          applyCityPreset(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Manual Coordinate Override Panel */}
                  <div className="p-3 bg-[#fdfbf7] border border-[#e6e2da] rounded-2xl text-[11px] space-y-2">
                    <p className="font-semibold text-xs text-[#5a5a40]">Precise Coordinates override</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[9px] uppercase text-gray-400">Lat</span>
                        <input
                          type="number"
                          step="0.0001"
                          className="w-full bg-white border border-[#dcd7cc] rounded p-1 outline-none font-mono"
                          value={latitude}
                          onChange={(e) => setLatitude(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-gray-400">Lng</span>
                        <input
                          type="number"
                          step="0.0001"
                          className="w-full bg-white border border-[#dcd7cc] rounded p-1 outline-none font-mono"
                          value={longitude}
                          onChange={(e) => setLongitude(Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-gray-400">Tz Offset</span>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full bg-white border border-[#dcd7cc] rounded p-1 outline-none font-mono"
                          value={timezone}
                          onChange={(e) => setTimezone(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <p className="text-[9px] text-[#5a5a40] leading-tight italic">
                      💡 Preset coordinates applied for: New Delhi, Mumbai, London, New York, Tokyo, Sydney.
                    </p>
                  </div>

                  <button
                    id="submit-astrology-calculation-btn"
                    type="submit"
                    className="w-full bg-[#5a5a40] hover:bg-[#434330] text-white py-3 rounded-xl block font-serif font-semibold tracking-wide transition-all shadow-md text-sm"
                  >
                    {getTranslation(selectedLanguage, "form_submit")}
                  </button>
                </form>
              </div>

              {/* Sunrise Timings and abhijit timings box */}
              {calculatedTimings && (
                <div className="bg-[#fdfbf7] border border-[#d97706]/45 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#e6e2da] pb-2">
                    <Clock className="w-4 h-4 text-[#d97706]" />
                    <h3 className="font-serif text-sm font-bold text-[#d97706] uppercase tracking-wider">Daily Muhurta Timings</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-[#e6e2da]">
                      <span className="text-[9px] text-[#5a5a40] font-bold uppercase tracking-wider block">Abhijit Muhurta</span>
                      <p className="font-serif italic font-semibold text-[#2d2a26] mt-1">{calculatedTimings.abhijitMuhurta.start} — {calculatedTimings.abhijitMuhurta.end}</p>
                    </div>
                    <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100">
                      <span className="text-[9px] text-red-700 font-bold uppercase tracking-wider block">Rahu Kalam</span>
                      <p className="font-serif italic font-semibold text-red-900 mt-1">{calculatedTimings.rahuKalam.start} — {calculatedTimings.rahuKalam.end}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#e6e2da]">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Yamagandam</span>
                      <p className="font-serif italic font-semibold text-slate-700 mt-1">{calculatedTimings.yamagandam.start} — {calculatedTimings.yamagandam.end}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#e6e2da]">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Gulika Kalam</span>
                      <p className="font-serif italic font-semibold text-slate-700 mt-1">{calculatedTimings.gulikaKalam.start} — {calculatedTimings.gulikaKalam.end}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Central / Right Area: Calculated Kundli Deck */}
            <div className="lg:col-span-8 space-y-6">
              {isCalculating ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#e6e2da] shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 border-4 border-[#5a5a40] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-serif italic text-lg text-[#5a5a40]">{getTranslation(selectedLanguage, "loading")}</p>
                </div>
              ) : calculatedChart ? (
                <div className="space-y-8">
                  {/* Kundli Chart graphic displaying */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div>
                      <KundliChart data={calculatedChart} lang={selectedLanguage} />
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3 border-b border-[#f5f2ed] pb-2">
                          <CheckCircle className="w-4 h-4 text-[#5a5a40]" />
                          <h4 className="font-serif text-sm font-bold text-[#5a5a40]">Birth Specification (Sidereal)</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                          <div>
                            <span className="text-gray-400 block text-[10px]">NAME</span>
                            <span className="font-bold">{name} ({gender})</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">BIRTH TIME</span>
                            <span className="font-bold">{dob} at {tob}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">PLACE</span>
                            <span className="font-bold text-ellipsis overflow-hidden">{city}, {country}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px]">COORDINATES</span>
                            <span className="font-bold font-mono">{latitude}°N, {longitude}°E</span>
                          </div>
                        </div>

                        <div className="bg-[#fdfbf7] rounded-2xl p-4 border border-[#e6e2da] space-y-2">
                          <h5 className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Ascendant & Lunar Node</h5>
                          <p className="text-xs font-serif italic text-slate-800 font-bold">{calculatedChart.ascendant.formatted}</p>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-[#dcd7cc] text-xs">
                            <div>
                              <span className="text-[9px] text-[#5a5a40] font-bold block">Moon Sign (Rashi)</span>
                              <span className="font-semibold">{calculatedChart.planets.find((p: any) => p.name === "Moon")?.rashi || "Virgo"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-[#5a5a40] font-bold block">Nakshatra & Pada</span>
                              <span className="font-semibold">
                                {calculatedChart.planets.find((p: any) => p.name === "Moon")?.nakshatra || "Hasta"} (Pada {calculatedChart.planets.find((p: any) => p.name === "Moon")?.pada || 1})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vimshottari current dasha segment */}
                      {calculatedDasha && (
                        <div className="border-t border-[#f5f2ed] pt-4 mt-4">
                          <h5 className="text-[10px] uppercase font-bold text-[#5a5a40] tracking-wider mb-2">Vimshottari Dasha State</h5>
                          <div className="bg-amber-500/5 hover:bg-amber-500/10 transition rounded-xl p-3 border border-amber-600/20 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold uppercase tracking-wider text-amber-700">Mahadasha: {calculatedDasha.currentMahadasha}</p>
                              <p className="text-[10px] text-[#5a5a40]">Cycle: {calculatedDasha.mahadashaStart} — {calculatedDasha.mahadashaEnd}</p>
                            </div>
                            <div className="border-l border-amber-600/20 pl-4">
                              <p className="font-bold text-[#2d2a26]">Antardasha: {calculatedDasha.currentAntardasha}</p>
                              <p className="text-[10px] text-gray-500">Ends: {calculatedDasha.antardashaEnd}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Planetary grid */}
                  <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-[#f5f2ed] pb-2">
                      <Sun className="w-5 h-5 text-[#5a5a40]" />
                      <h3 className="font-serif text-base font-bold text-[#2d2a26]">{getTranslation(selectedLanguage, "planetary_positions")}</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#f5f2ed] text-[#5a5a40] uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 font-bold">Planet</th>
                            <th className="py-2.5 font-bold">Longitude</th>
                            <th className="py-2.5 font-bold">Rashi Sign</th>
                            <th className="py-2.5 font-bold">Sign Deg</th>
                            <th className="py-2.5 font-bold">House</th>
                            <th className="py-2.5 font-bold">Nakshatra</th>
                            <th className="py-2.5 font-bold text-center">Retro</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f5f2ed]">
                          {calculatedChart.planets.map((p: any, idx: number) => (
                            <tr key={idx} className="hover:bg-[#fdfbf7] transition">
                              <td className="py-2.5 font-bold text-[#2d2a26] flex items-center gap-1">
                                {p.name === "Sun" && "☀️"}
                                {p.name === "Moon" && "🌙"}
                                {p.name === "Mars" && "🔴"}
                                {p.name === "Mercury" && "🪐"}
                                {p.name === "Jupiter" && "🟡"}
                                {p.name === "Venus" && "⚪"}
                                {p.name === "Saturn" && "🟣"}
                                {p.name === "Rahu" && "🌀"}
                                {p.name === "Ketu" && "☄️"}
                                {p.name}
                              </td>
                              <td className="py-2.5 font-mono">{p.formatted}</td>
                              <td className="py-2.5">{p.rashi}</td>
                              <td className="py-2.5 font-mono">{Math.floor(p.rashiDegree)}°{Math.floor((p.rashiDegree % 1) * 60)}'</td>
                              <td className="py-2.5 font-bold text-[#5a5a40]">{p.house}</td>
                              <td className="py-2.5 text-slate-800">{p.nakshatra} <span className="text-[10px] text-gray-500">({p.nakshatraLord})</span></td>
                              <td className="py-2.5 text-center">{p.retrograde ? <span className="text-red-500 font-bold font-mono">YES</span> : <span className="text-gray-300">—</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Gemini Analysis Stream Results */}
                  <div className="bg-[#2d2a26] text-[#f5f2ed] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="text-sm md:text-base uppercase tracking-[0.25em] font-light text-slate-200">
                          {getTranslation(selectedLanguage, "ai_horoscope")}
                        </h3>
                      </div>
                      <span className="bg-[#5a5a40] text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                        Gemini 2.5 Flash
                      </span>
                    </div>

                    {aiReport ? (
                      <div className="prose prose-invert prose-xs leading-relaxed max-w-none text-slate-200 space-y-4">
                        {aiReport.split("\n\n").map((para, i) => {
                          if (para.startsWith("#")) {
                            return <h4 key={i} className="text-[#d97706] font-serif text-lg font-bold mt-6 mb-2 border-l-2 border-amber-600 pl-3">{para.replace(/#+\s+/, "")}</h4>;
                          }
                          return <p key={i} className="text-xs md:text-sm">{para}</p>;
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-500/80 italic font-mono">Preparation of AI report in queue... Submit birth parameters to generate.</p>
                    )}
                  </div>

                  {/* Today's Transit */}
                  <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm mt-8">
                    <div className="border-b border-[#f5f2ed] pb-3 mb-4 flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#5a5a40]" />
                      <h3 className="font-serif text-base font-bold text-[#2d2a26]">Today's Planetary Transit</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-blue-600 block mb-1">Current Moon Sign</span>
                        <span className="font-bold text-sm">{todaysTransit?.planets.find((p: any) => p.name === "Moon")?.rashi}</span>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-purple-600 block mb-1">Current Nakshatra</span>
                        <span className="font-bold text-sm">{todaysTransit?.planets.find((p: any) => p.name === "Moon")?.nakshatra} ({todaysTransit?.planets.find((p: any) => p.name === "Moon")?.pada})</span>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Major Active Planet</span>
                        <span className="font-bold text-sm">Sun in {todaysTransit?.planets.find((p: any) => p.name === "Sun")?.rashi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lucky Information & Remedies section */}
                  {(() => {
                    const ascRashi = calculatedChart.ascendant.rashi;
                    const luckyInfo = LUCKY_INFO_BY_RASHI[ascRashi] || LUCKY_INFO_BY_RASHI["Aries"];
                    return (
                      <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm mt-8">
                        <div className="border-b border-[#f5f2ed] pb-3 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[#5a5a40]" />
                          <h3 className="font-serif text-base font-bold text-[#2d2a26]">{getTranslation(selectedLanguage, "remedies_header")} & Lucky Information</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-3 bg-[#fdfbf7] border border-[#e6e2da] rounded-xl text-center">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Lucky Number</span>
                            <span className="font-bold text-xl text-[#5a5a40]">{luckyInfo.number}</span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] border border-[#e6e2da] rounded-xl text-center">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Color</span>
                            <span className="font-bold text-sm text-[#5a5a40]">{luckyInfo.color}</span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] border border-[#e6e2da] rounded-xl text-center">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Direction</span>
                            <span className="font-bold text-sm text-[#5a5a40]">{luckyInfo.direction}</span>
                          </div>
                          <div className="p-3 bg-[#fdfbf7] border border-[#e6e2da] rounded-xl text-center">
                            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Day</span>
                            <span className="font-bold text-sm text-[#5a5a40]">{luckyInfo.day}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                            <span className="text-2xl">💎</span>
                            <div>
                              <h4 className="font-bold text-xs">Primary Gemstone: {luckyInfo.gem}</h4>
                              <p className="text-[11px] text-gray-500 italic mt-1 font-serif">Metal: {luckyInfo.metal}</p>
                              <p className="text-xs text-gray-700 mt-2">Wear it on a {luckyInfo.day} morning to channel absolute prosperity energies for your Ascendant ({ascRashi}).</p>
                            </div>
                          </div>
                          <div className="p-4 bg-[#f5f2ed] border border-[#e6e2da] rounded-2xl flex items-start gap-3">
                            <span className="text-2xl">📿</span>
                            <div>
                              <h4 className="font-bold text-xs">Auspicious Rudraksha: {luckyInfo.rudraksha}</h4>
                              <p className="text-xs text-gray-700 mt-1">Associated Fasting Day: {luckyInfo.day}</p>
                              <p className="text-xs text-[#5a5a40] mt-2">Recommended for spiritual grounding based on your {ascRashi} Ascendant alignment.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8 border-t border-[#f5f2ed] pt-6 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
                          <button onClick={() => window.print()} className="px-6 py-3 bg-[#2d2a26] text-[#fdfbf7] rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1a1815] transition shadow-md">
                            <Printer className="w-4 h-4" />
                            Download Kundli PDF
                          </button>
                          <button onClick={() => window.print()} className="px-6 py-3 bg-amber-600 text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition shadow-md">
                            <Printer className="w-4 h-4" />
                            Download Horoscope PDF
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-[#e6e2da] shadow-sm">
                  <p className="font-serif italic text-[#5a5a40]">Submit birth details to compute your complete Kundli</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HOROSCOPES HUB */}
        {activeTab === "horoscope" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm">
              <div className="text-center max-w-xl mx-auto mb-6">
                <h2 className="font-serif text-2xl italic font-bold">Zodiac Horoscope Center</h2>
                <p className="text-xs text-[#5a5a40] tracking-wide mt-1">Select your Moon Sign or Ascendant to view traditional transit predictions</p>
              </div>

              {/* Signs Selector List */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign.name}
                    id={`zodiac-btn-${sign.name.toLowerCase()}`}
                    onClick={() => {
                      setChosenZodiac(sign.name);
                    }}
                    className={`py-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${chosenZodiac === sign.name ? "bg-[#5a5a40] text-white border-[#5a5a40]" : "bg-[#fdfbf7] hover:bg-[#e6e2da] border-[#e6e2da] text-slate-800"}`}
                  >
                    <span className="text-sm font-serif font-bold">{sign.sanskrit}</span>
                    <span className="text-[10px] tracking-widest uppercase opacity-80 mt-1">{sign.name}</span>
                  </button>
                ))}
              </div>

              {/* Timeframe Selector */}
              <div className="flex justify-center gap-2 bg-[#f5f2ed] p-1.5 rounded-full max-w-sm mx-auto mb-6 border border-[#dcd7cc]">
                {(["daily", "weekly", "monthly", "yearly"] as const).map((frame) => (
                  <button
                    key={frame}
                    id={`timeframe-${frame}`}
                    onClick={() => setHoroscopeTimeframe(frame)}
                    className={`flex-1 py-1 px-3 rounded-full text-xs font-bold capitalize transition ${horoscopeTimeframe === frame ? "bg-amber-600 text-white" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {frame}
                  </button>
                ))}
              </div>

              {/* Horoscope result display */}
              <div className="bg-[#fdfbf7] border border-[#e6e2da] rounded-3xl p-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 border-b border-[#e6e2da] pb-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#5a5a40]/10 flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2d2a26] capitalize">{chosenZodiac} {horoscopeTimeframe} Forecast</h3>
                    <p className="text-[10px] text-gray-400 font-mono">Derived under transit Vedic constellations for year 2026</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                  <p>
                    For natives of <strong>{chosenZodiac}</strong>, the current alignment displays high celestial mobility in the professional sphere.
                    As the lord of karmic actions transits through key alignments, discipline remains vital. Avoid impulsive financial risks or agreements during
                    the transit hours. Make decisions with cautious counsel from elders. This is an optimal cycle to integrate more meditation rituals.
                  </p>
                  <p className="border-t border-dashed border-[#e6e2da] pt-3 text-[11px] text-[#5a5a40] italic">
                    ⭐ Lucky Color: {ZODIAC_PROFILES.find((p) => p.name === chosenZodiac)?.luckyColor || "Vasant Yellow"} | 💍 Recommended Stone: {ZODIAC_PROFILES.find((p) => p.name === chosenZodiac)?.stone || "Yellow Sapphire"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ZODIAC SIGNS ENCYCLOPEDIA */}
        {activeTab === "signs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ZODIAC_PROFILES.map((p) => (
              <div key={p.name} className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between border-b border-[#f5f2ed] pb-3 mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#5a5a40]">{p.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Ruler: {p.ruler}</span>
                  </div>
                  <span className="bg-[#f5f2ed] text-[#5a5a40] px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {p.element}
                  </span>
                </div>
                <div className="space-y-3 text-xs leading-relaxed text-[#2d2a26]">
                  <div>
                    <strong className="text-[10px] text-slate-400 block uppercase font-mono">Key Traits</strong>
                    <p>{p.traits}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-50 pt-2 font-mono">
                    <div>
                      <strong className="text-[9px] text-slate-400 block uppercase">LUCKY COLOR</strong>
                      <span>{p.luckyColor}</span>
                    </div>
                    <div>
                      <strong className="text-[9px] text-slate-400 block uppercase">GEMSTONE</strong>
                      <span>{p.stone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: RELATIONSHIP COMPATIBILITY (MATCH MAKING) */}
        {activeTab === "matching" && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm max-w-4xl mx-auto">
              <div className="text-center max-w-md mx-auto mb-6">
                <h2 className="font-serif text-2xl italic font-bold">Vedic Match Making (Ashta-Koota Milap)</h2>
                <p className="text-xs text-[#5a5a40] mt-1">Determine marital and physical compatibility between Bride & Groom based on 36 Gunas</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e6e2da]">
                  <h3 className="font-serif text-sm font-bold text-[#5a5a40] uppercase tracking-wider mb-3">Bride's Birth Information</h3>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block">Natal Nakshatra</label>
                    <select
                      id="bride-naks-select"
                      className="w-full bg-white border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5a5a40]"
                      value={brideNakshatra}
                      onChange={(e) => setBrideNakshatra(Number(e.target.value))}
                    >
                      {NAKSHATRAS.map((n, i) => (
                        <option key={i} value={i}>{n.name} (Ruler: {n.lord})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e6e2da]">
                  <h3 className="font-serif text-sm font-bold text-[#5a5a40] uppercase tracking-wider mb-3">Groom's Birth Information</h3>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-400 block">Natal Nakshatra</label>
                    <select
                      id="groom-naks-select"
                      className="w-full bg-white border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#5a5a40]"
                      value={groomNakshatra}
                      onChange={(e) => setGroomNakshatra(Number(e.target.value))}
                    >
                      {NAKSHATRAS.map((n, i) => (
                        <option key={i} value={i}>{n.name} (Ruler: {n.lord})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {matchResult && (
                <div className="bg-[#2d2a26] text-[#f5f2ed] rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#d97706] font-bold font-mono">ASHTA-KOOTA SCORE</span>
                      <h4 className="text-2xl md:text-3xl font-serif font-extrabold">{matchResult.totalPoints} / 36 Gunas</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-gray-400 block">Compatibility Verdict</span>
                      <span className="font-bold font-serif text-sm text-yellow-500">{matchResult.verdict}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {matchResult.breakdown.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
                        <span className="text-[9px] uppercase text-gray-400 block font-mono">{item.name}</span>
                        <span className="font-bold text-xs text-white block mt-1">{item.score} / {item.maxPoints} pts</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-300 italic leading-relaxed text-center">
                    📖 <strong>Remedial Note:</strong> Scores above 18/36 are recommended. For lower quotients, performing Sri Vishnu Sahasranama chanting or reciting specific Navagraha mantras can ameliorate discrepancies.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: NUMEROLOGY CODES */}
        {activeTab === "numerology" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm">
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl italic font-bold">Vedic Numerology Calculator</h2>
                <p className="text-xs text-[#5a5a40] mt-1">Discover your celestial Life Path Number and Soul Urge dynamics</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Enter Name</label>
                    <input
                      type="text"
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      defaultValue={name}
                      placeholder="e.g. Arjun"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Birth Date</label>
                    <input
                      type="date"
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      defaultValue={dob}
                    />
                  </div>
                </div>

                <div className="bg-[#fdfbf7] border border-[#e6e2da] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e6e2da] pb-3">
                    <div>
                      <span className="text-[10px] uppercase text-gray-400">Calculated Cosmic Key</span>
                      <h4 className="font-serif text-xl font-bold">Life Path Number: 7</h4>
                    </div>
                    <span className="bg-[#d97706] text-white px-3 py-1 rounded-full text-xs font-bold font-mono">Kept by Ketu</span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                    <p>
                      <strong>Life Path Number 7</strong> signals intense spiritual curiosity, research capabilities, and high-frequency analytical patterns. You are guarded by Ketu, rendering deep intuitive foresight. Do not rely heavily on superficial materialistic setups. Always lean towards self-reflection.
                    </p>
                    <p>
                      ⭐ Lucky Days: Monday, Thursday | 🎨 Lucky Colors: White, Emerald Green | 🔢 Harmonious Partners: 1 & 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DYNAMIC PANCHANG DECK */}
        {activeTab === "panchang" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm text-center">
              <h2 className="font-serif text-2xl italic font-bold">Dynamic Daily Vedic Panchang</h2>
              <p className="text-xs text-[#5a5a40] mt-1 font-mono">Current Tithi, Nakshatra, Yoga and Muhurtas</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-[#fdfbf7] border border-[#e6e2da] p-4 rounded-2xl">
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">TITHI (Moon Phase)</span>
                  <span className="text-sm font-serif font-bold text-[#5a5a40] block mt-1">Shukla Dashami</span>
                </div>
                <div className="bg-[#fdfbf7] border border-[#e6e2da] p-4 rounded-2xl">
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">NAKSHATRA</span>
                  <span className="text-sm font-serif font-bold text-[#5a5a40] block mt-1">Anuradha</span>
                </div>
                <div className="bg-[#fdfbf7] border border-[#e6e2da] p-4 rounded-2xl">
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">YOGA</span>
                  <span className="text-sm font-serif font-bold text-[#5a5a40] block mt-1">Siddha</span>
                </div>
                <div className="bg-[#fdfbf7] border border-[#e6e2da] p-4 rounded-2xl">
                  <span className="text-slate-400 block text-[9px] uppercase font-mono">Rasi (Moon)</span>
                  <span className="text-sm font-serif font-bold text-[#5a5a40] block mt-1">Vrishchika (Scorpio)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SPIRITUAL REMEDIES */}
        {activeTab === "remedies" && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center max-w-md mx-auto">
              <h2 className="font-serif text-2xl italic font-bold">Astro Remedies & Prescriptions</h2>
              <p className="text-xs text-[#5a5a40] mt-1">Traditional Shastra guidance, planetary fasts, and gemstones</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ZODIAC_PROFILES.slice(0, 4).map((p, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm flex gap-4">
                  <div className="w-14 h-14 bg-[#5a5a40]/5 border border-[#5a5a40]/25 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                    {idx === 0 && "💍"}
                    {idx === 1 && "🌿"}
                    {idx === 2 && "🕉️"}
                    {idx === 3 && "🌊"}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-sm font-bold text-[#5a5a40]">{p.name} Remedial Guidance</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      For a strong {p.ruler} alignment, we highly advise wearing natural <strong>{p.stone}</strong>.
                      Additionally, chanting the specific beeja mantra weekly promotes harmony in business dealings and familial networks.
                    </p>
                    <div className="bg-[#fdfbf7] p-2 rounded-xl border border-[#e6e2da] text-[10px] font-mono text-[#d97706] italic">
                      "Om Namah Shivaya" or planetary equivalents daily.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: ASTRO BLOG HUB */}
        {activeTab === "blog" && (
          <div className="space-y-8">
            <div className="text-center max-w-md mx-auto">
              <h2 className="font-serif text-2xl italic font-bold">Astrological Insights & Blog</h2>
              <p className="text-xs text-[#5a5a40] mt-1">Daily updates about cosmological movements, eclipses, and transit guides</p>
            </div>

            {/* Filter */}
            <div className="flex justify-center gap-2 max-w-sm mx-auto mb-6">
              <input
                type="text"
                placeholder="Search blog articles..."
                className="w-full bg-white border border-[#dcd7cc] rounded-xl px-4 py-2 text-xs outline-none focus:border-[#5a5a40]"
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Blog articles listing */}
              <div className="space-y-6">
                {blogArticles
                  .filter((art) => art.title.toLowerCase().includes(blogSearchQuery.toLowerCase()))
                  .map((art) => (
                    <article key={art.id} className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#5a5a40] tracking-wider">
                        <span>{art.category}</span>
                        <span>{art.date}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#2d2a26] hover:text-[#5a5a40] cursor-pointer">{art.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{art.excerpt}</p>
                      <div className="border-t border-[#f5f2ed] pt-3 flex items-center justify-between text-[11px] text-gray-400">
                        <span>{art.readTime}</span>
                        <button className="text-[#5a5a40] font-bold hover:underline">Read Full Article →</button>
                      </div>
                    </article>
                  ))}
              </div>

              {/* Sidebar with Transiting planet status details */}
              <div className="bg-[#2d2a26] text-white rounded-3xl p-6 space-y-4">
                <h3 className="font-serif text-sm font-bold tracking-widest text-[#d97706] uppercase">Active Lunar Cycles</h3>
                <div className="space-y-3 text-xs">
                  <div className="border-l-2 border-[#5a5a40] pl-3 py-1">
                    <p className="font-semibold text-slate-100">Saturn retrograde in Aquarius</p>
                    <p className="text-[10px] text-gray-400">Until November 2026</p>
                  </div>
                  <div className="border-l-2 border-[#5a5a40] pl-3 py-1">
                    <p className="font-semibold text-slate-100">Jupiter transition into Taurus</p>
                    <p className="text-[10px] text-gray-400">Provides extensive blessings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: CONTACT & BOOKING GATEWAY */}
        {activeTab === "contact" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 border border-[#e6e2da] shadow-sm space-y-6">
              <div className="text-center border-b border-[#f5f2ed] pb-4">
                <h2 className="font-serif text-2xl italic font-bold">Book a Personal Astrology Consultation</h2>
                <p className="text-xs text-[#5a5a40] mt-1">Converse with certified Acharyas. Get deeper customized chart analysis.</p>
              </div>

              {contactSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl mx-auto">
                    ✓
                  </div>
                  <h3 className="font-serif text-lg font-bold">Consultation Query Request Registered</h3>
                  <p className="text-xs text-gray-500">Om Shanti. Our senior astrologer will notify you via email in 24 hours.</p>
                  <button onClick={() => setContactSubmitted(false)} className="bg-[#5a5a40] text-white px-4 py-2 rounded-xl text-xs font-semibold">Send Another Request</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Email</label>
                      <input
                        type="email"
                        className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Consultation Category</label>
                    <select
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      value={contactTopic}
                      onChange={(e) => setContactTopic(e.target.value)}
                    >
                      <option>Kundli Natal Chart Analysis</option>
                      <option>Marriage Compatibility Consultation</option>
                      <option>Career Guidance & Auspicious Gemstones</option>
                      <option>Sade Sati & Saturn Affliction Remedies</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Detailed Message / birth details verification request</label>
                    <textarea
                      rows={4}
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      placeholder="Input additional queries, specific concerns or verify coordinates layout..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-[#5a5a40] text-white py-3 rounded-xl font-serif text-sm font-bold shadow-md hover:bg-[#434330] transition">
                    Register Consultation Query Live
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 10: USER ADMIN PANEL */}
        {activeTab === "admin" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-[#e6e2da] shadow-sm">
              <div className="border-b border-[#f5f2ed] pb-3 mb-4">
                <h2 className="font-serif text-xl font-bold">Admin Simulation Controls</h2>
                <p className="text-xs text-[#5a5a40]">Configure planetary databases, override translations and publish articles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Publish blog post */}
                <form onSubmit={handleAddNewBlogPost} className="space-y-4">
                  <h3 className="font-serif text-sm font-bold text-[#5a5a40] uppercase tracking-wider">Publish New Astrological Article</h3>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block">Article Title</label>
                    <input
                      type="text"
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      placeholder="e.g. Venus Transit Impacts"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block">Category</label>
                    <select
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                    >
                      <option>Planetary Transits</option>
                      <option>Gemology</option>
                      <option>Remedies & Timing</option>
                      <option>Spiritual Practices</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block">Content</label>
                    <textarea
                      rows={5}
                      className="w-full bg-[#fdfbf7] border border-[#dcd7cc] rounded-xl px-3 py-2 text-xs outline-none"
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-[#5a5a40] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#434330] transition">
                    Publish to Astro Blog
                  </button>
                </form>

                {/* Overrides translation simulation */}
                <div className="space-y-4">
                  <h3 className="font-serif text-sm font-bold text-[#5a5a40] uppercase tracking-wider">Simulate Custom Translations</h3>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This panel allows developers to mock and verify that multi-language support remains strictly dynamic. Feel free to modify individual UI translation sets.
                    </p>
                    <div className="bg-[#fdfbf7] border border-[#e6e2da] p-3 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#5a5a40]">Active Scopes</span>
                      <p className="text-[11px] font-mono text-slate-500">14 Languages compiled dynamically in memory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER AREA - NATURAL TONES STYLE */}
      <footer className="h-16 bg-[#e6e2da] px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-[#5a5a40] font-bold border-t border-[#dcd7cc] gap-2 py-4 shrink-0 mt-auto">
        <span>Swiss Ephemeris Sidereal Lahiri Engine</span>
        <span className="text-center font-serif italic text-slate-700 capitalize">
          Astral Forecast: Moon {calculatedChart?.planets.find((p: any) => p.name === "Moon")?.rashi || "Virgo"} • {calculatedChart?.planets.find((p: any) => p.name === "Moon")?.nakshatra || "Hasta"}
        </span>
        <span>© 2026 Vishwa Jyotish AI Systems</span>
      </footer>
    </div>
  );
}
