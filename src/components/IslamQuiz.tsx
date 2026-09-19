import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWizard } from "@/store/wizardStore";

interface QuizQuestion {
  id: string;
  question_ru: string;
  question_en: string;
  options_ru: Record<string, string>;
  options_en: Record<string, string>;
  correct: string;
  correct_en: string;
  source: string;
  source_en: string;
}

interface QuizState {
  currentIndex: number;
  score: number;
  answers: Record<string, string>;
  showResult: boolean;
  showExplanation: boolean;
  selectedAnswer: string | null;
}

export default function IslamQuiz() {
  const { t } = useTranslation();
  const lang = useWizard((s) => s.lang);
  const setLang = useWizard((s) => s.setLang);
  
  const [quizState, setQuizState] = useState<QuizState>({
    currentIndex: 0,
    score: 0,
    answers: {},
    showResult: false,
    showExplanation: false,
    selectedAnswer: null,
  });
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/islam_quiz_questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const currentQuestion = questions[quizState.currentIndex];
  const isLastQuestion = quizState.currentIndex >= questions.length - 1;

  const handleAnswer = (answerKey: string) => {
    if (quizState.showResult) return;
    
    const correct = lang === 'ru' ? currentQuestion.correct : currentQuestion.correct_en;
    const isCorrect = answerKey === correct;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerKey,
      showResult: true,
      showExplanation: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      answers: { ...prev.answers, [currentQuestion.id]: answerKey },
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizState(prev => ({ ...prev, showExplanation: false }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showResult: false,
        showExplanation: false,
        selectedAnswer: null,
      }));
    }
  };

  const handleRestart = () => {
    setQuizState({
      currentIndex: 0,
      score: 0,
      answers: {},
      showResult: false,
      showExplanation: false,
      selectedAnswer: null,
    });
  };

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang as "en" | "ru" | "az");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">{t('app.start') || 'Loading quiz...'}</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const questionText = lang === 'ru' ? currentQuestion.question_ru : currentQuestion.question_en;
  const options = lang === 'ru' ? currentQuestion.options_ru : currentQuestion.options_en;
  const optionKeys = Object.keys(options).sort();
  
  const correctKey = lang === 'ru' ? currentQuestion.correct : currentQuestion.correct_en;
  const sourceText = lang === 'ru' ? currentQuestion.source : currentQuestion.source_en;

  const progress = ((quizState.currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(251,191,36,0.07) 0%, transparent 60%), radial-gradient(50% 40% at 80% 100%, rgba(147,51,234,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                lang === 'en' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('ru')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                lang === 'ru' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => handleLanguageChange('az')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                lang === 'az' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              AZ
            </button>
          </div>
          
          <div className="flex-1 text-center">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              {lang === 'ru' ? 'Кто хочет стать мусульманином?' : 'Who Wants to Become a Muslim?'}
            </h1>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-slate-400">
              {quizState.showExplanation && isLastQuestion ? (
                <>
                  {t('app.finish') || 'Finish'} — {quizState.score}/{questions.length}
                </>
              ) : (
                <>
                  {quizState.currentIndex + 1} / {questions.length}
                </>
              )}
            </p>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right mt-1">{Math.round(progress)}% complete</p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quizState.currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
          >
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-6 md:p-8 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-6 leading-relaxed">
                {questionText}
              </h2>

              <div className="flex flex-col gap-3">
                {optionKeys.map((key) => {
                  const isSelected = quizState.selectedAnswer === key;
                  const isCorrect = key === correctKey;
                  const showCorrect = quizState.showResult && isCorrect;
                  const showIncorrect = quizState.showResult && isSelected && !isCorrect;
                  
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => handleAnswer(key)}
                      disabled={quizState.showResult}
                      whileHover={!quizState.showResult ? { scale: 1.015, x: 4 } : undefined}
                      whileTap={!quizState.showResult ? { scale: 0.985 } : undefined}
                      className={`group text-left rounded-xl border px-5 py-4 transition-colors cursor-pointer flex items-center gap-3 ${
                        quizState.showResult
                          ? showCorrect
                            ? "border-emerald-400 bg-emerald-400/10"
                            : showIncorrect
                            ? "border-red-400 bg-red-400/10"
                            : "border-slate-700/50 bg-slate-900/40 opacity-60"
                          : "border-slate-700/70 bg-slate-900/60 hover:border-amber-400/60 hover:bg-slate-800/70"
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors font-bold text-base ${
                        quizState.showResult
                          ? showCorrect
                            ? "border-emerald-400 bg-emerald-400 text-slate-950"
                            : showIncorrect
                            ? "border-red-400 bg-red-400 text-slate-950"
                            : isCorrect
                            ? "border-emerald-400 bg-emerald-400/10 text-emerald-400"
                            : "border-slate-600 text-slate-400"
                          : "border-slate-600 text-slate-300 hover:border-amber-400/60"
                      }`}>
                        {key}
                        {quizState.showResult && isCorrect && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                        {quizState.showResult && showIncorrect && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        )}
                      </span>
                      <span className="flex-1 text-base text-slate-100 group-hover:text-amber-200 transition-colors">
                        {options[key]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Explanation / Source */}
            {quizState.showExplanation && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-5 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                    <div className="flex-1 text-sm text-slate-300">
                      <p className="font-medium text-amber-300 mb-1">
                        {lang === 'ru' ? 'Правильный ответ:' : 'Correct answer:'} {options[correctKey]}
                      </p>
                      {sourceText && (
                        <p className="text-slate-500 text-xs">
                          <span className="font-medium text-slate-400">
                            {lang === 'ru' ? 'Источник:' : 'Source:'}
                          </span> {sourceText}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (quizState.currentIndex > 0) {
                    setQuizState(prev => ({
                      ...prev,
                      currentIndex: prev.currentIndex - 1,
                      showResult: false,
                      showExplanation: false,
                      selectedAnswer: null,
                    }));
                  }
                }}
                disabled={quizState.currentIndex === 0}
                className="rounded-xl border border-slate-700 px-4 sm:px-5 py-2.5 text-sm text-slate-300 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ← {t("app.back") || "Back"}
              </button>

              {quizState.showExplanation && isLastQuestion ? (
                <motion.button
                  type="button"
                  onClick={handleRestart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
                >
                  {t("app.restart") || "Play Again"} — {quizState.score}/{questions.length}
                </motion.button>
              ) : quizState.showExplanation ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
                >
                  {t("app.continue") || "Next Question"} →
                </motion.button>
              ) : (
                <div className="text-sm text-slate-500">
                  {lang === 'ru' ? 'Выберите ответ' : 'Select an answer'}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Final Score Screen */}
        {quizState.showExplanation && isLastQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-400/50 bg-amber-400/10 p-8 text-center mt-8"
          >
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent mb-4">
              {lang === 'ru' ? 'Викторина завершена!' : 'Quiz Complete!'}
            </h2>
            <div className="text-6xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
              {quizState.score} / {questions.length}
            </div>
            <p className="text-slate-300 text-lg mb-6">
              {lang === 'ru' 
                ? `Вы ответили правильно на ${quizState.score} из ${questions.length} вопросов.`
                : `You answered ${quizState.score} out of ${questions.length} questions correctly.`
              }
            </p>
            <p className="text-slate-400 text-sm mb-6">
              {lang === 'ru'
                ? 'Источники: Сахих аль-Бухари, Сахих Муслим, Табари, Ибн Кудама, Сунан Абу Дауд, Тфсир Ибн Касир'
                : 'Sources: Sahih al-Bukhari, Sahih Muslim, Tabari, Ibn Qudamah, Sunan Abu Dawud, Tafsir Ibn Kathir'
              }
            </p>
            <motion.button
              type="button"
              onClick={handleRestart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-3 font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              {t("app.restart") || "Play Again"}
            </motion.button>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-600 mt-10">
          <p>{t("app.footer") || "Built with philosophical rigor, not dogma."}</p>
          <div className="mt-1">
            <a href="mailto:ij@klaud.uk" className="text-amber-500/80 hover:text-amber-400 transition-colors">
              ij@klaud.uk
            </a>
          </div>
          <div className="mt-1 text-slate-500">
            Copyright 2026 © www.klaud.uk
          </div>
        </footer>
      </div>
    </div>
  );
}