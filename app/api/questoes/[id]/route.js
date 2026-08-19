import pool from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE /api/questoes/:id
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM questoes WHERE id = $1", [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ erro: e.message }, { status: 500 });
  }
}
