import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductDetail } from '@/features/products/presentation/hooks/useProducts';
import type { ProductImage } from '@/features/products/domain/entities/product.entity';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { formatCurrency } from '@/shared/utils';
import { useCartStore } from '@/core/store';
import { useToast } from '@/shared/hooks';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: product, isLoading } = useProductDetail(id || '');
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    if (!product || quantity < 1) return;

    if (quantity > product.stockQuantity) {
      toast.error(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
      return;
    }

    const productImage = product.images?.[selectedImage]?.imageUrl || (product.images?.[0]?.imageUrl || '');
    const price = typeof product.price === 'string' ? parseInt(product.price) : product.price;

    addItem({
      productId: product.productId,
      sellerId: product.sellerId,
      name: product.name,
      price,
      quantity,
      image: productImage,
      sku: product.sku || `SKU-${product.productId}`,
    });

    toast.success(`${product.name} đã thêm vào giỏ hàng`);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, product?.stockQuantity || 1));
    setQuantity(newQuantity);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Hết hàng', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stock < 5) return { text: `Chỉ còn ${stock}`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (stock < 20) return { text: `${stock} sản phẩm có sẵn`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { text: 'Còn hàng', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton height={400} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton height={300} className="mb-4" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={80} width={80} />
              ))}
            </div>
          </div>
          <div>
            <Skeleton height={30} className="mb-4" />
            <Skeleton height={20} className="mb-4" />
            <Skeleton height={40} className="mb-8" />
            <Skeleton height={100} className="mb-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sản phẩm không tìm thấy</h1>
        <Button onClick={() => navigate('/products')}>Quay lại danh sách sản phẩm</Button>
      </div>
    );
  }

  const imageUrls = product.images && product.images.length > 0 
    ? product.images.map((img: ProductImage) => img.imageUrl)
    : [];
  const price = typeof product.price === 'string' ? parseInt(product.price) : product.price;
  const originalPrice = product.originalPrice 
    ? (typeof product.originalPrice === 'string' ? parseInt(product.originalPrice) : product.originalPrice)
    : undefined;
  const discountPercentage = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <button onClick={() => navigate('/')} className="hover:text-gray-900">
          Trang chủ
        </button>
        <span>/</span>
        <button onClick={() => navigate('/products')} className="hover:text-gray-900">
          Sản phẩm
        </button>
        <span>/</span>
        <span>{product.category.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          {imageUrls.length > 0 && (
            <>
              <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imageUrls[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {imageUrls.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Product Info Section */}
        <div>
          {/* Category & Rating */}
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-gray-500">{product.category.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐ {product.rating || 0}</span>
              <span className="text-sm text-gray-500">({product.reviews || 0} đánh giá)</span>
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Price Section */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-red-600">{formatCurrency(price)}</span>
            {originalPrice && (
              <span className="text-xl text-gray-400 line-through">{formatCurrency(originalPrice)}</span>
            )}
          </div>

          {/* Seller Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Người bán</p>
                <p className="font-semibold text-gray-900">{product.seller.storeName}</p>
              </div>
              <Button size="sm" variant="ghost">
                Xem cửa hàng
              </Button>
            </div>
          </div>

          {/* Stock Status Section - Prominent Display */}
          <div className={`${stockStatus.bgColor} rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">Tình trạng kho</p>
                <p className={`${stockStatus.color} text-lg font-bold`}>{stockStatus.text}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700 font-medium">Số lượng sẵn có</p>
                <p className={`${stockStatus.color} text-2xl font-bold`}>{product.stockQuantity}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* SKU */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Mã sản phẩm: <span className="font-semibold text-gray-900">{product.sku || `SKU-${product.productId}`}</span>
            </p>
          </div>

          {/* Quantity & Add to Cart */}
          {product.stockQuantity > 0 ? (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-6 py-2 border-l border-r border-gray-300">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <Button fullWidth size="lg" onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700">
                Thêm vào giỏ hàng
              </Button>
            </div>
          ) : (
            <Button fullWidth size="lg" disabled className="bg-gray-400">
              Hết hàng
            </Button>
          )}

          {/* Additional Actions */}
          <div className="flex gap-4">
            <Button variant="ghost" fullWidth>
              ❤️ Yêu thích
            </Button>
            <Button variant="ghost" fullWidth>
              📱 Chia sẻ
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products or Reviews could go here */}
    </div>
  );
};
