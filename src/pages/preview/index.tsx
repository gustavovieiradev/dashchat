import { Box, Divider, Flex, Heading, Text, VStack, Input, InputGroup, InputRightElement, Icon } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { RiSendPlaneFill } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { parseCookies } from "../../helpers";
import { query as q } from 'faunadb';
import { fauna } from "../../services/fauna";
import { Select } from "../../components/Form/Select";
import { useState } from "react";
import { api } from "../../services/api";

interface Message {
  message: string;
  sender: 'user' | 'bot'
}

interface Project {
  id: string;
  value: string;
}

interface PreviewProps {
  projects: Project[];
}

export default function Preview({ projects }: PreviewProps) {
  const [projectSelected, setProjectSelected] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleSendMessage(ev) {
    try {
      if (ev.key === 'Enter') {
        const response = await api.post('/conversation', { message });
        const result = response.data;
  
        setMessages([...messages, {
          message,
          sender: 'user'
        }, {
          message: result.data.text_output,
          sender: 'bot'
        }])
        setMessage('');
      }

    } catch (err) {
      setMessages([...messages, {
        message: 'Não encontramos nenhuma mensagem',
        sender: 'bot'
      }])
    }
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Heading size="lg" fontWeight="normal">Preview</Heading>
          <Heading size="md" fontWeight="normal">Teste seu chatbot</Heading>
          <Divider my="6" borderColor="gray.700" />

          <Box w="100%" marginBottom="8">
            <Select name="project" placeholder="Selecione" label="Projeto" options={projects} onChange={(ev) => setProjectSelected(ev.target.value)} />
          </Box>
          {projectSelected && (
            <Box>
              <Flex w="100%" bgColor="gray.900" h="80px" borderTopRadius="10" align="center" px="5">
                <Heading size="lg" fontWeight="normal">Bem vindo</Heading>
              </Flex>
              <Box borderLeftWidth="3px" borderRightWidth="3px" borderColor="gray.900" p="5" height="500" w="100%" overflowY="scroll">
                <VStack spacing="3" w="100%">
                  {messages.map((mess, key) => (
                    <Flex justify={mess.sender === 'user' ? 'flex-end' : 'flex-start'} w="100%" key={key + 1} direction="row">
                      <Text maxW="200px" borderRadius="10" bgColor={mess.sender === 'user' ? "pink.500" : 'gray.900'} color="white" p="3">{mess.message}</Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
              <Flex h="80px" bgColor="gray.900" borderBottomRadius="10" align="center" px="5">
                <InputGroup>
                  <Input
                    name="search"
                    id="search"
                    bg="gray.800"
                    variant="filled"
                    _hover={{
                      bgColor: 'gray.800'
                    }}
                    _focus={{
                      bgColor: 'gray.800',
                      borderColor: 'pink.500'
                    }}
                    size="lg"
                    onKeyDown={handleSendMessage} 
                    placeholder="Digite aqui...."
                    onChange={(ev) => setMessage(ev.target.value)}
                  />
                  <InputRightElement children={<Icon as={RiSendPlaneFill} color="pink.500" w="7" h="7" mt="2"/>} />
                </InputGroup>
              </Flex>
            </Box>
          )}

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
      projects,
    }
  }
}