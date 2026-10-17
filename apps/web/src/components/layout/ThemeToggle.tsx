import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from 'cn'

type Choice = 'light' | 'dark' | 'system'

const OPTIONS: { id: Choice; label: string; Icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
  { id: 'system', label: 'System', Icon: Monitor },
]

function stored(): Choice {
  try {
    const v = localStorage.getItem('theme')
    return v === 'dark' || v === 'system' ? v : 'light'
  } catch {
    return 'light'
  }
}

function apply(choice: Choice) {
  const dark = choice === 'dark' || (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

/** Light, dark or follow the system. A labelled group of buttons, so it reads clearly and works by keyboard. */
export function ThemeSwitch() {
  const [choice, setChoice] = useState<Choice>('light')

  useEffect(() => {
    setChoice(stored())
  }, [])

  useEffect(() => {
    if (choice !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [choice])

  function pick(next: Choice) {
    setChoice(next)
    apply(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked; the theme still changes for this visit.
    }
  }

  return (
    <div role="group" aria-label="Color theme" className="bg-muted border-border inline-flex gap-1 rounded-full border p-1">
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={choice === id}
          aria-label={label}
          title={label}
          onClick={() => pick(id)}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-full border transition-colors',
            choice === id ? 'bg-card text-foreground border-border' : 'text-muted-foreground hover:text-foreground border-transparent',
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  )
}

/** Inline head script: light unless the visitor chose dark or system. Runs before paint. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})();`
