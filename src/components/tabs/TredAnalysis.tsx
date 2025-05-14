import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, Legend } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ProductInterface } from '../../interfaces';

const TrendAnalysis = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['products'], (result) => {
        setProducts(result.products || []);
      });
    }
  }, []);

  const getPriceDistribution = () => {
    const bins: { [key: string]: number } = {};
    for (let i = 0; i <= 100; i += 10) {
      bins[`${i}-${i + 10}`] = 0;
    }

    products.forEach((p) => {
      const price = p.price.amount / 100;
      const bucket = `${Math.floor(price / 10) * 10}-${Math.floor(price / 10) * 10 + 10}`;
      if (bins[bucket] !== undefined) {
        bins[bucket]++;
      }
    });

    return Object.keys(bins).map((range) => ({ range, count: bins[range] }));
  };

  const getPriceVsFavorites = () => {
    return products.map((p) => ({
      price: p.price.amount / 100,
      favorites: p.num_favorers
    }));
  };

  const getHandmadeDistribution = () => {
    let handmade = 0;
    let factory = 0;

    products.forEach((p) => {
      if ((p as any).who_made === 'i_did') handmade++;
      else factory++;
    });

    return [
      { name: 'Handmade', value: handmade },
      { name: 'Mass Produced', value: factory }
    ];
  };

  const COLORS = ['#4caf50', '#ff5722'];

  return (
    <div className="text-center">
      <h5 className="mb-3">📈 Trends</h5>

      <h6 className="mt-4">💵 Price Distribution</h6>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={getPriceDistribution()}>
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h6 className="mt-4">💖 Price vs Favorites</h6>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="price" name="Price" unit="$" />
          <YAxis dataKey="favorites" name="Favorites" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Products" data={getPriceVsFavorites()} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainer>

      <h6 className="mt-4">🧶 Handmade vs 🏭 Mass Production</h6>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={getHandmadeDistribution()}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {getHandmadeDistribution().map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendAnalysis;