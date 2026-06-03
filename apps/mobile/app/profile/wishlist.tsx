import React from 'react';
import { AuthGate } from '@/core/router';
import { PlaceholderScreen } from '@/presentation/screens/placeholder-screen';

export default function ProfileWishlistRoute() {
  return (
    <AuthGate>
      <PlaceholderScreen title="Wishlist" description="Danh sách sản phẩm yêu thích sẽ được hoàn thiện sau." />
    </AuthGate>
  );
}
