import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/posicoes -> { "tema::Direito Civil": 4, "exame::42º Exame": 7, ... }
export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM posicoes");
    const mapa = {};
    for (const p of rows) {
      mapa[`${p.eixo}::${p.valor}`] = p.indice;
    }
    return NextResponse.json(mapa);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}

// POST /api/posicoes -> salva a posição (upsert por eixo+valor)
export async function POST(req) {
  try {
    const { eixo, valor, indice } = await req.json();
    await pool.query(
      `INSERT INTO posicoes (eixo, valor, indice)
       VALUES ($1, $2, $3)
       ON CONFLICT (eixo, valor)
       DO UPDATE SET indice = $3, em = now()`,
      [eixo, valor, indice]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}