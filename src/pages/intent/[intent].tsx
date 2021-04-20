import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import { query as q } from 'faunadb';
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Select } from "../../components/Form/Select";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { fauna } from "../../services/fauna";

type IntentFormData = {
  name: string;
  text_input: string;
  text_output: string;
  next_intent: string;
}

interface ShowIntentProps {
  data: {
    name: string;
    text_input: string;
    text_output: string;
    next_intent: string;
  }
}

export default function ShowIntent({data}: ShowIntentProps) {
  const router = useRouter();
  const toast = useToast();
  const {register, handleSubmit, formState} = useForm({
    defaultValues: {
      name: data.name,
      text_input: data.text_input,
      text_output: data.text_output,
    }
  });

  console.log(data);

  const handleSave: SubmitHandler<IntentFormData> = async (values) => {
    await api.post('/intent/create', values);
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

export const getServerSideProps: GetServerSideProps = async({params}) => {
  const { intent } = params;
  const response: any = await fauna.query(
    q.Get(
      q.Match(
        q.Index('ix_intent_name'),
        q.Casefold(intent)
      )
    )
  )
  
  return {
    props: {
      data: response.data
    }
  }
}