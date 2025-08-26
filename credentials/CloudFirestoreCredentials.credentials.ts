import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CloudFirestoreCredentials implements ICredentialType {
	name = 'cloudFirestoreApi';
	displayName = 'Cloud Firestore API';
	documentationUrl = '[https://firebase.google.com/docs/admin/setup#initialize-sdk](https://firebase.google.com/docs/admin/setup#initialize-sdk)';
	properties: INodeProperties[] = [
		{
			displayName: 'Service Account JSON',
			name: 'serviceAccountJson',
			type: 'string',
			typeOptions: {
				multiline: true,
			},
			default: '',
			placeholder: '{ "type": "service_account", "project_id": ... }',
			description: 'Cole o conteúdo completo do seu arquivo JSON de credenciais do Firebase Admin SDK aqui.',
		},
	];
	icon = 'file:CloudFirestore.svg';
}