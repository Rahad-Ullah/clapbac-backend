type IFolderName = 'image' | 'media' | 'doc';

// single file
export const getSingleFilePath = (files: any, folderName: IFolderName) => {
  const fileField = files && files[folderName];
  if (fileField && Array.isArray(fileField) && fileField.length > 0) {
    // return S3 object key or location
    return fileField[0].location || fileField[0].key;
  }
  return undefined;
};

// multiple files
export const getMultipleFilesPath = (files: any, folderName: IFolderName) => {
  const folderFiles = files && files[folderName];
  if (folderFiles && Array.isArray(folderFiles)) {
    return folderFiles.map((file: any) => file.location || file.key);
  }
  return undefined;
};