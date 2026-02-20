import React, { useMemo, useRef, useState } from 'react';
import { MapPin, Heart, Sun, Map, Trophy, Waves, Volleyball, Plus, Trash2, CheckCircle } from 'lucide-react';
import type { Registration, PaymentType } from './types';

// ✅ Fotos (Vite empacota via import; funciona no GitHub Pages)
import f1 from './assets/images/foto1.jpeg';
import f2 from './assets/images/foto2.jpeg';
import f3 from './assets/images/foto3.jpeg';
import f4 from './assets/images/foto4.jpeg';

type SectionId = 'hero' | 'about' | 'activities' | 'registration';

const PAYMENT_LABEL: Record<Exclude<PaymentType,''>, string> = {
  PIX: 'PIX',
  'Cartão': 'Cartão',
  Dinheiro: 'Dinheiro',
  Outro: 'Outro',
};

function currencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Envia uma inscrição para um endpoint (ex.: Google Apps Script / Formspree / webhook).
 * Configure em .env.local:
 *   VITE_FORM_ENDPOINT="https://script.google.com/macros/s/AKfycbwZImn5Rtu4MYie0-YCcU_NF7_8re_OirKck2z2uYgwefqNfkOuiYBcIE5Q795e_ila/exec"
 */
async function sendRegistrationToEndpoint(payload: Registration): Promise<void> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  // Se você ainda não configurou, não quebra a tela; salva só localmente.
  if (!endpoint) return;

  const res = await fetch(import.meta.env.VITE_FORM_ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify(payload),
});


  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Falha ao enviar inscrição. HTTP ${res.status}. ${text}`);
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  const sections = useRef<Record<SectionId, HTMLElement | null>>({
    hero: null,
    about: null,
    activities: null,
    registration: null,
  });

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    sections.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const aboutImages = [f1, f2, f3, f4];

  const activities = [
    { icon: Trophy, title: 'Torneios', desc: 'Competições e brincadeiras durante o dia.' },
    { icon: Waves, title: 'Piscina', desc: 'Diversão garantida para toda a família.' },
    { icon: Volleyball, title: 'Esportes', desc: 'Atividades esportivas e recreativas.' },
    { icon: Sun, title: 'Lazer', desc: 'Tempo de qualidade, descanso e comunhão.' },
  ] as const;

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [form, setForm] = useState<{ name: string; phone: string; paymentType: PaymentType | '' }>({
    name: '',
    phone: '',
    paymentType: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendOk, setSendOk] = useState<string | null>(null);

  const addRegistration = async () => {
    setSendError(null);
    setSendOk(null);

    const name = form.name.trim();
    const phone = form.phone.trim();
    const paymentType = form.paymentType;

    if (!name) return setSendError('Informe o nome.');
    if (!phone) return setSendError('Informe um telefone/WhatsApp.');
    if (!paymentType) return setSendError('Selecione o tipo de pagamento.');

    const payload: Registration = {
      id: crypto.randomUUID(),
      name,
      phone,
      paymentType,
      createdAt: new Date().toISOString(),
    };

    // Salva localmente primeiro (boa UX)
    setRegistrations((prev) => [payload, ...prev]);
    setForm({ name: '', phone: '', paymentType: '' });

    // Envia para endpoint (se configurado)
    setIsSending(true);
    try {
      await sendRegistrationToEndpoint(payload);
      setSendOk('Inscrição enviada e salva com sucesso.');
    } catch (err: any) {
      setSendError(err?.message || 'Falha ao enviar inscrição.');
    } finally {
      setIsSending(false);
    }
  };

  const removeRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Heart className="w-5 h-5" />
            <span>IBGP • VI Festa da Família</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => scrollToSection('hero')} className="hover:opacity-70">Início</button>
            <button onClick={() => scrollToSection('about')} className="hover:opacity-70">Sobre</button>
            <button onClick={() => scrollToSection('activities')} className="hover:opacity-70">Atividades</button>
            <button onClick={() => scrollToSection('registration')} className="hover:opacity-70">Inscrição</button>
          </nav>

          <button className="md:hidden p-2 rounded-lg border border-gray-200" onClick={() => scrollToSection('registration')}>
            Inscrição
          </button>
        </div>
      </header>

      <section ref={(el) => (sections.current.hero = el)} className="pt-24 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                VI Festa da Família
                <span className="block text-gray-600 mt-2">01 de Maio • 8h às 18h</span>
              </h1>

              <p className="mt-5 text-lg text-gray-700">
                Um dia inteiro de comunhão, lazer, esportes e alegria na Chácara Estância Felicidade (Brazlândia - DF).
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => scrollToSection('registration')} className="px-5 py-3 rounded-lg bg-gray-900 text-white hover:opacity-90">
                  Quero me inscrever
                </button>

                <button onClick={() => scrollToSection('about')} className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">
                  Ver detalhes
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Chácara Estância Felicidade, Brazlândia - DF</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-[4/3]">
              <img src={f1} alt="Festa da Família" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section ref={(el) => (sections.current.about = el)} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold">Sobre o evento</h2>
              <p className="mt-4 text-gray-700">
                A VI Festa da Família IBGP é um encontro para fortalecer os laços familiares em um ambiente acolhedor e cristão.
              </p>
              <p className="mt-4 text-gray-700">
                Com atividades para todas as idades, é um dia memorável onde famílias podem se unir em amor, paz e alegria.
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
                  <div className="mt-0.5"><span className="inline-block w-5 h-5 rounded bg-gray-900" /></div>
                  <div>
                    <div className="font-semibold">Vouchers</div>
                    <div className="text-gray-700">
                      Adultos e crianças acima de 10 anos: R$ 100,00<br />
                      Crianças de 6 a 10 anos: R$ 50,00<br />
                      Crianças até 5 anos: Grátis
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {aboutImages.map((src, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100">
                  <img src={src} alt={`Foto ${index + 1} da Festa da Família`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section ref={(el) => (sections.current.activities = el)} className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Atividades</h2>
          <p className="mt-3 text-gray-700">Vai ter diversão o dia inteiro — para crianças, jovens e adultos.</p>

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

      <section ref={(el) => (sections.current.registration = el)} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold">Inscrição</h2>
          <p className="mt-3 text-gray-700">
            Preencha os dados abaixo. O envio pode ser salvo automaticamente (configure o endpoint no .env.local).
          </p>

          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Nome do participante"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Telefone/WhatsApp</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="(DD) 9XXXX-XXXX"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo de pagamento</label>
                  <select
                    value={form.paymentType}
                    onChange={(e) => setForm((p) => ({ ...p, paymentType: e.target.value as PaymentType }))}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione</option>
                    <option value="PIX">{PAYMENT_LABEL.PIX}</option>
                    <option value="Cartão">{PAYMENT_LABEL['Cartão']}</option>
                    <option value="Dinheiro">{PAYMENT_LABEL.Dinheiro}</option>
                    <option value="Outro">{PAYMENT_LABEL.Outro}</option>
                  </select>
                </div>

                {sendError && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{sendError}</div>}
                {sendOk && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{sendOk}</div>}

                <button
                  onClick={addRegistration}
                  disabled={isSending}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-900 text-white hover:opacity-90 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {isSending ? 'Enviando...' : 'Enviar inscrição'}
                </button>

                {!import.meta.env.VITE_FORM_ENDPOINT && (
                  <div className="text-xs text-gray-600">
                    Dica: para salvar em planilha/servidor, defina <span className="font-mono">VITE_FORM_ENDPOINT</span> no
                    arquivo <span className="font-mono">.env.local</span>.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Inscrições (local)</div>
              </div>

              <div className="mt-4 space-y-3">
                {registrations.length === 0 && <div className="text-sm text-gray-600">Nenhuma inscrição ainda.</div>}

                {registrations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-3">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-gray-600">
                        {r.phone} • {r.paymentType || '-'}
                      </div>
                    </div>

                    <button
                      onClick={() => removeRegistration(r.id)}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                      aria-label="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-600">
                Observação: esta lista é local (no navegador). Para persistir, configure o endpoint.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-sm text-gray-600">© {new Date().getFullYear()} IBGP</div>
      </footer>
    </div>
  );
}
