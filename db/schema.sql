-- ============================================================
-- Estudo OAB - estrutura do banco (PostgreSQL)
-- Rode este arquivo uma vez no pgAdmin (ou psql) para criar as tabelas.
-- ============================================================

CREATE TABLE IF NOT EXISTS questoes (
  id          SERIAL PRIMARY KEY,
  tema        TEXT        NOT NULL,
  exame       TEXT        NOT NULL DEFAULT '',
  enunciado   TEXT        NOT NULL,
  alternativas JSONB      NOT NULL,          -- [{ "letra": "A", "texto": "..." }, ...]
  correta     TEXT        NOT NULL,          -- "A" | "B" | "C" | "D"
  comentario  TEXT        NOT NULL DEFAULT '',
  criada_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Uma resposta corrente por questao (a ultima escolha vale).
CREATE TABLE IF NOT EXISTS respostas (
  questao_id  INTEGER     PRIMARY KEY REFERENCES questoes(id) ON DELETE CASCADE,
  escolhida   TEXT        NOT NULL,
  acertou     BOOLEAN     NOT NULL,
  em          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notas (
  id          SERIAL      PRIMARY KEY,
  texto       TEXT        NOT NULL,
  tema        TEXT        NOT NULL DEFAULT '',
  exame       TEXT        NOT NULL DEFAULT '',
  questao_id  INTEGER     REFERENCES questoes(id) ON DELETE SET NULL,
  resolvida   BOOLEAN     NOT NULL DEFAULT false,
  criada_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questoes_tema ON questoes(tema);
CREATE INDEX IF NOT EXISTS idx_notas_resolvida ON notas(resolvida);
