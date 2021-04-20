import { FormControl, FormErrorMessage, FormLabel, Select as ChakraSelect, SelectProps as ChakraSelectProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

type Option = {
  name: string;
  value: string;
}

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  options: Option[]
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = ({ name, label, options, error = null, ...rest }: SelectProps, ref) => {
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
          <option key={option.value} value={option.value}>{option.name}</option>
        ))}
      </ChakraSelect>

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}

    </FormControl>
  )
};

export const Select = forwardRef(SelectBase);