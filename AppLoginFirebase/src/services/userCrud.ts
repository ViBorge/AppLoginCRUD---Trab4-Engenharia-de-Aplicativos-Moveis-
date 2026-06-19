// Funções vazias (Stubs) que depois receberão a lógica do Firebase
export async function createUser(data: any) {
  console.log("Simulando criação de usuário:", data);
  return true;
}

export async function getUserProfile(userId: string) {
  console.log("Simulando busca de perfil para:", userId);
  return { nome: "Usuário Teste", idade: 20 };
}

export async function updateUser(userId: string, data: any) {
  console.log("Simulando atualização:", userId, data);
  return true;
}

export async function deleteUser(userId: string) {
  console.log("Simulando exclusão:", userId);
  return true;
}