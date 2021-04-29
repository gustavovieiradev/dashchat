import { query as q } from 'faunadb';
import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { fauna } from "../../services/fauna";

interface Client {
  name: string;
  id: string;
}

interface CLientProps {
  clients: Client[];
}

export default function Clients({clients}: CLientProps) {
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">Clientes</Heading>

            <Link href="/clients/create" passHref>
              <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} size="20" />}>
                Criar novo
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Cliente</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map(client => (
                <Tr key={client.name}>
                  <Td>
                    <Link href={`/clients/${client.id}`} passHref>
                      <Box cursor="pointer">
                        <Text fontWeight="bold">{client.name}</Text>
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
        q.Match(q.Index('ix_client')),
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  const clients = response.data.map(res => {
    return {
      name: res.data.name,
      id: res.data.id,
    }
  });
  
  return {
    props: {
      clients
    }
  }
}