import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Select as ChakraSelect, SelectProps as ChakraSelectProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

type Option = {
  id: string;
  value: string;
}

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  options: Option[],
  textHelp?: string;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = ({ name, label, options, error = null, textHelp = '', ...rest }: SelectProps, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraSelect
        name={name}
        id={name}
        focusBorderColor="pink.500"
        bg="gray.900"
        variant="filled"
        _hover={{
          bgColor: 'gray.900'
        }}
        size="lg"
        ref={ref}
        {...rest}
      >
        {options.map(option => (
          <option style={{color: '#000'}} key={option.id} value={option.id}>{option.value}</option>
        ))}
      </ChakraSelect>

      {textHelp && (
        <FormHelperText>{textHelp}</FormHelperText>
      )}

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}

    </FormControl>
  )
};

export const Select = forwardRef(SelectBase);