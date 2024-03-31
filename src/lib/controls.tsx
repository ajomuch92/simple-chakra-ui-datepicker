import { Box, Select, Flex, IconButton, Text } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { ChangeEvent } from 'react'
import { isGreaterThanDate, isLessThanDate } from './utils'

export interface LabelDaysProps {
  labels: string[]
  gap?: string
}

export function LabelDays({ labels, gap }: LabelDaysProps) {
  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={gap} marginTop={5}>
      {labels.map((label) => (
        <Text fontSize="12px" key={label}>
          {label}
        </Text>
      ))}
    </Box>
  )
}

export interface MonthSelectProps {
  months?: string[]
  onChange?: (arg0: number) => void
  defaultValue?: number
  currentYear?: number
  maxDate?: Date
  minDate?: Date
  activeColor?: string
}

export function MonthSelect({
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  defaultValue = 0,
  onChange = () => {},
  currentYear,
  maxDate,
  minDate,
}: MonthSelectProps) {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    if (onChange) {
      onChange(value as unknown as number)
    }
  }

  const isMonthDisabled = (month: number): boolean | undefined => {
    if (currentYear) {
      const date = new Date(currentYear, month, 1)
      return isGreaterThanDate(date, maxDate) || isLessThanDate(date, minDate)
    }
    return false
  }

  return (
    <Select
      border="none"
      value={defaultValue}
      onChange={onChangeHandler}
      size="sm"
      maxW="fit-content"
      _focusVisible={{
        borderColor: 'transparent',
      }}
      cursor='pointer'
    >
      {months.map((value, index) => (
        <option value={index} key={index} disabled={isMonthDisabled(index)}>
          {value}
        </option>
      ))}
    </Select>
  )
}

export interface YearSelectProps {
  initialYear?: number
  endYear?: number
  onChange?: (arg0: number) => void
  defaultValue?: number
  maxDate?: Date
  minDate?: Date
  activeColor?: string
}

export function YearSelect({
  defaultValue = new Date().getFullYear(),
  onChange,
  endYear = new Date().getFullYear() + 5,
  initialYear = new Date().getFullYear() - 100,
  maxDate,
  minDate,
}: YearSelectProps) {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    if (onChange) {
      onChange(value as unknown as number)
    }
  }

  const endYearComp = Math.min(endYear, maxDate?.getFullYear() || Infinity)
  const initialYearComp = Math.max(initialYear, minDate?.getFullYear() || -Infinity)

  const years = Array.from(
    Array(endYearComp - initialYearComp + 1).keys(),
    (i) => i + initialYearComp,
  )

  return (
    <Select
      border="none"
      value={defaultValue}
      onChange={onChangeHandler}
      size="sm"
      maxW="fit-content"
      _focusVisible={{
        borderColor: 'transparent',
      }}
      cursor='pointer'
    >
      {years.map((value, index) => (
        <option value={value} key={index}>
          {value}
        </option>
      ))}
    </Select>
  )
}

interface ControlButtonsProps {
  onNext?: () => void
  onPrev?: () => void
  bgColor?: string
  activeColor?: string
}

export function ControlButtons({ onNext, onPrev, bgColor, activeColor }: ControlButtonsProps) {
  return (
    <Flex gap="3px" justifyContent="center">
      <IconButton aria-label="Go back" bg={bgColor} icon={<ChevronLeftIcon />} _hover={{borderColor: activeColor}} onClick={onPrev} />
      <IconButton aria-label="Go ahead" bg={bgColor} icon={<ChevronRightIcon />} _hover={{borderColor: activeColor}} onClick={onNext} />
    </Flex>
  )
}
