# Guia de Configuração e Execução Inicial - NinoPDV

Este guia orienta sobre como configurar o ambiente e rodar o projeto **NinoPDV** no seu computador local pela primeira vez.

---

## 🛠️ Pré-requisitos Detectados
Identificamos que seu computador possui os seguintes softwares já instalados:
* **.NET SDK:** Versão 9.0 (compatível com a API .NET 8)
* **Node.js:** Versão 20.19.2
* **npm:** Versão 10.8.2
* **Docker:** Instalado (apenas necessita ser iniciado)

---

## 🗄️ Passo 1: Configurar o Banco de Dados (PostgreSQL)

O backend do NinoPDV está configurado para se conectar a um banco PostgreSQL no endereço `localhost:5432`, com o banco `NinoPDV`, usuário `postgres` e senha `postgres`.

Você pode configurar isso de duas formas:

### Opção A: Usando Docker (Recomendado e mais rápido)
Como você já possui o Docker instalado, siga os passos abaixo:
1. Abra o **Docker Desktop** em seu computador e aguarde ele iniciar.
2. Abra um terminal (PowerShell ou Command Prompt) e execute o seguinte comando para subir uma instância do PostgreSQL:
   ```bash
   docker run --name nino-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=NinoPDV -p 5432:5432 -d postgres
   ```
   *Isso baixará a imagem oficial do PostgreSQL (se ainda não tiver) e iniciará um container configurado exatamente para o projeto.*

### Opção B: Instalação Local (Nativa)
Se preferir instalar o PostgreSQL diretamente no Windows:
1. Certifique-se de que o serviço do PostgreSQL esteja rodando localmente na porta `5432`.
2. Crie um banco de dados chamado `NinoPDV`.
3. Garanta que exista um usuário chamado `postgres` com a senha `postgres` (ou atualize as credenciais no arquivo `backend/NinoPDV.Api/appsettings.json` na seção `ConnectionStrings`).

---

## 💻 Passo 2: Configurar e Rodar o Backend (.NET 8 Core API)

1. Abra um terminal na pasta do backend:
   ```powershell
   cd "d:\Nino Programas\PDV\backend\NinoPDV.Api"
   ```

2. Se você ainda não tem a ferramenta global do Entity Framework instalada, instale executando:
   ```powershell
   dotnet tool install --global dotnet-ef --add-source https://api.nuget.org/v3/index.json --ignore-failed-sources
   ```
   *(Caso já tenha instalada ou queira atualizar, utilize):*
   ```powershell
   dotnet tool update --global dotnet-ef --add-source https://api.nuget.org/v3/index.json --ignore-failed-sources
   ```

3. Restaure as dependências do projeto ignorando feeds inativos (se necessário) e depois execute as migrações para criar as tabelas no PostgreSQL:
   ```powershell
   dotnet restore --ignore-failed-sources
   dotnet ef database update
   ```

4. Inicie o servidor da API:
   ```powershell
   dotnet run
   ```
   * O backend iniciará. Na primeira execução, o sistema criará e populará automaticamente os dados básicos do banco (seed data de usuários).
   * A API estará acessível em:
     * **HTTP:** `http://localhost:5121`
     * **HTTPS:** `https://localhost:7201`
     * **Swagger (OpenAPI UI):** Acesse `http://localhost:5121/openapi/v1.json` ou configure no navegador para inspecionar os endpoints.

---

## 🖥️ Passo 3: Configurar e Rodar o Frontend Desktop (React + Electron)

O frontend desktop usa Vite para desenvolvimento web rápido e Electron para empacotamento desktop.

1. Abra um novo terminal na pasta do desktop:
   ```powershell
   cd "d:\Nino Programas\PDV\frontend-desktop"
   ```

2. Instale todas as dependências do projeto pela primeira vez:
   ```powershell
   npm install
   ```

3. Escolha como deseja rodar:
   * **Modo Web Comum** (Apenas o React rodando no navegador, ideal para testar interfaces rapidamente):
     ```powershell
     npm run dev
     ```
     *O app estará acessível em `http://localhost:5173`.*

   * **Modo Desktop Completo** (React + Janela nativa do Electron):
     ```powershell
     npm run desktop
     ```
     *Isso abrirá uma janela de aplicativo desktop integrada.*

---

## 📱 Passo 4: Configurar e Rodar o Frontend Mobile (React Native + Expo)

O frontend mobile utiliza o ecossistema Expo.

1. Abra um novo terminal na pasta do mobile:
   ```powershell
   cd "d:\Nino Programas\PDV\frontend-mobile"
   ```

2. Instale as dependências de pacotes:
   ```powershell
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Expo:
   ```powershell
   npm run start
   ```
   * O terminal exibirá um QR Code.
   * Você pode baixar o aplicativo **Expo Go** no seu celular (Android ou iOS) e escanear o QR Code para abrir e testar o app em tempo real no seu dispositivo físico.
   * Se tiver emuladores instalados e configurados, pode rodar `npm run android` ou `npm run ios`.

---

## 🚀 Dica para Programar (Fluxo Recomendado)

Para programar de forma eficiente no dia a dia, sugerimos iniciar o projeto nesta ordem:
1. Inicie o banco de dados (Docker Desktop ou Serviço do Windows).
2. Abra um terminal e rode o backend (`dotnet run` dentro de `backend/NinoPDV.Api`).
3. Abra outro terminal e rode o frontend desktop (`npm run desktop` ou `npm run dev` em `frontend-desktop`).
4. Se for desenvolver a parte mobile, inicie o Expo (`npm run start` em `frontend-mobile`).
