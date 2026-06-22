# Charbi

**Estuda os personagens da Bíblia através do tempo.**

Charbi é um site interativo para estudar personagens bíblicos: uma **linha do
tempo** (Gantt das suas vidas) e um **grafo familiar cronológico** que mostra
quando cada figura viveu, o que fez e como se liga às outras — de Adão aos
apóstolos.

A cronologia segue a cronologia bíblica publicada em
[jw.org](https://www.jw.org/pt/), derivada das idades de Génesis 5 e 11 e dos
pontos de ancoragem históricos (criação de Adão em 4026 a.E.C., Dilúvio em 2370
a.E.C., Êxodo em 1513 a.E.C., destruição de Jerusalém em 607 a.E.C., morte de
Jesus em 33 E.C.). Cada personagem tem uma ligação de estudo direta ao jw.org.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Neon** (Postgres serverless) via **Drizzle ORM**
- **React Flow** (`@xyflow/react`) para o grafo
- Deploy na **Vercel**

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preenche DATABASE_URL com a tua connection string da Neon
npm run db:migrate           # cria as tabelas
npm run db:seed              # popula eras, personagens e relações
npm run dev                  # http://localhost:3000
```

### Scripts de base de dados

| Script                | Descrição                                       |
| --------------------- | ----------------------------------------------- |
| `npm run db:generate` | Gera ficheiros de migração a partir do schema   |
| `npm run db:migrate`  | Aplica as migrações à Neon                      |
| `npm run db:seed`     | Limpa e repopula a base de dados                |
| `npm run db:studio`   | Abre o Drizzle Studio                           |

## Estrutura

```
app/               páginas (home, /cronologia, /grafo, /personagens, /personagem/[slug])
components/        UI (timeline-chart, family-graph, cartões, cabeçalho…)
lib/db/            schema e cliente Drizzle/Neon
lib/queries.ts     acesso a dados
data/seed-data.ts  dataset (eras, personagens, relações)
scripts/seed.ts    popula a base de dados
```

## Adicionar personagens

Edita `data/seed-data.ts` (acrescenta a `characters` e, se quiseres, a
`relationships`) e corre `npm run db:seed`. As páginas são geradas a partir da
base de dados, por isso basta um novo build/deploy.

---

Ferramenta pessoal de estudo, sem fins comerciais.
