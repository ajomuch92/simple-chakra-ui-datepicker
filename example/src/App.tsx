import './App.css'
import { Box, Text } from '@chakra-ui/react';
import { SimpleDatePicker } from 'simple-chakra-ui-datepicker';

function App() {

  return (
    <>
      <Box w="100%" h="100dvh">
        <Text>Hola</Text>
        <SimpleDatePicker withArrow={false} placeholder='Selecciona una fecha...' activeColor='green.500' colorSchema='green' inputProps={{w: '500px'}}  closable={false}/>
      </Box>
    </>
  )
}

export default App
