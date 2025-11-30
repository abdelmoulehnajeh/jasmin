'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/admin/AdminLayout';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  status: string;
  image_base64?: string | null;
  gallery?: string[];
}

export default function CarsManagement() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: 0,
    description: '',
    gallery: [] as string[],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      toast.error('Accès non autorisé');
      router.push('/');
      return;
    }

    setUser(parsedUser);
    fetchCars(token);
  }, [router]);

  const fetchCars = async (token: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query { cars { id brand model year price_per_day status image_base64 gallery } }`,
        }),
      });

      const data = await response.json();
      if (!data.errors) {
        // normalize cars
        setCars(data.data.cars.map((c: any) => ({
          ...c,
          image_base64: c.image_base64 || (Array.isArray(c.gallery) && c.gallery.length > 0 ? c.gallery[0] : null),
          gallery: c.gallery || [],
        })));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Build input matching backend expectations. Backend will normalize name/description if needed.
      const input = {
        name: `${formData.brand} ${formData.model}`,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        price_per_day: formData.price_per_day,
        description: formData.description || `${formData.brand} ${formData.model}`,
        image_base64: (formData.gallery && formData.gallery.length > 0) ? formData.gallery[0] : null,
        gallery: formData.gallery || [],
        total_count: 1,
      };

      const mutation = editingCar
        ? `mutation UpdateCar($id: String!, $input: CarInput!) { updateCar(id: $id, input: $input) { id brand model year price_per_day status } }`
        : `mutation CreateCar($input: CarInput!) { createCar(input: $input) { id brand model year price_per_day status } }`;

      const variables = editingCar
        ? { id: editingCar.id, input }
        : { input };

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success(editingCar ? 'Voiture modifiée!' : 'Voiture ajoutée!');
        setShowAddModal(false);
        setEditingCar(null);
        setFormData({ brand: '', model: '', year: new Date().getFullYear(), price_per_day: 0, description: '', gallery: [] });
        fetchCars(token!);
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette voiture?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const mutation = `mutation DeleteCar($id: String!) { deleteCar(id: $id) }`;
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: mutation, variables: { id } }),
      });

      const data = await response.json();
      if (!data.errors) {
        toast.success('Voiture supprimée!');
        fetchCars(token!);
      } else {
        toast.error(data.errors[0].message || 'Erreur');
      }
    } catch (error) {
      toast.error('Erreur de suppression');
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price_per_day: car.price_per_day,
      description: '',
      gallery: car.gallery || [],
    });
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout userName={user?.full_name} userRole={user?.role}>
      <Toaster position="top-right" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              GESTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">VOITURES</span>
            </h1>
            <p className="text-gray-400">Gérer votre flotte de véhicules</p>
          </div>
          <button
            onClick={() => {
              setEditingCar(null);
              setFormData({ brand: '', model: '', year: new Date().getFullYear(), price_per_day: 0, description: '', gallery: [] });
              setShowAddModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black rounded-xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <span className="text-2xl">➕</span>
            <span>AJOUTER VOITURE</span>
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-gray-900 border-2 border-orange-500/20 hover:border-orange-500 rounded-2xl overflow-hidden transition-all transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {car.image_base64 ? (
                  <img src={car.image_base64} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🚗</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-2">{car.brand} {car.model}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-400"><span className="font-bold">Année:</span> {car.year}</p>
                  <p className="text-orange-500 text-xl font-bold">${car.price_per_day}/jour</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    car.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {car.status === 'AVAILABLE' ? 'DISPONIBLE' : 'RÉSERVÉE'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-20">
            <span className="text-8xl mb-4 block">🚗</span>
            <p className="text-2xl text-gray-400">Aucune voiture. Ajoutez-en une!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border-2 border-orange-500 rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-black text-white mb-6">
              {editingCar ? 'MODIFIER' : 'AJOUTER'} VOITURE
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-orange-500 font-bold mb-2">Marque</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-orange-500 rounded-lg text-white outline-none"
                    placeholder="Mercedes, BMW..."
                  />
                </div>
                <div>
                  <label className="block text-orange-500 font-bold mb-2">Modèle</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-orange-500 rounded-lg text-white outline-none"
                    placeholder="S-Class, X5..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-orange-500 font-bold mb-2">Année</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-orange-500 rounded-lg text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-orange-500 font-bold mb-2">Prix/Jour ($)</label>
                  <input
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) })}
                    required
                    className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-orange-500 rounded-lg text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-orange-500 font-bold mb-2">URL Image</label>
                <p className="text-sm text-gray-400 mb-2">Upload multiple photos — stored as base64 in DB. First photo used as main image.</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files) return;
                    const arr: string[] = [];
                    for (let i = 0; i < files.length; i++) {
                      const file = files[i];
                      const reader = new FileReader();
                      const dataUrl = await new Promise<string>((res) => {
                        reader.onload = () => res(reader.result as string);
                        reader.readAsDataURL(file);
                      });
                      arr.push(dataUrl);
                    }
                    setFormData({ ...formData, gallery: [...(formData.gallery || []), ...arr] });
                  }}
                  className="w-full"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {(formData.gallery || []).map((g, idx) => (
                    <div key={idx} className="relative w-24 h-16 rounded overflow-hidden border-2 border-gray-700">
                      <img src={g} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => {
                        const newGallery = (formData.gallery || []).filter((_, i) => i !== idx);
                        setFormData({ ...formData, gallery: newGallery });
                      }} className="absolute -top-2 -right-2 bg-red-600 rounded-full w-6 h-6 text-xs flex items-center justify-center">×</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-orange-500 font-bold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-black border-2 border-gray-700 focus:border-orange-500 rounded-lg text-white outline-none"
                  placeholder="Short description"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black rounded-xl transition-all"
                >
                  {editingCar ? 'MODIFIER' : 'AJOUTER'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCar(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-black rounded-xl transition-all"
                >
                  ANNULER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
