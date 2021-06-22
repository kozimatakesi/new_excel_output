import { Button, Input } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const SearchDir = () => {
  const [dirPath, setDirPath] = useState("");

  const handleInputChangedDirPath = (event) => {
    const inputValue = event.target.value;
    setDirPath(inputValue);
  };

  useEffect(() => {
    //ディレクトリパスをダイアログで選択したものに変更する
    api.on("dirPath", (_, arg) => {
      setDirPath(arg);
    });
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          api.filesApi.searchDirPath();
        }}
      >
        フォルダ検索
      </Button>
      <Input
        value={dirPath}
        onChange={(event) => {
          handleInputChangedDirPath(event);
        }}
      />
      <Button
        onClick={() => {
          api.filesApi.createExcelFile(dirPath);
        }}
      >
        Excel出力
      </Button>
    </div>
  );
};

export default SearchDir;
