// A value/label pair for select and toggle option lists.
export type SelectOption<T extends string = string> = {
  value: T
  label: string
}
