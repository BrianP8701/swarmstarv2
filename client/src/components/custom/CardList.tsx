// src/components/custom/CardList.tsx
import * as React from 'react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

type CardProps = {
  title?: string
  description?: string
  footer?: React.ReactNode
  headerRight?: React.ReactNode
  content?: React.ReactNode
  contentClassName?: string // Added contentClassName prop
  className?: string
}

type CardListProps = {
  cards: CardProps[]
  className?: string
}

export default function CardList({ cards, className }: CardListProps) {
  return (
    <div className={cn('w-full space-y-4', className)}>
      {cards.map((card, index) => (
        <Card key={index} className={cn('flex flex-col', card.className)}>
          {(card.title || card.description || card.headerRight) && (
            <CardHeader>
              <div className='flex items-center justify-between'>
                {card.title && <CardTitle>{card.title}</CardTitle>}
                {card.headerRight && <div>{card.headerRight}</div>}
              </div>
              {card.description && <CardDescription>{card.description}</CardDescription>}
            </CardHeader>
          )}
          {card.content && <CardContent className={card.contentClassName}>{card.content}</CardContent>}
          {card.footer && <CardFooter>{card.footer}</CardFooter>}
        </Card>
      ))}
    </div>
  )
}
