import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { GetServerSideProps } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../services/fauna";
import { Alert } from "../../components/Alert";
import { useState } from "react";

type ClientFormData = {
  name: string;
  id: string;
}

interface ClientEditProps {
  data: {
    name: string;
    id: string;
  }
}

const formSchema = yup.object().shape({
  name: yup.string().required('Campo obrigatório'),
})

export default function ClientEdit({data}: ClientEditProps) {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: data.name
    }
  });
  const [isOpenAlert, setIsOpenAlert] = useState(false);

  const {errors} = formState;

  const handleSave: SubmitHandler<ClientFormData> = async (values) => {
    values.id = String(router.query.id);
    await api.post('/client/update', values);
    toast({
      title: "Intenção atualizada com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
    router.push('/clients');

  } 

  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6" onSubmit={handleSubmit(handleSave)}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Criar cliente</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Input name="name" label="Nome do cliente" {...register('name')} error={errors.name} />
            </Box>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button as="a" colorScheme="whiteAlpha" onClick={() => router.back()}>Cancelar</Button>
              <Button as="a" colorScheme="red" type="button" onClick={() => setIsOpenAlert(true)}>Excluir</Button>
              <Button colorScheme="pink" isLoading={formState.isSubmitting} type="submit">Editar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>

      {isOpenAlert && <Alert closeAlert={() => setIsOpenAlert(false)} description={`Deseja realmente excluir o cliente ${data.name}`} title="Excluir cliente" />}

    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async({params}) => {
  const { id } = params;
  console.log(id)
  const response: any = await fauna.query(
    q.Get(
      q.Match(
        q.Index('ix_client_id'),
        id
      )
    )
  )
  
  return {
    props: {
      data: response.data
    }
  }
}