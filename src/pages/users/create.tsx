import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { v4 } from 'uuid';
import { Select } from "../../components/Form/Select";
import { GetServerSideProps } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb';
import { useState } from "react";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiNest } from "../../services/api-nest";

type UserFormData = {
  name: string;
  email: string;
  password?: string;
  cliente: string;
  projeto: string;
}

interface Client {
  id: string;
  value: string;
}

interface Project {
  id: string;
  value: string;
}

interface UserCreateProps {
  clients: Client[];
}

const formSchema = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
  email: yup.string().required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
  projeto: yup.string().required('Campo obrigatório'),
  cliente: yup.string().required('Campo obrigatório'),
})

export default function UserCreate({clients}: UserCreateProps) {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(formSchema)
  });
  const [projects, setProjects] = useState<Project[]>([]);

  const {errors} = formState;

  const handleSave: SubmitHandler<UserFormData> = async (values) => {
    await apiNest.post('users', values);
    toast({
      title: "Usuário salvo com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  } 

  async function handleChangeClient(idClient: string) {
    if (!idClient) {
      return;
    }
    const projectsResponse = await apiNest.get(`projeto/cliente/${idClient}`);
    const formatProject = projectsResponse.data.map(project => {
      return {
        id: project._id,
        value: project.nome
      }
    }) 
    setProjects(formatProject);
  }

  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6" onSubmit={handleSubmit(handleSave)}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Criar usuário</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Input name="name" label="Nome do usuário" {...register('name')} error={errors.name} />
            </Box>
            <Box w="100%">
              <Input name="name" label="E-mail" {...register('email')} error={errors.email} />
            </Box>
            <Box w="100%">
              <Input name="password" label="Senha" {...register('password')} error={errors.password} type="password" />
            </Box>
            <Box w="100%">
              <Select placeholder="Selecione" name="cliente" label="Cliente" {...register('cliente')} options={clients} onChange={(ev) => handleChangeClient(ev.target.value)} error={errors.cliente}/>
            </Box>
            <Box w="100%">
              <Select placeholder="Selecione" name="projeto" label="Projetos" {...register('projeto')} options={projects} error={errors.projeto}/>
            </Box>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/client" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button colorScheme="pink" isLoading={formState.isSubmitting} type="submit">Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async({req}) => {
  const response = await apiNest.get('/cliente');

  const clients = response.data.map(res => {
    return {
      id: res._id,
      value: res.nome,
    }
  });
  
  return {
    props: {
      clients
    }
  }
}
