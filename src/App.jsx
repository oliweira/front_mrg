import React, { useState, useEffect } from 'react';

// URL de base para o seu Back-end / API REST.
// Você deve configurar esta URL para o endereço do seu servidor (ex: Railway, Vercel Functions, etc.)
// const API_BASE_URL = 'http://localhost:3000/api/products'; 

const logo = {
  url: 'logo_redonda.png',
  alt: 'Logo da MRG',
};

// Componente de Cabeçalho
const Header = ({ onNavigate }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white shadow-md rounded-xl mx-4 my-2">
      <div className="flex-shrink-0 mb-4 sm:mb-0 cursor-pointer" onClick={() => onNavigate('home')}>
        <img src={logo.url} alt={logo.alt} className="h-10 w-auto rounded-md" />
      </div>
      <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-gray-700 font-semibold text-lg">
        <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate('home')}>Início</button>
        <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate('list')}>Ver Produtos</button>
        <button className="hover:text-blue-500 transition-colors" onClick={() => onNavigate('register')}>Cadastrar Novo</button>
      </nav>
    </header>
  );
};

// Componente Hero/Home
const HeroSection = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 md:p-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 mb-4">
        Sistema de Inventário MRG
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
        Esta interface comunica com uma API REST externa para gerenciar o inventário no seu banco de dados MySQL.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onNavigate('register')}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Cadastrar Produto
        </button>
        <button
          onClick={() => onNavigate('list')}
          className="bg-white text-blue-600 border border-blue-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-50 transition-transform transform hover:scale-105"
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
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    collection: initialProduct?.collection || '',
    st_idade: initialProduct?.st_idade || '', 
    quantity: initialProduct?.quantity || '',
    image: initialProduct?.image || '',
    extraImages: initialProduct?.extraImages?.join(', ') || '',
    extraVideos: initialProduct?.extraVideos?.join(', ') || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
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
      onUpdateSubmit(initialProduct.id, formData);
    } else {
      onFormSubmit(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isEditing ? `Editar Produto: ${initialProduct?.name}` : 'Cadastro de Brinquedo'}
      </h2>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Nome do Brinquedo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="collection">Coleção</label>
          <input
            type="text"
            id="collection"
            name="collection"
            value={formData.collection}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="st_idade">Classificação de Idade (Ex: +2, 5 a 10) *</label>
          <input
            type="text"
            id="st_idade"
            name="st_idade"
            value={formData.st_idade}
            onChange={handleChange}
            required
            placeholder="+12 meses, +2, de 5 a 10"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="quantity">Quantidade *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="image">Imagem Principal (URL) *</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="extraImages">Imagens Extras (URLs, separadas por vírgula)</label>
          <input
            type="text"
            id="extraImages"
            name="extraImages"
            value={formData.extraImages}
            onChange={handleChange}
            placeholder="http://exemplo.com/img1.jpg, http://exemplo.com/img2.jpg"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="extraVideos">Vídeos Extras (URLs, separadas por vírgula)</label>
          <input
            type="text"
            id="extraVideos"
            name="extraVideos"
            value={formData.extraVideos}
            onChange={handleChange}
            placeholder="http://exemplo.com/vid1.mp4, http://exemplo.com/vid2.mp4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
    <div className="bg-white p-4 rounded-xl shadow-lg mb-4 flex flex-col md:flex-row gap-4 items-center">
      {/* Search Term */}
      <div className="w-full md:w-2/5">
        <label htmlFor="search" className="sr-only">Pesquisar Produto</label>
        <div className="relative">
          <input
            type="text"
            id="search"
            name="searchTerm"
            placeholder="Pesquisar por nome, descrição ou coleção..."
            value={filterState.searchTerm}
            onChange={onFilterChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          />
          {/* Ícone de lupa (SVG) */}
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>
      
      {/* Idade Filter */}
      <div className="w-full md:w-1/5">
        <label htmlFor="st_idadeFilter" className="sr-only">Filtrar por Classificação de Idade</label>
        <input
          type="text"
          id="st_idadeFilter"
          name="st_idadeFilter"
          placeholder="Filtrar Idade (Ex: +2)"
          value={filterState.st_idadeFilter}
          onChange={onFilterChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>

      {/* Quantity Filter */}
      <div className="w-full md:w-2/5">
        <label htmlFor="minQuantity" className="sr-only">Quantidade Mínima</label>
        <input
          type="number"
          id="minQuantity"
          name="minQuantity"
          placeholder="Qtd. Mínima (nu_quantidade)"
          value={filterState.minQuantity}
          onChange={onFilterChange}
          min="0"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
      </div>
    </div>
  );
};

// Componente para Controles de Ordenação (Novo)
const SortControls = ({ sortConfig, onSort }) => {
    // Função auxiliar para renderizar o ícone de direção
    const getSortIndicator = (column) => {
        if (sortConfig.column !== column) {
            return (
                <svg className="h-4 w-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            );
        }
        return sortConfig.direction === 'asc' ? (
            <svg className="h-4 w-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> // up arrow
        ) : (
            <svg className="h-4 w-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg> // down arrow
        );
    };

    const sortOptions = [
        { key: 'name', label: 'Nome' },
        { key: 'quantity', label: 'Quantidade' },
        { key: 'st_idade', label: 'Idade' },
    ];

    return (
        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-gray-700 mr-2">Ordenar por:</span>
            {sortOptions.map(option => (
                <button
                    key={option.key}
                    onClick={() => onSort(option.key)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors 
                        ${sortConfig.column === option.key ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    `}
                >
                    {option.label}
                    {getSortIndicator(option.key)}
                </button>
            ))}
        </div>
    );
};

// Componente de Lista de Produtos
const ProductList = ({ products, loading, onDelete, onEdit, totalProducts, filteredCount }) => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Produtos Cadastrados (API)</h2>
      
      {!loading && totalProducts > 0 && (
        <p className="text-center text-gray-500 mb-4">
          Mostrando **{filteredCount}** de **{totalProducts}** produtos.
        </p>
      )}

      {loading && <p className="text-center text-gray-500">Carregando produtos...</p>}
      
      {filteredCount === 0 && !loading && totalProducts > 0 && 
        <p className="text-center text-red-500">Nenhum produto corresponde aos filtros aplicados.</p>
      }
      
      {products.length === 0 && !loading && totalProducts === 0 && 
        // eslint-disable-next-line no-undef
        <p className="text-center text-gray-500">Nenhum produto cadastrado ainda. Verifique se o seu Back-end está ativo em {process.env.REACT_APP_API_BASE_URL}</p>
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x192/CCCCCC/333333?text=Imagem+N/A'; }} />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Coleção:</span> {product.collection || 'N/A'}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Idade:</span> **{product.st_idade || 'N/A'}**
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Quantidade:</span> {product.quantity}
              </p>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              
              {/* Exibir imagens e vídeos extras, se existirem */}
              {product.extraImages && product.extraImages.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Imagens Extras:</span>
                  <div className="flex space-x-2 mt-1 overflow-x-auto">
                    {product.extraImages.map((img, index) => (
                      <img key={index} src={img} alt={`Imagem extra ${index + 1}`} className="h-16 w-16 object-cover rounded-md" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/333333?text=Erro'; }} />
                    ))}
                  </div>
                </div>
              )}
              {product.extraVideos && product.extraVideos.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Vídeos Extras:</span>
                  <div className="flex space-x-2 mt-1 overflow-x-auto">
                    {product.extraVideos.map((vid, index) => (
                      <a key={index} href={vid} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        Vídeo {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                {/* Botão de Editar */}
                <button
                  onClick={() => onEdit(product)}
                  className="w-1/2 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Editar
                </button>
                {/* Botão de Excluir existente */}
                <button
                  onClick={() => onDelete(product.id)}
                  className="w-1/2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <p className="text-lg font-semibold text-gray-800 text-center mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Sim
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <p className="text-lg font-semibold text-gray-800 text-center mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Função principal de comparação para ordenação
const sortProducts = (products, sortConfig) => {
    if (!sortConfig.column) {
        return products;
    }

    // Cria uma cópia para evitar modificar o array original do estado
    const sortedProducts = [...products];

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
    products: [],
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
    // NOVO: Configuração de ordenação
    sortConfig: { column: 'name', direction: 'asc' }, // Padrão: Ordenar por nome (A-Z)
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
    setAppState((prev) => ({ ...prev, loading: true, errorMessage: null }));
    try {
      // eslint-disable-next-line no-undef
      const response = await fetch(process.env.REACT_APP_API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`API retornou status ${response.status}`);
      }
      
      const data = await response.json();
      setAppState((prev) => ({ ...prev, products: data, loading: false }));

    } catch (error) {
      console.error('Erro ao buscar produtos da API:', error);
      setAppState((prev) => ({
        ...prev,
        loading: false,
        // eslint-disable-next-line no-undef
        errorMessage: error.message || `Erro de conexão com a API em ${process.env.REACT_APP_API_BASE_URL}. Verifique se o servidor está ativo.`,
        products: [],
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
      name: formData.name,
      description: formData.description,
      collection: formData.collection,
      st_idade: formData.st_idade, 
      quantity: Number(formData.quantity),
      image: formData.image,
      // Converte a string de URLs separadas por vírgula em um array de strings
      extraImages: formData.extraImages.split(',').map((url) => url.trim()).filter(Boolean),
      extraVideos: formData.extraVideos.split(',').map((url) => url.trim()).filter(Boolean),
    };
  };

  // 2. Submitting new product to the API (POST)
  const handleFormSubmit = async (formData) => {
    setAppState((prev) => ({ ...prev, loading: true, errorMessage: null }));
    try {
      const newProductPayload = preparePayload(formData);

      // eslint-disable-next-line no-undef
      const response = await fetch(process.env.REACT_APP_API_BASE_URL, {
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
      
      // eslint-disable-next-line no-undef
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/${productId}`, {
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
          // eslint-disable-next-line no-undef
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/${productId}`, {
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

  // Função para lidar com a ordenação (NOVO)
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
          return <p className="text-center text-red-500">Erro: Nenhum produto selecionado para edição.</p>;
        }
        return <ProductForm 
          onFormSubmit={handleFormSubmit} 
          onUpdateSubmit={handleUpdateSubmit}
          loading={appState.loading} 
          errorMessage={appState.errorMessage} 
          initialProduct={appState.productToEdit} // Passa o produto para preencher o formulário
        />;
      case 'list':
        // ABRIMOS UM NOVO BLOCO DE ESCOPO COM AS CHAVES {} PARA EVITAR O ERRO 'no-case-declarations'
        { 
          const { searchTerm, minQuantity, st_idadeFilter, sortConfig } = filterState;
          
          // --- 1. FILTRAGEM ---
          const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
          const lowerCaseIdadeFilter = st_idadeFilter.toLowerCase().trim();

          let filteredProducts = appState.products.filter(product => {
              // Filtro por Quantidade Mínima (nu_quantidade)
              const quantityFilter = minQuantity === '' || product.quantity === null || (product.quantity >= Number(minQuantity));

              // Filtro por Classificação de Idade (st_idade)
              const idadeFilter = lowerCaseIdadeFilter === '' || 
                                  product.st_idade?.toLowerCase().includes(lowerCaseIdadeFilter);

              // Filtro por Termo de Busca (st_produto, descrição, coleção)
              const textMatch = (
                  product.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
                  product.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
                  product.collection?.toLowerCase().includes(lowerCaseSearchTerm)
              );

              return quantityFilter && idadeFilter && textMatch;
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
                products={sortedProducts} // Passa a lista ORDENADA
                loading={appState.loading} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
                totalProducts={appState.products.length} 
                filteredCount={sortedProducts.length} 
              />
            </>
          );
        } // FECHAMOS O BLOCO DE ESCOPO
      default:
        return <HeroSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <Header onNavigate={(view) => handleNavigate(view)} />
      <main className="container mx-auto p-4">
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
