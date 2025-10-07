import React, { useState, useEffect } from 'react';
import './App.css'

// NOTE: Para usar a API, você precisará configurar REACT_APP_API_BASE_URL.
// Corrigido para usar process.env como fallback para compatibilidade.
// O valor padrão 'http://localhost:3000/api/produtos' é usado se a variável de ambiente não estiver definida.
const API_BASE_URL = 'https://back-mrg.vercel.app/api/produtos';

// Imagem de logo (assumindo que 'logo_redonda.png' está na pasta 'public' do projeto)
// NOTE: Substitua pelo URL da sua imagem de logo real, se necessário.
const logo = {
  url: 'logo_redonda.png', 
  alt: 'Logo da MRG',
};

// Componente de Cabeçalho
const Header = ({ onNavigate }) => {
  return (
    // CLASSE CSS PURA: header-container
    <header className="header-container">
      <div className="logo-wrapper" onClick={() => onNavigate('home')}>
        {/* CLASSE CSS PURA: logo */}
        <img src={logo.url} alt={logo.alt} className="logo" />
      </div>
      {/* CLASSE CSS PURA: nav-links */}
      <nav className="nav-links">
        <button onClick={() => onNavigate('home')}>Início</button>
        <button onClick={() => onNavigate('list')}>Ver Produtos</button>
        <button onClick={() => onNavigate('register')}>Cadastrar Novo</button>
      </nav>
    </header>
  );
};

// Componente Hero/Home
const HeroSection = ({ onNavigate }) => {
  return (
    // CLASSE CSS PURA: hero-section
    <div className="hero-section">
      {/* CLASSE CSS PURA: hero-title */}
      <h1 className="hero-title">
        Sistema de Inventário MRG
      </h1>
      {/* CLASSE CSS PURA: hero-subtitle */}
      <p className="hero-subtitle">
        Esta interface comunica com uma API REST externa para gerenciar o inventário no seu banco de dados MySQL.
      </p>
      {/* CLASSE CSS PURA: hero-actions */}
      <div className="hero-actions">
        <button
          onClick={() => onNavigate('register')}
          className="btn-primary" // CLASSE CSS PURA: btn-primary
        >
          Cadastrar Produto
        </button>
        <button
          onClick={() => onNavigate('list')}
          className="btn-secondary" // CLASSE CSS PURA: btn-secondary
        >
          Ver Produtos
        </button>
      </div>
    </div>
  );
};

