# Estudo OAB

Aplicação para estudar questões da 1ª fase da OAB, com:

- questões organizadas e filtráveis por tema
- banco de questões com cadastro individual e importação em massa (JSON)
- bloco de dúvidas persistente, com dúvidas avulsas ou vinculadas a uma questão
- painel de progresso geral e por tema

Stack: Next.js (App Router) + PostgreSQL. Frontend e API vivem no mesmo projeto; os dados ficam no seu banco.

---

## 1. Pré-requisitos

- Node.js 18.18 ou superior
- Um PostgreSQL (local via pgAdmin para desenvolver, ou na nuvem para publicar)

## 2. Instalação

```bash
npm install
```

## 3. Banco de dados

Copie `.env.example` para `.env` e ajuste a `DATABASE_URL`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/estudo_oab
```

Crie o banco `estudo_oab` no pgAdmin e rode o conteúdo de `db/schema.sql` nele (abra a Query Tool, cole o arquivo e execute). Isso cria as tabelas `questoes`, `respostas` e `notas`.

Opcional: rode `db/seed.sql` para inserir duas questões de exemplo. Pode apagá-las depois.

## 4. Rodar localmente

```bash
npm run dev
```

Acesse http://localhost:3000

---

## 5. Publicar com um link

Para acessar por um link de qualquer lugar, você precisa de duas coisas: o app hospedado e um PostgreSQL acessível pela internet. O Postgres do seu pgAdmin local não é alcançável pela hospedagem, então use um banco na nuvem (o plano gratuito de qualquer um abaixo já resolve).

Sugestão de caminho (gratuito):

1. Crie um banco no Neon (neon.tech) ou Supabase. Copie a connection string que eles fornecem.
2. No pgAdmin, você pode conectar nesse banco da nuvem usando a mesma connection string e rodar o `db/schema.sql` ali, do jeito que já conhece.
3. Suba o projeto para um repositório no GitHub.
4. Importe o repositório na Vercel (vercel.com). Em Environment Variables, adicione `DATABASE_URL` com a connection string do passo 1.
5. A Vercel faz o deploy e te dá o link (algo como `seu-projeto.vercel.app`).

A partir daí, tudo que você cadastrar fica salvo no banco da nuvem e disponível em qualquer dispositivo pelo link.

Observação sobre acesso: por padrão o link é público e não tem login. Para uso pessoal costuma bastar manter o endereço só com você. Se quiser restringir o acesso ou separar dados por usuário, dá para adicionar autenticação depois.

---

## 6. Como popular as questões

Três formas, todas na aba **Banco de questões**:

- **Adicionar uma**: formulário completo, marcando a alternativa correta.
- **Importar em massa**: cole um array JSON no formato abaixo.
- Enquanto estuda, o botão **Anotar dúvida** salva a dúvida já vinculada à questão e ao tema.

Formato do JSON de importação:

```json
[
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
]
```

O campo `tema` deve bater com um dos temas usados no app para o filtro funcionar. A lista de temas está em `app/page.jsx` (constante `TEMAS`).

---

## 7. Estrutura do projeto

```
estudo-oab/
├── app/
│   ├── api/
│   │   ├── questoes/route.js        GET lista, POST cria (uma ou várias)
│   │   ├── questoes/[id]/route.js   DELETE
│   │   ├── respostas/route.js       GET mapa, POST registra (upsert)
│   │   ├── notas/route.js           GET lista, POST cria
│   │   └── notas/[id]/route.js      PATCH resolvida, DELETE
│   ├── layout.jsx
│   ├── page.jsx                     interface (4 abas)
│   └── globals.css
├── lib/
│   └── db.js                        pool de conexão com o PostgreSQL
├── db/
│   ├── schema.sql                   estrutura das tabelas
│   └── seed.sql                     questões de exemplo (opcional)
├── .env.example
└── package.json
```
