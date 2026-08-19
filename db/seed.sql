-- Dados de exemplo (opcional). Rode depois do schema.sql.
-- Sao questoes ilustrativas, nao copias de provas reais. Pode apagar quando quiser.

INSERT INTO questoes (tema, exame, enunciado, alternativas, correta, comentario) VALUES
(
  'Etica e Estatuto da OAB',
  'Exemplo',
  'Segundo o Estatuto da Advocacia, sobre o sigilo profissional do advogado, assinale a afirmativa correta.',
  '[
    {"letra":"A","texto":"O sigilo cede diante de qualquer requisicao judicial."},
    {"letra":"B","texto":"O sigilo e inerente a profissao e independe de solicitacao de reserva."},
    {"letra":"C","texto":"O sigilo so existe se houver contrato escrito com o cliente."},
    {"letra":"D","texto":"O sigilo pode ser dispensado unilateralmente pelo advogado a qualquer tempo."}
  ]'::jsonb,
  'B',
  'O sigilo profissional e inerente ao exercicio da advocacia, abrangendo fatos conhecidos em razao da atividade.'
),
(
  'Direito Constitucional',
  'Exemplo',
  'Sobre os direitos e garantias fundamentais, o mandado de seguranca e cabivel para proteger',
  '[
    {"letra":"A","texto":"direito liquido e certo nao amparado por habeas corpus ou habeas data."},
    {"letra":"B","texto":"qualquer direito, ainda que dependa de dilacao probatoria."},
    {"letra":"C","texto":"exclusivamente direitos de natureza patrimonial."},
    {"letra":"D","texto":"apenas direitos coletivos, jamais individuais."}
  ]'::jsonb,
  'A',
  'O mandado de seguranca tutela direito liquido e certo, comprovavel de plano, quando nao amparado por HC ou HD.'
);
