import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/questoes -> lista todas
export async function GET() {
  try {
    const { rows } = await pool.query(
  "SELECT * FROM questoes ORDER BY exame, numero NULLS LAST, criada_em"
);
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}

// POST /api/questoes -> cria uma questao ou um array delas (importacao em massa)
export async function POST(req) {
  try {
    const body = await req.json();
    const lista = Array.isArray(body) ? body : [body];
    const inseridas = [];

    for (const q of lista) {
      if (!q.enunciado || !q.tema || !q.correta || !Array.isArray(q.alternativas)) continue;
        const { rows } = await pool.query(
          `INSERT INTO questoes (tema, exame, enunciado, alternativas, correta, comentario, numero)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *`,
          [
            q.tema,
            q.exame || "",
            q.enunciado,
            JSON.stringify(q.alternativas),
            q.correta,
            q.comentario || "",
            q.numero || null,
          ]
        );
      inseridas.push(rows[0]);
    }

    return NextResponse.json(inseridas);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
