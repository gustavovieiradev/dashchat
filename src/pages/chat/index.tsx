import { Box, Button, Code, Divider, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

export default function Chat() {
  return (
    <Box>
      <Header />
      <Flex as="form" w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box flex="1" borderRadius={8} bg="gray.800" p={["6", "8"]}>
          <Heading size="lg" fontWeight="normal">Informações do chat</Heading>
          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <Box w="100%">
              <Text>Para ter o chat em qualquer página do seu site basta colar o seguinte código: </Text>
              <Code children={'<iframe src="http://192.168.0.210:3001" style={{position: "absolute", bottom: "10px", right: "10px", height: "800px", width: "400px"}} title="Iframe Example"></iframe>'} />
            </Box>
            <Box w="100%">
            <Text>Para ter o chat completo em qualquer página do seu site basta colar o seguinte código: </Text>
              <Code children={'<iframe src="http://192.168.0.210:3001/chat" style={{position: "absolute", height: "100%", width: "100%"}} title="Iframe Example"></iframe>'} />
            </Box>
          </VStack>
          {/* <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button colorScheme="pink" type="submit">Salvar</Button>
            </HStack>
          </Flex> */}
        </Box>
      </Flex>
    </Box>
  )
}