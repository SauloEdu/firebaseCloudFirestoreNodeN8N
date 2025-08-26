import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { Firestore, Timestamp, GeoPoint } from '@google-cloud/firestore';

function parseDocumentData(values: { key: string, value: any, type: string }[], firestore: Firestore): { [key: string]: any } {
	const data: { [key: string]: any } = {};
	if (!values) {
		return data;
	}

	for (const item of values) {
		let parsedValue = item.value;
		switch (item.type) {
			case 'number':
				parsedValue = parseFloat(item.value);
				break;
			case 'boolean':
				parsedValue = item.value.toLowerCase() === 'true';
				break;
			case 'map':
			case 'array':
				try {
					parsedValue = JSON.parse(item.value);
				} catch (e) {
					throw new Error(`JSON inválido para a chave '${item.key}': ${item.value}`);
				}
				break;
			case 'null':
				parsedValue = null;
				break;
			case 'timestamp':
				parsedValue = Timestamp.fromDate(new Date(item.value));
				break;
			case 'geopoint':
				const [lat, lon] = item.value.split(',').map(Number);
				parsedValue = new GeoPoint(lat, lon);
				break;
			case 'reference':
				parsedValue = firestore.doc(item.value);
				break;
			case 'string':
			default:
				parsedValue = item.value;
				break;
		}
		data[item.key] = parsedValue;
	}
	return data;
}


export class CloudFirestore implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloud Firestore Connection',
		name: 'cloudFirestore',
		icon: 'file:CloudFirestore.svg',
		group: ['storage'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interage com o Google Cloud Firestore',
		documentationUrl: 'https://github.com/SauloEdu/firebaseCloudFirestoreNodeN8N', // Link da documentação
		defaults: {
			name: 'Cloud Firestore',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cloudFirestoreApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'document',
			},
			// Operation
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Cria um novo documento',
						action: 'Criar um documento',
					},
					{
						name: 'Read',
						value: 'read',
						description: 'Lê um documento',
						action: 'Ler um documento',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Atualiza um documento',
						action: 'Atualizar um documento',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Deleta um documento',
						action: 'Deletar um documento',
					},
				],
				default: 'create',
			},
			// Project Name or ID
			{
				displayName: 'Project Name or ID',
				name: 'projectId',
				type: 'string',
				default: '',
				required: true,
				description: 'O ID do seu projeto no Google Cloud',
			},
			// Path
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'colecao/documentoId/subcolecao/{id}',
				description: 'O caminho para o documento. Ex: /usuarios/{id}. Use {id} para gerar um ID aleatório na criação.',
			},
			// Document Data (para Create e Update)
			{
				displayName: 'Document',
				name: 'documentData',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				default: {},
				description: 'Os dados do documento a serem criados ou atualizados.',
				options: [
					{
						name: 'values',
						displayName: 'Value',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								default: 'string',
								options: [
									{ name: 'String', value: 'string' },
									{ name: 'Number', value: 'number' },
									{ name: 'Boolean', value: 'boolean' },
									{ name: 'Map (Object)', value: 'map' },
									{ name: 'Array', value: 'array' },
									{ name: 'Null', value: 'null' },
									{ name: 'Timestamp', value: 'timestamp' },
									{ name: 'GeoPoint', value: 'geopoint' },
									{ name: 'Reference', value: 'reference' },
								],
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i< items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const projectId = this.getNodeParameter('projectId', i) as string;
				let path = this.getNodeParameter('path', i) as string;

				const credentials = await this.getCredentials('cloudFirestoreApi');
				
				let serviceAccount;
				try {
					serviceAccount = JSON.parse(credentials.serviceAccountJson as string);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), 'O JSON da Conta de Serviço é inválido.');
				}

				const firestore = new Firestore({
					projectId,
					credentials: {
						client_email: serviceAccount.client_email,
						private_key: serviceAccount.private_key,
					},
				});

				if (path.startsWith('/')) {
					path = path.substring(1);
				}

				if (operation === 'create') {
					const documentData = this.getNodeParameter('documentData', i, {}) as { values: { key: string, value: any, type: string }[] };
					const parsedData = parseDocumentData(documentData.values, firestore);

					let docRef;
					if (path.includes('{id}')) {
						const collectionPath = path.substring(0, path.lastIndexOf('/'));
						if (!collectionPath) {
							throw new NodeOperationError(this.getNode(), 'Caminho inválido para criação com {id}. Deve ser "colecao/{id}".');
						}
						const collectionRef = firestore.collection(collectionPath);
						docRef = await collectionRef.add(parsedData);
					} else {
						docRef = firestore.doc(path);
						await docRef.set(parsedData);
					}
					returnData.push({ json: { id: docRef.id, path: docRef.path }, pairedItem: { item: i } });

				} else if (operation === 'read') {
					const docRef = firestore.doc(path);
					const doc = await docRef.get();
					if (!doc.exists) {
						throw new NodeOperationError(this.getNode(), `Documento não encontrado em: ${path}`);
					}
					returnData.push({ json: { id: doc.id, ...doc.data() }, pairedItem: { item: i } });

				} else if (operation === 'update') {
					const documentData = this.getNodeParameter('documentData', i, {}) as { values: { key: string, value: any, type: string }[] };
					const parsedData = parseDocumentData(documentData.values, firestore);
					const docRef = firestore.doc(path);
					await docRef.update(parsedData);
					returnData.push({ json: { success: true, path: docRef.path }, pairedItem: { item: i } });

				} else if (operation === 'delete') {
					const docRef = firestore.doc(path);
					await docRef.delete();
					returnData.push({ json: { success: true, path: docRef.path }, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					if (error instanceof Error) {
						returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					} else {
						returnData.push({ json: { error: 'Ocorreu um erro desconhecido' }, pairedItem: { item: i } });
					}
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}