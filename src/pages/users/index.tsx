import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { GetServerSideProps } from "next";
import { query as q } from 'faunadb';
import { fauna } from "../../services/fauna";
import { parseCookies } from "../../helpers";
import { useRouter } from "next/router";

interface UserListProps {
  users: User[];
}

interface User {
  id: string;
  name: string;
  email: string;
  client: string;
}

export default function UserList({users}: UserListProps) {
  const router = useRouter();

  function handleGoDetail(id: string) {
    router.push(`/users/${id}`);
    return;
  }

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">Usuários</Heading>

            <Link href="/users/create" passHref>
              <Button as="a" size="sm" fontSize="sm" colorScheme="pink" leftIcon={<Icon as={RiAddLine} size="20" />}>
                Criar novo
              </Button>
            </Link>
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Usuário</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.id} cursor="pointer" onClick={() =>handleGoDetail(user.id)}>
                  <Td>
                    <Box>
                      <Text fontWeight="bold">{user.name}</Text>
                      <Text fontSize="sm" color="gray.300">{user.email}</Text>
                      <Text fontSize="sm" color="gray.300">Cliente: {user.client}</Text>
                    </Box>
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

export const getServerSideProps: GetServerSideProps = async({req}) => {
  const data: any = parseCookies(req);

  if (!data.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const response = await fauna.query<any>(
    q.Map(
      q.Paginate(
        q.Match(q.Index('ix_user')),
      ),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  )

  const users = response.data.map(user => {
    return {
      id: user.data.id,
      name: user.data.name,
      email: user.data.email,
      client: user.data.client.value,
    }
  })

  return {
    props: {
      users
    }
  }
}