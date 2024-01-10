import { ReactNode, useState } from 'react'
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
  Text,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons';

export interface SimpleDatePickerProps {
  isDisabled?: boolean
  icon?: ReactNode
  containerProps?: Omit<BoxProps, 'position' | 'backgroundColor' | 'opacity'>
  withArrow?: boolean,
  popoverProps?: PopoverProps,
  closable?: boolean,
  placeholder?: string,
  inputProps?: Omit<InputProps, 'placeholder' | 'isReadOnly' | 'defaultValue'>
  value?: Date,
  todayLabel?: string,
  clearLabel?: string,
  daysLabels?: string[]
}

export default function SimpleDatePicker({
    isDisabled = false,
    icon = <CalendarIcon />,
    withArrow = true,
    closable = true,
    containerProps,
    popoverProps,
    inputProps,
    placeholder,
    clearLabel = 'Clear',
    todayLabel = 'Today',
    daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    value = new Date()
  } : SimpleDatePickerProps
  ) {
  const [currentText, setCurrentText] = useState('')
  const [currentValue, setCurrentValue] = useState<Date>(value)

  return (
    <Popover {...popoverProps}>
      <PopoverTrigger>
        <Box position='relative' backgroundColor={isDisabled ? 'gray.100' : undefined} opacity={isDisabled ? 0.8 : 1} {...containerProps}>
          <Input isReadOnly placeholder={placeholder} defaultValue={currentText} {...inputProps} />
          <Box as='span' position='absolute' right='0.5rem' top='50%' transform='translateY(-50%)'>
            {icon}
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        {withArrow && <PopoverArrow />}
        {closable && <PopoverCloseButton />}
        <PopoverBody>
          <Box display='grid' gridTemplateColumns='repeat(7, 1fr)' gap='5px' marginTop={5}>
            {daysLabels.map((label) => <Text fontSize='12px'>{label}</Text>)}
          </Box>
        </PopoverBody>
        <PopoverFooter>
          <Box display='flex' justifyContent='space-between'>
            <Button size='sm' colorScheme='blue'>{todayLabel}</Button>
            <Button size='sm' variant='ghost' colorScheme='blue'>{clearLabel}</Button>
          </Box>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}