export interface Usuario {
  id: number;
  username: string;
  role: 'ADMIN' | 'ASSISTENTE' | 'CLIENTE';
  createdBy?: number;
}

export interface CreateUsuarioRequest {
  username: string;
  password: string;
}
