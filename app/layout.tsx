import '@radix-ui/themes/styles.css'
import { Container, Theme } from '@radix-ui/themes'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Theme appearance="dark" accentColor="indigo">
          <Container size="2" p="6">
            {children}
          </Container>
        </Theme>
      </body>
    </html>
  )
}
