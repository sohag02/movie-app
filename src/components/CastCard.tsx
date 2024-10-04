'use client'
import { type Cast } from "@/lib/interfaces"
import { getImage } from "@/lib/tmdb"
import Image from "next/image"
import { User } from "lucide-react"

type CastCardProps = {
  cast: Cast
}

export const CastCard = ({ cast }: CastCardProps) => {
  return (
    <div className="w-32 flex flex-col items-center justify-center">
      {cast.profile_path ? (
        <Image
          src={getImage(cast.profile_path, "w200")}
          alt={cast.name}
          width={128}
          height={128}
          className="w-32 h-32 rounded-full object-cover"
        />
      ) : (
        <User className="w-32 h-32 rounded-full object-cover bg-gray-400" />
      )}
      <p className="text-sm pt-1 font-medium truncate-multiline-2">{cast.name}</p>
      <p className="text-xs text-gray-500 truncate-multiline-2">{cast.character}</p>
    </div>
  )
}
