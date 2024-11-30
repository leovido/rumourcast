import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'> & { text?: string, defaultValue: string }>(
  ({ className, defaultValue = "", text = "", onChange, ...props }, ref) => {
    console.log('Current text:', text)
    console.log('Default value:', defaultValue)
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      
      if (!newValue.startsWith(defaultValue)) {
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: defaultValue
          }
        }
        onChange?.(newEvent as React.ChangeEvent<HTMLTextAreaElement>)
        return
      }
      
      const newContent = newValue.slice(defaultValue.length)
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: newContent
        }
      }
      console.log('Sending to parent:', newEvent.target.value)
      onChange?.(newEvent as React.ChangeEvent<HTMLTextAreaElement>)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement
      const selectionStart = target.selectionStart
      
      if (selectionStart! <= defaultValue.length && 
          (e.key === 'Backspace' || e.key === 'Delete' || 
           e.key === 'ArrowLeft' || e.key === 'Home')) {
        e.preventDefault()
        if (e.key === 'Home') {
          target.setSelectionRange(defaultValue.length, defaultValue.length)
        }
      }
    }

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        value={defaultValue + (text || '')}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
