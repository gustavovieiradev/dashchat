import { query as q } from 'faunadb';
import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { fauna } from "../../services/fauna";

interface Intent {
  ref: any;
  name: string;
  text_input: string;
  text_output: string;
  next_intent: string;
}

interface IntentProps {
  intents: Intent[];
}

export default function IntentList({intents}: IntentProps) {
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">Intenções</Heading>

            <Link href="/intent/create" passHref>
              <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} size="20" />}>
                Criar novo
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Intenção</Th>
              </Tr>
            </Thead>
            <Tbody>
              {intents.map(intent => (
                <Tr key={intent.name}>
                  <Td>
                    <Link href={`/intent/${intent.name}`} passHref>
                      <Box cursor="pointer">
                        <Text fontWeight="bold">{intent.name}</Text>
                        <Text fontSize="sm" color="gray.300">Texto de entrada: {intent.text_input}</Text>
                        <Text fontSize="sm" color="gray.300">Texto de saída: {intent.text_output}</Text>
                        {/* <Text fontSize="sm" color="gray.300">{intent.next_intent}</Text> */}
                      </Box>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

        </Box>
      </Flex>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async() => {
  const response: any = await fauna.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('ix_intent')),
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  const intents = response.data.map(res => {
    return {
      ref: res.ref,
      name: res.data.name,
      text_input: res.data.text_input,
      text_output: res.data.text_output,
      next_intent: res.data.next_intent,
    }
  });
  
  return {
    props: {
      intents: JSON.parse(JSON.stringify(intents))
    }
  }
}