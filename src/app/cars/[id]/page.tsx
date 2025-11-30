"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import BookingModal from '@/components/modals/BookingModal';

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query GetCar($id: String!, $language: String) { car(id: $id, language: $language) { id name brand model year price_per_day description image_base64 gallery model_3d_url status service_type features specs { engine transmission fuelType seats color } average_rating total_ratings } }`,
            variables: { id, language: 'en' },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error(data.errors);
          setError(data.errors[0]?.message || 'Failed to load car');
          setCar(null);
        } else {
          const c = data.data.car;
          if (!c) {
            setError('Car not found');
            setCar(null);
          } else {
            setCar(c);
            const main = c.image_base64 || (Array.isArray(c.gallery) && c.gallery.length ? c.gallery[0] : null);
            setMainImage(main);
          }
        }
      } catch (err) {
        console.error('Fetch car failed', err);
        setError('Failed to load car');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Toaster />
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Car not found'}</h2>
          <button onClick={() => router.push('/')} className="px-4 py-2 bg-gold-600 rounded">Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Toaster />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {mainImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImage} alt={`${car.brand} ${car.model}`} className="w-full h-96 object-cover" />
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center text-6xl">🚗</div>
            )}
          </div>

          {Array.isArray(car.gallery) && car.gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {car.gallery.map((g: string, i: number) => (
                <button key={i} onClick={() => setMainImage(g)} className="w-full h-20 overflow-hidden rounded border border-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt={`photo-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-black mb-2">{car.brand} {car.model}</h1>
          <p className="text-gray-300 mb-4">{car.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-gold-300 text-sm">Year</div>
              <div className="text-white font-semibold">{car.year}</div>
            </div>
            <div>
              <div className="text-gold-300 text-sm">Price</div>
              <div className="text-gold-500 font-bold">${car.price_per_day} / day</div>
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="mb-4">
              <div className="text-gold-300 text-sm mb-2">Features</div>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f: string, idx: number) => (
                  <span key={idx} className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm">{f}</span>
                ))}
              </div>
            </div>
          )}

          {car.specs && (
            <div className="mb-6">
              <div className="text-gold-300 text-sm mb-2">Specifications</div>
              <div className="bg-gray-900 p-4 rounded">
                {car.specs.engine && <div className="mb-1"><strong className="text-gray-300">Engine:</strong> <span className="text-white">{car.specs.engine}</span></div>}
                {car.specs.transmission && <div className="mb-1"><strong className="text-gray-300">Transmission:</strong> <span className="text-white">{car.specs.transmission}</span></div>}
                {car.specs.fuelType && <div className="mb-1"><strong className="text-gray-300">Fuel:</strong> <span className="text-white">{car.specs.fuelType}</span></div>}
                {car.specs.seats && <div className="mb-1"><strong className="text-gray-300">Seats:</strong> <span className="text-white">{car.specs.seats}</span></div>}
                {car.specs.color && <div className="mb-1"><strong className="text-gray-300">Color:</strong> <span className="text-white">{car.specs.color}</span></div>}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button onClick={() => setIsBookingOpen(true)} className="px-6 py-3 bg-gold-600 text-black rounded-xl font-bold">Book Now</button>
            <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-800 rounded">Back</button>
          </div>

          <div className="mt-6 text-sm text-gray-400">Average rating: {car.average_rating?.toFixed?.(1) || '0.0'} ({car.total_ratings || 0})</div>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal car={car} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}
