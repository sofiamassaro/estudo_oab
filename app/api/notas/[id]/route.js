import pool from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH /api/notas/:id -> alterna o campo resolvida
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { resolvida } = await req.json();
    const { rows } = await pool.query(
      "UPDATE notas SET resolvida = $1 WHERE id = $2 RETURNING *",
      [resolvida, id]
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}

// DELETE /api/notas/:id
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM notas WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
