import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const WatchlistCover = ({id, name }: { id: number, name: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Watchlist</CardDescription>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardFooter className='flex flex-row gap-2'>
        <Button>Edit</Button>
        <Button variant="outline">Delete</Button>
      </CardFooter>
    </Card>
  )
}
