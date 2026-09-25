import '@radix-ui/themes/styles.css'
import { Container, Theme } from '@radix-ui/themes'
import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Theme appearance="dark" accentColor="indigo">
          <SiteHeader />
          <Container size="3" p="6">
            {children}
          </Container>
        </Theme>
      </body>
    </html>
  )
}
