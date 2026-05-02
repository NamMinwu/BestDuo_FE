import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "BestDuo · 최고의 듀오 통계"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at 25% 20%, rgba(79,123,255,0.35), transparent 55%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.30), transparent 55%), #060816",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 36,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#94a3b8",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, #4f7bff 0%, #a855f7 100%)",
              display: "block",
            }}
          />
          BestDuo
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 1.05,
            backgroundImage:
              "linear-gradient(135deg, #ffffff 0%, #4f7bff 55%, #a855f7 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          최고의 듀오 통계
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 38,
            color: "#cbd5e1",
            display: "flex",
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.3,
          }}
        >
          두 플레이어의 시너지와 데이터를 연결해 최적의 듀오 조합을
          찾아드립니다
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 28,
            color: "#64748b",
            display: "flex",
          }}
        >
          bestduo.cloud
        </div>
      </div>
    ),
    { ...size },
  )
}
