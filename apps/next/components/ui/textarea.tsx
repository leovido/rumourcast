import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, value = "Your fixed text here\n", onChange, ...props }, ref) => {
    const [additionalContent, setAdditionalContent] = React.useState('')
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (!newValue.startsWith(value)) {
        e.target.value = value + additionalContent
        return
      }
      setAdditionalContent(newValue.slice(value.length))
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement
      const selectionStart = target.selectionStart
      
      if (selectionStart! <= value.length && 
          (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault()
      }
    }

    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        value={value + additionalContent}
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
