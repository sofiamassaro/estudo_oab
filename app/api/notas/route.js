import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/notas -> lista todas
export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM notas ORDER BY criada_em DESC");
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}

// POST /api/notas -> cria uma nota
export async function POST(req) {
  try {
    const { texto, tema, exame, questaoId } = await req.json();
    if (!texto || !texto.trim()) {
      return NextResponse.json({ erro: "Texto vazio." }, { status: 400 });
    }
    const { rows } = await pool.query(
      `INSERT INTO notas (texto, tema, exame, questao_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [texto.trim(), tema || "", exame || "", questaoId || null]
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
