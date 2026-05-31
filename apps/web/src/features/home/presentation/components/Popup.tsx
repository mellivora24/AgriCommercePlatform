import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PromoPopup: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [showPromo, setShowPromo] = useState(!isAuthenticated);

  const handleClose = () => {
    setShowPromo(false);
  };

  const handleLogin = () => {
    setShowPromo(false);
    navigate('/login');
  };

  const handleRegister = () => {
    setShowPromo(false);
    navigate('/register');
  };

  if (!showPromo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && setShowPromo(false)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors"
          aria-label="Đóng"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-500 px-8 py-7 text-center">
          <div className="text-5xl mb-2">🌿</div>
          <h2 className="text-white text-xl font-bold mb-1">
            Ưu đãi dành riêng cho bạn!
          </h2>
          <p className="text-white/80 text-sm">
            Đăng ký ngay — nhận ngay khuyến mãi hấp dẫn
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 px-6 pt-5">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-800">10%</p>
            <p className="text-xs text-gray-500 mt-0.5">Giảm đơn đầu tiên</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-800">Free</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Giao hàng đơn &gt;200k
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-4">
          <p className="text-sm text-gray-500 text-center mb-4">
            Tham gia cùng hàng nghìn khách hàng đang mua sắm nông sản sạch
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                handleRegister();
              }}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Đăng ký nhận ưu đãi
            </button>
            <button
              onClick={() => {
                handleLogin();
              }}
              className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm transition-colors"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
          <p
            onClick={handleClose}
            className="text-xs text-gray-400 text-center mt-3 cursor-pointer hover:text-gray-600"
          >
            Bỏ qua — tiếp tục xem không cần đăng ký
          </p>
        </div>
      </div>
    </div>
  );
};
