import { useState, useEffect, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile' // <--- NEU
import { 
  EnvelopeSimple, Robot, Database, CalendarCheck, List, X, Clock, 
  ArrowRight, TrendUp, WarningCircle, CheckCircle, CurrencyEur, User, 
  Calculator, PhoneCall, Lightning, CircleNotch, ChatText 
} from '@phosphor-icons/react'
const WEBHOOK_URL = "https://n8n.convee.de/webhook/analyse-anfrage"
const TURNSTILE_SITE_KEY = "0x4AAAAAACMZYCHiONmr4bkm"
// --- Hook für Animationen beim Scrollen ---
function useOnScreen(options: any) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, options)
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [ref, options])
  return [ref, visible] as const
}

// --- Analyse Modal (Mit Turnstile & Rate Limit) ---
const AnalysisModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'success' | 'error' | 'blocked'>('form')
  const [formData, setFormData] = useState({ name: '', email: '', website: '', message: '' })
  const [captchaToken, setCaptchaToken] = useState<string | null>(null) // Speichert, ob User Mensch ist

  // Reset beim Öffnen
  useEffect(() => {
    if (isOpen) {
      // RATE LIMIT CHECK: Hat der User heute schon gesendet?
      const lastSent = localStorage.getItem('convee_last_sent')
      if (lastSent) {
        const hoursSince = (Date.now() - parseInt(lastSent)) / 1000 / 60 / 60
        if (hoursSince < 24) {
           setStep('blocked') // Zeige Block-Screen
           return
        }
      }
      setStep('form')
      setFormData({ name: '', email: '', website: '', message: '' })
      setCaptchaToken(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. CAPTCHA CHECK
    if (!captchaToken) {
      alert("Bitte bestätigen Sie, dass Sie ein Mensch sind.")
      return
    }

    setStep('loading')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          captchaToken: captchaToken, // Senden wir mit, falls wir es im Backend prüfen wollen
          source: 'landingpage_analyse_form',
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        // RATE LIMIT SETZEN: Speichere Zeitstempel
        localStorage.setItem('convee_last_sent', Date.now().toString())
        setStep('success')
      } else {
        throw new Error('Fehler beim Senden')
      }

    } catch (error) {
      console.error("Submission Error:", error)
      setStep('error')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0c0e12]/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-[#13161c] border border-white/10 w-full max-w-lg rounded-2xl relative z-10 shadow-2xl animate-slide-in overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-start bg-[#181b21]">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-500 mb-2">
              <Lightning weight="fill" size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Kostenlose Potenzial-Analyse</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Umsatz-Check anfordern</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-slate-400 text-sm mb-4">
                Erfahren Sie, wie viel Provision Sie verlieren. Wir senden Ihnen eine individuelle Auswertung.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>
                  <input required type="text" placeholder="Max Mustermann" className="w-full bg-[#0c0e12] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-700"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">E-Mail</label>
                  <input required type="email" placeholder="max@firma.de" className="w-full bg-[#0c0e12] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-700"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Website (Optional)</label>
                <input type="text" placeholder="www.ihre-immobilien.de" className="w-full bg-[#0c0e12] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-700"
                  value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end ml-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nachricht (Optional)</label>
                  <span className={`text-[10px] font-mono ${formData.message.length > 450 ? 'text-amber-500' : 'text-slate-600'}`}>{formData.message.length}/500</span>
                </div>
                <div className="relative">
                  <textarea rows={3} maxLength={500} placeholder="Haben Sie spezielle Anforderungen?" className="w-full bg-[#0c0e12] border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-700 resize-none"
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                  <ChatText className="absolute right-3 top-3 text-slate-700 pointer-events-none" size={16} />
                </div>
              </div>

              {/* CLOUDFLARE TURNSTILE WIDGET */}
              <div className="py-2">
                 <Turnstile 
                   siteKey={TURNSTILE_SITE_KEY} 
                   onSuccess={(token) => setCaptchaToken(token)}
                   options={{ theme: 'dark', size: 'flexible' }}
                 />
              </div>

              <button type="submit" disabled={!captchaToken} className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#0c0e12] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-amber-900/20 mt-2">
                Analyse jetzt kostenlos anfordern <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform"/>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600 mt-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>SSL-Verschlüsselte Übertragung</span>
              </div>
            </form>
          )}

          {step === 'blocked' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                <CheckCircle size={40} weight="fill" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Schon erledigt!</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Sie haben heute bereits eine Analyse angefordert. Wir bearbeiten Ihre Anfrage gerade.
                </p>
              </div>
              <button onClick={onClose} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm">
                Schließen
              </button>
            </div>
          )}

          {step === 'loading' && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                <CircleNotch size={64} className="text-amber-500 animate-spin relative z-10" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">Sicherheits-Check...</h4>
                <p className="text-slate-400 text-sm">Daten werden verschlüsselt übertragen.</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle size={40} weight="fill" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Anfrage erfolgreich!</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                  Vielen Dank, {formData.name}. Wir haben Ihre Anfrage erhalten.
                </p>
              </div>
              <button onClick={onClose} className="px-8 py-3 bg-[#1a1d24] hover:bg-[#252a33] border border-white/10 text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.02]">
                Schließen
              </button>
            </div>
          )}

          {step === 'error' && (
             <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                 <WarningCircle size={40} weight="fill" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">Ein Fehler ist aufgetreten.</h3>
                 <p className="text-slate-400 text-sm max-w-xs mx-auto">
                   Entschuldigung, der Server antwortet nicht. Bitte schreiben Sie uns direkt an info@convee.de
                 </p>
               </div>
               <button onClick={() => setStep('form')} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm">
                 Nochmal versuchen
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

// --- ROI Calculator Modal Component ---
const ROICalculator = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [leads, setLeads] = useState(50)
  const [commission, setCommission] = useState(10000)
  const [missedRate, setMissedRate] = useState(40) 

  const lostRevenue = Math.round(leads * (missedRate / 100) * commission)
  const yearlyLoss = lostRevenue * 12

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#13161c] border border-white/10 w-full max-w-md rounded-2xl p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <Calculator size={24} weight="fill" />
          </div>
          <h3 className="text-xl font-bold text-white">Leakage Rechner</h3>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Leads pro Monat</span>
              <span className="text-white font-mono">{leads}</span>
            </div>
            <input type="range" min="10" max="500" step="10" value={leads} onChange={(e) => setLeads(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Ø Provision pro Deal</span>
              <span className="text-white font-mono">{commission.toLocaleString()} €</span>
            </div>
            <input type="range" min="3000" max="50000" step="1000" value={commission} onChange={(e) => setCommission(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Nicht erreichte Leads</span>
              <span className="text-amber-500 font-mono">{missedRate}%</span>
            </div>
            <input type="range" min="10" max="90" step="5" value={missedRate} onChange={(e) => setMissedRate(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 text-center mt-6">
            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Jährliches Pipeline-Volumen in Gefahr</div>
            <div className="text-3xl md:text-4xl font-bold text-white font-numbers mb-1 text-amber-500">
              {yearlyLoss.toLocaleString()} €
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Umsatz, den Sie an Wettbewerber verschenken.
            </div>
          </div>

          <button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
            Diesen Verlust stoppen <ArrowRight weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Navbar ---
const Navbar = ({ onOpenCalc, onOpenAnalysis }: { onOpenCalc: () => void, onOpenAnalysis: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="fixed w-full z-50 top-0 bg-[#0c0e12]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-lg rounded-sm">C</div>
          <span className="text-lg font-bold tracking-tight text-white uppercase">Convee</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#problem" className="hover:text-white transition-colors">Das Problem</a>
          <a href="#daten" className="hover:text-white transition-colors">Marktdaten</a>
          <button onClick={onOpenCalc} className="hover:text-amber-500 transition-colors">Rechner</button>
        </div>
        <div className="hidden md:block">
          <button onClick={onOpenAnalysis} className="bg-white text-black hover:bg-slate-200 px-5 py-2.5 text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Analyse anfordern
          </button>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#0c0e12] border-b border-white/5 p-6 flex flex-col gap-6 h-screen">
          <a href="#problem" className="text-lg font-bold text-white">Das Problem</a>
          <a href="#daten" className="text-lg font-bold text-white">Daten</a>
          <button onClick={() => {onOpenCalc(); setIsOpen(false)}} className="text-lg font-bold text-amber-500 text-left">
            Verlust berechnen
          </button>
          <button onClick={() => {onOpenAnalysis(); setIsOpen(false)}} className="w-full bg-white text-black py-4 font-bold rounded-lg mt-4">
            Analyse anfordern
          </button>
        </div>
      )}
    </nav>
  )
}

// --- Hero Section ---
const Hero = ({ onOpenCalc, onOpenAnalysis }: { onOpenCalc: () => void, onOpenAnalysis: () => void }) => (
  <div className="pt-32 pb-24 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      
      <div>
        <div className="inline-flex items-center gap-2 border-l-2 border-amber-500 pl-4 mb-8">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Achtung Makler</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
          Sie verbrennen <br/><span className="text-slate-500">jeden Tag</span> Umsatz.
        </h1>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
          Jede Minute Verzögerung bei einer Anfrage kostet Geld. Leads, die erst nach 10 Minuten kontaktiert werden, sind statistisch gesehen <strong>wertlos</strong>.
          <br/><br/>
          Convee stoppt diesen Verlust. Sofort.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={onOpenAnalysis} className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
            Verlust stoppen <ArrowRight weight="bold" />
          </button>
          <button onClick={onOpenCalc} className="border border-slate-700 hover:bg-slate-800 text-white px-8 py-4 font-bold text-lg transition-all flex items-center justify-center gap-2">
            <Calculator size={20} /> ROI berechnen
          </button>
        </div>
        <div className="mt-8 flex items-center gap-4 text-xs text-slate-500 font-mono">
          <span>DATA SOURCE: HARVARD BUSINESS REVIEW</span>
          <span>•</span>
          <span>INSIDESALES.COM STUDY</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full pointer-events-none"></div>
        <div className="bg-[#13161c] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative z-10">
          <div className="bg-[#1a1d24] px-5 py-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-status"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Pipeline Activity</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">ID: #LEAD-8924</div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex gap-4 animate-slide-in" style={{animationDelay: '0s'}}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-slate-400"><EnvelopeSimple size={16} /></div>
                <div className="h-full w-[1px] bg-white/5 my-2"></div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-mono mb-1">14:02:01 • EINGANG</div>
                <div className="text-sm text-white font-medium">Neue Anfrage: "Penthouse HafenCity"</div>
                <div className="text-xs text-slate-400 mt-1">Quelle: ImmoScout24</div>
              </div>
            </div>

            <div className="flex gap-4 animate-slide-in" style={{animationDelay: '0.5s'}}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500"><Robot size={16} /></div>
                <div className="h-full w-[1px] bg-white/5 my-2"></div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-mono mb-1">14:02:11 • KI-QUALIFIZIERUNG</div>
                <div className="p-3 bg-white/5 rounded border border-white/5 text-sm">
                  <div className="flex items-center gap-2 mb-1"><CheckCircle size={14} className="text-emerald-500" weight="fill" /><span className="text-slate-200">Kapitalnachweis vorhanden</span></div>
                  <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" weight="fill" /><span className="text-slate-200">Sofort verfügbar</span></div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 animate-slide-in" style={{animationDelay: '1.5s'}}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500"><CalendarCheck size={16} /></div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-mono mb-1">14:02:21 • CONVERSION</div>
                <div className="text-sm text-white font-medium">Kalender-Einladung gesendet</div>
                <div className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-2 bg-emerald-500/10 px-2 py-1 rounded"><Clock size={12} /> Reaktionszeit: ~20 Sek</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-4 top-10 w-24 h-24 border-r border-t border-slate-700 rounded-tr-3xl -z-10 opacity-50"></div>
        <div className="absolute -left-4 bottom-10 w-24 h-24 border-l border-b border-slate-700 rounded-bl-3xl -z-10 opacity-50"></div>

      </div>
    </div>
  </div>
)

// --- Fact Section ---
const FactSection = ({ onOpenCalc }: { onOpenCalc: () => void }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.2 })

  return (
    <div id="daten" className="py-24 bg-[#0e1116] border-y border-white/5" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Die Mathematik des Verlusts.</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Der Markt wartet nicht. Hier sind die Fakten aus der <em>Lead Response Management Study</em>.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-[#13161c] p-8 border border-white/5 hover:border-amber-500/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <WarningCircle size={32} className="text-amber-500" />
              <div className="text-xs font-mono text-slate-500">FACT #01</div>
            </div>
            <div className="font-numbers text-5xl font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">400%</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Weniger Qualifizierung</div>
            <p className="text-slate-500 text-sm leading-relaxed">Wenn Sie einen Lead nach <strong>10 Minuten</strong> statt nach 5 Minuten kontaktieren, sinkt die Chance drastisch.</p>
            
            <div className="w-full bg-slate-800 h-1 mt-6 overflow-hidden">
               <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: isVisible ? '100%' : '0%' }}></div>
            </div>
            <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden opacity-30">
               <div className="h-full bg-slate-500 transition-all duration-1000 ease-out delay-200" style={{ width: isVisible ? '25%' : '0%' }}></div>
            </div>
          </div>

          <div className="bg-[#13161c] p-8 border border-white/5 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <PhoneCall size={32} className="text-slate-300" />
              <div className="text-xs font-mono text-slate-500">FACT #02</div>
            </div>
            <div className="font-numbers text-5xl font-bold text-white mb-2">6x</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">Kontaktversuche nötig</div>
            <p className="text-slate-500 text-sm leading-relaxed">90% der Abschlüsse passieren erst nach dem 6. Kontaktversuch. Die meisten Makler geben nach dem 2. Versuch auf. Convee bleibt dran.</p>
          </div>

          <div className="bg-gradient-to-br from-[#1a1d24] to-[#13161c] p-8 border border-white/10 relative overflow-hidden group hover:border-amber-500/50 transition-all cursor-pointer" onClick={onOpenCalc}>
            <div className="absolute top-0 right-0 p-4 opacity-10"><CurrencyEur size={100} /></div>
            <div className="relative z-10">
               <h3 className="text-white font-bold text-lg mb-6">Ihr Lead-Verlust pro Jahr</h3>
               <div className="space-y-4 font-mono text-sm">
                 <div className="flex justify-between text-slate-400"><span>Leads / Monat:</span><span>50</span></div>
                 <div className="flex justify-between text-slate-400"><span>Nicht erreicht (40%):</span><span>20</span></div>
                 <div className="h-[1px] bg-white/10 my-2"></div>
                 <div className="flex justify-between text-amber-500 font-bold text-lg group-hover:scale-105 transition-transform"><span>Potenzial:</span><span>Klicken &gt;</span></div>
               </div>
               <button className="w-full mt-6 bg-white/5 group-hover:bg-amber-500 group-hover:text-black border border-white/10 group-hover:border-amber-500 text-white py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                 <Calculator size={16} /> Jetzt berechnen
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// --- Features Grid ---
const Features = () => (
  <div id="features" className="py-24 bg-[#0c0e12]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Das Convee System. <br/><span className="text-slate-500">Ihre 24/7 Vertriebsmaschine.</span></h2>
          <div className="space-y-8">
            {[
              { title: "Sofortige Reaktion", desc: "Jeder Lead erhält in <60 Sekunden eine Antwort.", icon: <Clock weight="fill" /> },
              { title: "Natürliche Qualifizierung", desc: "KI fragt nach Budget und Finanzierung.", icon: <TrendUp weight="fill" /> },
              { title: "CRM Integration", desc: "Kompatibel mit OnOffice, FlowFact und Salesforce. Daten werden sauber strukturiert übergeben.", icon: <Database weight="fill" /> }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-[#1a1d24] flex items-center justify-center text-white rounded-lg border border-white/5 shrink-0">{item.icon}</div>
                <div><h4 className="text-white font-bold text-lg">{item.title}</h4><p className="text-slate-400 text-sm mt-1 leading-relaxed max-w-sm">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
           <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/20 to-transparent rounded-2xl"></div>
           <div className="border border-white/5 bg-[#13161c] p-8 rounded-2xl relative z-10 shadow-2xl">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4"><User size={20} className="text-slate-400" /><span className="text-sm font-bold text-white">Lead Profil: M. Müller</span><span className="ml-auto text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-bold">QUALIFIZIERT</span></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Budget</div><div className="text-white font-mono">850.000 €</div></div>
                  <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Kapital</div><div className="text-white font-mono">Vorhanden (Bank)</div></div>
                  <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dringlichkeit</div><div className="text-white font-mono">Hoch (3 Monate)</div></div>
                  <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div><div className="text-white font-mono">Termin gebucht</div></div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                 <button className="w-full bg-white text-black py-3 font-bold text-sm hover:bg-slate-200 transition-colors">
                   Profil in CRM öffnen
                 </button>
              </div>
           </div>
           
           <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border border-slate-800 rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
)

// --- Footer ---
const Footer = () => (
  <footer className="bg-[#0c0e12] py-20 border-t border-white/5 text-sm text-slate-500">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
      <div className="col-span-2"><div className="text-white font-bold text-xl mb-4 tracking-tight uppercase">Convee</div><p className="max-w-xs mb-6 text-slate-500">Wir automatisieren den Vertrieb für Immobilienmakler.</p></div>
      <div><h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Produkt</h4><ul className="space-y-3"><li><a href="#" className="hover:text-white">Features</a></li><li><a href="#" className="hover:text-white">Preise</a></li></ul></div>
      <div><h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Rechtliches</h4><ul className="space-y-3"><li><a href="#" className="hover:text-white">Impressum</a></li></ul></div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs">
      <div>© {new Date().getFullYear()} Convee Automation Systems.</div>
      <div className="mt-2 md:mt-0">Made in Germany.</div>
    </div>
  </footer>
)

// --- Main App Component ---
function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 selection:bg-amber-500/30 selection:text-white">
      <Navbar 
        onOpenCalc={() => setIsCalculatorOpen(true)} 
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
      />
      
      {/* Die Modals */}
      <ROICalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
      <AnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />

      <main className={(isCalculatorOpen || isAnalysisOpen) ? 'blur-sm transition-all' : 'transition-all'}>
        <Hero 
          onOpenCalc={() => setIsCalculatorOpen(true)} 
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
        />
        <FactSection onOpenCalc={() => setIsCalculatorOpen(true)} />
        <Features />
      </main>

      <Footer />
    </div>
  )
}

export default App