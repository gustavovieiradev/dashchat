import { Button, Flex, Stack, useToast } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../components/Form/Input'
import { useRouter } from 'next/router';
import { api } from '../services/api';

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
})

export default function Signin() {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const {errors} = formState;

  const handleSignin: SubmitHandler<SignInFormData> = async (values) => {
    // if (values.email === 'admin@gmail.com' && values.password === '@bcd!23A') {
    //   router.push('/chat')
    //   return;
    // }

    try {
      const user = await api.post('/user/login', values);
      router.push('/chat')
    } catch(err) {
      console.log('user');
      toast({
        title: "Usuário não encontrado",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
    

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
      </Flex>


      {/* <iframe src="http://192.168.10.81:3001" style={{position: 'absolute', bottom: "10px", right: "10px", height: '800px', width: '400px'}} title="Iframe Example"></iframe> */}

      {/* <iframe src="http://192.168.0.210:3001/chat" style={{position: "absolute", height: "100%", width: "100%"}} title="Iframe Example"></iframe> */}

    </Flex>
  )
}