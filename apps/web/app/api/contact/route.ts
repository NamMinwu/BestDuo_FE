import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  nickname: z.string().trim().min(1, "닉네임을 입력해주세요").max(40),
  contact: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(5, "문의 내용을 5자 이상 입력해주세요").max(2000),
  // honeypot — must remain empty
  website: z.string().max(0).optional().default(""),
})

const RATE_LIMIT_WINDOW_MS = 30_000
const ipLastSubmit = new Map<string, number>()

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown"
  return request.headers.get("x-real-ip") ?? "unknown"
}

function escapeForDiscord(input: string): string {
  return input.replace(/```/g, "​`​`​`")
}

export async function POST(request: Request) {
  const webhookUrl = process.env.DISCORD_CONTACT_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: "문의 채널이 설정되지 않았습니다" },
      { status: 503 }
    )
  }

  const ip = getClientIp(request)
  const now = Date.now()
  const last = ipLastSubmit.get(ip) ?? 0
  if (now - last < RATE_LIMIT_WINDOW_MS) {
    return NextResponse.json(
      { success: false, error: "잠시 후 다시 시도해주세요" },
      { status: 429 }
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "잘못된 요청 형식입니다" },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다"
    return NextResponse.json(
      { success: false, error: firstError },
      { status: 400 }
    )
  }

  // honeypot triggered → silently succeed without forwarding
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ success: true })
  }

  const { nickname, contact, message } = parsed.data
  const userAgent = request.headers.get("user-agent") ?? "unknown"

  const embed = {
    title: "새 문의",
    color: 0x4f7bff,
    fields: [
      { name: "닉네임", value: escapeForDiscord(nickname), inline: true },
      {
        name: "연락처",
        value: contact ? escapeForDiscord(contact) : "(없음)",
        inline: true,
      },
      {
        name: "내용",
        value: `\`\`\`\n${escapeForDiscord(message).slice(0, 1900)}\n\`\`\``,
      },
    ],
    footer: { text: `IP ${ip} · ${userAgent.slice(0, 80)}` },
    timestamp: new Date().toISOString(),
  }

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!discordResponse.ok) {
      return NextResponse.json(
        { success: false, error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요" },
        { status: 502 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요" },
      { status: 502 }
    )
  }

  ipLastSubmit.set(ip, now)
  return NextResponse.json({ success: true })
}
