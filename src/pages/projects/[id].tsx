import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { Select } from "../../components/Form/Select";
import { GetServerSideProps } from "next";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { apiNest } from "../../services/api-nest";

type ProjectsFormData = {
  nome: string;
  cliente: string;
}

interface Client {
  id: string;
  value: string;
}

interface ProjectEditProps {
  clients: Client[];
  project: {
    _id: string;
    nome: string;
    cliente: string;
  }
}

const formSchema = yup.object().shape({
  nome: yup.string().required('Campo obrigatório'),
  cliente: yup.string().required('Campo obrigatório'),
})

export default function ProjectEdit({clients, project}: ProjectEditProps) {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      nome: project.nome,
      cliente: project.cliente,
    }
  });

  const {errors} = formState;

  const handleSave: SubmitHandler<ProjectsFormData> = async (values) => {
    await api.patch(`/project/${project._id}`, values);
    toast({
      title: "Projeto editado com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    router.push('/projects');
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

export const getServerSideProps: GetServerSideProps = async({params}) => {
  const clienteResponse = await apiNest.get('/cliente')

  const clients = clienteResponse.data.map(res => {
    return {
      id: res._id,
      value: res.nome,
    }
  });

  const { id } = params;

  const projetoResponse = await apiNest.get(`projeto/${id}`);

  return {
    props: {
      clients,
      project: projetoResponse.data
    }
  }
}
