import React, { useState, useRef } from 'react';
import {
  MapPin,
  Heart,
  Sun,
  Map,
  Trophy,
  Waves,
  Square,
  Volleyball,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { Participant } from './types';
import PaymentModal from './components/PaymentModal';

// ✅ IMPORT DAS IMAGENS (Vite precisa disso para empacotar corretamente)
import f1 from "./assets/images/foto1.jpeg";
import f2 from "./assets/images/foto2.jpeg";
import f3 from "./assets/images/foto3.jpeg";
import f4 from "./assets/images/foto4.jpeg";

const App = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState<Participant>({
    id: '',
    name: '',
    age: 0,
    category: '',
    paid: false,
    createdAt: new Date().toISOString(),
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const sections = useRef<Record<string, HTMLElement | null>>({
    hero: null,
    about: null,
    activities: null,
    registration: null,
  });

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sections.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (field: keyof Participant, value: any) => {
    setNewParticipant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addParticipant = () => {
    if (!newParticipant.name?.trim()) return;

    const participant: Participant = {
      ...newParticipant,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setParticipants((prev) => [...prev, participant]);

    setNewParticipant({
      id: '',
      name: '',
      age: 0,
      category: '',
      paid: false,
      createdAt: new Date().toISOString(),
    });
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const markAsPaid = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsPaymentModalOpen(true);
  };

  const confirmPayment = () => {
    if (!selectedParticipant) return;

    setParticipants((prev) =>
      prev.map((p) => (p.id === selectedParticipant.id ? { ...p, paid: true } : p))
    );

    setIsPaymentModalOpen(false);
    setSelectedParticipant(null);
  };

  const calculateTotal = () => {
    // (ajuste conforme sua regra real de valores)
    const total = participants.reduce((acc, p) => {
      if (p.category === 'adult') return acc + 100;
      if (p.category === 'child_6_10') return acc + 50;
      return acc;
    }, 0);

    return total;
  };

  const activities = [
    { icon: Trophy, title: 'Torneios', desc: 'Competições e brincadeiras durante o dia.' },
    { icon: Waves, title: 'Piscina', desc: 'Diversão garantida para toda a família.' },
    { icon: Volleyball, title: 'Esportes', desc: 'Atividades esportivas e recreativas.' },
    { icon: Sun, title: 'Lazer', desc: 'Tempo de qualidade, descanso e comunhão.' },
  ];

  const totalAmount = calculateTotal();

  // ✅ Fotos da seção "Sobre" (Vite empacota via import)
  const aboutImages = [f1, f2, f3, f4];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Heart className="w-5 h-5" />
            <span>VI Festa da Família - IBGP</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => scrollToSection('hero')} className="hover:opacity-70">
              Início
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:opacity-70">
              Sobre
            </button>
            <button onClick={() => scrollToSection('activities')} className="hover:opacity-70">
              Atividades
            </button>
            <button onClick={() => scrollToSection('registration')} className="hover:opacity-70">
              Inscrição
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        ref={(el) => (sections.current.hero = el)}
        className="pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                VI Festa da Família
                <span className="block text-gray-600 mt-2">IBGP • 01 de Maio • 8h às 18h</span>
              </h1>
              <p className="mt-5 text-lg text-gray-700">
                Um dia inteiro de comunhão, lazer, esportes e alegria na Chácara Estância Felicidade
                (Brazlândia - DF).
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToSection('registration')}
                  className="px-5 py-3 rounded-lg bg-gray-900 text-white hover:opacity-90"
                >
                  Quero me inscrever
                </button>

                <button
                  onClick={() => scrollToSection('about')}
                  className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Ver detalhes
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Chácara Estância Felicidade, Brazlândia - DF</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-[4/3]">
              {/* Você pode trocar por um banner em public/ se quiser */}
              <img
                src={f1}
                alt="Banner da Festa da Família"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={(el) => (sections.current.about = el)} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold">Sobre o evento</h2>
              <p className="mt-4 text-gray-700">
                A VI Festa da Família é um encontro para celebrarmos juntos: família, amizade,
                alegria e comunhão. Traga sua cadeira, protetor solar e venha preparado para um dia
                incrível.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="font-semibold">Data e horário</div>
                    <div className="text-gray-700">01 de Maio • 8h às 18h</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Map className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="font-semibold">Local</div>
                    <div className="text-gray-700">Chácara Estância Felicidade, Brazlândia - DF</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Square className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="font-semibold">Vouchers</div>
                    <div className="text-gray-700">
                      Adultos e crianças acima de 10 anos: R$ 100,00
                      <br />
                      Crianças de 6 a 10 anos: R$ 50,00
                      <br />
                      Crianças até 5 anos: Grátis
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Aqui substitui os corações pelas fotos */}
            <div className="grid grid-cols-2 gap-4">
              {aboutImages.map((src, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100"
                >
                  <img
                    src={src}
                    alt={`Foto ${index + 1} da Festa da Família`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section
        ref={(el) => (sections.current.activities = el)}
        className="py-16 px-4 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Atividades</h2>
          <p className="mt-3 text-gray-700">
            Vai ter diversão o dia inteiro — para crianças, jovens e adultos.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activities.map((a, idx) => {
              const Icon = a.icon;
              return (
                <div key={idx} className="rounded-xl bg-white shadow p-5 border border-gray-100">
                  <Icon className="w-6 h-6" />
                  <div className="mt-3 font-semibold">{a.title}</div>
                  <div className="mt-1 text-sm text-gray-700">{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section ref={(el) => (sections.current.registration = el)} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Inscrição</h2>
          <p className="mt-3 text-gray-700">
            Cadastre os participantes abaixo. Depois você pode marcar o pagamento.
          </p>

          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <input
                    value={newParticipant.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Nome do participante"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Idade</label>
                    <input
                      type="number"
                      value={newParticipant.age || 0}
                      onChange={(e) => handleInputChange('age', Number(e.target.value))}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <select
                      value={newParticipant.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Selecione</option>
                      <option value="adult">Adulto / acima de 10</option>
                      <option value="child_6_10">Criança 6 a 10</option>
                      <option value="child_0_5">Criança até 5</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={addParticipant}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-900 text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar participante
                </button>
              </div>
            </div>

            {/* List */}
            <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Participantes</div>
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold">R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {participants.length === 0 && (
                  <div className="text-sm text-gray-600">Nenhum participante cadastrado ainda.</div>
                )}

                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border border-gray-100 rounded-lg p-3"
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-600">
                        {p.age} anos •{' '}
                        {p.category === 'adult'
                          ? 'Adulto / acima de 10'
                          : p.category === 'child_6_10'
                          ? 'Criança 6 a 10'
                          : 'Criança até 5'}
                        {p.paid ? ' • Pago' : ' • Pendente'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!p.paid && (
                        <button
                          onClick={() => markAsPaid(p)}
                          className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:opacity-90"
                        >
                          Marcar pago
                        </button>
                      )}

                      <button
                        onClick={() => removeParticipant(p.id)}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                        aria-label="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedParticipant && (
                <PaymentModal
                  isOpen={isPaymentModalOpen}
                  onClose={() => setIsPaymentModalOpen(false)}
                  onConfirm={confirmPayment}
                  participant={selectedParticipant}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-sm text-gray-600">
          © {new Date().getFullYear()} VI Festa da Família - IBGP
        </div>
      </footer>
    </div>
  );
};

export default App;
