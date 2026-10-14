import React, { useState } from 'react';
import { 
  Plus, 
  Heart, 
  ExternalLink, 
  Trash2, 
  ShoppingBag,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { WishlistItem, User, ThemeMode } from '../types';
import { ProductIllustration } from './ProductIllustrations';

interface WishlistViewProps {
  wishlist: WishlistItem[];
  currentUser: User;
  theme: ThemeMode;
  onAddItem: (item: Omit<WishlistItem, 'id' | 'likes'>) => void;
  onDeleteItem: (id: string) => void;
  onLikeItem: (id: string) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  currentUser,
  theme,
  onAddItem,
  onDeleteItem,
  onLikeItem
}) => {
  const isDark = theme === 'dark';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('MZN');

  // Form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('Amazon');
  const [storeUrl, setStoreUrl] = useState('');
  const [category, setCategory] = useState('Tecnologia');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('alta');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80');

  const photoPresets = [
    { label: 'Auscultadores', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', cat: 'Tecnologia' },
    { label: 'Livro', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=80', cat: 'Livros' },
    { label: 'Relógio', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop&q=80', cat: 'Acessórios' },
    { label: 'Perfume', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80', cat: 'Beleza & Perfumes' },
    { label: 'Mochila', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80', cat: 'Moda' },
    { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80', cat: 'Tecnologia' },
    { label: 'Caneca térmica', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', cat: 'Cozinha' },
    { label: 'Chocolates', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80', cat: 'Gourmet' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    onAddItem({
      userId: currentUser.id,
      title,
      price: parseFloat(price) || 1000,
      currency: selectedCurrency,
      store: store || 'Amazon',
      storeUrl: storeUrl || (store === 'Amazon' ? 'https://www.amazon.com' : 'https://jumia.co.mz'),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
      category,
      priority
    });

    setTitle('');
    setPrice('');
    setStoreUrl('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Minha Lista de Desejos
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Adicione presentes com fotos reais e links para quem tirou o seu nome no sorteio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Currency Switcher */}
          <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {['MZN', 'EUR', 'BRL', 'USD'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2 py-0.5 rounded-lg transition-colors text-xs ${
                  selectedCurrency === curr 
                    ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Product Grid or Clean Empty State */}
      {wishlist.length === 0 ? (
        <div className={`rounded-3xl border border-dashed p-10 text-center space-y-3 ${
          isDark ? 'border-slate-800 bg-slate-950/40 text-slate-300' : 'border-slate-300 bg-white text-slate-700 shadow-xs'
        }`}>
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            A sua Lista de Desejos está vazia
          </h3>
          <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Adicione presentes que gostaria de receber para dar ideias e sugestões ao seu amigo secreto!
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              + Adicionar Primeiro Desejo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {wishlist.map((item) => {
          const isRealUrl = item.imageUrl && (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/'));

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col justify-between transition-all group overflow-hidden ${
                isDark 
                  ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-700/60' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Top Bar with Category & Heart */}
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border truncate max-w-[150px] ${
                  isDark ? 'bg-slate-800 border-slate-700 text-emerald-300' : 'bg-slate-100 border-slate-200 text-emerald-700'
                }`}>
                  {item.category}
                </span>

                <button
                  onClick={() => onLikeItem(item.id)}
                  className={`p-1.5 rounded-full border transition-colors flex items-center gap-1 text-xs shrink-0 ${
                    isDark ? 'border-slate-800 text-slate-400 hover:text-rose-400' : 'border-slate-200 text-slate-500 hover:text-rose-600'
                  }`}
                  title="Curtir presente"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span className="text-[11px] font-mono">{item.likes}</span>
                </button>
              </div>

              {/* Real Photography Image Container */}
              <div className="h-36 sm:h-40 w-full mb-2.5 rounded-xl overflow-hidden bg-slate-950/40 relative border border-slate-800/40 flex items-center justify-center">
                {isRealUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ProductIllustration type={item.imageUrl} />
                )}
              </div>

              {/* Product Details - Never Overflows */}
              <div className="space-y-1 min-w-0">
                <h4 className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h4>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm sm:text-base font-black text-amber-300 font-mono tabular-nums">
                    {selectedCurrency} {item.price.toLocaleString()}
                  </span>

                  <span className={`text-[11px] font-medium flex items-center gap-1 truncate max-w-[120px] ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <ShoppingBag className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.store}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Actions with Real Store Link */}
              <div className={`flex items-center justify-between pt-2.5 mt-2.5 border-t ${
                isDark ? 'border-slate-800/80' : 'border-slate-100'
              }`}>
                {item.storeUrl ? (
                  <a
                    href={item.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Ver na loja</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-500">Sugestão</span>
                )}

                <button
                  onClick={() => onDeleteItem(item.id)}
                  title="Remover produto"
                  className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal Adicionar Produto com Foto Real */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className={`w-full max-w-lg my-auto rounded-3xl border p-5 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#091510] border-emerald-800/70 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-emerald-800/60' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display">
                    Adicionar Presente com Imagem Real
                  </h3>
                  <p className="text-xs text-emerald-400/80">
                    Defina o título, valor e foto real do produto desejado.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm text-left">
              <div>
                <label className="block font-semibold mb-1 text-emerald-200">
                  Nome do Produto / Presente <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Auscultadores JBL, Livro de Ficção, Perfume Dior..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all ${
                    isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-500'
                  }`}
                />
              </div>

              {/* Photo Presets */}
              <div>
                <label className="block font-semibold mb-1.5 text-emerald-200">
                  Escolha uma Foto Real ou Cole o Link
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                  {photoPresets.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => {
                        setImageUrl(preset.url);
                        setCategory(preset.cat);
                        if (!title) setTitle(preset.label.replace(/^.*? /, ''));
                      }}
                      className={`p-1.5 rounded-xl border text-[11px] font-medium text-left truncate transition-colors ${
                        imageUrl === preset.url 
                          ? 'bg-emerald-600 text-white border-emerald-500' 
                          : 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200 hover:bg-emerald-900/40'
                      }`}
                    >
                      <span className="truncate block">{preset.label}</span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... (URL da imagem)"
                    className={`w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none ${
                      isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-emerald-200">
                    Preço Estimado ({selectedCurrency}) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 3500"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                      isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-emerald-200">
                    Loja Sugerida
                  </label>
                  <input
                    type="text"
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    placeholder="Ex: Amazon, Sephora, Wook..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                      isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-emerald-200 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-emerald-400" />
                  <span>Link da Loja (Onde comprar online)</span>
                </label>
                <input
                  type="url"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://www.amazon.com/dp/..."
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none ${
                    isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2.5 border-t border-emerald-900/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold transition-colors text-xs ${
                    isDark ? 'bg-emerald-950 border border-emerald-800/60 text-emerald-300 hover:text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Presente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
