import { Button, Input } from "@chakra-ui/react";
import React, { useState, useEffect, useCallback } from "react";
import {useDropzone} from 'react-dropzone';

const SearchDir = () => {
  const [dirPath, setDirPath] = useState("");

  const handleInputChangedDirPath = (event) => {
    const inputValue = event.target.value;
    setDirPath(inputValue);
  };

  const onDrop = useCallback(acceptedFiles => {
    console.log('acceptedFiles:', acceptedFiles);
    const num = acceptedFiles.length;
    const first = acceptedFiles[0].path;
    console.log(first);
    const last = acceptedFiles[num - 1].path;
    const firstSplit = first.split('/');
    const lastSplit = last.split('/');
    const array = [];
    for(let i = 0; i < lastSplit.length; i++){
      if(firstSplit[i] === lastSplit[i]){
        array.push(firstSplit[i]);
      }
    }
    console.log(array);
    const dragPath = array.join('/');
    console.log(dragPath);
    setDirPath(dragPath);
  },[])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


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

      <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>


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
      <Button
        onClick={() => {
          api.filesApi.openFile();
        }}
      >
        Excelオープン
      </Button>
    </div>
  );
};

export default SearchDir;
