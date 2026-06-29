export type FormState = {
  tripGoal: string
  country: string
  agency: string
  notes: string
  startDate: Date | null
  endDate: Date | null
}

export const INITIAL_STATE: FormState = {
  tripGoal: '',
  country: '',
  agency: '',
  notes: '',
  startDate: null,
  endDate: null,
}
