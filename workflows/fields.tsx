'use client'

// The workflow's fields, drawn with Radix Themes. One map from field type to
// component: swap this file for MUI, Ant Design or your own, and every form changes.

import type { DefaultFieldComponent, DefaultFieldProps } from '@clipless/react'
import { Flex, Select, Text, TextArea, TextField } from '@radix-ui/themes'
import type { ReactNode } from 'react'

const text = (v: unknown) => (v == null ? '' : String(v))

function Labelled({ api, field, children }: DefaultFieldProps & { children: ReactNode }) {
  return (
    <Flex direction="column" gap="1" mb="4">
      <Text as="label" htmlFor={api.name} size="2" weight="medium">
        {field.label}
      </Text>
      {children}
      {api.touched && api.error && (
        <Text size="1" color="red">
          {api.error}
        </Text>
      )}
    </Flex>
  )
}

const Input: DefaultFieldComponent = ({ api, field }) => (
  <Labelled api={api} field={field}>
    <TextField.Root id={api.name} type={field.type === 'email' ? 'email' : 'text'} value={text(api.value)} onChange={api.onChange} onBlur={api.onBlur} />
  </Labelled>
)

const NumberInput: DefaultFieldComponent = ({ api, field }) => (
  <Labelled api={api} field={field}>
    <TextField.Root
      id={api.name}
      type="number"
      value={text(api.value)}
      onChange={(e) => api.setValue(e.target.value === '' ? undefined : Number(e.target.value))}
      onBlur={api.onBlur}
    />
  </Labelled>
)

const SelectInput: DefaultFieldComponent = ({ api, field }) => (
  <Labelled api={api} field={field}>
    <Select.Root value={api.value ? text(api.value) : undefined} onValueChange={api.setValue} onOpenChange={(open) => !open && api.onBlur()}>
      <Select.Trigger id={api.name} placeholder="Choose…" />
      <Select.Content>
        {field.options?.map((o) => (
          <Select.Item key={text(o.value)} value={text(o.value)}>
            {o.label ?? text(o.value)}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  </Labelled>
)

const TextAreaInput: DefaultFieldComponent = ({ api, field }) => (
  <Labelled api={api} field={field}>
    <TextArea id={api.name} value={text(api.value)} onChange={api.onChange} onBlur={api.onBlur} />
  </Labelled>
)

export const fields = { text: Input, email: Input, number: NumberInput, select: SelectInput, textarea: TextAreaInput }
