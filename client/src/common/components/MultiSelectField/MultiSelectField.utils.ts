import { OTHER_FILE_TYPE } from '../../constants/fileTypes'

// Split the free-text "Other" field into trimmed, non-empty values.
export const parseOtherValues = (text: string) =>
  text
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

/**
 * Combine fixed selections with any comma-separated values typed under "Other",
 * dropping the sentinel itself. Use on submit to build the value list to send.
 */
export const mergeOtherValues = (
  value: string[],
  otherText: string,
  otherValue = OTHER_FILE_TYPE,
) => {
  const fixed = value.filter((item) => item !== otherValue)
  const custom = value.includes(otherValue) ? parseOtherValues(otherText) : []
  return [...fixed, ...custom]
}
