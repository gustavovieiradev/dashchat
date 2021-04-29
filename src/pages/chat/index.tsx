import { Box, Button, Code, Divider, Flex, Heading, HStack, Radio, RadioGroup, Text, useToast, VStack } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { query as q } from 'faunadb';
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { fauna } from "../../services/fauna";
import { Select } from "../../components/Form/Select";

type ChatFormData = {
  title: string;
  theme: string;
  oldTheme?: string;
}

interface ChatProps {
  data: ChatFormData;
  projects: Project[];
}

interface Project {
  id: string;
  value: string;
}

export default function Chat({data, projects}: ChatProps) {
  const {register, handleSubmit, formState} = useForm({
    defaultValues: {
      title: data.title,
      theme: data.theme,
      id_project: null
    }
  });
  const toast = useToast();

  const handleSave: SubmitHandler<ChatFormData> = async (values) => {
    if (data.theme) {
      values.oldTheme = data.theme;
    }

    await api.post('/config/create', values);

    toast({
      title: "Configuração salva com sucesso",
      status: "success",
      duration: 9000,
      isClosable: true,
    })
  } 

  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6" onSubmit={handleSubmit(handleSave)}>
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Informações do chat</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Select name="client" placeholder="Selecione" label="Projeto" {...register('id_project')} options={projects} />
            </Box>
            <Box w="100%">
              <Text fontWeight="medium" mb="2">Para ter o chat em qualquer página do seu site basta colar o seguinte código: </Text>
              <Code children={'<iframe src="http://192.168.0.210:3001" style={{position: "absolute", bottom: "10px", right: "10px", height: "800px", width: "400px"}} title="Iframe Example"></iframe>'} />
            </Box>
            <Box w="100%">
              <Text fontWeight="medium" mb="2">Para ter o chat completo em qualquer página do seu site basta colar o seguinte código: </Text>
              <Code children={'<iframe src="http://192.168.0.210:3001/chat" style={{position: "absolute", height: "100%", width: "100%"}} title="Iframe Example"></iframe>'} />
            </Box>
            <Box w="100%">
              <Input name="title" label="Título" {...register('title')} />
            </Box>
            <Box w="100%">
              <Text fontWeight="medium" mb="2">Selecione o tema: </Text>
              <RadioGroup defaultValue={data.theme}>
                <HStack align="start">
                  <Box bg="black" p="2" borderRadius="5">
                    <Radio value="black" colorScheme="black" {...register('theme')}>Preto e branco</Radio>
                  </Box>
                  <Box bg="red.500" p="2" borderRadius="5">
                    <Radio value="red" colorScheme="red" {...register('theme')}>Vermelho e branco</Radio>
                  </Box>
                  <Box bg="green.500" p="2" borderRadius="5">
                    <Radio value="green" colorScheme="green" {...register('theme')}>Verde e branco</Radio>
                  </Box>
                  <Box bg="blue.500" p="2" borderRadius="5">
                    <Radio value="blue" colorScheme="blue" {...register('theme')}>Azul e branco</Radio>
                  </Box>
                </HStack>
              </RadioGroup>
            </Box>

          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button colorScheme="pink" type="submit">Salvar</Button>
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
        q.Match(q.Index('ix_config')),
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  const config = response.data.map(res => {
    return {
      title: res.data.title,
      theme: res.data.theme,
    }
  });

  const responseProject: any = await fauna.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('ix_project')),
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  const projects = responseProject.data.map(res => {
    return {
      value: res.data.name,
      id: res.data.id,
    }
  });

  return {
    props: {
      data: config.length ? config[config.length - 1] : {},
      projects
    }
  }
}