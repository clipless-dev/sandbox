import { withClipless } from '@clipless/react/next'

// withClipless strips what only api.clipless.dev reads (prompts, webhook addresses, email
// text) from every workflow file, and makes `?role=` imports hold one role's stages.
export default withClipless({})
