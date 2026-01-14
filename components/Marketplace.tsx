import React, { useState, useRef } from 'react';
import { Star, ShoppingCart, Check, Plus, X, Upload, Tag, DollarSign, AlignLeft, Image as ImageIcon, AlertCircle, Zap, Video, PlayCircle, ShieldCheck, Eye, Clock, History } from 'lucide-react';
import { Product } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface MarketplaceProps {
  products: Product[];
  addToCart: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onOpenCart: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, addToCart, onAddProduct, onOpenCart }) => {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [viewingVideoUrl, setViewingVideoUrl] = useState<string | null>(null);
  
  // New State for Details & History
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Listing Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: '' as any,
    category: 'worms',
    description: '',
    imageUrl: ''
  });
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Video State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (product: Product) => {
    addToCart(product);
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
        setAddedIds(prev => {
            const next = new Set(prev);
            next.delete(product.id);
            return next;
        });
    }, 1500);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    onOpenCart();
  };

  const handleViewDetails = (product: Product) => {
    setViewingProduct(product);
    setRecentlyViewed(prev => {
        const filtered = prev.filter(p => p.id !== product.id);
        return [product, ...filtered].slice(0, 5);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size must be less than 5MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      // Limit video size (e.g., 15MB for demo purposes)
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("Video size must be less than 15MB.");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) return;
    setUploadError(null);

    let finalImageUrl = newProduct.imageUrl || 'https://picsum.photos/400/400?grayscale';
    let finalVideoUrl: string | undefined = undefined;

    try {
        // Process Image
        if (imageFile) {
            const base64 = await fileToBase64(imageFile);
            finalImageUrl = `data:${imageFile.type};base64,${base64}`;
        }

        // Process Video
        if (videoFile) {
            const base64 = await fileToBase64(videoFile);
            finalVideoUrl = `data:${videoFile.type};base64,${base64}`;
        }
    } catch (error) {
        console.error("Error processing files", error);
        setUploadError("Failed to process files. Please try again.");
        return;
    }

    const productToAdd: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category as any,
      description: newProduct.description,
      imageUrl: finalImageUrl,
      verificationVideoUrl: finalVideoUrl,
      rating: 5.0 // New items start with 5 stars!
    };

    onAddProduct(productToAdd);
    
    // Reset and close
    setIsListingModalOpen(false);
    setNewProduct({
      name: '',
      price: '' as any,
      category: 'worms',
      description: '',
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setVideoFile(null);
    setVideoPreview(null);
    setUploadError(null);
  };

  // Helper for Fee Calculation
  const priceValue = Number(newProduct.price) || 0;
  const sellerFee = priceValue * 0.05;
  const estimatedPayout = priceValue - sellerFee;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-earth-900">Marketplace</h2>
          <p className="text-earth-600 mt-2">Curated supplies for your composting journey.</p>
        </div>
        <button 
          onClick={() => setIsListingModalOpen(true)}
          className="bg-nature-600 hover:bg-nature-500 text-white px-5 py-3 rounded-xl font-bold shadow-sm transition-transform hover:scale-105 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Sell Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div 
                className="relative h-48 overflow-hidden bg-earth-100 cursor-pointer"
                onClick={() => handleViewDetails(product)}
            >
               <img 
                 src={product.imageUrl} 
                 alt={product.name} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
               
               {/* Hover Overlay for Details */}
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                   <div className="bg-white/90 text-earth-800 px-3 py-1.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center shadow-sm">
                       <Eye className="w-3 h-3 mr-1" />
                       Quick View
                   </div>
               </div>

               {/* Categories Badge */}
               <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-earth-800 uppercase tracking-wide shadow-sm z-10 pointer-events-none">
                 {product.category}
               </div>

               {/* Video Badge & Play Button */}
               {product.verificationVideoUrl && (
                 <>
                    <div className="absolute top-3 left-3 bg-nature-600/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center shadow-sm z-10 pointer-events-none">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Video Verified
                    </div>
                    {/* Only show play button if not hovered or make it distinct from quick view click */}
                    <div className="absolute bottom-3 right-3 z-20">
                         <button 
                            onClick={(e) => { e.stopPropagation(); setViewingVideoUrl(product.verificationVideoUrl!); }}
                            className="bg-white/90 text-nature-600 rounded-full p-2 hover:bg-nature-600 hover:text-white transition-colors shadow-md"
                            title="Watch Verification Video"
                        >
                            <PlayCircle className="w-5 h-5" />
                        </button>
                    </div>
                 </>
               )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 
                    className="text-lg font-bold text-earth-900 leading-tight cursor-pointer hover:text-nature-700 transition-colors"
                    onClick={() => handleViewDetails(product)}
                >
                    {product.name}
                </h3>
                <span className="text-nature-700 font-bold bg-nature-50 px-2 py-1 rounded-md text-sm whitespace-nowrap ml-2">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-xs text-earth-400 ml-2">({product.rating})</span>
              </div>

              <p className="text-earth-600 text-sm mb-4 line-clamp-2 flex-1">
                {product.description}
              </p>

              <div className="flex gap-3 mt-auto">
                <button 
                    onClick={() => handleAdd(product)}
                    className={`flex-1 font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 border-2
                        ${addedIds.has(product.id) 
                            ? 'bg-nature-600 border-nature-600 text-white' 
                            : 'bg-white border-earth-200 text-earth-700 hover:border-earth-400'}`}
                >
                    {addedIds.has(product.id) ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Added</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart</span>
                        </>
                    )}
                </button>
                <button 
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 bg-earth-800 hover:bg-earth-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1 shadow-md hover:shadow-lg"
                >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
          <div className="border-t border-earth-200 pt-8 animate-fade-in">
              <h3 className="text-xl font-bold text-earth-900 mb-6 flex items-center">
                  <History className="w-5 h-5 mr-2 text-earth-500" />
                  Recently Viewed
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recentlyViewed.map(product => (
                      <div 
                        key={`recent-${product.id}`} 
                        className="bg-white rounded-xl border border-earth-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => handleViewDetails(product)}
                      >
                          <div className="aspect-square bg-earth-100 relative">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                {product.verificationVideoUrl && (
                                    <div className="absolute top-1 right-1 bg-nature-600/90 p-1 rounded-full text-white">
                                        <ShieldCheck className="w-3 h-3" />
                                    </div>
                                )}
                          </div>
                          <div className="p-3">
                              <h4 className="font-bold text-earth-800 text-sm truncate">{product.name}</h4>
                              <p className="text-xs text-nature-700 font-bold mt-1">${product.price.toFixed(2)}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Product Details Modal */}
      {viewingProduct && (
          <div className="fixed inset-0 z-[70] overflow-y-auto" onClick={() => setViewingProduct(null)}>
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-earth-900 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                  
                  <div 
                    className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full"
                    onClick={e => e.stopPropagation()}
                  >
                      <div className="relative">
                          <button 
                            className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full text-earth-800 transition-colors"
                            onClick={() => setViewingProduct(null)}
                          >
                              <X className="w-6 h-6" />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2">
                              <div className="relative h-64 md:h-auto bg-earth-100">
                                  <img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="w-full h-full object-cover" />
                                  {viewingProduct.verificationVideoUrl && (
                                     <button 
                                        onClick={() => setViewingVideoUrl(viewingProduct.verificationVideoUrl!)}
                                        className="absolute bottom-4 right-4 bg-white/90 text-nature-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-md flex items-center hover:bg-nature-600 hover:text-white transition-colors"
                                     >
                                         <PlayCircle className="w-4 h-4 mr-2" />
                                         Watch Video
                                     </button>
                                  )}
                              </div>
                              
                              <div className="p-8 flex flex-col">
                                  <div className="flex items-center mb-2">
                                      <span className="bg-earth-100 text-earth-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide mr-2">
                                          {viewingProduct.category}
                                      </span>
                                      <div className="flex items-center">
                                          <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                                          <span className="text-sm font-bold text-earth-700">{viewingProduct.rating}</span>
                                      </div>
                                  </div>
                                  
                                  <h2 className="text-2xl font-bold text-earth-900 mb-2">{viewingProduct.name}</h2>
                                  <p className="text-3xl font-bold text-nature-600 mb-6">${viewingProduct.price.toFixed(2)}</p>
                                  
                                  <div className="prose prose-sm prose-earth mb-8 flex-1">
                                      <p>{viewingProduct.description}</p>
                                  </div>
                                  
                                  <div className="flex gap-4">
                                      <button 
                                        onClick={() => handleAdd(viewingProduct)}
                                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center transition-colors
                                            ${addedIds.has(viewingProduct.id) 
                                                ? 'bg-nature-100 text-nature-800' 
                                                : 'bg-earth-100 text-earth-800 hover:bg-earth-200'}`}
                                      >
                                          {addedIds.has(viewingProduct.id) ? 'Added to Cart' : 'Add to Cart'}
                                      </button>
                                      <button 
                                        onClick={() => { setViewingProduct(null); handleBuyNow(viewingProduct); }}
                                        className="flex-1 bg-earth-900 hover:bg-earth-800 text-white py-3 rounded-xl font-bold flex items-center justify-center shadow-lg"
                                      >
                                          <Zap className="w-4 h-4 mr-2 fill-current" />
                                          Buy Now
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Video Playback Modal */}
      {viewingVideoUrl && (
          <div className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setViewingVideoUrl(null)}>
              <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                  <button 
                      className="absolute -top-12 right-0 text-white hover:text-earth-300 transition-colors"
                      onClick={() => setViewingVideoUrl(null)}
                  >
                      <X className="w-8 h-8" />
                  </button>
                  <video 
                      src={viewingVideoUrl} 
                      controls 
                      autoPlay 
                      className="w-full max-h-[80vh] rounded-lg shadow-2xl bg-black"
                  />
              </div>
          </div>
      )}

      {/* List Item Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-earth-900 opacity-75" onClick={() => setIsListingModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5 border-b border-earth-100 pb-3">
                    <h3 className="text-xl font-bold text-earth-900">Create New Listing</h3>
                    <button onClick={() => setIsListingModalOpen(false)} className="text-earth-400 hover:text-earth-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmitListing} className="space-y-4">
                    {/* Media Uploads Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        
                        {/* Image Upload */}
                        <div className="flex flex-col">
                             <label className="block text-sm font-bold text-earth-700 mb-2">Product Image *</label>
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex-1 min-h-[160px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden
                                    ${imagePreview ? 'border-nature-500' : 'border-earth-300 hover:bg-earth-50'}`}
                             >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-2 text-earth-400" />
                                        <span className="text-sm text-earth-500">Upload Image</span>
                                    </>
                                )}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                             </div>
                        </div>

                        {/* Video Upload */}
                        <div className="flex flex-col">
                             <label className="block text-sm font-bold text-earth-700 mb-2 flex justify-between">
                                 Video Verification
                                 <span className="text-xs font-normal text-earth-400 bg-earth-100 px-2 py-0.5 rounded-full">Optional</span>
                             </label>
                             <div 
                                onClick={() => videoInputRef.current?.click()}
                                className={`flex-1 min-h-[160px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden
                                    ${videoPreview ? 'border-nature-500 bg-black' : 'border-earth-300 hover:bg-earth-50'}`}
                             >
                                {videoPreview ? (
                                    <video src={videoPreview} className="w-full h-full object-cover absolute inset-0" />
                                ) : (
                                    <>
                                        <Video className="w-8 h-8 mb-2 text-earth-400" />
                                        <span className="text-sm text-earth-500">Upload Video</span>
                                        <span className="text-xs text-earth-400 mt-1">Show it works!</span>
                                    </>
                                )}
                                <input 
                                    ref={videoInputRef}
                                    type="file" 
                                    accept="video/*" 
                                    className="hidden"
                                    onChange={handleVideoChange}
                                />
                             </div>
                        </div>
                    </div>

                    {uploadError && (
                        <div className="flex items-center text-rose-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {uploadError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1 flex items-center">
                                <Tag className="w-4 h-4 mr-1" /> Product Name
                            </label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none"
                                placeholder="e.g. Premium Worm Castings"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-earth-700 mb-1">Category</label>
                            <select 
                                className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none bg-white"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                            >
                                <option value="worms">Worms</option>
                                <option value="bins">Bins</option>
                                <option value="tools">Tools</option>
                                <option value="starters">Starters</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" /> Price
                        </label>
                        <input 
                            type="number" 
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none"
                            placeholder="0.00"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                         {priceValue > 0 && (
                            <div className="mt-2 text-xs bg-earth-50 p-2 rounded-lg text-earth-600 border border-earth-100">
                                <div className="flex justify-between mb-1">
                                    <span>Listing Price:</span>
                                    <span>${priceValue.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-1 text-rose-600">
                                    <span>Platform Fee (5%):</span>
                                    <span>-${sellerFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-earth-800 border-t border-earth-200 pt-1">
                                    <span>You Receive:</span>
                                    <span>${estimatedPayout.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-700 mb-1 flex items-center">
                            <AlignLeft className="w-4 h-4 mr-1" /> Description
                        </label>
                        <textarea 
                            required
                            rows={3}
                            className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none resize-none"
                            placeholder="Describe your item..."
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        />
                    </div>
                    
                    {!imagePreview && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-earth-700 mb-1 flex items-center">
                                <ImageIcon className="w-4 h-4 mr-1" /> Or Image URL (Optional)
                            </label>
                            <input 
                                type="url" 
                                className="w-full p-2.5 rounded-lg border border-earth-300 focus:ring-2 focus:ring-nature-500 focus:border-nature-500 outline-none"
                                placeholder="https://..."
                                value={newProduct.imageUrl}
                                onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-nature-600 hover:bg-nature-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex justify-center items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            List Item
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;