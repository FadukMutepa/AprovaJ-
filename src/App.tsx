import { useState, useEffect, FormEvent } from "react";
import { 
  BookOpen, 
  Brain, 
  CheckCircle, 
  Download, 
  ArrowRight, 
  Menu, 
  X, 
  Star, 
  ChevronRight, 
  Award, 
  Users, 
  Clock, 
  PlayCircle, 
  Lock, 
  HelpCircle,
  FileText,
  Check,
  Send,
  AlertCircle
} from "lucide-react";
import { examQuestions, examPdfs, universityCourses, ExamQuestion } from "./data";

export default function App() {
  // Navigation & UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeTab, setActiveTab] = useState<"exames" | "simulados" | "resolucoes">("exames");

  // Mini-Quiz interactive state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // PDF Simulator state
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [downloadedPdfs, setDownloadedPdfs] = useState<string[]>([]);

  // Lead capture form state
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Subscription modal state
  const [selectedPlan, setSelectedPlan] = useState<"gratuito" | "premium" | null>(null);
  const [modalStep, setModalStep] = useState<"select" | "success">("select");
  const [subscribingEmail, setSubscribingEmail] = useState("");

  // Persisted user state from localStorage (client simulation)
  const [registeredUser, setRegisteredUser] = useState<{nome: string, email: string, curso: string} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("aprova_ja_user");
    if (saved) {
      try {
        setRegisteredUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "funcionalidades", "como-funciona", "planos", "contacto"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle PDF Simulation
  const handleDownloadPdf = (pdfId: string, pdfName: string) => {
    if (downloadingPdfId) return;
    setDownloadingPdfId(pdfId);
    setDownloadProgress(0);
    setShowDownloadSuccess(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingPdfId(null);
            setShowDownloadSuccess(true);
            setDownloadedPdfs((prevList) => [...prevList, pdfId]);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Mini-Quiz Actions
  const handleQuizAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optionIdx);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    setShowExplanation(true);
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setShowExplanation(false);
    setCurrentQuizIndex((prev) => (prev + 1) % examQuestions.length);
  };

  // Lead Form Submission
  const handleLeadSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nome.trim()) {
      setFormError("Por favor, introduz o teu nome completo.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Por favor, introduz um endereço de email válido.");
      return;
    }
    if (!curso) {
      setFormError("Por favor, seleciona o teu curso universitário de sonho.");
      return;
    }

    const userData = { nome, email, curso };
    localStorage.setItem("aprova_ja_user", JSON.stringify(userData));
    setRegisteredUser(userData);
    setFormSubmitted(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("aprova_ja_user");
    setRegisteredUser(null);
    setFormSubmitted(false);
    setNome("");
    setEmail("");
    setCurso("");
  };

  // Plan subscription simulation
  const handleSelectPlan = (plan: "gratuito" | "premium") => {
    setSelectedPlan(plan);
    setModalStep("select");
    // Pre-populate if already registered
    if (registeredUser) {
      setSubscribingEmail(registeredUser.email);
    } else {
      setSubscribingEmail("");
    }
  };

  const handleConfirmSubscription = (e: FormEvent) => {
    e.preventDefault();
    if (!subscribingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribingEmail)) {
      alert("Por favor, insere um email válido.");
      return;
    }
    setModalStep("success");
    // Automatically save or link to registered user
    if (!registeredUser) {
      const generatedUser = {
        nome: subscribingEmail.split("@")[0],
        email: subscribingEmail,
        curso: "Geral"
      };
      localStorage.setItem("aprova_ja_user", JSON.stringify(generatedUser));
      setRegisteredUser(generatedUser);
    }
  };

  const currentQuestion: ExamQuestion = examQuestions[currentQuizIndex];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 w-full bg-[#0B2545]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
              AprovaJá
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#funcionalidades" 
              className={`text-sm font-medium transition-colors ${activeSection === "funcionalidades" ? "text-emerald-400" : "text-slate-300 hover:text-white"}`}
            >
              Funcionalidades
            </a>
            <a 
              href="#como-funciona" 
              className={`text-sm font-medium transition-colors ${activeSection === "como-funciona" ? "text-emerald-400" : "text-slate-300 hover:text-white"}`}
            >
              Como Funciona
            </a>
            <a 
              href="#planos" 
              className={`text-sm font-medium transition-colors ${activeSection === "planos" ? "text-emerald-400" : "text-slate-300 hover:text-white"}`}
            >
              Planos
            </a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {registeredUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-3 py-1.5 rounded-full font-medium flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Estudante: {registeredUser.nome}</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <a 
                href="#contacto" 
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1"
              >
                <span>Começar Grátis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mobile Hamburguer button */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu container */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#07192F] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
            <a 
              href="#funcionalidades" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Funcionalidades
            </a>
            <a 
              href="#como-funciona" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Como Funciona
            </a>
            <a 
              href="#planos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Planos
            </a>
            
            <hr className="border-slate-800 my-2" />
            
            <div className="px-3 pt-2">
              {registeredUser ? (
                <div className="flex flex-col space-y-3">
                  <div className="text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3 py-2 rounded-lg font-medium flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Ligado como: {registeredUser.nome} ({registeredUser.curso})</span>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center bg-slate-800 text-slate-300 hover:text-white py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
                  >
                    Sair da Conta
                  </button>
                </div>
              ) : (
                <a 
                  href="#contacto" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full block text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-500/10"
                >
                  Começar Grátis
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="grow">
        
        {/* 1. HERO SECTION */}
        <section id="home" className="relative bg-[#0B2545] text-white overflow-hidden py-16 lg:py-24">
          
          {/* Subtle geometric background pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full bg-emerald-500 blur-3xl"></div>
            <div className="absolute -bottom-1/2 -right-1/4 w-full h-full rounded-full bg-blue-500 blur-3xl"></div>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Hero Left: Headlines & CTA */}
              <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
                
                {/* Micro Pill Badge */}
                <div className="inline-flex items-center self-center lg:self-start space-x-2 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400 tracking-wide uppercase shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>Preparação Premium Exclusiva 2026/2027</span>
                </div>

                {/* Main H1 Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                  A tua aprovação na universidade <span className="text-emerald-400 underline decoration-emerald-500/50 decoration-wavy">começa aqui</span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  Estuda exames anteriores, pratica com simulados e melhora a tua nota de forma simples e eficiente. Tudo construído sob medida para ti.
                </p>

                {/* Trust numbers */}
                <div className="grid grid-cols-3 gap-4 py-3 border-y border-slate-800 max-w-lg mx-auto lg:mx-0 text-slate-300 text-center lg:text-left">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">94.6%</p>
                    <p className="text-xs text-slate-400">Taxa de Sucesso</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">+12k</p>
                    <p className="text-xs text-slate-400">Estudantes Ativos</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">400+</p>
                    <p className="text-xs text-slate-400">Exames Resolvidos</p>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 pt-2">
                  <a 
                    href="#contacto" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-4 rounded-2xl text-base transition-all text-center shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 flex items-center justify-center space-x-2"
                  >
                    <span>Começar Grátis</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a 
                    href="#planos" 
                    className="bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 font-semibold px-8 py-4 rounded-2xl text-base transition-all text-center flex items-center justify-center space-x-2"
                  >
                    <span>Ver Planos</span>
                  </a>
                </div>
              </div>

              {/* Hero Right: Interactive App Simulator Device Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-5 relative">
                  
                  {/* Smartphone Top Notch bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 px-3 pb-3 border-b border-slate-800/80 mb-4">
                    <span className="font-mono text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">Simulado Interativo</span>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-400">Demonstração Live</span>
                    </div>
                  </div>

                  {/* Header widget in device */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-900/40">
                        {currentQuestion.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Questão {currentQuizIndex + 1} de {examQuestions.length}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {currentQuestion.university} ({currentQuestion.year})
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/50 min-h-[100px] mb-4">
                    <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                      {currentQuestion.questionText}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2 mb-4">
                    {currentQuestion.options.map((option, idx) => {
                      let btnStyle = "bg-slate-800/50 border-slate-700/60 text-slate-200 hover:bg-slate-800";
                      
                      if (selectedAnswer === idx) {
                        if (quizSubmitted) {
                          btnStyle = idx === currentQuestion.correctIndex 
                            ? "bg-emerald-900/40 border-emerald-500 text-emerald-200" 
                            : "bg-red-950/40 border-red-500 text-red-200";
                        } else {
                          btnStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20";
                        }
                      } else if (quizSubmitted && idx === currentQuestion.correctIndex) {
                        btnStyle = "bg-emerald-900/40 border-emerald-500 text-emerald-200";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer flex items-start space-x-2.5 ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                            selectedAnswer === idx ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-tight">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation/Feedback */}
                  {showExplanation && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4 animate-fadeIn max-h-[180px] overflow-y-auto custom-scrollbar">
                      <div className="flex items-center space-x-1.5 mb-2">
                        {selectedAnswer === currentQuestion.correctIndex ? (
                          <div className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
                            <CheckCircle className="w-4 h-4" />
                            <span>Parabéns! Resposta Correta</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-red-400 font-bold text-xs">
                            <X className="w-4 h-4" />
                            <span>Ops! Opção Incorreta</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs font-semibold text-slate-300 mb-1">Resolução Passo a Passo:</p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs leading-normal">
                        {currentQuestion.explanation.map((exp, i) => (
                          <li key={i}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Device Control Action Button */}
                  <div>
                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedAnswer === null}
                        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                          selectedAnswer !== null 
                            ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/10" 
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        <span>Confirmar Resposta</span>
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuiz}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <span>Próxima Questão</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. FUNCIONALIDADES SECTION */}
        <section id="funcionalidades" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-3">
                Prepara-te Inteligente
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                Tudo o que precisas para garantir a tua vaga
              </h3>
              <p className="text-base sm:text-lg text-slate-500 mt-4 leading-relaxed">
                Reunimos exames, testes inteligentes e explicações detalhadas em formato acessível para estudares de qualquer lugar.
              </p>
            </div>

            {/* Interactive Tabs trigger buttons */}
            <div className="flex justify-center mb-10">
              <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-1 sm:space-x-2 max-w-lg w-full">
                <button
                  onClick={() => setActiveTab("exames")}
                  className={`flex-1 text-center py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeTab === "exames" 
                      ? "bg-[#0B2545] text-white shadow" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Exames</span>
                </button>
                <button
                  onClick={() => setActiveTab("simulados")}
                  className={`flex-1 text-center py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeTab === "simulados" 
                      ? "bg-[#0B2545] text-white shadow" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Simulados</span>
                </button>
                <button
                  onClick={() => setActiveTab("resolucoes")}
                  className={`flex-1 text-center py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeTab === "resolucoes" 
                      ? "bg-[#0B2545] text-white shadow" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Resoluções</span>
                </button>
              </div>
            </div>

            {/* Feature Cards Grid (3 Columns) with highlight animation or selected tabs overlay */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1: Exames Anteriores */}
              <div 
                onClick={() => setActiveTab("exames")}
                className={`bg-slate-50 rounded-2xl p-8 border cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeTab === "exames" 
                    ? "border-emerald-500 ring-2 ring-emerald-500/10 -translate-y-1.5" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-6 font-bold text-xl">
                  📘
                </div>
                <h4 className="text-xl font-extrabold text-[#0B2545] mb-3">
                  Exames Anteriores
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Descarrega e estuda as provas oficiais de anos anteriores das maiores universidades de Portugal. Totalmente gratuito.
                </p>
                <div className="flex items-center text-xs font-bold text-emerald-600">
                  <span>Explorar Biblioteca PDF</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Card 2: Simulados Interativos */}
              <div 
                onClick={() => setActiveTab("simulados")}
                className={`bg-slate-50 rounded-2xl p-8 border cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeTab === "simulados" 
                    ? "border-emerald-500 ring-2 ring-emerald-500/10 -translate-y-1.5" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-6 font-bold text-xl">
                  🧠
                </div>
                <h4 className="text-xl font-extrabold text-[#0B2545] mb-3">
                  Simulados Interativos
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Cria questionários personalizados, controla o tempo limite e acompanha a tua evolução estatística em tempo real por disciplina.
                </p>
                <div className="flex items-center text-xs font-bold text-emerald-600">
                  <span>Praticar Online Agora</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Card 3: Resoluções Explicadas */}
              <div 
                onClick={() => setActiveTab("resolucoes")}
                className={`bg-slate-50 rounded-2xl p-8 border cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeTab === "resolucoes" 
                    ? "border-emerald-500 ring-2 ring-emerald-500/10 -translate-y-1.5" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-6 font-bold text-xl">
                  📝
                </div>
                <h4 className="text-xl font-extrabold text-[#0B2545] mb-3">
                  Resoluções Passo a Passo
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Chega de apenas ver a resposta correta. Entende a lógica com explicações passo a passo desenvolvidas por professores.
                </p>
                <div className="flex items-center text-xs font-bold text-emerald-600">
                  <span>Ver Exemplo de Resolução</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

            </div>

            {/* TAB INTERACTIVE PANELS DISPLAY */}
            <div className="mt-12 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8">
              
              {/* TAB 1: EXAMES LIBRARY SIMULATOR */}
              {activeTab === "exames" && (
                <div className="animate-fadeIn">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-[#0B2545]">Biblioteca de Exames Nacionais Recentes</h4>
                      <p className="text-xs sm:text-sm text-slate-500">Faz download gratuito do caderno de questões original.</p>
                    </div>
                    {showDownloadSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs text-emerald-800 flex items-center space-x-2 self-start lg:self-center">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Exame descarregado com sucesso para a tua pasta de descargas!</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {examPdfs.map((pdf) => {
                      const isDownloaded = downloadedPdfs.includes(pdf.id);
                      const isDownloading = downloadingPdfId === pdf.id;

                      return (
                        <div key={pdf.id} className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between shadow-sm">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">{pdf.university}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{pdf.size}</span>
                            </div>
                            <h5 className="font-bold text-sm text-[#0B2545]">{pdf.subject}</h5>
                            <p className="text-xs text-slate-400 mt-1">Exame Oficial de {pdf.year}</p>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{(pdf.downloads + (isDownloaded ? 1 : 0)).toLocaleString()} downloads</span>
                            
                            {isDownloading ? (
                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-500 h-full transition-all duration-150" style={{ width: `${downloadProgress}%` }}></div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDownloadPdf(pdf.id, pdf.subject)}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                  isDownloaded 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                }`}
                                title="Baixar PDF do Exame"
                              >
                                {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">
                      *Todos os PDFs acima contêm os exames reais com enunciados oficiais. As resoluções completas estão disponíveis no plano Premium.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: SIMULADOS INTERATIVOS PROMOTIONAL PANEL */}
              {activeTab === "simulados" && (
                <div className="animate-fadeIn flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/2">
                    <h4 className="text-lg font-bold text-[#0B2545] mb-2">Prepara o teu cérebro com perguntas cronometradas</h4>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                      O nosso motor de simulados cria sessões ajustadas para o teu tempo. Estuda focado em Matemática, Química ou Biologia, acumulando pontos de desempenho.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-600">
                        <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Mecanismo de cronómetro igual à prova real para controlo de ansiedade.</span>
                      </li>
                      <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-600">
                        <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Estatísticas detalhadas mostrando que matérias precisas de rever mais.</span>
                      </li>
                      <li className="flex items-start space-x-2 text-xs sm:text-sm text-slate-600">
                        <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Mais de 3.000 questões parametrizadas no banco de dados premium.</span>
                      </li>
                    </ul>
                    <a 
                      href="#home" 
                      className="inline-flex items-center space-x-1.5 bg-[#0B2545] hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all"
                    >
                      <span>Testar Simulador na Hero Section</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="lg:w-1/2 w-full bg-white rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-[#0B2545]">A tua Meta Semanal</span>
                      <span className="text-xs text-emerald-600 font-bold">75% Concluído</span>
                    </div>
                    <div className="space-y-3.5">
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Simulados Efetuados</span>
                          <span className="font-semibold text-slate-700">3 de 4 planeados</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[75%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Questões Respondidas</span>
                          <span className="font-semibold text-slate-700">60 de 80 planeados</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[75%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Tempo Estimado de Estudo</span>
                          <span className="font-semibold text-slate-700">3.5h de 5h</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[70%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RESOLUÇÕES COMPLETA PREVIEW */}
              {activeTab === "resolucoes" && (
                <div className="animate-fadeIn flex flex-col lg:flex-row items-center gap-8">
                  <div className="lg:w-1/2">
                    <h4 className="text-lg font-bold text-[#0B2545] mb-2">Aprende com o Erro de Forma Inteligente</h4>
                    <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                      Errar é parte do processo, mas só se compreenderes o porquê. No AprovaJá, cada exercício possui uma resolução redigida passo a passo por tutores experientes.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 space-y-2">
                      <p className="font-bold flex items-center space-x-1">
                        <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Metodologia "Explicação Linear"</span>
                      </p>
                      <p className="leading-relaxed">
                        Dividimos a resolução em 3 fases: Identificação do Conceito, Aplicação da Fórmula Base, e Resolução Algébrica Final. Isto garante fixação de conteúdo imediata sem decoreba.
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-1/2 w-full bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">Exemplo Prático</span>
                    <p className="text-xs font-bold text-slate-700">Exercício: "Calcule a derivada de f(x) = 3x² + 5x"</p>
                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1 font-mono border border-slate-100">
                      <p className="text-emerald-600 font-bold"># Passo 1: Aplicar a Regra de Potência para 3x²</p>
                      <p>f'(3x²) = 3 * (2 * x^(2-1)) = 6x</p>
                      <p className="text-emerald-600 font-bold mt-2"># Passo 2: Aplicar a Regra de Derivada para 5x</p>
                      <p>f'(5x) = 5 * 1 = 5</p>
                      <p className="text-emerald-600 font-bold mt-2"># Passo 3: Somar os resultados obtidos</p>
                      <p className="font-bold text-slate-700">f'(x) = 6x + 5</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* 3. COMO FUNCIONA SECTION */}
        <section id="como-funciona" className="py-20 bg-slate-100 relative">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-3">
                Fluxo Simples
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                Como Funciona a Plataforma?
              </h3>
              <p className="text-base sm:text-lg text-slate-500 mt-3">
                Garante o teu acesso e começa a treinar em menos de 2 minutos, sem complicações.
              </p>
            </div>

            {/* Connecting lines for desktop (absolute positioned vectors behind steps) */}
            <div className="hidden lg:block absolute top-[43%] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20 z-0"></div>

            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300 relative">
                  <span>1</span>
                  {/* Decorative tiny radar ring */}
                  <div className="absolute inset-0 rounded-2xl border border-emerald-500/0 group-hover:border-emerald-500/40 group-hover:scale-125 transition-all duration-300"></div>
                </div>
                <h4 className="text-lg font-bold text-[#0B2545] mt-6 mb-2">
                  Escolhe o exame e universidade
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  Acede a uma vasta seleção de exames nacionais oficiais de acordo com a tua instituição alvo de candidatura.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300 relative">
                  <span>2</span>
                  <div className="absolute inset-0 rounded-2xl border border-emerald-500/0 group-hover:border-emerald-500/40 group-hover:scale-125 transition-all duration-300"></div>
                </div>
                <h4 className="text-lg font-bold text-[#0B2545] mt-6 mb-2">
                  Estuda o conteúdo e pratica
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  Estuda ao teu ritmo. Analisa resoluções detalhadas para as questões em que tiveste maior dificuldade.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors duration-300 relative">
                  <span>3</span>
                  <div className="absolute inset-0 rounded-2xl border border-emerald-500/0 group-hover:border-emerald-500/40 group-hover:scale-125 transition-all duration-300"></div>
                </div>
                <h4 className="text-lg font-bold text-[#0B2545] mt-6 mb-2">
                  Faz simulados e melhora
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  Gera testes cronometrados para simular o dia oficial da prova e eleva a tua nota até ao nível de excelência.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. PLANOS SECTION */}
        <section id="planos" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-3">
                Investimento no teu Futuro
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                Planos Justos para Todos os Bolsos
              </h3>
              <p className="text-base sm:text-lg text-slate-500 mt-3">
                Começa gratuitamente e, quando estiveres pronto, desbloqueia o poder total do plano Premium.
              </p>
            </div>

            {/* Plans Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Plano Gratuito */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between relative shadow-sm">
                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200/60 px-3 py-1 rounded-full">
                      Plano Gratuito
                    </span>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-extrabold text-[#0B2545]">0€</span>
                      <span className="text-slate-400 text-sm ml-2">/ para sempre</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Excelente para conheceres a nossa biblioteca inicial.</p>
                  </div>

                  <hr className="border-slate-200 my-6" />

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Acesso a PDFs dos enunciados</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Simulados básicos</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>Fórum de dúvidas coletivo</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-400 line-through">
                      <Lock className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                      <span>Resoluções completas comentadas</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-400 line-through">
                      <Lock className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                      <span>Simulados ilimitados personalizados</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan("gratuito")}
                  className="w-full py-4 rounded-xl border border-slate-300 hover:border-[#0B2545] hover:bg-[#0B2545] hover:text-white text-[#0B2545] font-bold text-sm transition-all text-center cursor-pointer"
                >
                  Criar Conta Grátis
                </button>
              </div>

              {/* Plano Premium - DESTACADO VISUALMENTE */}
              <div className="bg-[#0B2545] rounded-3xl p-8 border-2 border-emerald-500 flex flex-col justify-between relative text-white shadow-xl shadow-[#0B2545]/20">
                
                {/* Popularity Badge */}
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow">
                  Mais Recomendado ⭐
                </div>

                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
                      Plano Premium
                    </span>
                    <div className="mt-5 flex items-baseline">
                      <span className="text-4xl font-extrabold text-white">9,90€</span>
                      <span className="text-slate-300 text-sm ml-2">/ mês</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-2">Garante a tua melhor nota de admissão sem limites.</p>
                  </div>

                  <hr className="border-slate-800 my-6" />

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3 text-sm text-slate-200">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-white">Resoluções completas e comentadas</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-200">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Simulados ilimitados personalizados</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-200">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Vídeos explicativos exclusivos</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-200">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Suporte prioritário via WhatsApp</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-200">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Garantia de satisfação de 7 dias</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan("premium")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-4 rounded-xl text-sm transition-all text-center shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-100 cursor-pointer"
                >
                  Assinar Agora
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* 5. FORMULÁRIO DE LEADS */}
        <section id="contacto" className="py-20 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-md relative overflow-hidden">
              
              {/* Background accent ring */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/5 pointer-events-none"></div>

              {/* Form Content */}
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
                    Inscreve-te para receber novidades
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Recebe alertas de datas de exames nacionais, simulados e materiais gratuitos de estudo diretamente no teu email.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center animate-fadeIn">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Inscrição Efetuada com Sucesso!</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                      Obrigado, <span className="font-semibold text-slate-900">{registeredUser?.nome}</span>. Enviámos um email de boas-vindas para <span className="font-semibold text-slate-900">{registeredUser?.email}</span> com a nossa primeira pasta de materiais gratuitos de estudo de <span className="font-semibold text-emerald-700">{registeredUser?.curso}</span>!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="bg-[#0B2545] hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Submeter Outro Email
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Limpar Dados Salvos
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-6">
                    {formError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="lead-name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Nome Completo
                        </label>
                        <input
                          id="lead-name"
                          type="text"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Ex: João Silva"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-sm transition-all outline-none text-slate-800"
                        />
                      </div>

                      <div>
                        <label htmlFor="lead-email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Endereço de Email
                        </label>
                        <input
                          id="lead-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ex: joao@email.com"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-sm transition-all outline-none text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lead-course" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Curso Desejado na Universidade
                      </label>
                      <select
                        id="lead-course"
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-sm transition-all outline-none text-slate-800 cursor-pointer"
                      >
                        <option value="">-- Seleciona o teu curso alvo --</option>
                        {universityCourses.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-4 rounded-xl text-sm transition-all text-center shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-100 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Quero Receber Atualizações</span>
                    </button>
                  </form>
                )}

                {/* Additional disclaimer text for GDPR / SPAM */}
                <p className="text-[11px] text-slate-400 text-center mt-5">
                  Prometemos não partilhar os teus dados e enviar apenas conteúdos úteis de preparação. Podes cancelar a inscrição a qualquer momento.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#07192F] text-slate-400 border-t border-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: App Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Award className="w-5 h-5 text-slate-950" />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  AprovaJá
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                A nossa missão é democratizar a preparação para os exames nacionais, fornecendo ferramentas modernas, explicativas e acessíveis para todos os estudantes portugueses.
              </p>
            </div>

            {/* Column 2: Quick links */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">Plataforma</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#funcionalidades" className="hover:text-emerald-400 transition-colors">Funcionalidades</a></li>
                <li><a href="#como-funciona" className="hover:text-emerald-400 transition-colors">Como Funciona</a></li>
                <li><a href="#planos" className="hover:text-emerald-400 transition-colors">Planos e Preços</a></li>
                <li><a href="#contacto" className="hover:text-emerald-400 transition-colors">Registo Grátis</a></li>
              </ul>
            </div>

            {/* Column 3: Legal & Social */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h5>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => alert("Simulação de Termos de Uso")} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Termos de Uso</button></li>
                <li><button onClick={() => alert("Simulação de Política de Privacidade")} className="hover:text-emerald-400 transition-colors text-left cursor-pointer">Política de Privacidade</button></li>
                <li className="flex space-x-3 pt-2 text-slate-300">
                  <span className="hover:text-emerald-400 transition-colors text-xs font-mono cursor-pointer">Instagram</span>
                  <span className="hover:text-emerald-400 transition-colors text-xs font-mono cursor-pointer">LinkedIn</span>
                  <span className="hover:text-emerald-400 transition-colors text-xs font-mono cursor-pointer">TikTok</span>
                </li>
              </ul>
            </div>

          </div>

          <hr className="border-slate-900 my-8" />

          {/* Educational Disclaimer */}
          <div className="text-center space-y-4">
            <p className="text-[11px] leading-relaxed max-w-2xl mx-auto text-slate-500">
              Aviso legal: O AprovaJá é uma plataforma independente de estudo e preparação desenvolvida para apoio académico. Não possui qualquer ligação oficial, patrocínio ou representação com o Ministério da Educação, IAVE, ou com qualquer outra instituição de ensino pública ou privada portuguesa.
            </p>
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} AprovaJá. Todos os direitos reservados.
            </p>
          </div>

        </div>
      </footer>

      {/* SUBSCRIPTION SIMULATION MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden relative">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {modalStep === "select" ? (
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-extrabold text-[#0B2545]">
                    Adere ao {selectedPlan === "premium" ? "Plano Premium" : "Plano Gratuito"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Preenche o teu email de acesso abaixo para ativares a tua conta.
                  </p>
                </div>

                <form onSubmit={handleConfirmSubscription} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Endereço de Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: joao@email.com"
                      value={subscribingEmail}
                      onChange={(e) => setSubscribingEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-800"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">Plano Selecionado:</span>
                      <span className="text-emerald-600 uppercase tracking-wide">{selectedPlan}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-sm pt-2 border-t border-slate-200">
                      <span>Total Hoje:</span>
                      <span>{selectedPlan === "premium" ? "9,90€" : "0,00€"}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition-all text-center shadow-lg shadow-emerald-500/10"
                  >
                    Confirmar Ativação
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Plano Ativado com Sucesso!</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Parabéns! O teu acesso ao <span className="font-semibold text-emerald-600 uppercase">{selectedPlan}</span> associado a <span className="font-semibold text-slate-800">{subscribingEmail}</span> está ativo e pronto a usar.
                </p>
                
                <button
                  onClick={() => {
                    setSelectedPlan(null);
                    // Scroll down to the features or form to keep exploring
                    document.getElementById("funcionalidades")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-[#0B2545] hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-all"
                >
                  Ir para Funcionalidades de Estudo
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
