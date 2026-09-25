// TypeScript does not know what `?role=` means; each role this app imports is declared once.
type RoleWorkflow = import('react').ComponentType<Partial<import('@clipless/react').WorkflowProps>>
declare module '*?role=employee' {
  const Workflow: RoleWorkflow
  export default Workflow
}
declare module '*?role=manager' {
  const Workflow: RoleWorkflow
  export default Workflow
}
declare module '*?role=finance' {
  const Workflow: RoleWorkflow
  export default Workflow
}
