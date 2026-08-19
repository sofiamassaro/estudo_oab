import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/respostas -> { [questaoId]: { escolhida, acertou } }
export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM respostas");
    const mapa = {};
    for (const r of rows) {
      mapa[r.questao_id] = { escolhida: r.escolhida, acertou: r.acertou };
    }
    return NextResponse.json(mapa);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}

// POST /api/respostas -> registra a resposta (upsert por questao)
export async function POST(req) {
  try {
    const { questaoId, escolhida, acertou } = await req.json();
    await pool.query(
      `INSERT INTO respostas (questao_id, escolhida, acertou)
       VALUES ($1, $2, $3)
       ON CONFLICT (questao_id)
       DO UPDATE SET escolhida = $2, acertou = $3, em = now()`,
      [questaoId, escolhida, acertou]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
