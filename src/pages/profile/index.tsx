import { Box, Button, Divider, Flex, Heading, HStack, useToast, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { parseCookies } from "../../helpers";
import * as yup from 'yup';
import { api } from "../../services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../../contexts/UserContext";
import { useCookies } from "react-cookie";

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

interface ProfileProps {
  user: User;
}

interface User {
  name: string;
  email: string
}

const formSchema = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
})

export default function Profile({ user }: ProfileProps) {
  const { updateUser } = useUser();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: user.name,
      password: '',
    }
  });
  const toast = useToast();
  const {errors} = formState;

  

  const handleSave: SubmitHandler<ProfileFormData> = async (values) => {
    try {
      values.email = user.email;
      if (!values.password) {
        delete values.password;
      }
      await api.post('/profile/update', values);
      console.log(33333);
      updateUser({
        email: values.email,
        name: values.name,
      });

      toast({
        title: "Perfil atualizado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch(err) {
      console.log(err);
      toast({
        title: "Erro ao atualizar perfil",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    
  } 

  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6" onSubmit={handleSubmit(handleSave)}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Editar perfil</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Input name="name" label="Nome do usuário" {...register('name')} error={errors.name} />
            </Box>
            <Box w="100%">
              <Input name="name" label="E-mail" isDisabled={true} value={user.email}/>
            </Box>
            <Box w="100%">
              <Input type="password" name="password" label="Altere sua senha" {...register('password')} error={errors.password} />
            </Box>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="pink" type="submit" isLoading={formState.isSubmitting}>Editar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

interface CookieProps {
  user?: string;
}

export const getServerSideProps: GetServerSideProps = async({req}) => {
  const data: CookieProps = parseCookies(req);

  if (!data.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const user = JSON.parse(data.user);

  return {
    props: {
      user: user.user.data,
      url: process.env.DASHCHAT_INTERFACE
    }
  }
}