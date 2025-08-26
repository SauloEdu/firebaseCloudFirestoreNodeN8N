Node de Conexão com Cloud Firestore para n8n
Este é um node customizado para a plataforma de automação de workflows n8n. Ele permite que você interaja diretamente com o Google Cloud Firestore, realizando operações de Criar, Ler, Atualizar e Deletar (CRUD) em seus documentos.

Funcionalidades
Autenticação Segura: Utiliza uma Conta de Serviço (Service Account) do Firebase/Google Cloud para autenticação segura no servidor.

Operações CRUD: Suporte completo para as operações essenciais do Firestore:

Create: Crie novos documentos em qualquer coleção ou subcoleção.

Read: Leia o conteúdo de um documento específico.

Update: Atualize campos existentes em um documento.

Delete: Remova um documento permanentemente.

Criação Dinâmica de ID: Use {id} no caminho para que o Firestore gere um ID de documento único e aleatório automaticamente.

Suporte a Tipos de Dados Complexos: Insira arrays e maps (objetos) diretamente no Firestore usando o formato JSON no editor de chave-valor.

Instalação
Para usar este node, você precisa de uma instância do n8n auto-hospedada (self-hosted).

Navegue até o diretório de dados do usuário do n8n na sua máquina (geralmente ~/.n8n/).

Entre na pasta custom-nodes. Se ela não existir, crie-a.

Clone este repositório do GitHub para dentro da pasta custom-nodes:

git clone [https://github.com/SauloEdu/firebaseCloudFirestoreNodeN8N.git](https://github.com/SauloEdu/firebaseCloudFirestoreNodeN8N.git)

Reinicie sua instância do n8n.

O node "Cloud Firestore Connection" aparecerá na lista de integrações.

Configuração
1. Obter Credenciais no Firebase
Antes de usar o node, você precisa de uma chave de Conta de Serviço do seu projeto Firebase.

Acesse o Console do Firebase.

Selecione seu projeto.

Clique no ícone de engrenagem (⚙️) e vá para Configurações do projeto.

Clique na aba Contas de serviço.

Clique em Gerar nova chave privada e confirme. Um arquivo .json será baixado.

2. Configurar Credencial no n8n
Na sua instância do n8n, vá para Credentials > Add credential.

Procure por "Cloud Firestore API" e selecione-o.

Abra o arquivo .json que você baixou do Firebase.

Copie todo o conteúdo do arquivo JSON.

Cole o conteúdo completo no campo Service Account JSON.

Clique em Save.

Modo de Uso
Campos do Node
Credential to connect with: Selecione a credencial "Cloud Firestore API" que você acabou de criar.

Project Name or ID: Insira o ID do seu projeto Firebase (encontrado no arquivo JSON como project_id).

Operation: Escolha a ação que deseja realizar (Create, Read, Update, Delete).

Path: Especifique o caminho para o documento.

Formato: colecao/documentoId/subcolecao/outroDocumentoId

Exemplo (ID específico): usuarios/12345

Exemplo (ID aleatório para Create): usuarios/{id}

Document: (Aparece para Create e Update) Use o editor de chave-valor para definir os dados do documento.

Exemplos
Criar um Documento com ID Aleatório
Operation: Create

Path: clientes/{id}

Document:

Key: nome, Value: Empresa Exemplo, Type: string

Key: status, Value: ativo, Type: string

Ler um Documento
Operation: Read

Path: clientes/ABCDE12345

Atualizar um Documento (Adicionando um Array)
Operation: Update

Path: clientes/ABCDE12345

Document:

Key: tags, Value: ["premium", "ativo", "2025"], Type: array

Criar um Documento com um Objeto (Map) Aninhado
Operation: Create

Path: pedidos/{id}

Document:

Key: detalhes, Value: { "produto": "Node n8n", "quantidade": 1, "entregue": false }, Type: map
