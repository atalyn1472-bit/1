"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Settings, PenLine, Clock, CalendarDays, User, BookOpen, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeDiaryAction } from "@/app/actions/analyze";
import { saveDiaryAction } from "@/app/actions/save";

type Emotion = "melancholy" | "neutral" | "peaceful" | "joyful" | "inspired";

interface EmotionData {
  id: Emotion;
  emoji: string;
  color: string;
}

const emotions: EmotionData[] = [
  { id: "melancholy", emoji: "😔", color: "text-blue-500" },
  { id: "neutral", emoji: "😐", color: "text-gray-500" },
  { id: "peaceful", emoji: "😌", color: "text-violet-600" },
  { id: "joyful", emoji: "😊", color: "text-orange-500" },
  { id: "inspired", emoji: "🤩", color: "text-amber-500" },
];

const translations = {
  ko: {
    saveSuccess: "구글 시트에 일기가 성공적으로 저장되었습니다!",
    saveError: "해당 기능을 사용하려면 구글 앱스 스크립트 웹앱 주소가 환경 변수에 설정되어야 합니다.",
    analyzeError: "분석 중 문제가 발생했습니다. API 키가 정확한지 확인해주세요!",
    appTitle: "The Living Journal",
    navJournal: "일기장",
    navReflections: "회고",
    navTimeline: "타임라인",
    eveningReflection: "오늘의 회고",
    placeholder: "여기에 일기를 작성해보세요... 오늘 하루는 어땠나요?",
    analyzing: "분석 중...",
    analyzeSentiment: "감정 분석하기",
    todaysResonance: "오늘의 감정 상태",
    geminiInsights: "Gemini의 통찰",
    startOver: "새로 작성하기",
    save: "저장",
    saving: "저장 중...",
    toggleLang: "EN",
    emotions: {
      melancholy: "우울함",
      neutral: "평온함",
      peaceful: "평화로움",
      joyful: "기쁨",
      inspired: "영감받음",
    }
  },
  en: {
    saveSuccess: "Diary successfully saved to Google Sheets!",
    saveError: "Google Apps Script Web App URL must be set in environment variables to use this feature.",
    analyzeError: "An error occurred during analysis. Please check your API key!",
    appTitle: "The Living Journal",
    navJournal: "Journal",
    navReflections: "Reflections",
    navTimeline: "Timeline",
    eveningReflection: "Evening Reflection",
    placeholder: "Begin your reflection here... What's on your mind tonight?",
    analyzing: "Analyzing entry...",
    analyzeSentiment: "Analyze Sentiment",
    todaysResonance: "Today's Emotional Resonance",
    geminiInsights: "Gemini Insights",
    startOver: "Start Over",
    save: "Save",
    saving: "Saving...",
    toggleLang: "KO",
    emotions: {
      melancholy: "MELANCHOLY",
      neutral: "NEUTRAL",
      peaceful: "PEACEFUL",
      joyful: "JOYFUL",
      inspired: "INSPIRED",
    }
  }
};

