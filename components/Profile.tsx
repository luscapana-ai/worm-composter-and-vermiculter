import React, { useState, useRef } from 'react';
import { User, Package, MapPin, Mail, Save, Image as ImageIcon, Plus, Trash2, Heart, Upload, Loader2, X, AlertCircle, Award, Trophy, Star } from 'lucide-react';
import { UserProfile, Order, PortfolioItem } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ProfileProps {
  user: UserProfile;
  orders: Order[];
  updateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, orders, updateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  // Gallery State
  const [isUploading, setIsUploading] = useState(false);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const imageUrl = `data:${file.type};base64,${base64}`;
      setNewPhotoPreview(imageUrl);
    } catch (err) {
      setUploadError("Failed to process image.");
    } finally {
      setIsUploading(false);
    }
  };

  const saveToPortfolio = () => {
    if (!newPhotoPreview) return;

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      imageUrl: newPhotoPreview,
      caption: newPhotoCaption || "My Compost Journey",
      date: new Date().toISOString(),
      likes: 0
    };

    const updatedUser = {
      ...user,
      portfolio: [newItem, ...(user.portfolio || [])],
      xp: user.xp + 50 // Give XP for uploading
    };

    updateUser(updatedUser);
    setFormData(updatedUser); // Sync local form state
    
    // Reset
    setNewPhotoPreview(null);
    setNewPhotoCaption('');
    setUploadError(null);
  };

  const deletePortfolioItem = (id: string) => {
    const updatedUser = {
      ...user,
      portfolio: user.portfolio.filter(item => item.id !== id)
    };
    updateUser(updatedUser);
    setFormData(updatedUser);
  };

  // Gamification Logic
  const nextLevelXp = user.level * 1000;
  const progressPercent = Math.min(100, (user.xp / nextLevelXp) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-earth-900 mb-8">My Account</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* User Details & Level Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 sticky top-24">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-earth-200 rounded-full flex items-center justify-center text-earth-600 relative">
                <User className="w-12 h-12" />
                <div className="absolute -bottom-2 bg-nature-600 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">
                    Lvl {user.level}
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-earth-500 mb-1">
                    <span>{user.xp} XP</span>
                    <span>{nextLevelXp} XP</span>
                </div>
                <div className="h-2 bg-earth-100 rounded-full overflow-hidden">
                    <div className="h-full bg-nature-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-center text-xs text-earth-400 mt-2">
                    {nextLevelXp - user.xp} XP to Level {user.level + 1}
                </p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-earth-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-nature-500 focus:ring-nature-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-earth-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-nature-500 focus:ring-nature-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-earth-500 uppercase">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="mt-1 block w-full rounded-md border-earth-300 shadow-sm focus:border-nature-500 focus:ring-nature-500 p-2 border"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-nature-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-nature-700 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-1" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setFormData(user); }}
                    className="flex-1 bg-earth-100 text-earth-700 py-2 rounded-lg text-sm font-medium hover:bg-earth-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-earth-900">{user.name}</h3>
                  <p className="text-earth-500 text-sm">{user.email}</p>
                </div>
                
                <div className="border-t border-earth-100 pt-4">
                  <div className="flex items-start text-earth-600 mb-2">
                    <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm">{user.address || 'No address set'}</span>
                  </div>
                  <div className="flex items-center text-earth-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-4 bg-earth-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-earth-900 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Achievements, Order History & Gallery */}
        <div className="md:col-span-2 space-y-8">

           {/* Achievements Section */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
             <h3 className="text-xl font-bold text-earth-900 mb-6 flex items-center">
               <Trophy className="w-5 h-5 mr-2 text-amber-500" />
               Badges & Achievements
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {user.badges.map(badge => (
                    <div 
                        key={badge.id} 
                        className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all
                            ${badge.earnedDate 
                                ? `bg-${badge.color}-50 border-${badge.color}-200` 
                                : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                            }`}
                    >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h4 className="text-xs font-bold text-earth-900 mb-1">{badge.name}</h4>
                        <p className="text-[10px] text-earth-500 leading-tight">{badge.description}</p>
                        {badge.earnedDate && (
                            <span className="mt-2 text-[9px] font-bold text-nature-600 bg-white px-1.5 py-0.5 rounded-full shadow-sm">
                                {new Date(badge.earnedDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                ))}
             </div>
           </div>
          
          {/* Order History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
            <h3 className="text-xl font-bold text-earth-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2 text-nature-600" />
              Order History
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-earth-500 bg-earth-50 rounded-xl border border-earth-100">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-earth-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-earth-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-earth-500 uppercase">Date</p>
                        <p className="text-sm font-medium text-earth-900">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-earth-500 uppercase">Total</p>
                        <p className="text-sm font-medium text-earth-900">${order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === 'delivered' ? 'bg-nature-100 text-nature-800' : 
                            order.status === 'processing' ? 'bg-amber-100 text-amber-800' : 
                            'bg-sky-100 text-sky-800'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {/* Collapsed Items View (can be expanded) */}
                    <div className="px-6 py-3 bg-white">
                         <p className="text-sm text-earth-500">{order.items.length} item(s): {order.items.map(i => i.name).join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
             <h3 className="text-xl font-bold text-earth-900 mb-6 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-nature-600" />
              My Garden Gallery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload Card */}
              {newPhotoPreview ? (
                <div className="col-span-1 sm:col-span-2 bg-earth-50 rounded-xl p-4 border border-earth-200">
                    <h4 className="font-bold text-earth-800 mb-4">Complete Your Upload</h4>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <img src={newPhotoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-earth-200" />
                        <div className="flex-1 space-y-3">
                            <input 
                                type="text"
                                placeholder="Write a caption (e.g., 'Harvest Day!')"
                                className="w-full p-2.5 rounded-lg border border-earth-300 focus:border-nature-500 outline-none"
                                value={newPhotoCaption}
                                onChange={(e) => setNewPhotoCaption(e.target.value)}
                            />
                            <div className="flex space-x-2">
                                <button 
                                    onClick={saveToPortfolio}
                                    className="bg-nature-600 hover:bg-nature-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                                >
                                    <Save className="w-4 h-4 mr-2" /> Share to Gallery
                                </button>
                                <button 
                                    onClick={() => { setNewPhotoPreview(null); setNewPhotoCaption(''); }}
                                    className="bg-white border border-earth-300 hover:bg-earth-50 text-earth-600 px-4 py-2 rounded-lg text-sm font-bold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-earth-300 bg-earth-50 hover:bg-earth-100 hover:border-nature-400 cursor-pointer flex flex-col items-center justify-center transition-all group"
                >
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-nature-600 animate-spin" />
                    ) : (
                        <>
                            <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-earth-500 group-hover:text-nature-600" />
                            </div>
                            <span className="text-sm font-medium text-earth-600 group-hover:text-nature-700">Add Photo</span>
                            <span className="text-xs text-earth-400 mt-1">Show off your setup!</span>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
              )}

              {uploadError && (
                 <div className="col-span-full bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {uploadError}
                 </div>
              )}

              {/* Gallery Items */}
              {user.portfolio && user.portfolio.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative aspect-square rounded-xl overflow-hidden bg-earth-100 border border-earth-200 cursor-zoom-in"
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                      <img src={item.imageUrl} alt="Portfolio" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <p className="text-white font-medium text-sm line-clamp-2 mb-1">{item.caption}</p>
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-earth-300">{new Date(item.date).toLocaleDateString()}</span>
                              <div className="flex items-center space-x-2">
                                  <div className="flex items-center text-rose-400 text-xs font-bold">
                                      <Heart className="w-3 h-3 mr-1 fill-current" />
                                      {item.likes}
                                  </div>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); deletePortfolioItem(item.id); }}
                                      className="p-1.5 bg-white/20 hover:bg-rose-600 rounded-full text-white transition-colors"
                                      title="Delete"
                                  >
                                      <Trash2 className="w-3 h-3" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
            >
                <X className="w-10 h-10" />
            </button>
            <img 
                src={selectedImage} 
                alt="Zoomed View" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}
    </div>
  );
};

export default Profile;