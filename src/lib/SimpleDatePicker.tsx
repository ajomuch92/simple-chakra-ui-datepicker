import { ReactElement, useEffect, useState } from 'react'
import {
  Box,
  BoxProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverProps,
  Input,
  InputProps,
  Button,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import { ternary, isSameDate, isGreaterThanDate, isLessThanDate } from './utils'
import { ControlButtons, LabelDays, MonthSelect, YearSelect } from './controls'

export interface SimpleDatePickerProps {
  isDisabled?: boolean
  icon?: ReactElement
  rightArrowIcon?: ReactElement
  leftArrowIcon?: ReactElement
  containerProps?: Omit<BoxProps, 'position' | 'backgroundColor' | 'opacity'>
  withArrow?: boolean
  isInvalid?: boolean
  popoverProps?: Omit<PopoverProps, 'isOpen' | 'onClose'>
  closable?: boolean
  closeOnClick?: boolean
  placeholder?: string
  inputProps?: Omit<
    InputProps,
    'placeholder' | 'isReadOnly' | 'defaultValue' | 'colorSchema' | 'isInvalid' | 'onClick'
  >
  defaultValue?: Date
  todayLabel?: string
  clearLabel?: string
  daysLabels?: string[]
  months?: string[]
  colorSchema?: string
  activeColor?: string
  inactiveColor?: string
  disabledWeekend?: boolean
  maxDate?: Date
  minDate?: Date
  disabledDates?: Date[]
  monthGap?: string
  dateBorderRadius?: string
  formatDate?: (arg0: Date) => string
  onChange?: (arg0?: Date) => void
}

export default function SimpleDatePicker({
  isDisabled = false,
  icon = <CalendarIcon />,
  rightArrowIcon,
  leftArrowIcon,
  withArrow = true,
  closable = true,
  closeOnClick = true,
  isInvalid,
  containerProps,
  popoverProps,
  inputProps,
  placeholder = 'Pick a date',
  clearLabel = 'Clear',
  todayLabel = 'Today',
  daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  defaultValue,
  months,
  colorSchema = 'blue',
  activeColor = 'blue.400',
  inactiveColor = 'gray.50',
  monthGap = '5px',
  dateBorderRadius = 'md',
  disabledDates,
  disabledWeekend,
  maxDate,
  minDate,
  onChange,
  formatDate,
}: SimpleDatePickerProps) {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [currentText, setCurrentText] = useState('')
  const [currentValue, setCurrentValue] = useState<Date | undefined>(defaultValue)
  const currentValueTemp = currentValue || new Date()
  const [currentMonth, setCurrentMonth] = useState(currentValueTemp.getMonth())
  const [currentYear, setCurrentYear] = useState(currentValueTemp.getFullYear())
  const initialMonthDay = new Date(currentYear, currentMonth)
  const finalMonthDate = new Date(currentYear, currentMonth + 1, 0)
  const initialWeekDay = initialMonthDay.getDay()
  const blankDays = new Array(initialWeekDay).fill(undefined)
  const filledDays = new Array(finalMonthDate.getDate())
    .fill(undefined)
    .map((_, index) => index + 1)
  const daysOfMonth: Array<number | undefined> = [...blankDays, ...filledDays]

  const setInternalDate = (date?: Date) => {
    setCurrentValue(date)
    if (onChange) {
      onChange(date)
    }
  }

  const setDate = (day?: number) => {
    if (!day) return
    const date = new Date(currentYear, currentMonth, day)
    setInternalDate(date)
  }

  useEffect(() => {
    if (!currentValue) setCurrentText('')
    else {
      if (formatDate) setCurrentText(formatDate(currentValue))
      else setCurrentText(currentValue.toLocaleDateString())
    }
  }, [setCurrentText, currentValue, formatDate])

  const Calendar = () => {
    return (
      <>
        {daysOfMonth.map((val, index) => {
          const localCurrentDate = ternary<Date | undefined>(
            val,
            new Date(currentYear, currentMonth, val),
            val,
          )
          const isActiveDate = isSameDate(currentValue, localCurrentDate)
          let isDisabledWithMaxDate = false
          let isDisabledWithMinDate = false
          if (localCurrentDate && maxDate) {
            isDisabledWithMaxDate = isGreaterThanDate(localCurrentDate, maxDate)
          }
          if (localCurrentDate && minDate) {
            isDisabledWithMinDate = isLessThanDate(localCurrentDate, minDate)
          }
          const isWithinDisabledDates =
            Array.isArray(disabledDates) &&
            disabledDates.some((r) => isSameDate(localCurrentDate, r))
          const isDisabledWeekend =
            localCurrentDate && disabledWeekend && [0, 6].includes(localCurrentDate.getDay())
          const isDisabled =
            isDisabledWithMaxDate ||
            isDisabledWithMinDate ||
            isWithinDisabledDates ||
            isDisabledWeekend
          return (
            <Box
              as={ternary(val, 'button', 'span')}
              key={index}
              bg={ternary(val, ternary(isActiveDate, activeColor, inactiveColor), 'transparent')}
              textColor={ternary(isActiveDate, 'white', 'black')}
              aspectRatio={1}
              borderRadius={dateBorderRadius}
              display="flex"
              justifyContent="center"
              alignItems="center"
              disabled={isDisabled}
              _disabled={{
                opacity: 0.5,
                cursor: 'not-allowed',
              }}
              cursor={ternary(val, 'pointer', 'default')}
              _hover={ternary(
                val,
                {
                  bg: ternary(isDisabled, inactiveColor, activeColor),
                  color: ternary(isDisabled, 'initial', 'white'),
                  borderColor: 'transparent',
                },
                {},
              )}
              onClick={() => {
                if (!isDisabled) {
                  setDate(val)
                  if (closeOnClick) onClose()
                }
              }}
            >
              {val}
            </Box>
          )
        })}
      </>
    )
  }

  const onNext = () => {
    setCurrentMonth((val) => ternary(val !== 11, val + 1, 0))
    if (currentMonth === 11) {
      setCurrentYear((val) => val + 1)
    }
  }

  const onPrev = () => {
    setCurrentMonth((val) => ternary(val !== 0, val - 1, 11))
    if (currentMonth === 0) {
      setCurrentYear((val) => val - 1)
    }
  }

  const setToday = () => {
    const date = new Date()
    setInternalDate(date)
  }

  return (
    <Popover isOpen={isOpen} onClose={onClose} {...popoverProps}>
      <PopoverTrigger>
        <Box
          position="relative"
          pointerEvents={isDisabled ? 'none' : undefined}
          backgroundColor={isDisabled ? 'gray.100' : undefined}
          opacity={isDisabled ? 0.8 : 1}
          {...containerProps}
        >
          <Input
            isReadOnly
            placeholder={placeholder}
            defaultValue={currentText}
            colorScheme={colorSchema}
            cursor="pointer"
            isInvalid={isInvalid}
            onClick={onToggle}
            {...inputProps}
          />
          <Box as="span" position="absolute" right="0.5rem" top="50%" transform="translateY(-50%)">
            {icon}
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        {withArrow && <PopoverArrow />}
        {closable && <PopoverCloseButton />}
        <PopoverBody>
          <Flex mt={closable ? 6 : 2} alignItems="center" justifyContent="space-around">
            <MonthSelect
              defaultValue={currentMonth}
              months={months}
              currentYear={currentYear}
              maxDate={maxDate}
              minDate={minDate}
              activeColor={activeColor}
              onChange={(e) => setCurrentMonth(e)}
            />
            <YearSelect
              defaultValue={currentYear}
              maxDate={maxDate}
              minDate={minDate}
              activeColor={activeColor}
              onChange={(e) => setCurrentYear(e)}
            />
            <ControlButtons
              bgColor={inactiveColor}
              activeColor={activeColor}
              rightArrowIcon={rightArrowIcon}
              leftArrowIcon={leftArrowIcon}
              onNext={onNext}
              onPrev={onPrev}
            />
          </Flex>
          <LabelDays labels={daysLabels} gap={monthGap} />
          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={monthGap} marginTop={2}>
            <Calendar />
          </Box>
        </PopoverBody>
        <PopoverFooter>
          <Box display="flex" justifyContent="space-between">
            <Button
              size="sm"
              colorScheme={colorSchema}
              bg={activeColor}
              onClick={setToday}
              _hover={{ borderColor: 'transparent' }}
            >
              {todayLabel}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color={activeColor}
              colorScheme={colorSchema}
              _hover={{ borderColor: activeColor }}
              onClick={() => {
                setInternalDate(undefined)
              }}
            >
              {clearLabel}
            </Button>
          </Box>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
