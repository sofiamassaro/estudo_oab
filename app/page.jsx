"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BookOpen,
  Database,
  StickyNote,
  BarChart3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Upload,
  Plus,
  Lightbulb,
  Filter,
  CircleHelp,
  CircleCheck,
  EyeOff,
} from "lucide-react";

// -------------------------------------------------------------------
// Constantes
// -------------------------------------------------------------------
const TEMAS = [
  "Ética e Estatuto da OAB",
  "Filosofia do Direito",
  "Direito Constitucional",
  "Direitos Humanos",
  "Direito Eleitoral",
  "Direito Internacional",
  "Direito Tributário",
  "Direito Financeiro",
  "Direito Administrativo",
  "Direito Ambiental",
  "Direito Civil",
  "Estatuto da Criança e do Adolescente",
  "Direito do Consumidor",
  "Direito Empresarial",
  "Direito Processual Civil",
  "Direito Penal",
  "Direito Processual Penal",
  "Direito do Trabalho",
  "Direito Processual do Trabalho",
  "Direito Previdenciário",
];

const LETRAS = ["A", "B", "C", "D"];

// -------------------------------------------------------------------
// Camada de API
// -------------------------------------------------------------------
const api = {
  listarQuestoes: () => fetch("/api/questoes").then((r) => r.json()),
  criarQuestoes: (dados) =>
    fetch("/api/questoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }).then((r) => r.json()),
  excluirQuestao: (id) => fetch(`/api/questoes/${id}`, { method: "DELETE" }),

  listarRespostas: () => fetch("/api/respostas").then((r) => r.json()),
  registrarResposta: (dados) =>
    fetch("/api/respostas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }),

  listarNotas: () => fetch("/api/notas").then((r) => r.json()),
  criarNota: (dados) =>
    fetch("/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }).then((r) => r.json()),
  atualizarNota: (id, resolvida) =>
    fetch(`/api/notas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolvida }),
    }).then((r) => r.json()),
  excluirNota: (id) => fetch(`/api/notas/${id}`, { method: "DELETE" }),

    listarPosicoes: () =>
    fetch("/api/posicoes").then((r) => r.json()).catch(() => ({})),
  salvarPosicao: (dados) =>
    fetch("/api/posicoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }),
};

// -------------------------------------------------------------------
// App
// -------------------------------------------------------------------
export default function App() {
  const [aba, setAba] = useState("estudar");
  const [carregado, setCarregado] = useState(false);
  const [erroConexao, setErroConexao] = useState(false);

  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [notas, setNotas] = useState([]);
  const [posicoes, setPosicoes] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [q, r, n, p] = await Promise.all([
          api.listarQuestoes(),
          api.listarRespostas(),
          api.listarNotas(),
          api.listarPosicoes(),
        ]);
        setQuestoes(Array.isArray(q) ? q : []);
        setRespostas(r && typeof r === "object" ? r : {});
        setNotas(Array.isArray(n) ? n : []);
        setPosicoes(p && typeof p === "object" ? p : {});
      } catch {
        setErroConexao(true);
      } finally {
        setCarregado(true);
      }
    })();
  }, []);

  const abas = [
    { id: "estudar", nome: "Estudar", icone: BookOpen },
    { id: "banco", nome: "Banco de questões", icone: Database },
    { id: "duvidas", nome: "Dúvidas", icone: StickyNote },
    { id: "progresso", nome: "Progresso", icone: BarChart3 },
  ];

  if (!carregado) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">Carregando…</div>
    );
  }

  if (erroConexao) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="font-serif text-xl font-semibold text-slate-800 mb-2">Sem conexão com o banco</p>
          <p className="text-sm text-slate-500">
            Verifique a variável DATABASE_URL no arquivo .env e se as tabelas foram criadas com o
            db/schema.sql. Depois recarregue a página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Estudo OAB
              </h1>
              <span className="text-xs text-violet-600 font-medium hidden sm:inline">
                1ª fase · banco pessoal
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {questoes.length} {questoes.length === 1 ? "questão" : "questões"}
            </div>
          </div>
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {abas.map((a) => {
              const Icone = a.icone;
              const ativa = aba === a.id;
              const contador = a.id === "duvidas" ? notas.filter((n) => !n.resolvida).length : null;
              return (
                <button
                  key={a.id}
                  onClick={() => setAba(a.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    ativa
                      ? "border-violet-600 text-violet-700"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icone size={16} />
                  {a.nome}
                  {contador != null && contador > 0 && (
                    <span className="ml-0.5 text-[11px] bg-amber-100 text-amber-700 rounded-full px-1.5 py-0.5">
                      {contador}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {aba === "estudar" && (
          <Estudar
            questoes={questoes}
            respostas={respostas}
            setRespostas={setRespostas}
            setNotas={setNotas}
            posicoes={posicoes}
            setPosicoes={setPosicoes}
          />
        )}
        {aba === "banco" && (
          <Banco
            questoes={questoes}
            setQuestoes={setQuestoes}
            setRespostas={setRespostas}
          />
        )}
        {aba === "duvidas" && <Duvidas notas={notas} setNotas={setNotas} />}
        {aba === "progresso" && <Progresso questoes={questoes} respostas={respostas} />}
      </main>
    </div>
  );
}

// -------------------------------------------------------------------
// Aba: Estudar
// -------------------------------------------------------------------
function Estudar({ questoes, respostas, setRespostas, setNotas, posicoes, setPosicoes }) {
  const [eixo, setEixo] = useState("tema"); // "tema" | "exame"
  const [valorAtivo, setValorAtivo] = useState("Todos");
  const [indice, setIndice] = useState(0);
  const [mostrarDuvida, setMostrarDuvida] = useState(false);
  const [textoDuvida, setTextoDuvida] = useState("");

  const temasComQuestoes = useMemo(() => {
    const set = new Set(questoes.map((q) => q.tema));
    return TEMAS.filter((t) => set.has(t));
  }, [questoes]);

  const examesComQuestoes = useMemo(() => {
    const set = new Set(questoes.map((q) => q.exame).filter((e) => e && e.trim()));
    return Array.from(set).sort();
  }, [questoes]);

  const opcoes = eixo === "tema" ? temasComQuestoes : examesComQuestoes;

  const filtradas = useMemo(() => {
    if (valorAtivo === "Todos") return questoes;
    return questoes.filter((q) => (eixo === "tema" ? q.tema : q.exame) === valorAtivo);
  }, [questoes, eixo, valorAtivo]);

  function trocarEixo(novo) {
    setEixo(novo);
    setValorAtivo("Todos");
  }

  const chavePos = (eixo, valor) => `${eixo}::${valor}`;
  const primeiroSalvar = useRef(true);

  // Ao trocar de tema/edição, volta para onde você parou (salvo no banco).
  useEffect(() => {
    setMostrarDuvida(false);
    setTextoDuvida("");

    const total = filtradas.length;
    if (total === 0) {
      setIndice(0);
      return;
    }

    let alvo = posicoes[chavePos(eixo, valorAtivo)];

    // fallback: última questão já respondida neste filtro
    if (alvo == null) {
      alvo = 0;
      for (let i = total - 1; i >= 0; i--) {
        if (respostas[filtradas[i].id]) { alvo = i; break; }
      }
    }

    setIndice(Math.min(Math.max(alvo, 0), total - 1));
  }, [valorAtivo, eixo, filtradas.length]);

  // Salva a posição atual no banco para retomar em qualquer dispositivo.
  useEffect(() => {
    setMostrarDuvida(false);
    setTextoDuvida("");

    // não salva no primeiro render (antes da posição ser restaurada)
    if (primeiroSalvar.current) {
      primeiroSalvar.current = false;
      return;
    }
    if (filtradas.length === 0) return;

    const chave = chavePos(eixo, valorAtivo);
    setPosicoes((prev) => (prev[chave] === indice ? prev : { ...prev, [chave]: indice }));
    api.salvarPosicao({ eixo, valor: valorAtivo, indice }).catch(() => {});
  }, [indice]);

  if (questoes.length === 0) {
    return (
      <VazioEstado
        titulo="Nenhuma questão ainda"
        texto="Adicione ou importe questões na aba Banco de questões para começar a estudar."
      />
    );
  }

  const questao = filtradas[indice];
  const resp = questao ? respostas[questao.id] : null;
  const respondida = !!resp;

  async function responder(letra) {
    if (respondida) return;
    const acertou = letra === questao.correta;
    setRespostas((prev) => ({ ...prev, [questao.id]: { escolhida: letra, acertou } }));
    try {
      await api.registrarResposta({ questaoId: questao.id, escolhida: letra, acertou });
    } catch {
      /* estado local ja atualizado */
    }
  }

  async function salvarDuvida() {
    if (!textoDuvida.trim()) return;
    const nova = await api.criarNota({
      texto: textoDuvida.trim(),
      tema: questao.tema,
      exame: questao.exame,
      questaoId: questao.id,
    });
    setNotas((prev) => [nova, ...prev]);
    setTextoDuvida("");
    setMostrarDuvida(false);
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400">Separar por</span>
          <SegBtn ativo={eixo === "tema"} onClick={() => trocarEixo("tema")}>
            Tema
          </SegBtn>
          <SegBtn ativo={eixo === "exame"} onClick={() => trocarEixo("exame")}>
            Edição
          </SegBtn>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-slate-400" />
          <Chip ativo={valorAtivo === "Todos"} onClick={() => setValorAtivo("Todos")}>
            Todos ({questoes.length})
          </Chip>
          {eixo === "exame" && examesComQuestoes.length === 0 ? (
            <span className="text-xs text-slate-400">
              Nenhuma questão tem a edição preenchida. Informe o exame ao cadastrar para filtrar por edição.
            </span>
          ) : (
            opcoes.map((v) => (
              <Chip key={v} ativo={valorAtivo === v} onClick={() => setValorAtivo(v)}>
                {eixo === "tema"
                  ? v.replace("Direito ", "").replace("Estatuto da Criança e do Adolescente", "ECA")
                  : v}{" "}
                ({questoes.filter((q) => (eixo === "tema" ? q.tema : q.exame) === v).length})
              </Chip>
            ))
          )}
        </div>
      </div>

      {!questao ? (
        <VazioEstado titulo="Sem questões neste filtro" texto="Escolha outra opção ou adicione questões." />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 sm:px-6 pt-5 flex items-center justify-between text-xs">
            <span className="font-medium text-violet-700">{questao.tema}</span>
            <span className="text-slate-400">
              {questao.exame ? `${questao.exame} · ` : ""}
              {indice + 1} de {filtradas.length}
            </span>
          </div>

          <div className="px-5 sm:px-6 py-4">
            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{questao.enunciado}</p>
          </div>

          <div className="px-5 sm:px-6 pb-2 space-y-2">
            {questao.alternativas.map((alt) => {
              const escolhida = resp && resp.escolhida === alt.letra;
              const eCorreta = alt.letra === questao.correta;
              let cls = "border-slate-200 hover:border-violet-300 hover:bg-violet-50/40";
              if (respondida) {
                if (eCorreta) cls = "border-emerald-300 bg-emerald-50";
                else if (escolhida) cls = "border-rose-300 bg-rose-50";
                else cls = "border-slate-200 opacity-60";
              }
              return (
                <button
                  key={alt.letra}
                  onClick={() => responder(alt.letra)}
                  disabled={respondida}
                  className={`w-full text-left flex gap-3 items-start rounded-lg border px-4 py-3 transition-colors ${cls} ${
                    respondida ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-xs font-semibold ${
                      respondida && eCorreta
                        ? "bg-emerald-600 text-white"
                        : respondida && escolhida
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {respondida && eCorreta ? (
                      <Check size={14} />
                    ) : respondida && escolhida ? (
                      <X size={14} />
                    ) : (
                      alt.letra
                    )}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed pt-0.5">{alt.texto}</span>
                </button>
              );
            })}
          </div>

          {respondida && (
            <div className="mx-5 sm:mx-6 mb-2 mt-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                {resp.acertou ? (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <CircleCheck size={16} /> Você acertou
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1.5">
                    <X size={16} /> Gabarito: alternativa {questao.correta}
                  </span>
                )}
              </div>
              {questao.comentario && (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {questao.comentario}
                </p>
              )}
            </div>
          )}

          <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => setMostrarDuvida((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              <Lightbulb size={16} /> Anotar dúvida
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIndice((i) => Math.max(0, i - 1))}
                disabled={indice === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <button
                onClick={() => setIndice((i) => Math.min(filtradas.length - 1, i + 1))}
                disabled={indice >= filtradas.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-violet-600 text-white disabled:opacity-40 hover:bg-violet-700"
              >
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {mostrarDuvida && (
            <div className="px-5 sm:px-6 pb-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                <label className="text-xs font-medium text-amber-800 mb-1.5 block">
                  Dúvida sobre esta questão (fica salva na aba Dúvidas)
                </label>
                <textarea
                  value={textoDuvida}
                  onChange={(e) => setTextoDuvida(e.target.value)}
                  rows={3}
                  placeholder="Ex.: revisar a diferença entre habeas data e mandado de segurança…"
                  className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setMostrarDuvida(false)}
                    className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarDuvida}
                    className="px-3 py-1.5 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Salvar dúvida
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// Aba: Banco de questões
// -------------------------------------------------------------------
function Banco({ questoes, setQuestoes, setRespostas }) {
  const [modo, setModo] = useState("lista");
  const [busca, setBusca] = useState("");

  const filtradas = useMemo(() => {
    const b = busca.trim().toLowerCase();
    if (!b) return questoes;
    return questoes.filter(
      (q) =>
        q.enunciado.toLowerCase().includes(b) ||
        q.tema.toLowerCase().includes(b) ||
        (q.exame || "").toLowerCase().includes(b)
    );
  }, [questoes, busca]);

  async function excluir(id) {
    await api.excluirQuestao(id);
    setQuestoes((prev) => prev.filter((q) => q.id !== id));
    setRespostas((prev) => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <SegBtn ativo={modo === "lista"} onClick={() => setModo("lista")}>
          Todas as questões
        </SegBtn>
        <SegBtn ativo={modo === "adicionar"} onClick={() => setModo("adicionar")}>
          <Plus size={15} /> Adicionar uma
        </SegBtn>
        <SegBtn ativo={modo === "importar"} onClick={() => setModo("importar")}>
          <Upload size={15} /> Importar em massa
        </SegBtn>
      </div>

      {modo === "adicionar" && (
        <FormQuestao
          onSalvar={async (q) => {
            const criadas = await api.criarQuestoes(q);
            setQuestoes((prev) => [...criadas, ...prev]);
            setModo("lista");
          }}
        />
      )}

      {modo === "importar" && (
        <Importar
          onImportar={async (novas) => {
            const criadas = await api.criarQuestoes(novas);
            setQuestoes((prev) => [...criadas, ...prev]);
            setModo("lista");
          }}
        />
      )}

      {modo === "lista" && (
        <div>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por enunciado, tema ou exame…"
            className="w-full mb-4 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          {filtradas.length === 0 ? (
            <VazioEstado titulo="Nada por aqui" texto="Nenhuma questão corresponde à busca." />
          ) : (
            <ul className="space-y-2">
              {filtradas.map((q) => (
                <li
                  key={q.id}
                  className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="text-violet-700 font-medium">{q.tema}</span>
                      {q.exame && <span className="text-slate-400">· {q.exame}</span>}
                      <span className="text-slate-400">· gabarito {q.correta}</span>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{q.enunciado}</p>
                  </div>
                  <button
                    onClick={() => excluir(q.id)}
                    className="shrink-0 text-slate-300 hover:text-rose-500 p-1"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function FormQuestao({ onSalvar }) {
  const [tema, setTema] = useState(TEMAS[0]);
  const [exame, setExame] = useState("");
  const [enunciado, setEnunciado] = useState("");
  const [alts, setAlts] = useState({ A: "", B: "", C: "", D: "" });
  const [correta, setCorreta] = useState("A");
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function salvar() {
    if (!enunciado.trim()) return setErro("Escreva o enunciado.");
    if (LETRAS.some((l) => !alts[l].trim())) return setErro("Preencha as quatro alternativas.");
    setErro("");
    setEnviando(true);
    try {
      await onSalvar({
        tema,
        exame: exame.trim(),
        enunciado: enunciado.trim(),
        alternativas: LETRAS.map((l) => ({ letra: l, texto: alts[l].trim() })),
        correta,
        comentario: comentario.trim(),
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Rotulo>Tema</Rotulo>
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
          >
            {TEMAS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <Rotulo>Exame (opcional)</Rotulo>
          <input
            value={exame}
            onChange={(e) => setExame(e.target.value)}
            placeholder="Ex.: 42º Exame"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
      </div>

      <div>
        <Rotulo>Enunciado</Rotulo>
        <textarea
          value={enunciado}
          onChange={(e) => setEnunciado(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
      </div>

      <div className="space-y-2">
        <Rotulo>Alternativas</Rotulo>
        {LETRAS.map((l) => (
          <div key={l} className="flex items-center gap-2">
            <button
              onClick={() => setCorreta(l)}
              title="Marcar como correta"
              className={`shrink-0 w-8 h-8 rounded-full text-xs font-semibold grid place-items-center border transition-colors ${
                correta === l
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-white border-slate-300 text-slate-500 hover:border-emerald-400"
              }`}
            >
              {l}
            </button>
            <input
              value={alts[l]}
              onChange={(e) => setAlts((prev) => ({ ...prev, [l]: e.target.value }))}
              placeholder={`Texto da alternativa ${l}`}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>
        ))}
        <p className="text-xs text-slate-400">O círculo verde marca a alternativa correta.</p>
      </div>

      <div>
        <Rotulo>Comentário / gabarito comentado (opcional)</Rotulo>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
      </div>

      {erro && <p className="text-sm text-rose-600">{erro}</p>}
      <div className="flex justify-end">
        <button
          onClick={salvar}
          disabled={enviando}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
        >
          {enviando ? "Salvando…" : "Salvar questão"}
        </button>
      </div>
    </div>
  );
}

function Importar({ onImportar }) {
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const exemplo = `[
  {
    "tema": "Direito Civil",
    "exame": "42º Exame",
    "enunciado": "Texto da questão...",
    "alternativas": [
      { "letra": "A", "texto": "..." },
      { "letra": "B", "texto": "..." },
      { "letra": "C", "texto": "..." },
      { "letra": "D", "texto": "..." }
    ],
    "correta": "C",
    "comentario": "opcional"
  }
]`;

  async function importar() {
    try {
      const dados = JSON.parse(texto);
      if (!Array.isArray(dados)) throw new Error("O JSON precisa ser uma lista de questões.");
      const validas = dados.filter(
        (q) => q.enunciado && Array.isArray(q.alternativas) && q.correta && q.tema
      );
      if (validas.length === 0) throw new Error("Nenhuma questão válida encontrada.");
      setEnviando(true);
      await onImportar(validas);
      setMsg({ ok: true, texto: `${validas.length} questão(ões) importada(s).` });
      setTexto("");
    } catch (e) {
      setMsg({ ok: false, texto: e.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
      <p className="text-sm text-slate-600">
        Cole uma lista de questões em JSON. Você também pode mandar as provas no chat que eu devolvo
        neste formato pronto para colar aqui.
      </p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={10}
        placeholder={exemplo}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-200"
      />
      {msg && <p className={`text-sm ${msg.ok ? "text-emerald-600" : "text-rose-600"}`}>{msg.texto}</p>}
      <div className="flex items-center justify-between">
        <button onClick={() => setTexto(exemplo)} className="text-xs text-violet-600 hover:underline">
          Preencher com o formato de exemplo
        </button>
        <button
          onClick={importar}
          disabled={enviando}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
        >
          {enviando ? "Importando…" : "Importar"}
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Aba: Dúvidas
// -------------------------------------------------------------------
function Duvidas({ notas, setNotas }) {
  const [texto, setTexto] = useState("");
  const [tema, setTema] = useState("Geral");
  const [filtro, setFiltro] = useState("abertas");

  async function adicionar() {
    if (!texto.trim()) return;
    const nova = await api.criarNota({
      texto: texto.trim(),
      tema: tema === "Geral" ? "" : tema,
      exame: "",
      questaoId: null,
    });
    setNotas((prev) => [nova, ...prev]);
    setTexto("");
  }

  async function alternarResolvida(nota) {
    const atualizada = await api.atualizarNota(nota.id, !nota.resolvida);
    setNotas((prev) => prev.map((n) => (n.id === nota.id ? atualizada : n)));
  }

  async function excluir(id) {
    await api.excluirNota(id);
    setNotas((prev) => prev.filter((n) => n.id !== id));
  }

  const visiveis = notas.filter((n) =>
    filtro === "todas" ? true : filtro === "abertas" ? !n.resolvida : n.resolvida
  );

  return (
    <div className="grid md:grid-cols-[1fr_1.3fr] gap-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
        <h2 className="font-serif text-lg font-semibold text-slate-900 mb-1">Nova dúvida</h2>
        <p className="text-sm text-slate-500 mb-4">
          Anote o que travou durante a prova. Depois filtre por tema para revisar.
        </p>
        <Rotulo>Tema</Rotulo>
        <select
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          className="w-full mb-3 rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
        >
          <option>Geral</option>
          {TEMAS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={5}
          placeholder="Escreva a dúvida…"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
        <button
          onClick={adicionar}
          className="mt-3 w-full px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
        >
          Salvar dúvida
        </button>
      </div>

      <div>
        <div className="flex gap-2 mb-3">
          {[
            ["abertas", "Abertas"],
            ["resolvidas", "Resolvidas"],
            ["todas", "Todas"],
          ].map(([id, nome]) => (
            <SegBtn key={id} ativo={filtro === id} onClick={() => setFiltro(id)}>
              {nome}
            </SegBtn>
          ))}
        </div>

        {visiveis.length === 0 ? (
          <VazioEstado
            titulo="Sem dúvidas aqui"
            texto="As dúvidas que você anotar durante o estudo aparecem nesta lista."
          />
        ) : (
          <ul className="space-y-2">
            {visiveis.map((n) => (
              <li
                key={n.id}
                className={`bg-white rounded-lg border px-4 py-3 ${
                  n.resolvida ? "border-slate-200 opacity-60" : "border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {(n.tema || n.questao_id) && (
                      <div className="flex items-center gap-2 text-xs mb-1 flex-wrap">
                        {n.tema && <span className="text-violet-700 font-medium">{n.tema}</span>}
                        {n.questao_id && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <CircleHelp size={12} /> vinculada a uma questão
                          </span>
                        )}
                      </div>
                    )}
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        n.resolvida ? "line-through text-slate-400" : "text-slate-700"
                      }`}
                    >
                      {n.texto}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => alternarResolvida(n)}
                      title={n.resolvida ? "Reabrir" : "Marcar como resolvida"}
                      className={`p-1 rounded ${
                        n.resolvida
                          ? "text-slate-300 hover:text-slate-500"
                          : "text-emerald-500 hover:text-emerald-600"
                      }`}
                    >
                      {n.resolvida ? <EyeOff size={16} /> : <CircleCheck size={16} />}
                    </button>
                    <button
                      onClick={() => excluir(n.id)}
                      title="Excluir"
                      className="p-1 rounded text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Aba: Progresso
// -------------------------------------------------------------------
function Progresso({ questoes, respostas }) {
  const total = questoes.length;
  const respondidas = Object.keys(respostas).length;
  const acertos = Object.values(respostas).filter((r) => r.acertou).length;
  const pct = respondidas ? Math.round((acertos / respondidas) * 100) : 0;

  const porTema = useMemo(() => {
    const map = {};
    for (const q of questoes) {
      if (!map[q.tema]) map[q.tema] = { total: 0, respondidas: 0, acertos: 0 };
      map[q.tema].total++;
      const r = respostas[q.id];
      if (r) {
        map[q.tema].respondidas++;
        if (r.acertou) map[q.tema].acertos++;
      }
    }
    return Object.entries(map)
      .map(([tema, v]) => ({
        tema,
        ...v,
        pct: v.respondidas ? Math.round((v.acertos / v.respondidas) * 100) : null,
      }))
      .sort((a, b) => b.total - a.total);
  }, [questoes, respostas]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Cartao rotulo="Questões" valor={total} />
        <Cartao rotulo="Respondidas" valor={respondidas} />
        <Cartao rotulo="Acertos" valor={acertos} />
        <Cartao rotulo="Aproveitamento" valor={`${pct}%`} destaque />
      </div>

      <h2 className="font-serif text-lg font-semibold text-slate-900 mb-3">Por tema</h2>
      {porTema.length === 0 ? (
        <VazioEstado titulo="Sem dados ainda" texto="Responda algumas questões para ver seu desempenho." />
      ) : (
        <ul className="space-y-3">
          {porTema.map((t) => (
            <li key={t.tema} className="bg-white rounded-lg border border-slate-200 px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700">{t.tema}</span>
                <span className="text-xs text-slate-500">
                  {t.respondidas}/{t.total} · {t.pct == null ? "—" : `${t.pct}%`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    t.pct == null
                      ? "bg-slate-200"
                      : t.pct >= 70
                      ? "bg-emerald-500"
                      : t.pct >= 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${t.pct == null ? 0 : t.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// UI auxiliares
// -------------------------------------------------------------------
function Chip({ ativo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        ativo
          ? "bg-violet-600 border-violet-600 text-white"
          : "bg-white border-slate-200 text-slate-600 hover:border-violet-300"
      }`}
    >
      {children}
    </button>
  );
}

function SegBtn({ ativo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
        ativo
          ? "bg-slate-900 border-slate-900 text-white"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function Rotulo({ children }) {
  return <label className="block text-xs font-medium text-slate-500 mb-1.5">{children}</label>;
}

function Cartao({ rotulo, valor, destaque }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        destaque ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`text-2xl font-semibold ${destaque ? "text-violet-700" : "text-slate-900"}`}>
        {valor}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{rotulo}</div>
    </div>
  );
}

function VazioEstado({ titulo, texto }) {
  return (
    <div className="text-center py-16 px-4">
      <p className="font-serif text-lg font-semibold text-slate-700 mb-1">{titulo}</p>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">{texto}</p>
    </div>
  );
}