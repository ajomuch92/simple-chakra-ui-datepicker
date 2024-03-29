import { ReactNode, useEffect, useState } from 'react'
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
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons';
import { ternary, isSameDate, isGreaterThanDate, isLessThanDate } from './utils';
import { ControlButtons, LabelDays, MonthSelect, YearSelect } from './controls';

export interface SimpleDatePickerProps {
  isDisabled?: boolean
  icon?: ReactNode
  containerProps?: Omit<BoxProps, 'position' | 'backgroundColor' | 'opacity'>
  withArrow?: boolean,
  popoverProps?: PopoverProps,
  closable?: boolean,
  placeholder?: string,
  inputProps?: Omit<InputProps, 'placeholder' | 'isReadOnly' | 'defaultValue'>
  defaultValue?: Date,
  todayLabel?: string,
  clearLabel?: string,
  daysLabels?: string[],
  months?: string[],
  colorSchema?: string,
  activeColor?: string,
  inactiveColor?: string,
  // disabledWeekend?: boolean,
  maxDate?: Date,
  minDate?: Date,
  disabledDates?: Date[],
  formatDate?: (arg0: Date) => string,
  onChange?: (arg0: Date) => void,
}

export default function SimpleDatePicker({
    isDisabled = false,
    icon = <CalendarIcon />,
    withArrow = true,
    closable = true,
    containerProps,
    popoverProps,
    inputProps,
    placeholder= 'Pick a date',
    clearLabel = 'Clear',
    todayLabel = 'Today',
    daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    defaultValue,
    months,
    colorSchema= 'blue',
    activeColor = 'blue.400',
    inactiveColor = 'gray.50',
    maxDate,
    minDate,
    onChange,
    formatDate,
  } : SimpleDatePickerProps
  ) {
  const [currentText, setCurrentText] = useState('');
  const [currentValue, setCurrentValue] = useState<Date>(defaultValue || new Date());
  const [isPicked, setIsPicket] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(currentValue.getMonth());
  const [currentYear, setCurrentYear] = useState(currentValue.getFullYear());
  const initialMonthDay = new Date(currentYear, currentMonth);
  const finalMonthDate = new Date(currentYear, currentMonth + 1, 0);
  const initialWeekDay = initialMonthDay.getDay();
  const blankDays = new Array(initialWeekDay).fill(undefined);
  const filledDays = new Array(finalMonthDate.getDate()).fill(undefined).map((_, index) => index + 1);
  const daysOfMonth: Array<number|undefined> = [...blankDays, ...filledDays];

  const setInternalDate = (date: Date) => {
    setCurrentValue(date);
    setIsPicket(true);
    if (onChange) {
      onChange(date);
    }
  }

  const setDate = (day?: number) => {
    if (!day) return;
    const date = new Date(currentYear, currentMonth, day);
    setInternalDate(date);
  }

  useEffect(() => {
    if (isPicked) {
      if (formatDate) setCurrentText(formatDate(currentValue));
      else setCurrentText(currentValue.toLocaleDateString());
    }
  }, [setCurrentText, currentValue, isPicked, formatDate]);

  const Calendar = () => {
    return <>
      {
        daysOfMonth.map((val, index) => {
          const localCurrentDate = ternary<Date | undefined>(val, new Date(currentYear, currentMonth, val), val);
          const isActiveDate = isSameDate(currentValue, localCurrentDate);
          let isDisabled = false;
          if (localCurrentDate && maxDate) {
            isDisabled = isGreaterThanDate(maxDate, localCurrentDate);
          }
          if (localCurrentDate && minDate) {
            isDisabled = isLessThanDate(localCurrentDate, minDate);
          }
          return <Box
            as={ternary(val, 'button', 'span')}
            key={index}
            bg={ternary(val, ternary(isActiveDate, activeColor , inactiveColor),'transparent')}
            textColor={ternary(isActiveDate, 'white' , 'black')}
            aspectRatio={1}
            borderRadius='md'
            display='flex'
            justifyContent='center'
            alignItems='center'
            disabled={isDisabled}
            cursor={ternary(val,'pointer','default')}
            _hover={ternary(val, {bg: activeColor, color: 'white'}, {})}
            onClick={() => {
              setDate(val);
            }}
          >
            {val}
          </Box>
        })
      }
    </>
  }

  const onNext = () => {
    setCurrentMonth((val) => ternary(val !== 11, val + 1, 0));
    if (currentMonth === 11) {
      setCurrentYear((val) => val + 1);
    }
  }

  const onPrev = () => {
    setCurrentMonth((val) => ternary(val !== 0, val - 1, 11));
    if (currentMonth === 0) {
      setCurrentYear((val) => val - 1);
    }
  }

  const setToday = () => {
    const date = new Date();
    setInternalDate(date);
  }

  return (
    <Popover {...popoverProps}>
      <PopoverTrigger>
        <Box position='relative' pointerEvents={isDisabled ? 'none':undefined} backgroundColor={isDisabled ? 'gray.100' : undefined} opacity={isDisabled ? 0.8 : 1} {...containerProps}>
          <Input isReadOnly placeholder={placeholder} defaultValue={currentText} cursor='pointer' {...inputProps} />
          <Box as='span' position='absolute' right='0.5rem' top='50%' transform='translateY(-50%)'>
            {icon}
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        {withArrow && <PopoverArrow />}
        {closable && <PopoverCloseButton />}
        <PopoverBody>
          <Flex mt={6} alignItems='center' justifyContent='space-around'>
            <MonthSelect defaultValue={currentMonth} months={months} currentYear={currentYear} maxDate={maxDate} minDate={minDate} onChange={(e) => setCurrentMonth(e)} />
            <YearSelect defaultValue={currentYear} maxDate={maxDate} minDate={minDate} onChange={(e) => setCurrentYear(e)}/>
            <ControlButtons bgColor={inactiveColor} onNext={onNext} onPrev={onPrev}/>
          </Flex>
          <LabelDays labels={daysLabels} />
          <Box display='grid' gridTemplateColumns='repeat(7, 1fr)' gap='5px' marginTop={2}>
            <Calendar />
          </Box>
        </PopoverBody>
        <PopoverFooter>
          <Box display='flex' justifyContent='space-between'>
            <Button size='sm' colorScheme={colorSchema} onClick={setToday}>{todayLabel}</Button>
            <Button size='sm' variant='ghost' colorScheme={colorSchema}>{clearLabel}</Button>
          </Box>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}