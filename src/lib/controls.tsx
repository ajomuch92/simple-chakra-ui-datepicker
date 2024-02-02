import { Select, Flex, IconButton} from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { ChangeEvent } from "react"

interface MonthSelectProps {
    months?: string[]
    onChange?: (arg0: number) => void
    defaultValue?: number
}
export function MonthSelect({months = ['January',
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
'December'], defaultValue = 0, onChange = () => {}}: MonthSelectProps) {

    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (onChange) {
            onChange(value as unknown as number);
        }
    }

    return <Select border='none' value={defaultValue} onChange={onChangeHandler} size='sm' maxW='fit-content'>
        {
            months.map((value, index) => <option value={index} key={index}>{value}</option>)
        }
    </Select>
}

interface YearSelectProps {
    initialYear?: number
    endYear?: number
    onChange?: (arg0: number) => void
    defaultValue?: number
}

export function YearSelect({defaultValue = new Date().getFullYear(), onChange, endYear = new Date().getFullYear()  + 5, initialYear = new Date().getFullYear()  - 100}: YearSelectProps) {
    const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (onChange) {
            onChange(value as unknown as number);
        }
    }

    const years = Array.from(Array(endYear - initialYear + 1).keys(), i => i + initialYear);

    return <Select border='none' value={defaultValue} onChange={onChangeHandler} size='sm' maxW='fit-content'>
        {
            years.map((value, index) => <option value={value} key={index}>{value}</option>)
        }
    </Select>
}

interface ControlButtonsProps {
    onNext?: () => void
    onPrev?: () => void
    bgColor?: string
}

export function ControlButtons({onNext, onPrev, bgColor}: ControlButtonsProps) {
    return <Flex gap='3px' justifyContent='center'>
        <IconButton aria-label='Go back' bg={bgColor} icon={<ChevronLeftIcon />} onClick={onPrev}/>
        <IconButton aria-label='Go ahead' bg={bgColor} icon={<ChevronRightIcon />} onClick={onNext} />
    </Flex>
}