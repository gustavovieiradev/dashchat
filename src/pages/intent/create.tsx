import { Box, Button, Divider, Flex, FormHelperText, Heading, HStack, Table, Tbody, Td, Text, Thead, Tr, useToast, VStack } from "@chakra-ui/react";
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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from "react";
import { apiNest } from "../../services/api-nest";

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

interface PostIntent {
  mensagem: string[];
  utterances: string[];
  intent: string;
  template: string;
  projeto: string;

}

const formSchema = yup.object().shape({
  id_project: yup.string().required('Campo obrigatório'),
  name: yup.string().required('Campo obrigatório'),
})

export default function CreateIntent({ projects }: CreateIntentProps) {
  const [textInput, setTextInput] = useState<string>('');
  const [textsInput, setTextsInput] = useState<string[]>([]);
  const [textOutput, setTextOutput] = useState<string>('');
  const [textsOutput, setTextsOutput] = useState<string[]>([]);
  const router = useRouter();
  const toast = useToast()
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(formSchema)
  });

  const { errors } = formState;

  const handleSave: SubmitHandler<IntentFormData> = async (values) => {
    const params = formatData(values);

    console.log(params);

    await apiNest.post('/conversa', params);
    toast({
      title: "Intenção salva com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    router.push('/intent');
  }

  function formatData(data: IntentFormData): PostIntent {
    const formData = {
      mensagem: textsOutput,
      utterances: textsInput,
      intent: data.name.toUpperCase(),
      template: 'text',
      projeto: data.id_project,
    }
    return formData;
  }

  function handleAddTextInput(): void {
    setTextsInput([
      ...textsInput,
      textInput
    ]);
    setTextInput('');
  }

  function handleAddTextOutput(): void {
    setTextsOutput([
      ...textsOutput,
      textOutput
    ]);
    setTextOutput('');
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
              <Select name="project" placeholder="Selecione" label="Projeto" options={projects} {...register('id_project')} error={errors.id_project} />
            </Box>
            <Box w="100%">
              <Input name="name" label="Nome da intenção" {...register('name')} error={errors.name} />
            </Box>
            <Box w="100%">
              <Input name="text_input" label="Textos de entrada" onChange={(ev) => setTextInput(ev.target.value)} value={textInput} textHelp="Adicione um ou mais texto de entrada" />
            </Box>
            <Box>
              <Button as="a" colorScheme="pink" onClick={handleAddTextInput}>Adicionar texto de entrada</Button>
            </Box>
            {textsInput.length > 0 && (
              <Flex justifyContent="flex-start" width="100%">
                <Table colorScheme="whiteAlpha">
                  <Tbody>
                    {textsInput.map(text => (
                      <Tr>
                        <Td>
                          <Text fontWeight="bold">{text}</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Flex>
            )}
            <Box w="100%">
              <Input name="text_output" label="Texto de saída" onChange={(ev) => setTextOutput(ev.target.value)} value={textOutput} textHelp="Adicione um ou mais texto de saída"/>
            </Box>
            <Box>
              <Button as="a" colorScheme="pink" onClick={handleAddTextOutput}>Adicionar texto de saída</Button>
            </Box>
            {textsOutput.length > 0 && (
              <Flex justifyContent="flex-start" width="100%">
                <Table colorScheme="whiteAlpha">
                  <Tbody>
                    {textsOutput.map(text => (
                      <Tr>
                        <Td>
                          <Text fontWeight="bold">{text}</Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Flex>
            )}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await apiNest.get('/projeto');

  const projects = response.data.map(res => {
    return {
      id: res._id,
      value: res.nome,
    }
  });

  return {
    props: {
      projects
    }
  }
}