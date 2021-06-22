import React from "react";
import {
  ChakraProvider,
  Container,
} from "@chakra-ui/react";
import SearchDir from "./SearchDir";

const App = () => {
  return (
    <ChakraProvider>
      <Container>
        <SearchDir />
      </Container>
    </ChakraProvider>
  );
};

export default App;
