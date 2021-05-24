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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { apiNest } from "../../services/api-nest";

type ProjectsFormData = {
  nome: string;
  cliente: string;
}

interface Client {
  id: string;
  value: string;
}

interface ProjectCreateProps {
  clients: Client[];
}

const formSchema = yup.object().shape({
  nome: yup.string().required('Campo obrigatório'),
  cliente: yup.string().required('Campo obrigatório'),
})

export default function ProjectCreate({clients}: ProjectCreateProps) {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(formSchema)
  });

  const {errors} = formState;

  const handleSave: SubmitHandler<ProjectsFormData> = async (values) => {
    await api.post('/project', values);

    // const bodyConfig = {
    //   title: 'Bem vindo',
    //   theme: 'black',
    //   id_project: values.id,
    //   project: {
    //     id: values.id,
    //     name: values.name,
    //     client: values.client
    //   }
    // }

    // await api.post('/config/create', bodyConfig);

    toast({
      title: "Projeto salvo com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    // router.push('/projects');
  } 

  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6" onSubmit={handleSubmit(handleSave)}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Criar projeto</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Input name="nome" label="Nome do cliente" {...register('nome')} error={errors.nome}/>
            </Box>
            <Box w="100%">
            <Select name="cliente" placeholder="Selecione" label="Cliente" {...register('cliente')} options={clients} error={errors.cliente}/>
            </Box>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/projects" passHref>
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

export const getServerSideProps: GetServerSideProps = async() => {
  const response = await apiNest.get('/cliente')

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