// Componente de Formulário (Usado para Cadastro e Edição)
const ProductForm = ({
  onFormSubmit,
  onUpdateSubmit,
  loading,
  errorMessage,
  initialProduct,
}) => {
  const isEditing = !!initialProduct;
  
  const [formData, setFormData] = useState({
    st_produto: initialProduct?.st_produto || '',
    st_descricao: initialProduct?.st_descricao || '',
    st_colecao: initialProduct?.st_colecao || '',
    st_idade: initialProduct?.st_idade || '', 
    nu_custo: initialProduct?.nu_custo || '',
    nu_preco: initialProduct?.nu_preco || '',
    nu_quantidade: initialProduct?.nu_quantidade || '',
    st_urlimagem: initialProduct?.st_urlimagem || '',
    st_urlimagemextra: initialProduct?.st_urlimagemextra?.join(', ') || '',
    st_urlvideoextra: initialProduct?.st_urlvideoextra?.join(', ') || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nu_quantidade') {
      const numValue = parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        // Garante que o valor seja numérico ou string vazia
        [name]: isNaN(numValue) ? '' : numValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && initialProduct) {
      onUpdateSubmit(initialProduct.id_produto, formData);
    } else {
      onFormSubmit(formData);
    }
  };

  return (
    <div className="form-container"> {/* CLASSE CSS PURA: form-container */}
      <h2 className="form-title"> {/* CLASSE CSS PURA: form-title */}
        {isEditing ? `Editar Produto: ${initialProduct?.st_produto}` : 'Cadastro de Brinquedo'}
      </h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* CLASSE CSS PURA: error-message */}
      <form onSubmit={handleSubmit} className="form-fields"> {/* Classe de agrupamento (form-fields) */}
        <div className="form-field">
          <label className="form-label" htmlFor="st_produto">Nome do Brinquedo *</label>
          <input
            type="text"
            id="st_produto"
            name="st_produto"
            value={formData.st_produto}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="st_descricao">Descrição *</label>
          <textarea
            id="st_descricao"
            name="st_descricao"
            rows="4"
            value={formData.st_descricao}
            onChange={handleChange}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="st_colecao">Coleção</label>
          <input
            type="text"
            id="st_colecao"
            name="st_colecao"
            value={formData.st_colecao}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="st_idade">Classificação de Idade (Ex: +2, 5 a 10) *</label>
          <input
            type="text"
            id="st_idade"
            name="st_idade"
            value={formData.st_idade}
            onChange={handleChange}
            required
            placeholder="+12 meses, +2, de 5 a 10"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="nu_custo">Custo *</label>
          <input
            type="text"
            id="nu_custo"
            name="nu_custo"
            value={formData.nu_custo}
            onChange={handleChange}
            required
            min="0"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="nu_preco">Preço *</label>
          <input
            type="text"
            id="nu_preco"
            name="nu_preco"
            value={formData.nu_preco}
            onChange={handleChange}
            required
            min="0"
            className="form-input"
          />
        </div>        
        <div className="form-field">
          <label className="form-label" htmlFor="nu_quantidade">Quantidade *</label>
          <input
            type="number"
            id="nu_quantidade"
            name="nu_quantidade"
            value={formData.nu_quantidade}
            onChange={handleChange}
            required
            min="0"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="st_urlimagem">Imagem Principal (URL) *</label>
          <input
            type="url"
            id="st_urlimagem"
            name="st_urlimagem"
            value={formData.st_urlimagem}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="st_urlimagemextra">Imagens Extras (URLs, separadas por vírgula)</label>
          <input
            type="text"
            id="st_urlimagemextra"
            name="st_urlimagemextra"
            value={formData.st_urlimagemextra}
            onChange={handleChange}
            placeholder="http://exemplo.com/img1.jpg, http://exemplo.com/img2.jpg"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="st_urlvideoextra">Vídeos Extras (URLs, separadas por vírgula)</label>
          <input
            type="text"
            id="st_urlvideoextra"
            name="st_urlvideoextra"
            value={formData.st_urlvideoextra}
            onChange={handleChange}
            placeholder="http://exemplo.com/vid1.mp4, http://exemplo.com/vid2.mp4"
            className="form-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="form-submit-button" /* CLASSE CSS PURA: form-submit-button */
        >
          {loading ? (isEditing ? 'Atualizando...' : 'Enviando para o Back-end...') : (isEditing ? 'Salvar Alterações' : 'Cadastrar')}
        </button>
      </form>
    </div>
  );
};

// Componente da Barra de Filtro e Pesquisa
const FilterBar = ({ filterState, onFilterChange }) => {
  return (
    // CLASSE CSS PURA: filter-bar
    <div className="filter-bar">
      {/* Search Term */}
      <div className="filter-input-group">
        <label htmlFor="search" className="sr-only">Pesquisar Produto</label>
        <div className="relative">
          <input
            type="text"
            id="search"
            name="searchTerm"
            placeholder="Pesquisar por nome, descrição ou coleção..."
            value={filterState.searchTerm}
            onChange={onFilterChange}
            className="filter-input"
          />
          {/* Ícone de lupa (SVG) - CLASSE CSS PURA: search-icon */}
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>
      
      {/* Idade Filter */}
      <div className="filter-input-group">
        <label htmlFor="st_idadeFilter" className="sr-only">Filtrar por Classificação de Idade</label>
        <input
          type="text"
          id="st_idadeFilter"
          name="st_idadeFilter"
          placeholder="Filtrar Idade (Ex: +2)"
          value={filterState.st_idadeFilter}
          onChange={onFilterChange}
          className="filter-input"
        />
      </div>

      {/* Quantity Filter */}
      <div className="filter-input-group">
        <label htmlFor="minQuantity" className="sr-only">Quantidade Mínima</label>
        <input
          type="number"
          id="minQuantity"
          name="minQuantity"
          placeholder="Qtd. Mínima (nu_quantidade)"
          value={filterState.minQuantity}
          onChange={onFilterChange}
          min="0"
          className="filter-input"
        />
      </div>
    </div>
  );
};

