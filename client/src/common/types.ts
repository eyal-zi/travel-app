// A value/label pair for select and toggle option lists.
export type SelectOption<T extends string = string> = {
  value: T
  label: string
  // Optional group label. Consecutive options sharing a group are rendered under
  // a subheader in grouped selects (see toOptionGroups); ungrouped options render
  // at the top level.
  group?: string
}
