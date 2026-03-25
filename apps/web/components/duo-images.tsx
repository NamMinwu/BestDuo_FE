import Image from "next/image"

export function DuoImages({
  adcImage,
  supImage,
  adcName,
  supName,
  size = 40,
}: {
  adcImage: string
  supImage: string
  adcName: string
  supName: string
  size?: number
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <Image
        src={adcImage}
        alt={adcName}
        width={size}
        height={size}
        className="rounded-sm border border-border"
      />
      <Image
        src={supImage}
        alt={supName}
        width={size}
        height={size}
        className="rounded-sm border border-border"
      />
    </div>
  )
}
