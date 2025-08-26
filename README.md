🔥 Node de Conexão com Cloud Firestore para n8n

Este é um node customizado para a plataforma de automação de workflows n8n
.
Com ele, você pode interagir diretamente com o Google Cloud Firestore, realizando operações de Criar, Ler, Atualizar e Deletar (CRUD) em seus documentos.

✨ Funcionalidades

✅ Autenticação Segura – via Conta de Serviço (Service Account) do Firebase/Google Cloud.
⚡ Operações CRUD completas:

🆕 Create → Crie novos documentos.

📖 Read → Leia documentos específicos.

✏️ Update → Atualize campos existentes.

🗑️ Delete → Remova documentos permanentemente.

🔑 Criação Dinâmica de ID → use {id} no caminho para gerar IDs únicos automaticamente.
🧩 Suporte a Tipos Complexos → arrays e maps em formato JSON diretamente no editor de chave-valor.

⚙️ Instalação

Certifique-se de ter uma instância self-hosted do n8n.

Acesse o diretório de dados do usuário do n8n:

cd ~/.n8n/


Entre (ou crie) a pasta custom-nodes.

Clone este repositório:

git clone https://github.com/SauloEdu/firebaseCloudFirestoreNodeN8N.git


Reinicie sua instância do n8n.

O node Cloud Firestore Connection aparecerá na lista de integrações. 🚀

🔑 Configuração
1️⃣ Obter Credenciais no Firebase

Acesse o Console do Firebase
.

Selecione seu projeto.

Vá em Configurações do projeto (⚙️) → Contas de serviço.

Clique em Gerar nova chave privada → baixe o arquivo .json.

2️⃣ Configurar no n8n

No n8n, vá em Credentials > Add credential.

Procure por Cloud Firestore API.

Abra o arquivo .json baixado e copie o conteúdo.

Cole no campo Service Account JSON.

Clique em Save. 🎉

▶️ Modo de Uso
Campos do Node

🔐 Credential to connect with → selecione a credencial criada.

🏷️ Project Name or ID → ID do seu projeto Firebase (project_id do JSON).

⚙️ Operation → escolha (Create, Read, Update, Delete).

📂 Path → caminho do documento.

Exemplo (ID específico): usuarios/12345

Exemplo (ID aleatório): usuarios/{id}

📝 Document → (para Create e Update) defina os dados no editor de chave-valor.

📚 Exemplos
🔹 Criar Documento com ID Aleatório
Operation: Create  
Path: clientes/{id}  
Document:  
  - Key: nome, Value: "Empresa Exemplo", Type: string  
  - Key: status, Value: "ativo", Type: string  

🔹 Ler Documento
Operation: Read  
Path: clientes/ABCDE12345

🔹 Atualizar Documento (com Array)
Operation: Update  
Path: clientes/ABCDE12345  
Document:  
  - Key: tags, Value: ["premium", "ativo", "2025"], Type: array  

🔹 Criar Documento com Objeto (Map) Aninhado
Operation: Create  
Path: pedidos/{id}  
Document:  
  - Key: detalhes, Value: { "produto": "Node n8n", "quantidade": 1, "entregue": false }, Type: map  

🎯 Resultado

Com esse node, você consegue integrar o Firestore ao seu n8n de forma simples, segura e escalável, abrindo espaço para automações poderosas. 🚀
