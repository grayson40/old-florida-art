import { GootenProducts } from '@/components/gooten-products';

export default function GootenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <GootenProducts />
    </div>
  );
}

export const metadata = {
  title: 'Gooten Products | FL Shop',
  description: 'Browse print-on-demand products from Gooten\'s catalog',
}; 