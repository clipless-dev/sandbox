import { Badge, Box, Flex, Link, Text } from '@radix-ui/themes'
import NextLink from 'next/link'

export function SiteHeader() {
  return (
    <Box asChild px="6" py="3" style={{ borderBottom: '1px solid var(--gray-a5)', background: 'var(--color-panel-solid)' }}>
      <header>
        <Flex align="center" gap="3">
          <Link asChild color="gray" highContrast underline="none">
            <NextLink href="/">
              <Text weight="bold" size="4">
                Clipless
              </Text>
            </NextLink>
          </Link>
          <Text size="3" color="gray">
            Expense claims
          </Text>
          <Badge color="amber" variant="soft">
            Sandbox
          </Badge>
          <Flex ml="auto" gap="4">
            <Link href="https://clipless.dev/docs/" size="2" color="gray">
              Docs
            </Link>
            <Link href="https://github.com/dsego/clipless-sandbox" size="2" color="gray">
              Source
            </Link>
          </Flex>
        </Flex>
      </header>
    </Box>
  )
}
