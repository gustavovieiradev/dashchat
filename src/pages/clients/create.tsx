import { Box, Button, Divider, Flex, Heading, HStack, SimpleGrid, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";

type ClientFormData = {
  nome: string;
}

const formSchema = yup.object().shape({
  nome: yup.string().required('Campo obrigatório'),
})

export default function ClientCreate() {
  const router = useRouter();
  const toast = useToast()
  const {register, handleSubmit, formState} = useForm({
    resolver: yupResolver(formSchema)
  });

  const {errors} = formState;

  const handleSave: SubmitHandler<ClientFormData> = async (values) => {
    await api.post('/client/create', values);
    toast({
      title: "Cliente salv com sucesso",
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
              <Input name="name" label="Nome do cliente" {...register('nome')} error={errors.nome} />
            </Box>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button as="a" colorScheme="whiteAlpha" onClick={() => router.back()}>Cancelar</Button>
              <Button colorScheme="pink" isLoading={formState.isSubmitting} type="submit">Salvar</Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}