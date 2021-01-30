#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

//Variables
DynamicJsonDocument config(3500);

bool setupFile(){
  log_i("begin filesystem SPIFFS");
  if (!SPIFFS.begin(true))
  {
    log_e("SPIFFS Mount Failed");
    printOledTextSingleLine("Falha ao montar SPIFFS");
    return false;
  }
  log_i("begin filesystem completed");
  return true;
}

bool fileExist(fs::FS &fs, const char *dirname, const char *filename, uint8_t levels)
{
  log_i("if file exists: directory -> %s | filename -> %s",dirname,filename);
  bool exist = false;
  File root = fs.open(dirname);
  if (!root)
  {
    log_w("Failed to open directory");
    printOledTextSingleLine("Falha ao abrir deretório");
    return exist;
  }

  if (!root.isDirectory())
  {
    log_i("Not a directory");
    printOledTextSingleLine("Não é um diretório");
    return exist;
  }

  File file = root.openNextFile();

  while (file)
  {
    log_d("found file %s looking for %s",file.name(),filename);
    exist = strcmp(file.name(), filename) == 0;
    if (exist) break;
    file = root.openNextFile();
  }
  log_d("file exist -> %d",exist);
  return exist;
}

void listDir(fs::FS &fs, const char *dirname, uint8_t levels)
{
  log_d("Listing directory: %s", dirname);
  Serial.printf("Listing directory: %s\n", dirname);

  File root = fs.open(dirname);

  if (!root)
  {
    log_w("Failed to open directory");
    printOledTextSingleLine("Falha ao abrir diretírio");
    return;
  }
  if (!root.isDirectory())
  {
    log_i("Not a directory");
    printOledTextSingleLine("Não é um diretório");
    return;
  }

  File file = root.openNextFile();
  while (file)
  {
    if (file.isDirectory())
    {
      log_d("found directory %s",file.name());
      if (levels) listDir(fs, file.name(), levels - 1);
    }
    else
    {
      log_d("found file %s %f",file.name(),file.size());
    }
    file = root.openNextFile();
  }
}

String readFile(fs::FS &fs, const char *path)
{
  log_d("Reading file: %s", path);
  File file = fs.open(path);
  if (!file || file.isDirectory())
  {
    log_e("Failed to open file for reading");
    printOledTextSingleLine("Falha ao ler o arquivo");
    return "";
  }
  String out;
  while (file.available()) out += (char)file.read();
  return out;
}

void writeFile(fs::FS &fs, const char *path, const char *message)
{
  log_d("Writing file: %s", path);
  File file = fs.open(path, FILE_WRITE);
  if (!file)
  {
    log_e("Failed to open file for writing");
    printOledTextSingleLine("Falha ao escrever o arquivo");
    return;
  }
  if (file.print(message))
  {
    log_i("file written");
  }
  else
  {
    log_e("Write failed");
    file.close();
    SPIFFS.format();
  }
}

void appendFile(fs::FS &fs, const char *path, const char *message)
{
  log_d("appending to file: %s | %s", path, message);

  File file = fs.open(path, FILE_APPEND);
  if (!file)
  {
    printOledTextSingleLine("Falha ao acrescentar info ao arquivo");
    return;
  }
  if (file.print(message))
  {
    log_i("message appended to file");
  }
  else
  {
    log_e("failed to append message to file");
    printOledTextSingleLine("Falha ao escrever arquivo");
  }
}

void renameFile(fs::FS &fs, const char *path1, const char *path2)
{
  log_d("renaming file %s to %s", path1, path2);
  if (fs.rename(path1, path2))
  {
    log_i("file were renamed");
    printOledTextSingleLine("Arquivo Renomeado");
  }
  else
  {
    log_e("failed to rename file");
    printOledTextSingleLine("Falha ao renomear");
  }
}

void deleteFile(fs::FS &fs, const char *path)
{
  log_d("Deleting file: %s\n", path);
  if (fs.remove(path))
  {
    log_d("file deleted");
    printOledTextSingleLine("Arquivo Removido");
  }
  else
  {
    log_e("failed to delete file");
    printOledTextSingleLine("Falha ao remover arquivo");
  }
}
