import { Button, Flex, Stack } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Input } from '../components/Form/Input'

type SignInFormData = {
  email: string;
  password: string;
}

export default function Signin() {
  const {register, handleSubmit, formState} = useForm();

  const handleSignin: SubmitHandler<SignInFormData> = async (values) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
  } 

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex as="form" w="100%" maxW={360} bg="gray.800" p="8" borderRadius={8} flexDir="column" onSubmit={handleSubmit(handleSignin)}>
        <Stack spacing="4">
          <Input name="email" label="E-mail" type="email" {...register('email')} />
          <Input name="password" label="Senha" type="password" {...register('password')} />
        </Stack>
        <Button type="submit" mt="6" colorScheme="pink" size="lg" isLoading={formState.isSubmitting} >Entrar</Button>
      </Flex>
    </Flex>
  )
}