import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'> & { 
  text?: string, 
  defaultValue: string,
  disabled?: boolean 
}>(
  ({ className, defaultValue = "", text = "", onChange, disabled = false, ...props }, ref) => {    
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
          'flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        value={defaultValue + (text || '')}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
