import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { v4 } from 'uuid';
import { GetServerSideProps } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb';

type IntentFormData = {
  name: string;
  text_input: string;
  text_output: string;
  next_intent: string;
  id_project: string;
}

interface Project {
  id: string;
  value: string;
}

interface CreateIntentProps {
  projects: Project[];
}

export default function CreateIntent({projects}: CreateIntentProps) {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm();

  const {errors} = formState;

  const handleSave: SubmitHandler<IntentFormData> = async (values) => {
    const params = {
      ...values,
      id: v4(),
      project: projects.find(p => values.id_project === p.id)
    };

    delete params.id_project;

    await api.post('/intent/create', params);
    toast({
      title: "Intenção salva com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    router.push('/intent');

  } 

  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6" onSubmit={handleSubmit(handleSave)}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Criar Intenção</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Select name="next_intent" label="Projeto" options={projects} {...register('id_project')}/>
            </Box>
            <Box w="100%">
              <Input name="name" label="Nome da intenção" {...register('name')} />
            </Box>
            <Box w="100%">
              <Input name="text_input" label="Texto de entrada" {...register('text_input')} />
            </Box>
            <Box w="100%">
              <Input name="text_output" label="Texto de saída" {...register('text_output')} />
            </Box>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
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
  const response: any = await fauna.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('ix_project')),
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  const projects = response.data.map(res => {
    return {
      id: res.data.id,
      value: res.data.name,
    }
  });
  
  return {
    props: {
      projects
    }
  }
}