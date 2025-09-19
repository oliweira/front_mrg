import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';

/* global __app_id, __firebase_config, __initial_auth_token */

// Variáveis de ambiente fornecidas pelo sistema
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Configuração inicial do Firebase
let app = null;
let db = null;
let auth = null;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    collection: '',
    age: '',
    quantity: '',
    image: '',
    extraImages: '',
    extraVideos: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Efeito para inicialização do Firebase e autenticação
  useEffect(() => {
    async function initFirebase() {
      try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        console.log("Firebase App Initialized.");

        let userCred;
        if (initialAuthToken) {
          userCred = await signInWithCustomToken(auth, initialAuthToken);
        } else {
          userCred = await signInAnonymously(auth);
        }
        setUserId(userCred.user.uid);
        console.log("User authenticated with ID:", userCred.user.uid);
      } catch (e) {
        console.error("Erro na inicialização do Firebase ou na autenticação:", e);
        setError("Erro na autenticação. Tente novamente.");
        setIsLoading(false);
      }
    }
    
    if (Object.keys(firebaseConfig).length > 0) {
      initFirebase();
    } else {
      setError("Configuração do Firebase não encontrada.");
      setIsLoading(false);
    }
  }, []);

  // Efeito para buscar e ouvir os dados em tempo real
  useEffect(() => {
    if (db && userId) {
      setIsLoading(true);
      const privatePath = `/artifacts/${appId}/users/${userId}/products`;
      const productsRef = collection(db, privatePath);
      
      const q = query(productsRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
        setIsLoading(false);
      }, (err) => {
        console.error("Erro ao carregar produtos:", err);
        setError("Erro ao carregar dados dos produtos.");
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const showMessageBox = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validação dos campos obrigatórios
    if (!form.name || !form.description || !form.age || !form.quantity || !form.image) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const privatePath = `/artifacts/${appId}/users/${userId}/products`;
      await addDoc(collection(db, privatePath), {
        ...form,
        age: parseInt(form.age, 10),
        quantity: parseInt(form.quantity, 10),
        extraImages: form.extraImages.split(',').map(s => s.trim()).filter(s => s),
        extraVideos: form.extraVideos.split(',').map(s => s.trim()).filter(s => s),
        createdAt: serverTimestamp(),
      });
      setForm({
        name: '',
        description: '',
        collection: '',
        age: '',
        quantity: '',
        image: '',
        extraImages: '',
        extraVideos: '',
      });
      showMessageBox('Produto cadastrado com sucesso!');
      setCurrentPage('list');
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
      setError("Erro ao cadastrar o produto.");
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="home-container">
            {/* Adicionando a logo na página inicial */}
            <img 
              src="/logo_redonda.png"
              alt="Logo MRG Arte e Brinquedos"
              className="logo-home"
            />
            <h1 className="main-title">
              Arte e Brinquedos
            </h1>
            <p className="subtitle">
              Bem-vindo ao seu painel de gerenciamento de produtos. Utilize o menu acima para começar.
            </p>
            <div className="button-group">
              <button
                onClick={() => setCurrentPage('list')}
                className="button primary"
              >
                Listar Produtos
              </button>
              <button
                onClick={() => setCurrentPage('add')}
                className="button secondary"
              >
                Cadastrar Novo Produto
              </button>
            </div>
          </div>
        );
      case 'add':
        return (
          <div className="form-container">
            <h2 className="form-title">Cadastro de Produto</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">Nome do Brinquedo <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição <span className="required">*</span></label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Coleção</label>
                <input
                  type="text"
                  name="collection"
                  value={form.collection}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Idade <span className="required">*</span></label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantidade <span className="required">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">URL da Imagem Principal <span className="required">*</span></label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">URLs de Imagens Extras (separadas por vírgula)</label>
                <input
                  type="text"
                  name="extraImages"
                  value={form.extraImages}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">URLs de Vídeos Extras (separadas por vírgula)</label>
                <input
                  type="text"
                  name="extraVideos"
                  value={form.extraVideos}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/video1.mp4, https://exemplo.com/video2.mp4"
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="button submit"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        );
      case 'list':
        return (
          <div className="list-container">
            <h2 className="list-title">Produtos Cadastrados</h2>
            {isLoading ? (
              <p className="loading-message">Carregando produtos...</p>
            ) : products.length > 0 ? (
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <img
                      src={product.image || 'https://placehold.co/400x300/e5e7eb/5a67d8?text=Sem+Imagem'}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-info">
                        <p><strong>Coleção:</strong> {product.collection || 'N/A'}</p>
                        <p><strong>Idade:</strong> {product.age} anos</p>
                        <p><strong>Quantidade:</strong> {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Nenhum produto cadastrado ainda.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <style>{`
        /* Variáveis de cores */
        :root {
          --bg-primary: #f3f4f6;
          --bg-secondary: #ffffff;
          --text-primary: #1f2937;
          --text-secondary: #4b5563;
          --border-color: #d1d5db;
          --button-primary-bg: #9333ea;
          --button-primary-hover: #7e22ce;
          --button-secondary-bg: #2563eb;
          --button-secondary-hover: #1d4ed8;
          --highlight-color: #1e40af;
          --card-bg: #ffffff;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --error-bg: #fee2e2;
          --error-text: #b91c1c;
        }

        .dark {
          --bg-primary: #111827;
          --bg-secondary: #1f2937;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --border-color: #4b5563;
          --button-primary-bg: #a855f7;
          --button-primary-hover: #9333ea;
          --button-secondary-bg: #3b82f6;
          --button-secondary-hover: #2563eb;
          --highlight-color: #93c5fd;
          --card-bg: #1f2937;
          --shadow-color: rgba(0, 0, 0, 0.3);
          --error-bg: #4a1313;
          --error-text: #fca5a5;
        }

        /* Global Styles */
        * {
            box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
        }

        .app-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.5s ease;
          overflow-x: hidden;
        }

        /* Navigation Bar */
        .navbar {
          background-color: var(--bg-secondary);
          box-shadow: 0 2px 4px var(--shadow-color);
          padding: 1rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .navbar-content {
            flex-direction: row;
          }
        }

        .navbar-logo {
          cursor: pointer;
        }

        .navbar-logo img {
          height: 2.5rem;
          width: auto;
        }
        
        .navbar-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        @media (min-width: 640px) {
          .navbar-buttons {
            margin-top: 0;
          }
        }
        
        .nav-button {
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.3s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .nav-button:hover {
          color: var(--button-secondary-bg);
        }
        
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          font-size: 1.5rem;
          transition: transform 0.3s ease;
          margin-left: 1rem;
        }
        
        .theme-toggle:hover {
          transform: scale(1.1);
        }

        /* Main Content */
        .main-content {
          width: 100%;
          max-width: 1200px;
          margin: 2rem auto 0;
          padding: 1rem;
        }

        /* Home Page */
        .home-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem;
        }

        .logo-home {
          margin-bottom: 1rem;
          width: 12rem;
          height: auto;
        }

        .main-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--highlight-color);
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .main-title {
            font-size: 3rem;
          }
        }

        .subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 48rem;
        }

        .button-group {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .button-group {
            flex-direction: row;
            gap: 1rem;
          }
        }

        .button {
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          box-shadow: 0 4px 6px var(--shadow-color);
          transition: transform 0.3s ease, background-color 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .button:hover {
          transform: scale(1.05);
        }

        .button.primary {
          background-color: var(--button-primary-bg);
          color: #ffffff;
        }

        .button.primary:hover {
          background-color: var(--button-primary-hover);
        }

        .button.secondary {
          background-color: var(--button-secondary-bg);
          color: #ffffff;
        }

        .button.secondary:hover {
          background-color: var(--button-secondary-hover);
        }

        /* Form Page */
        .form-container {
          padding: 1rem 1.5rem 2rem;
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px var(--shadow-color), 0 4px 6px -2px var(--shadow-color);
        }

        .form-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .error-message {
          padding: 1rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--error-text);
          background-color: var(--error-bg);
          border-radius: 0.5rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .form-input {
          margin-top: 0.25rem;
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px var(--shadow-color);
          outline: none;
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .form-input:focus {
          border-color: var(--button-secondary-bg);
          box-shadow: 0 0 0 1px var(--button-secondary-bg);
        }
        
.required {
          color: #ef4444;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .button.submit {
          display: inline-flex;
          justify-content: center;
          padding: 0.5rem 1.5rem;
          border: 1px solid transparent;
          box-shadow: 0 1px 2px var(--shadow-color);
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.375rem;
          color: #ffffff;
          background-color: var(--button-secondary-bg);
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        
        .button.submit:hover {
          background-color: var(--button-secondary-hover);
          transform: scale(1.05);
        }

        /* List Page */
        .list-container {
          padding: 1rem 1.5rem 2rem;
        }

        .list-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .loading-message, .empty-message {
          text-align: center;
          color: var(--text-secondary);
        }
        
        .product-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.5rem;
        }
        
        @media (min-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .product-card {
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px var(--shadow-color);
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .product-card:hover {
          transform: scale(1.05);
        }
        
        .product-image {
          width: 100%;
          height: 12rem;
          object-fit: cover;
        }
        
        .product-details {
          padding: 1rem;
        }
        
.product-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .product-info {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        /* Footer */
        .app-footer {
          margin-top: auto;
          padding: 1rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
        }
        
        .app-footer span {
          font-family: monospace;
          color: var(--text-primary);
        }
        
        /* Modal Message */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        
        .modal-content {
          background-color: var(--card-bg);
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 400px;
          color: var(--text-primary);
        }
        
        .modal-message {
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
        }
        
        .modal-button {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 9999px;
          background-color: var(--button-secondary-bg);
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .modal-button:hover {
          background-color: var(--button-secondary-hover);
        }
      `}</style>
      <nav className="navbar">
        <div className="navbar-content">
          <div onClick={() => setCurrentPage('home')} className="navbar-logo">
            {/* Adicionando a logo na barra de navegação */}
            <img 
              src="/logo_redonda.png"
              alt="Logo MRG Arte e Brinquedos"
            />
          </div>
          <div className="navbar-buttons">
            <button
              onClick={() => setCurrentPage('home')}
              className="nav-button"
            >
              Início
            </button>
            <button
              onClick={() => setCurrentPage('add')}
              className="nav-button"
            >
              Cadastrar
            </button>
            <button
              onClick={() => setCurrentPage('list')}
              className="nav-button"
            >
              Listar
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="theme-toggle"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        {renderContent()}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-message">{modalMessage}</p>
            <button onClick={closeModal} className="modal-button">OK</button>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>MRG Arte e Brinquedos - ME</p>
      </footer>
    </div>
  );
}

export default App;
