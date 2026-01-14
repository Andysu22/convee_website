import { useState } from 'react'
import { 
  EnvelopeSimple, 
  Robot, 
  Database, 
  CalendarCheck, 
  List, 
  X, 
  CheckCircle,
  Clock,
  CurrencyEur,
  Coffee,
  Lightning,
  CaretRight,
  ShieldCheck
} from '@phosphor-icons/react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <nav className="fixed w-full z-50 top-0 bg-[#020617]/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Convee</span>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#vorteile" className="hover:text-white transition-colors">Vorteile</a>
          <a href="#vergleich" className="hover:text-white transition-colors">Mensch vs. AI</a>
          <a href="#features" className="hover:text-white transition-colors">Funktionen</a>
        </div>

        <button className="hidden md:flex bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors">
          Erstgespräch sichern
        </button>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-slate-800 p-6 flex flex-col gap-4 shadow-2xl">
          <a href="#vorteile" className="text-lg font-medium text-slate-300" onClick={() => setIsOpen(false)}>Vorteile</a>
          <a href="#vergleich" className="text-lg font-medium text-slate-300" onClick={() => setIsOpen(false)}>Vergleich</a>
          <button className="bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">Termin buchen</button>
        </div>
      )}
    </nav>
  )
}

const Hero = () => (
  <div className="pt-40 pb-20 relative overflow-hidden">
    {/* Hintergrund-Effekt */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 opacity-40"></div>
    
    <div className="max-w-7xl mx-auto px-6 text-center z-10 relative">
      <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        <span className="text-sm font-medium text-slate-300">Jetzt verfügbar für Immobilienmakler</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
        Ihr neuer Mitarbeiter <br />
        <span className="gradient-text">arbeitet 24/7. Ohne Gehalt.</span>
      </h1>
      
      <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        Automatisieren Sie Vorqualifizierung, Datenerfassung und Terminbuchung. 
        Kein "Ich melde mich später". Convee antwortet sofort – auch Sonntag nachts.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
          Demo ansehen <CaretRight weight="bold" />
        </button>
        <button className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm">
          ROI berechnen
        </button>
      </div>
    </div>
  </div>
)

// Moderne Pipeline Animation (Flüssiger Gradient)
const Pipeline = () => (
  <div className="py-12 bg-slate-900/30 border-y border-slate-800/50 backdrop-blur-sm">
    <div className="max-w-5xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0">
        
        {/* Verbindungs-Linie (Hintergrund) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 rounded-full -z-10"></div>
        
        {/* Animierter Flow (Vordergrund) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 rounded-full -z-10 overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-flow"></div>
        </div>

        {[
          { icon: <EnvelopeSimple size={28} />, label: "Eingang" },
          { icon: <Robot size={28} />, label: "KI-Analyse" },
          { icon: <Database size={28} />, label: "CRM Sync" },
          { icon: <CalendarCheck size={28} />, label: "Termin" }
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-4 bg-[#020617] p-4 rounded-2xl border border-slate-800 relative z-10 w-full md:w-auto">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${i === 1 ? 'bg-blue-600 shadow-blue-500/20' : 'bg-slate-800'}`}>
              {step.icon}
            </div>
            <span className="font-medium text-slate-300">{step.label}</span>
          </div>
        ))}

      </div>
      <p className="text-center text-slate-500 mt-8 text-sm">
        *Durchschnittliche Reaktionszeit: <span className="text-emerald-400 font-bold">45 Sekunden</span>
      </p>
    </div>
  </div>
)

// Der Vergleich: Mensch vs. AI
const Comparison = () => (
  <div id="vergleich" className="py-24 bg-[#020617]">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Warum Convee?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Ihr neuer digitaler Mitarbeiter ist nicht nur schneller, sondern auch drastisch günstiger als traditionelles Personal.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Traditionell */}
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 opacity-70">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
              <Coffee size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-300">Traditionell</h3>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-400">
              <X className="text-red-500 shrink-0" size={20} />
              <span>Verfügbar: Mo-Fr, 9-17 Uhr</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="text-red-500 shrink-0" size={20} />
              <span>Reaktionszeit: Stunden/Tage</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="text-red-500 shrink-0" size={20} />
              <span>Kosten: ~3.500€ / Monat</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="text-red-500 shrink-0" size={20} />
              <span>Krankheit & Urlaub</span>
            </li>
          </ul>
        </div>

        {/* Convee AI */}
        <div className="p-8 rounded-3xl bg-slate-800/50 border border-blue-500/30 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <Lightning size={32} weight="fill" />
              </div>
              <h3 className="text-2xl font-bold text-white">Convee AI</h3>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white">
                <CheckCircle className="text-emerald-400 shrink-0" size={20} weight="fill" />
                <span className="font-medium">Verfügbar: 24/7 (auch Feiertags)</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle className="text-emerald-400 shrink-0" size={20} weight="fill" />
                <span className="font-medium">Reaktionszeit: &lt; 60 Sekunden</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle className="text-emerald-400 shrink-0" size={20} weight="fill" />
                <span className="font-medium">Kosten: Ein Bruchteil davon</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle className="text-emerald-400 shrink-0" size={20} weight="fill" />
                <span className="font-medium">Niemals krank, immer freundlich</span>
              </li>
            </ul>
            <button className="w-full py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Jetzt AI-Assistenten einstellen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const Features = () => (
  <div id="features" className="py-24 bg-slate-950">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Clock size={32} />,
            title: "Zeitersparnis",
            desc: "Sparen Sie ca. 15 Stunden Admin-Arbeit pro Woche. Zeit, die Sie für Besichtigungen nutzen können."
          },
          {
            icon: <CurrencyEur size={32} />,
            title: "Mehr Umsatz",
            desc: "Kein Lead geht verloren. Schnelle Antworten erhöhen die Abschlusswahrscheinlichkeit um 391%."
          },
          {
            icon: <ShieldCheck size={32} />,
            title: "Volle Kontrolle",
            desc: "Alle Daten landen sauber in Ihrem CRM (OnOffice, FlowFact). Sie behalten den Überblick."
          }
        ].map((f, i) => (
          <div key={i} className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="text-blue-400 mb-6">{f.icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Footer = () => (
  <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center text-slate-500">
    <div className="mb-4 font-bold text-white text-xl">Convee.AI</div>
    <p>© 2026 Convee Automation. Made for Real Estate.</p>
  </footer>
)

function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <Navbar />
      <Hero />
      <Pipeline />
      <Comparison />
      <Features />
      <Footer />
    </div>
  )
}

export default App