export default function DiaryPage() {
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [diaryText, setDiaryText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSentiment, setAnalyzedSentiment] = useState<Emotion | null>(null);
  const [analysisReport, setAnalysisReport] = useState<{ title: string, insights: string[], tags: string[] } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const t = translations[lang];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveDiaryAction(diaryText);
      alert(t.saveSuccess);
      setDiaryText("");
      setAnalyzedSentiment(null);
      setAnalysisReport(null);
    } catch (error) {
      alert(t.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!diaryText.trim()) return;
    
    setIsAnalyzing(true);
    setAnalyzedSentiment(null);
    setAnalysisReport(null);

    try {
      const data = await analyzeDiaryAction(diaryText, lang);
      setAnalyzedSentiment(data.sentiment as Emotion);
      setAnalysisReport({ title: data.title, insights: data.insights, tags: data.tags });
    } catch (error) {
      console.error(error);
      alert(t.analyzeError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === "ko" ? "en" : "ko");
  };

  const currentDate = new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FDFBFF] text-slate-800 font-sans selection:bg-violet-200">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-violet-100/50 bg-white/50 backdrop-blur-md sticky top-0 z-10 w-full">
        <h1 className="text-xl font-bold bg-gradient-to-r from-violet-900 to-indigo-800 bg-clip-text text-transparent">
          {t.appTitle}
        </h1>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
          <a href="#" className="flex items-center gap-2 text-violet-700 border-b-2 border-violet-700 pb-1">
            <PenLine className="w-4 h-4" /> {t.navJournal}
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-slate-800 transition-colors pb-1">
            <BookOpen className="w-4 h-4" /> {t.navReflections}
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-slate-800 transition-colors pb-1">
            <Clock className="w-4 h-4" /> {t.navTimeline}
          </a>
        </nav>
        <div className="flex items-center space-x-4 text-slate-400">
          <button onClick={toggleLanguage} className="flex items-center gap-1 hover:text-slate-700 transition font-semibold text-sm mr-2 border border-slate-200 px-2.5 py-1 rounded-full bg-slate-50">
            <Globe className="w-4 h-4" /> {t.toggleLang}
          </button>
          <button className="hover:text-slate-700 transition">
            <CalendarDays className="w-5 h-5" />
          </button>
          <button className="hover:text-slate-700 transition">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-12 px-6 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center mb-10 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">{currentDate}</p>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t.eveningReflection}</h2>
        </div>

        {/* Diary Input Area */}
        <div className="w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-100/40 to-fuchsia-50/20 rounded-[2.5rem] transform translate-y-2 translate-x-1 -z-10 blur-xl transition-all duration-500 opacity-60 group-hover:opacity-100"></div>
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-violet-50/50 p-8 pb-20 relative transition-shadow duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
            <textarea
              className="w-full h-64 resize-none bg-transparent outline-none text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 placeholder:font-light"
              placeholder={t.placeholder}
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              disabled={isAnalyzing}
            />
            
            {/* Action Button positioned inside the card bottom */}
            <div className="absolute left-0 right-0 -bottom-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!diaryText.trim() || isAnalyzing}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white shadow-lg transition-all duration-300",
                  diaryText.trim()
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-105 hover:shadow-violet-200"
                    : "bg-slate-300 cursor-not-allowed",
                  isAnalyzing && "animate-pulse cursor-wait"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {t.analyzeSentiment}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Emotions Section */}
        <div className="mt-20 flex flex-col items-center">
          <AnimatePresence>
            {analysisReport?.title && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-8 text-center"
              >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  "{analysisReport.title}"
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
          <h3 className="text-sm font-medium text-slate-500 mb-6">{t.todaysResonance}</h3>
          <div className="flex items-center space-x-2 md:space-x-8 bg-violet-50/50 px-8 py-4 rounded-full border border-violet-100/50 backdrop-blur-sm shadow-inner">
            {emotions.map((emotion) => {
              const isSelected = analyzedSentiment === emotion.id;
              const isDimmed = analyzedSentiment !== null && !isSelected;

              return (
                <div key={emotion.id} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.4 : isDimmed ? 0.8 : 1,
                      opacity: isDimmed ? 0.4 : 1,
                      y: isSelected ? -8 : 0,
                    }}
                    className="cursor-pointer select-none text-4xl drop-shadow-sm transition-all duration-500 ease-out"
                  >
                    {emotion.emoji}
                  </motion.div>
                  <motion.span
                    animate={{
                      opacity: isSelected ? 1 : isDimmed ? 0.3 : 0.6,
                      scale: isSelected ? 1 : 0.9,
                    }}
                    className={cn(
                      "text-[0.65rem] font-bold tracking-widest mt-3 transition-colors duration-300",
                      isSelected ? emotion.color : "text-slate-400"
                    )}
                  >
                    {t.emotions[emotion.id as keyof typeof t.emotions]}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gemini Insights Section */}
        <AnimatePresence>
          {analyzedSentiment && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mt-16 w-full relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-200 to-fuchsia-200 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="bg-gradient-to-br from-violet-50 to-white rounded-3xl p-8 border border-violet-100 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-200">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{t.geminiInsights}</h3>
                </div>
                
                {analysisReport && (
                  <>
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                      {analysisReport.insights.map((insight, idx) => (
                        <p key={idx}>{insight}</p>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
                      {analysisReport.tags.map((tag, idx) => {
                        const colors = [
                          "bg-emerald-100 text-emerald-700",
                          "bg-lime-100 text-lime-700",
                          "bg-violet-100 text-violet-700",
                          "bg-amber-100 text-amber-700",
                          "bg-blue-100 text-blue-700"
                        ];
                        return (
                          <span key={idx} className={`px-3 py-1.5 rounded-full ${colors[idx % colors.length]}`}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-10 pt-6 border-t border-violet-100 flex items-center justify-end gap-4">
                      <button
                        onClick={() => {
                          setDiaryText("");
                          setAnalyzedSentiment(null);
                          setAnalysisReport(null);
                        }}
                        className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {t.startOver}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                          "px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-md shadow-violet-200 transition-opacity",
                          isSaving ? "bg-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"
                        )}
                      >
                        {isSaving ? t.saving : t.save}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
