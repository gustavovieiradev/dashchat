import { Button, Flex, Stack, useToast, Link, Icon } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/Form/Input'
import { useRouter } from 'next/router';
import { api } from '../services/api';

type ResetPasswordFormData = {
  email: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required().email(),
})

export default function Signin() {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const {errors} = formState;

  const handleSignin: SubmitHandler<ResetPasswordFormData> = async (values) => {
    try {
      await api.post('/user/resetPassword', values);
      toast({
        title: "Senha alterada com sucesso. Verifique seu e-mail",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
      handlePageLogin();
    } catch(err) {
      toast({
        title: "Usuário não encontrado",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  } 

  function handlePageLogin() {
    router.push('/')
  }

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex as="form" w="100%" maxW={360} bg="gray.800" p="8" borderRadius={8} flexDir="column" onSubmit={handleSubmit(handleSignin)}>
        <Stack spacing="4">
          <Input 
            name="email" 
            label="E-mail"
            error={errors.email} 
            type="email" 
            {...register('email')} 
          />
        </Stack>
        <Button type="submit" mt="6" colorScheme="pink" size="lg" isLoading={formState.isSubmitting} >Reenviar senha</Button>
        <Button type="submit" mt="6" colorScheme="whiteAlpha" onClick={handlePageLogin} >Voltar ao login</Button>
      </Flex>
    </Flex>
  )
}