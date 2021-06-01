import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  textHelp?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, label, error = null, textHelp = '', ...rest }: InputProps, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
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
      />

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

export const Input = forwardRef(InputBase);

