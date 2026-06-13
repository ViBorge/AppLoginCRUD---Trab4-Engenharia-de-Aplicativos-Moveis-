import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Modal,
  Provider as PaperProvider,
  Paragraph,
  Portal,
  Text,
  TextInput,
  Title
} from 'react-native-paper';


// Import do Firebase v8
import firebase from 'firebase';
import 'firebase/firestore';

// Credenciais Firebase 
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Inicializar Firebase apenas uma vez
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  
  const [clienteAtual, setClienteAtual] = useState({
    id: null,
    codigo: '',
    nome: '',
    foto: ''
  });

  // Carregar clientes do Firebase
  const carregarClientes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await firebase.firestore().collection('clientes').get();
      const clientesData = [];
      querySnapshot.forEach((doc) => {
        clientesData.push({ id: doc.id, ...doc.data() });
      });
      setClientes(clientesData);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const limparFormulario = () => {
    setClienteAtual({
      id: null,
      codigo: '',
      nome: '',
      foto: ''
    });
    setEditando(false);
  };

  const validarFormulario = () => {
    if (!clienteAtual.codigo.trim()) {
      Alert.alert('Erro', 'Por favor, informe o código do cliente');
      return false;
    }
    if (!clienteAtual.nome.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do cliente');
      return false;
    }
    return true;
  };

  // Criar e atualiazar Clientes - Salvar cliente
  const salvarCliente = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    
    try {
      if (editando) {
        // UPDATE
        await firebase.firestore().collection('clientes').doc(clienteAtual.id).update({
          codigo: clienteAtual.codigo,
          nome: clienteAtual.nome,
          foto: clienteAtual.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        });
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      } else {
        // CREATE
        await firebase.firestore().collection('clientes').add({
          codigo: clienteAtual.codigo,
          nome: clienteAtual.nome,
          foto: clienteAtual.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          dataCriacao: firebase.firestore.FieldValue.serverTimestamp()
        });
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      }
      
      setModalVisible(false);
      limparFormulario();
      carregarClientes();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Preparar edição (UPDATE)
  const editarCliente = (cliente) => {
    setClienteAtual(cliente);
    setEditando(true);
    setModalVisible(true);
  };

  // EXCLUSÃO - DELETE
  const excluirCliente = (cliente) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o cliente ${cliente.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await firebase.firestore().collection('clientes').doc(cliente.id).delete();
              carregarClientes();
              Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir cliente: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // CRIAR Novo cliente
  const novoCliente = () => {
    limparFormulario();
    setModalVisible(true);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Header */}
        <Appbar.Header>
          <Appbar.Content title="Clientes" subtitle={`${clientes.length} clientes cadastrados`} />
          <Appbar.Action icon="plus" onPress={novoCliente} />
          <Appbar.Action icon="refresh" onPress={carregarClientes} />
        </Appbar.Header>

        {/* Conteúdo */}
        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : clientes.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Title style={styles.emptyTitle}>Nenhum cliente cadastrado</Title>
                <Paragraph>Clique no botão + para adicionar um novo cliente</Paragraph>
                <Button 
                  mode="contained" 
                  onPress={novoCliente}
                  style={styles.emptyButton}
                >
                  Adicionar Primeiro Cliente
                </Button>
              </Card.Content>
            </Card>
          ) : (
            clientes.map((cliente) => (
              <Card key={cliente.id} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Avatar.Image 
                      size={60} 
                      source={{ uri: cliente.foto }} 
                      style={styles.avatar}
                    />
                    <View style={styles.cardInfo}>
                      <Title style={styles.nome}>{cliente.nome}</Title>
                      <Chip mode="outlined" style={styles.chip}>
                        Código: {cliente.codigo}
                      </Chip>
                    </View>
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  <View style={styles.cardActions}>
                    <Button 
                      mode="outlined" 
                      onPress={() => editarCliente(cliente)}
                      style={styles.actionButton}
                      icon="pencil"
                    >
                      Editar
                    </Button>
                    <Button 
                      mode="contained" 
                      buttonColor="#FF3B30"
                      onPress={() => excluirCliente(cliente)}
                      style={styles.actionButton}
                      icon="delete"
                    >
                      Excluir
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>

        {/* Modal de Formulário */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Card>
              <Card.Content>
                <Title style={styles.modalTitle}>
                  {editando ? 'Editar Cliente' : 'Novo Cliente'}
                </Title>
                
                <TextInput
                  label="Código *"
                  value={clienteAtual.codigo}
                  onChangeText={(text) => setClienteAtual({...clienteAtual, codigo: text})}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="identifier" />}
                />
                
                <TextInput
                  label="Nome Completo *"
                  value={clienteAtual.nome}
                  onChangeText={(text) => setClienteAtual({...clienteAtual, nome: text})}
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account" />}
                />
                
                <TextInput
                  label="URL da Foto"
                  value={clienteAtual.foto}
                  onChangeText={(text) => setClienteAtual({...clienteAtual, foto: text})}
                  mode="outlined"
                  style={styles.input}
                  placeholder="https://exemplo.com/foto.jpg"
                  left={<TextInput.Icon icon="image" />}
                />
                
                <Paragraph style={styles.helperText}>
                  * Campos obrigatórios
                </Paragraph>
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setModalVisible(false)}
                    style={styles.modalButton}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={salvarCliente}
                    style={styles.modalButton}
                    loading={loading}
                    disabled={loading}
                    icon={editando ? "check" : "plus"}
                  >
                    {editando ? 'Atualizar' : 'Salvar'}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>

        {/* Botão Flutuante */}
        {!modalVisible && (
          <Button
            mode="contained"
            onPress={novoCliente}
            style={styles.fab}
            icon="plus"
            contentStyle={styles.fabContent}
          >
            Novo Cliente
          </Button>
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyCard: {
    margin: 16,
    elevation: 4,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyButton: {
    marginTop: 20,
  },
  card: {
    margin: 8,
    elevation: 4,
  },
  cardContent: {
    paddingVertical: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    marginBottom: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    elevation: 4,
  },
  fabContent: {
    paddingHorizontal: 16,
  },
});