// Componente para Controles de Ordenação
const SortControls = ({ sortConfig, onSort }) => {
    // Função auxiliar para renderizar o ícone de direção
    const getSortIndicator = (column) => {
        if (sortConfig.column !== column) {
            // CLASSE CSS PURA: sort-icon default
            return (
                <svg className="sort-icon default" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            );
        }
        return sortConfig.direction === 'asc' ? (
            // CLASSE CSS PURA: sort-icon active-up
            <svg className="sort-icon active-up" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> // up arrow
        ) : (
            // CLASSE CSS PURA: sort-icon active-down
            <svg className="sort-icon active-down" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg> // down arrow
        );
    };

    const sortOptions = [
        { key: 'st_produto', label: 'Nome' },
        { key: 'nu_quantidade', label: 'Quantidade' },
        { key: 'st_idade', label: 'Idade' },
    ];

    return (
        // CLASSE CSS PURA: sort-controls
        <div className="sort-controls">
            {/* CLASSE CSS PURA: sort-label */}
            <span className="sort-label">Ordenar por:</span>
            {sortOptions.map(option => (
                <button
                    key={option.key}
                    onClick={() => onSort(option.key)}
                    // CLASSE CSS PURA: sort-button e ativa/desativa
                    className={`sort-button ${sortConfig.column === option.key ? 'active' : ''}`}
                >
                    {option.label}
                    {getSortIndicator(option.key)}
                </button>
            ))}
        </div>
    );
};

