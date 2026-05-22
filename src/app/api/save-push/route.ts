import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const { reminderTime, subscription, accessToken } = await req.json()
    if (!reminderTime || !subscription || !accessToken) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    // Crear cliente de Supabase con el token del usuario
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    )

    // Verificar usuario autenticado
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Guardar o actualizar la suscripción y hora
    const { error } = await supabase
      .from("user_push_subscriptions")
      .upsert({
        user_id: user.id,
        subscription,
        reminder_time: reminderTime
      }, { onConflict: "user_id" })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
