import { Button, Flex, Stack, useToast, Link } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/Form/Input'
import { useRouter } from 'next/router';
import { api } from '../services/api';
import { useCookies } from 'react-cookie';
import { useUser } from '../contexts/UserContext';

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
})

export default function Signin() {
  const { createUser } = useUser()
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(signInFormSchema)
  });
  const [_, setCookie] = useCookies(["user"])

  const {errors} = formState;

  const handleSignin: SubmitHandler<SignInFormData> = async (values) => {
    try {
      const user = await api.post('/user/login', values);
      createUser(user.data);
      router.push('/chat')
    } catch(err) {
      toast({
        title: "Usuário não encontrado",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  } 

  function handlePageResetPassword(ev) {
    ev.preventDefault();
    router.push('/resetPassword')
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
          <Input 
            name="password" 
            label="Senha" 
            type="password" 
            error={errors.password} 
            {...register('password')} />
        </Stack>
        <Button type="submit" mt="6" colorScheme="pink" size="lg" isLoading={formState.isSubmitting} >Entrar</Button>
        <Button type="submit" mt="6" colorScheme="whiteAlpha" onClick={handlePageResetPassword}>Esqueceu a senha?</Button>
      </Flex>

    </Flex>
  )
}