// Componente de Lista de Produtos
const ProductList = ({ produtos, loading, onDelete, onEdit, totalProducts, filteredCount }) => {
  return (
    <div className="p-6">
      <h2 className="product-list-title">Produtos Cadastrados</h2>
      
      {!loading && totalProducts > 0 && (
        <p className="product-detail" style={{ textAlign: 'center', marginBottom: '16px' }}>
          Mostrando <strong>{filteredCount}</strong> de <strong>{totalProducts}</strong> produtos.
        </p>
      )}

      {loading && <p className="product-detail" style={{ textAlign: 'center' }}>Carregando produtos...</p>}
      
      {filteredCount === 0 && !loading && totalProducts > 0 && 
        <p className="error-message" style={{ marginBottom: '16px' }}>Nenhum produto corresponde aos filtros aplicados.</p>
      }
      
      {produtos.length === 0 && !loading && totalProducts === 0 && 
        <p className="product-detail" style={{ textAlign: 'center' }}>Nenhum produto cadastrado ainda. Verifique se o seu Back-end está ativo em {API_BASE_URL}</p>
      }

      {/* CLASSE CSS PURA: product-grid */}
      <div className="product-grid">
        {produtos.map((product) => (
          // CLASSE CSS PURA: product-card
          <div key={product.id_produto} className="product-card">
            {/* CLASSE CSS PURA: product-image */}
            <img 
              src={product.st_urlimagem} 
              alt={product.st_produto} 
              className="product-image" 
              // Placeholder em caso de erro no carregamento da imagem
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x192/CCCCCC/333333?text=Imagem+N/A'; }} 
            />
            {/* CLASSE CSS PURA: product-info */}
            <div className="product-info">
              {/* CLASSE CSS PURA: product-name */}
              <h3 className="product-name">{product.st_produto}</h3>
              {/* CLASSE CSS PURA: product-detail */}
              <p className="product-detail">
                <span>Coleção:</span> {product.st_colecao || 'N/A'}
              </p>
              <p className="product-detail">
                <span>Idade:</span> <strong>{product.st_idade || 'N/A'}</strong>
              </p>
              <p className="product-detail">
                <span>Custo:</span> {product.nu_custo}
              </p>
              <p className="product-detail">
                <span>Preço:</span> {product.nu_preco}
              </p>
              <p className="product-detail">
                <span>Quantidade:</span> {product.nu_quantidade}
              </p>
              {/* CLASSE CSS PURA: product-description */}
              <p className="product-description">{product.st_descricao}</p>
              
              {/* Exibir imagens e vídeos extras, se existirem */}
              {product.st_urlimagemextra && product.st_urlimagemextra.length > 0 && (
                // CLASSE CSS PURA: extra-info-section
                <div className="extra-info-section">
                  <span className="extra-info-label">Imagens Extras:</span>
                  {/* CLASSE CSS PURA: extra-images-list */}
                  <div className="extra-images-list">
                    {product.st_urlimagemextra.map((img, index) => (
                      // CLASSE CSS PURA: extra-image
                      <img key={index} src={img} alt={`Imagem extra ${index + 1}`} className="extra-image" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/333333?text=Erro'; }} />
                    ))}
                  </div>
                </div>
              )}
              {product.st_urlvideoextra && product.st_urlvideoextra.length > 0 && (
                <div className="extra-info-section">
                  <span className="extra-info-label">Vídeos Extras:</span>
                  {/* CLASSE CSS PURA: extra-videos-list */}
                  <div className="extra-videos-list">
                    {product.st_urlvideoextra.map((vid, index) => (
                      // CLASSE CSS PURA: extra-video-link
                      <a key={index} href={vid} target="_blank" rel="noopener noreferrer" className="extra-video-link">
                        Vídeo {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CLASSE CSS PURA: card-actions */}
              <div className="card-actions">
                {/* CLASSE CSS PURA: btn-edit */}
                <button
                  onClick={() => onEdit(product)}
                  className="btn-edit"
                >
                  Editar
                </button>
                {/* CLASSE CSS PURA: btn-delete */}
                <button
                  onClick={() => onDelete(product.id_produto)}
                  className="btn-delete"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para a modal de confirmação
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    // CLASSE CSS PURA: modal-overlay
    <div className="modal-overlay">
      {/* CLASSE CSS PURA: modal-content */}
      <div className="modal-content">
        {/* CLASSE CSS PURA: modal-message */}
        <p className="modal-message">{message}</p>
        {/* CLASSE CSS PURA: modal-actions */}
        <div className="modal-actions">
          {/* CLASSE CSS PURA: modal-confirm-btn */}
          <button
            onClick={onConfirm}
            className="modal-confirm-btn"
          >
            Sim
          </button>
          {/* CLASSE CSS PURA: modal-cancel-btn */}
          <button
            onClick={onCancel}
            className="modal-cancel-btn"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para a modal de alerta
const AlertModal = ({ message, onConfirm }) => {
  return (
    // CLASSE CSS PURA: modal-overlay
    <div className="modal-overlay">
      {/* CLASSE CSS PURA: modal-content */}
      <div className="modal-content">
        {/* CLASSE CSS PURA: modal-message */}
        <p className="modal-message">{message}</p>
        {/* CLASSE CSS PURA: modal-actions */}
        <div className="modal-actions">
          {/* CLASSE CSS PURA: modal-alert-btn */}
          <button
            onClick={onConfirm}
            className="modal-alert-btn"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Função principal de comparação para ordenação
const sortProducts = (produtos, sortConfig) => {
    if (!sortConfig.column) {
        return produtos;
    }

    // Cria uma cópia para evitar modificar o array original do estado
    const sortedProducts = [...produtos];

    sortedProducts.sort((a, b) => {
        const aValue = a[sortConfig.column] ?? ''; // Trata null/undefined como string vazia
        const bValue = b[sortConfig.column] ?? '';

        let comparison = 0;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            comparison = aValue - bValue;
        } else {
            // Comparação de string, tratando como case-insensitive
            comparison = String(aValue).localeCompare(String(bValue), 'pt', { sensitivity: 'base' });
        }

        // Se a direção for descendente (desc), inverte o resultado da comparação
        return sortConfig.direction === 'asc' ? comparison : comparison * -1;
    });

    return sortedProducts;
};

const App = () => {
  const [appState, setAppState] = useState({
    view: 'home',
    produtos: [],
    loading: false,
    errorMessage: null,
    productToEdit: null,
  });
  const [modal, setModal] = useState({ type: null, message: '' });

  // ESTADO PARA FILTROS E ORDENAÇÃO
  const [filterState, setFilterState] = useState({
    searchTerm: '',
    st_idadeFilter: '',
    minQuantity: '', 
    // Configuração de ordenação
    sortConfig: { column: 'st_produto', direction: 'asc' }, 
  });

  // Função para lidar com a navegação
  const handleNavigate = (view, product = null) => {
    setAppState((prev) => ({ 
      ...prev, 
      view, 
      errorMessage: null,
      productToEdit: product,
    }));
  };

  // 1. Fetching data from the API (GET)
  const fetchProducts = async () => {
    // Verifica se a API_BASE_URL foi carregada corretamente
    if (!API_BASE_URL) {
      setAppState((prev) => ({ 
        ...prev, 
        loading: false,
        errorMessage: 'A URL base da API não foi definida. Verifique o arquivo .env.local.',
        produtos: [],
      }));
      return;
    }

    setAppState((prev) => ({ ...prev, loading: true, errorMessage: null }));
    try {
      // Implementação de Backoff Exponencial para a chamada de API
      const MAX_RETRIES = 3;
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const response = await fetch(API_BASE_URL);
        
        if (response.ok) {
          const data = await response.json();
          setAppState((prev) => ({ ...prev, produtos: data, loading: false }));
          return; // Sucesso, sai da função
        }

        // Se falhar e não for a última tentativa, espera e tenta novamente
        if (attempt < MAX_RETRIES - 1) {
          const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Última tentativa falhou
          throw new Error(`API retornou status ${response.status}`);
        }
      }
      
    } catch (error) {
      console.error('Erro ao buscar produtos da API:', error);
      setAppState((prev) => ({
        ...prev,
        loading: false,
        errorMessage: error.message || `Erro de conexão com a API em ${API_BASE_URL}. Verifique se o servidor está ativo.`,
        produtos: [],
      }));
    }
  };

  // Efeito para carregar os produtos ao entrar na tela de listagem
  useEffect(() => {
    if (appState.view === 'list') {
      fetchProducts();
    }
  }, [appState.view]);

  // Função auxiliar para preparar o payload
  const preparePayload = (formData) => {
    return {
      st_produto: formData.st_produto,
      st_descricao: formData.st_descricao,
      st_colecao: formData.st_colecao,
      st_idade: formData.st_idade, 
      nu_custo: Number(formData.nu_custo), 
      nu_preco: Number(formData.nu_preco), 
      nu_quantidade: Number(formData.nu_quantidade),
      st_urlimagem: formData.st_urlimagem,
      // Converte a string de URLs separadas por vírgula em um array de strings
      st_urlimagemextra: formData.st_urlimagemextra.split(',').map((url) => url.trim()).filter(Boolean),
      st_urlvideoextra: formData.st_urlvideoextra.split(',').map((url) => url.trim()).filter(Boolean),
    };
  };

  // 2. Submitting new product to the API (POST)
  const handleFormSubmit = async (formData) => {
    setAppState((prev) => ({ ...prev, loading: true, errorMessage: null }));
    try {
      const newProductPayload = preparePayload(formData);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha ao cadastrar: ${errorText}`);
      }

      setAppState((prev) => ({ ...prev, loading: false }));
      setModal({ type: 'alert', message: 'Produto cadastrado com sucesso! A lista será atualizada.' });
      handleNavigate('list');
    } catch (error) {
      console.error('Erro ao adicionar produto: ', error);
      setAppState((prev) => ({
        ...prev,
        loading: false,
        errorMessage: error.message || 'Erro ao salvar o produto na API. Verifique o console.',
      }));
    }
  };
  
  // 3. Updating an existing product (PUT)
  const handleUpdateSubmit = async (productId, formData) => {
    setAppState((prev) => ({ ...prev, loading: true, errorMessage: null }));
    try {
      const updatedProductPayload = preparePayload(formData);
      
      const response = await fetch(`${API_BASE_URL}/${productId}`, {
        method: 'PUT', // Requisição PUT para atualização
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProductPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha ao atualizar: ${errorText}`);
      }

      setAppState((prev) => ({ ...prev, loading: false }));
      setModal({ type: 'alert', message: 'Produto atualizado com sucesso! A lista será atualizada.' });
      handleNavigate('list');
    } catch (error) {
      console.error('Erro ao atualizar produto: ', error);
      setAppState((prev) => ({
        ...prev,
        loading: false,
        errorMessage: error.message || 'Erro ao atualizar o produto na API. Verifique o console.',
      }));
    }
  };


  // 4. Deleting a product (DELETE)
  const handleDelete = async (productId) => {
    setModal({
      type: 'confirm',
      message: 'Tem certeza de que deseja excluir este produto?',
      onConfirm: async () => {
        setModal({ type: null, message: '' }); // Fechar modal de confirmação
        setAppState((prev) => ({ ...prev, loading: true, errorMessage: null }));
        try {
          const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Falha ao excluir: ${errorText}`);
          }

          setAppState((prev) => ({ ...prev, loading: false }));
          setModal({ type: 'alert', message: 'Produto excluído com sucesso!' });
          fetchProducts(); // Atualiza a lista após a exclusão
        } catch (error) {
          console.error('Erro ao excluir produto: ', error);
          setAppState((prev) => ({
            ...prev,
            loading: false,
            errorMessage: error.message || 'Erro ao excluir o produto na API. Tente novamente.',
          }));
        }
      },
      onCancel: () => setModal({ type: null, message: '' }),
    });
  };

  // Função para iniciar o modo de edição
  const handleEdit = (product) => {
    handleNavigate('edit', product);
  };

  // Função para lidar com a mudança nos filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterState((prev) => ({ 
      ...prev, 
      [name]: value,
    }));
  };

  // Função para lidar com a ordenação
  const handleSort = (column) => {
    setFilterState((prev) => {
      let direction = 'asc';
      if (prev.sortConfig.column === column && prev.sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      return {
        ...prev,
        sortConfig: { column, direction },
      };
    });
  };

  const renderView = () => {
    switch (appState.view) {
      case 'register':
        return <ProductForm 
          onFormSubmit={handleFormSubmit} 
          onUpdateSubmit={handleUpdateSubmit}
          loading={appState.loading} 
          errorMessage={appState.errorMessage} 
          initialProduct={null} // Não é edição
        />;
      case 'edit':
        if (!appState.productToEdit) {
          return <p className="error-message" style={{ margin: '32px' }}>Erro: Nenhum produto selecionado para edição.</p>;
        }
        return <ProductForm 
          onFormSubmit={handleFormSubmit} 
          onUpdateSubmit={handleUpdateSubmit}
          loading={appState.loading} 
          errorMessage={appState.errorMessage} 
          initialProduct={appState.productToEdit} // Passa o produto para preencher o formulário
        />;
      case 'list':
        // Bloco de escopo para declaração de variáveis (evita erro 'no-case-declarations')
        { 
          const { searchTerm, minQuantity, st_idadeFilter, sortConfig } = filterState;
          
          // --- 1. FILTRAGEM ---
          const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
          const lowerCaseIdadeFilter = st_idadeFilter.toLowerCase().trim();

          let filteredProducts = appState.produtos.filter(product => {
              // Filtro por Quantidade Mínima (nu_quantidade)
              const nu_quantidade = Number(minQuantity);
              const nu_quantidadeFilter = isNaN(nu_quantidade) || minQuantity === '' || product.nu_quantidade === null || (product.nu_quantidade >= nu_quantidade);

              // Filtro por Classificação de Idade (st_idade)
              const idadeFilter = lowerCaseIdadeFilter === '' || 
                                  product.st_idade?.toLowerCase().includes(lowerCaseIdadeFilter);

              // Filtro por Termo de Busca (st_produto, descrição, coleção)
              const textMatch = (
                  product.st_produto?.toLowerCase().includes(lowerCaseSearchTerm) ||
                  product.st_descricao?.toLowerCase().includes(lowerCaseSearchTerm) ||
                  product.st_colecao?.toLowerCase().includes(lowerCaseSearchTerm)
              );

              return nu_quantidadeFilter && idadeFilter && textMatch;
          });
          
          // --- 2. ORDENAÇÃO ---
          const sortedProducts = sortProducts(filteredProducts, sortConfig);


          return (
            <>
              <FilterBar 
                filterState={filterState} 
                onFilterChange={handleFilterChange} 
              />
              <SortControls
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <ProductList 
                produtos={sortedProducts} // Passa a lista ORDENADA
                loading={appState.loading} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
                totalProducts={appState.produtos.length} 
                filteredCount={sortedProducts.length} 
              />
            </>
          );
        }
      default:
        return <HeroSection onNavigate={handleNavigate} />;
    }
  };

  return (
    // CLASSE CSS PURA: app-container
    <div className="app-container">
      <Header onNavigate={(view) => handleNavigate(view)} />
      {/* CLASSE CSS PURA: main-content */}
      <main className="main-content">
        {renderView()}
      </main>

      {modal.type === 'alert' && (
        <AlertModal
          message={modal.message}
          onConfirm={() => setModal({ type: null, message: '' })}
        />
      )}
      {modal.type === 'confirm' && (
        <ConfirmModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </div>
  );
};

export default App;
