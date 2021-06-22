import React from "react";
import { Button, Input, FormControl } from "@chakra-ui/react";

const DirSerchForm = ({ label, path, onSearch, onChangePath }) => {
  return (
    <FormControl>
      <Button onClick={onSearch}>{label}</Button>
      <Input value={path} onChange={onChangePath} />
    </FormControl>
  );
};

export default DirSerchForm;
